import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}