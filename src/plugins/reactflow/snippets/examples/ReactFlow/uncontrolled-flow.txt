import { ReactFlow } from '@xyflow/react';

const defaultNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Hello' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'World' } },
];
const defaultEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Flow() {
  return <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView />;
}