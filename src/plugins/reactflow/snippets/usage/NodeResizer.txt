import { NodeResizer } from '@xyflow/react';

function ResizableNode({ data, selected }) {
  return (
    <>
      <NodeResizer isVisible={selected} minWidth={100} minHeight={50} />
      <div className="p-4">{data.label}</div>
    </>
  );
}