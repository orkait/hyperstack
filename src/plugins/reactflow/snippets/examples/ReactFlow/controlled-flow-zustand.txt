import { ReactFlow } from '@xyflow/react';
import useFlowStore from './store';

const selector = (s) => ({
  nodes: s.nodes, edges: s.edges,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export default function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(selector);
  return (
    <ReactFlow
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    />
  );
}