import { NodeToolbar, Position } from '@xyflow/react';

function ToolbarNode({ data }) {
  return (
    <>
      <NodeToolbar position={Position.Top}>
        <button>Edit</button>
        <button>Delete</button>
      </NodeToolbar>
      <div className="p-4">{data.label}</div>
    </>
  );
}