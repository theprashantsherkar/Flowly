import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { EDGE_DASH_ARRAY } from '@flowly/shared';

const FREE_ENDPOINT_TYPE = 'free-endpoint';

// Selection and drag state stay local (per-user); everything else is shared.
const stripTransient = (node) => {
  const { selected, dragging, resizing, ...rest } = node;
  return rest;
};
const stripEdge = (edge) => {
  const { selected, ...rest } = edge;
  return rest;
};

/**
 * Two-way binding between a Yjs document and the Zustand store. Nodes/edges live
 * in Y.Maps keyed by id; the CRDT merges concurrent edits automatically. Local
 * selection is tracked here and re-applied so it isn't shared between users.
 */
export function createYjsSync(doc, store) {
  const yNodes = doc.getMap('nodes');
  const yEdges = doc.getMap('edges');
  const yComments = doc.getArray('comments');
  const selectedNodes = new Set();
  const selectedEdges = new Set();

  const pushNodes = () => {
    store.getState()._setNodes(
      Array.from(yNodes.values()).map((n) => ({ ...n, selected: selectedNodes.has(n.id) }))
    );
  };
  const pushEdges = () => {
    store.getState()._setEdges(
      Array.from(yEdges.values()).map((e) => ({ ...e, selected: selectedEdges.has(e.id) }))
    );
  };
  const pushComments = () => store.getState()._setComments(yComments.toArray());

  // Drop any floating endpoint node no longer referenced by an edge (e.g. after
  // an arrow is deleted). Mirrors pruneFreeEndpoints in the local store.
  const pruneFreeEndpoints = () => {
    const referenced = new Set();
    yEdges.forEach((edge) => {
      referenced.add(edge.source);
      referenced.add(edge.target);
    });
    const orphans = [];
    yNodes.forEach((node, id) => {
      if (node.type === FREE_ENDPOINT_TYPE && !referenced.has(id)) orphans.push(id);
    });
    if (orphans.length) {
      doc.transact(() => orphans.forEach((id) => yNodes.delete(id)));
    }
  };

  const nodesObserver = () => pushNodes();
  const edgesObserver = () => pushEdges();
  const commentsObserver = () => pushComments();
  yNodes.observe(nodesObserver);
  yEdges.observe(edgesObserver);
  yComments.observe(commentsObserver);

  const sync = {
    onNodesChange(changes) {
      const current = Array.from(yNodes.values()).map((n) => ({ ...n, selected: selectedNodes.has(n.id) }));
      const next = applyNodeChanges(changes, current);
      const byId = new Map(next.map((n) => [n.id, n]));
      let selectionChanged = false;

      doc.transact(() => {
        for (const change of changes) {
          if (change.type === 'remove') {
            yNodes.delete(change.id);
            selectedNodes.delete(change.id);
          } else if (change.type === 'select') {
            selectionChanged = true;
            if (change.selected) selectedNodes.add(change.id);
            else selectedNodes.delete(change.id);
          } else if (change.type === 'position' || change.type === 'dimensions') {
            const node = byId.get(change.id);
            if (node) yNodes.set(node.id, stripTransient(node));
          }
        }
      });
      // A directly-deleted floating endpoint may leave its partner orphaned.
      if (changes.some((c) => c.type === 'remove')) pruneFreeEndpoints();
      if (selectionChanged) pushNodes();
    },

    addNode(node) {
      yNodes.set(node.id, stripTransient(node));
    },

    onEdgesChange(changes) {
      const current = Array.from(yEdges.values()).map((e) => ({ ...e, selected: selectedEdges.has(e.id) }));
      const next = applyEdgeChanges(changes, current);
      const byId = new Map(next.map((e) => [e.id, e]));
      let selectionChanged = false;
      let removed = false;

      doc.transact(() => {
        for (const change of changes) {
          if (change.type === 'remove') {
            yEdges.delete(change.id);
            selectedEdges.delete(change.id);
            removed = true;
          } else if (change.type === 'select') {
            selectionChanged = true;
            if (change.selected) selectedEdges.add(change.id);
            else selectedEdges.delete(change.id);
          } else {
            const edge = byId.get(change.id);
            if (edge) yEdges.set(edge.id, stripEdge(edge));
          }
        }
      });
      if (removed) pruneFreeEndpoints();
      if (selectionChanged) pushEdges();
    },

    addEdge(edge) {
      yEdges.set(edge.id, stripEdge(edge));
    },

    updateNodeField(nodeId, field, value) {
      const node = yNodes.get(nodeId);
      if (!node) return;
      yNodes.set(nodeId, { ...node, data: { ...node.data, [field]: value } });
    },

    setSelectedEdgesStyle(style) {
      doc.transact(() => {
        selectedEdges.forEach((id) => {
          const edge = yEdges.get(id);
          if (!edge) return;
          yEdges.set(id, {
            ...edge,
            style: {
              ...edge.style,
              strokeDasharray: EDGE_DASH_ARRAY[style],
              strokeLinecap: style === 'dotted' ? 'round' : 'butt',
            },
            data: { ...edge.data, lineStyle: style },
          });
        });
      });
    },

    addComment(comment) {
      yComments.push([comment]);
    },
    updateComment(id, patch) {
      const arr = yComments.toArray();
      const idx = arr.findIndex((c) => c.id === id);
      if (idx === -1) return;
      doc.transact(() => {
        yComments.delete(idx, 1);
        yComments.insert(idx, [{ ...arr[idx], ...patch }]);
      });
    },
    deleteComment(id) {
      const idx = yComments.toArray().findIndex((c) => c.id === id);
      if (idx >= 0) yComments.delete(idx, 1);
    },

    // Replace the whole graph (used to restore a saved version); broadcasts to all.
    replaceAll(nodes = [], edges = []) {
      doc.transact(() => {
        Array.from(yNodes.keys()).forEach((k) => yNodes.delete(k));
        Array.from(yEdges.keys()).forEach((k) => yEdges.delete(k));
        nodes.forEach((n) => yNodes.set(n.id, stripTransient(n)));
        edges.forEach((e) => yEdges.set(e.id, stripEdge(e)));
      });
    },

    // Seed a brand-new (empty) shared doc from the REST snapshot the first time.
    seedIfEmpty(nodes = [], edges = []) {
      if (yNodes.size === 0 && yEdges.size === 0 && (nodes.length || edges.length)) {
        doc.transact(() => {
          nodes.forEach((n) => yNodes.set(n.id, stripTransient(n)));
          edges.forEach((e) => yEdges.set(e.id, stripEdge(e)));
        });
      }
    },

    snapshot() {
      return {
        nodes: Array.from(yNodes.values()),
        edges: Array.from(yEdges.values()),
      };
    },

    destroy() {
      yNodes.unobserve(nodesObserver);
      yEdges.unobserve(edgesObserver);
      yComments.unobserve(commentsObserver);
    },
  };

  pushNodes();
  pushEdges();
  pushComments();
  return sync;
}
