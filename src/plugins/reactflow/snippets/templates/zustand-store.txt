import { create } from 'zustand';
import {
  type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect,
  applyNodeChanges, applyEdgeChanges, addEdge,
} from '@xyflow/react';

export type FlowState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<Record<string, unknown>>) => void;
};

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  removeNode: (id) => set({
    nodes: get().nodes.filter((n) => n.id !== id),
    edges: get().edges.filter((e) => e.source !== id && e.target !== id),
  }),
  updateNodeData: (id, data) => set({
    nodes: get().nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
  }),
}));

// Stable selector — use to prevent re-renders
export const flowSelector = (s: FlowState) => ({
  nodes: s.nodes,
  edges: s.edges,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export default useFlowStore;
