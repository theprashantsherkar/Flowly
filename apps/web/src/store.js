import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { nanoid } from 'nanoid';
import { EDGE_DASH_ARRAY } from '@flowly/shared';

const buildEdge = (connection, style) => ({
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
  edgeStyle: 'solid', // solid | dashed | dotted — applied to new connections
  setEdgeStyle: (edgeStyle) => set({ edgeStyle }),
  // Collision-safe ids: a per-session counter would clash when loading a saved
  // flow (or, later, when two people add nodes at once). nanoid avoids both.
  getNodeID: (type) => `${type}-${nanoid(6)}`,
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({ edges: addEdge(buildEdge(connection, get().edgeStyle), get().edges) });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, [fieldName]: fieldValue } } : node
      ),
    });
  },
  // Restyle currently-selected edges (used by the line-style picker).
  setSelectedEdgesStyle: (style) => {
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
  // Replace the canvas with a loaded flow document (used when opening a flow).
  setGraph: ({ nodes = [], edges = [] }) => {
    set({ nodes, edges });
  },
  // Clear the canvas (used when unmounting the editor).
  resetGraph: () => {
    set({ nodes: [], edges: [] });
  },
}));
