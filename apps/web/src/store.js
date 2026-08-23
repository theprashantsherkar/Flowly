import { create } from 'zustand';
import { addEdge as rfAddEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { nanoid } from 'nanoid';
import { EDGE_DASH_ARRAY } from '@flowly/shared';

const FREE_ENDPOINT_TYPE = 'free-endpoint';

// A tiny anchor node that lets an edge end float freely on the canvas instead of
// terminating on a shape. It is draggable/selectable so the loose end of an
// arrow can be grabbed and repositioned (or deleted) like anything else.
const freeEndpointNode = (id, position) => ({
  id,
  type: FREE_ENDPOINT_TYPE,
  position,
  data: { kind: FREE_ENDPOINT_TYPE },
  draggable: true,
  selectable: true,
  connectable: false,
  hidden: false,
});

// Drop any free-endpoint node that is no longer referenced by an edge. This keeps
// the canvas tidy when an arrow (or one of its ends) is deleted.
export const pruneFreeEndpoints = (nodes, edges) => {
  const referenced = new Set();
  edges.forEach((edge) => {
    referenced.add(edge.source);
    referenced.add(edge.target);
  });
  return nodes.filter((node) => node.type !== FREE_ENDPOINT_TYPE || referenced.has(node.id));
};

const DEFAULT_MARKER = { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#94a3b8' };

export const buildEdge = (connection, style, extra = {}) => {
  const { id, type = 'smoothstep', markerEnd, data: extraData, ...rest } = extra;
  return {
    ...connection,
    ...rest,
    // Every edge needs a stable, unique id: the collaborative store keys edges by
    // id, so without one they'd all collapse onto a single entry.
    id: id || connection.id || `edge-${nanoid(6)}`,
    type,
    markerEnd: markerEnd === null ? undefined : markerEnd || DEFAULT_MARKER,
    style: {
      stroke: '#94a3b8',
      strokeWidth: 2,
      strokeDasharray: EDGE_DASH_ARRAY[style],
      strokeLinecap: style === 'dotted' ? 'round' : 'butt',
    },
    data: { lineStyle: style, ...(extraData || {}) },
  };
};

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  comments: [],
  edgeStyle: 'solid', // solid | dashed | dotted — applied to new connections
  // When a flow is opened collaboratively, `sync` routes mutations through the
  // shared Yjs document instead of local state (see collab/yjsSync.js).
  sync: null,
  setSync: (sync) => set({ sync }),

  setEdgeStyle: (edgeStyle) => set({ edgeStyle }),
  getNodeID: (type) => `${type}-${nanoid(6)}`,

  addNode: (node) => {
    const { sync } = get();
    if (sync) return sync.addNode(node);
    set({ nodes: [...get().nodes, node] });
  },
  addEdge: (edge) => {
    const { sync } = get();
    if (sync) return sync.addEdge(edge);
    set({ edges: rfAddEdge(edge, get().edges) });
  },
  onNodesChange: (changes) => {
    const { sync } = get();
    if (sync) return sync.onNodesChange(changes);
    const nodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: pruneFreeEndpoints(nodes, get().edges) });
  },
  onEdgesChange: (changes) => {
    const { sync } = get();
    if (sync) return sync.onEdgesChange(changes);
    const edges = applyEdgeChanges(changes, get().edges);
    set({ edges, nodes: pruneFreeEndpoints(get().nodes, edges) });
  },
  onConnect: (connection) => {
    get().addEdge(buildEdge(connection, get().edgeStyle));
  },
  // A connection dragged off a shape and released on empty canvas: it terminates
  // on a floating endpoint instead of snapping back / requiring a target shape.
  addFloatingEdge: ({ source, sourceHandle, position }) => {
    const endpointId = `free-endpoint-${nanoid(6)}`;
    const connection = {
      source,
      sourceHandle,
      target: endpointId,
      targetHandle: 'free',
    };
    const edge = buildEdge(connection, get().edgeStyle, {
      data: { freeEndId: endpointId },
    });
    get().addNode(freeEndpointNode(endpointId, position));
    get().addEdge(edge);
    return edge;
  },
  // A fully independent arrow/line: an edge strung between two floating endpoints,
  // neither of which is tied to a shape. Both ends can be dragged around.
  addStandaloneArrow: ({ position, withHead = true }) => {
    const startId = `free-endpoint-${nanoid(6)}`;
    const endId = `free-endpoint-${nanoid(6)}`;
    const half = 90;
    get().addNode(freeEndpointNode(startId, { x: position.x - half, y: position.y }));
    get().addNode(freeEndpointNode(endId, { x: position.x + half, y: position.y }));
    const edge = buildEdge(
      { source: startId, sourceHandle: 'free', target: endId, targetHandle: 'free' },
      get().edgeStyle,
      { type: 'straight', markerEnd: withHead ? undefined : null, data: { standalone: true } }
    );
    get().addEdge(edge);
    return edge;
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    const { sync } = get();
    if (sync) return sync.updateNodeField(nodeId, fieldName, fieldValue);
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, [fieldName]: fieldValue } } : node
      ),
    });
  },
  setSelectedEdgesStyle: (style) => {
    const { sync } = get();
    if (sync) return sync.setSelectedEdgesStyle(style);
    set({
      edges: get().edges.map((edge) =>
        edge.selected
          ? {
              ...edge,
              style: {
                ...edge.style,
                strokeDasharray: EDGE_DASH_ARRAY[style],
                strokeLinecap: style === 'dotted' ? 'round' : 'butt',
              },
              data: { ...edge.data, lineStyle: style },
            }
          : edge
      ),
    });
  },

  addComment: (comment) => get().sync?.addComment(comment),
  resolveComment: (id, resolved) => get().sync?.updateComment(id, { resolved }),
  deleteComment: (id) => get().sync?.deleteComment(id),

  // Remove a single node and any edges attached to it.
  deleteNode: (id) => {
    const { edges, onNodesChange, onEdgesChange } = get();
    const edgeRemovals = edges
      .filter((e) => e.source === id || e.target === id)
      .map((e) => ({ id: e.id, type: 'remove' }));
    if (edgeRemovals.length) onEdgesChange(edgeRemovals);
    onNodesChange([{ id, type: 'remove' }]);
  },
  // Remove everything currently selected (nodes + their edges + selected edges).
  deleteSelected: () => {
    const { nodes, edges, onNodesChange, onEdgesChange } = get();
    const selNodeIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    const selEdgeIds = new Set(edges.filter((e) => e.selected).map((e) => e.id));
    const edgeRemovals = edges
      .filter((e) => selEdgeIds.has(e.id) || selNodeIds.has(e.source) || selNodeIds.has(e.target))
      .map((e) => ({ id: e.id, type: 'remove' }));
    if (edgeRemovals.length) onEdgesChange(edgeRemovals);
    if (selNodeIds.size) onNodesChange([...selNodeIds].map((id) => ({ id, type: 'remove' })));
  },

  // Direct array setters used by the Yjs observer (never delegate).
  _setNodes: (nodes) => set({ nodes }),
  _setEdges: (edges) => set({ edges }),
  _setComments: (comments) => set({ comments }),

  setGraph: ({ nodes = [], edges = [] }) => set({ nodes, edges }),
  resetGraph: () => set({ nodes: [], edges: [], comments: [] }),
}));
