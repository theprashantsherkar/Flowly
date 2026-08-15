import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { nanoid } from 'nanoid';
import { EDGE_DASH_ARRAY } from '@flowly/shared';

export const buildEdge = (connection, style) => ({
  ...connection,
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#94a3b8' },
  style: {
    stroke: '#94a3b8',
    strokeWidth: 2,
    strokeDasharray: EDGE_DASH_ARRAY[style],
    strokeLinecap: style === 'dotted' ? 'round' : 'butt',
  },
  data: { lineStyle: style },
});

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
  onNodesChange: (changes) => {
    const { sync } = get();
    if (sync) return sync.onNodesChange(changes);
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    const { sync } = get();
    if (sync) return sync.onEdgesChange(changes);
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    const { sync } = get();
    const edge = buildEdge(connection, get().edgeStyle);
    if (sync) return sync.addEdge(edge);
    set({ edges: addEdge(edge, get().edges) });
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
