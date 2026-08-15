import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { nanoid } from 'nanoid';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
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
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
        },
        get().edges
      ),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, [fieldName]: fieldValue } } : node
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
