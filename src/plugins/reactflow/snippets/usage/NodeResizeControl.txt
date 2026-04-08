import { NodeResizeControl } from '@xyflow/react';
import { GripVertical } from 'lucide-react';

function ResizableNode({ data, selected }) {
  return (
    <>
      <NodeResizeControl minWidth={100} minHeight={50}>
        <GripVertical className="w-3 h-3" />
      </NodeResizeControl>
      <div className="p-4">{data.label}</div>
    </>
  );
}