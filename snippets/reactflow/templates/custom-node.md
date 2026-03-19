import { memo } from 'react';
import { Handle, Position, NodeToolbar, type NodeProps, type Node } from '@xyflow/react';

type CustomNodeData = {
  label: string;
  description?: string;
  icon?: string;
  status?: 'active' | 'inactive' | 'error';
};

type CustomNodeType = Node<CustomNodeData, 'custom'>;

const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeType>) => {
  const statusColor = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    error: 'bg-red-500',
  }[data.status ?? 'inactive'];

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <button className="px-2 py-1 text-xs bg-white border rounded shadow">Edit</button>
        <button className="px-2 py-1 text-xs bg-red-50 border border-red-200 rounded shadow ml-1">Delete</button>
      </NodeToolbar>

      <Handle type="target" position={Position.Left} />

      <div className={`px-4 py-3 rounded-lg border shadow-sm bg-white ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="font-medium text-sm">{data.label}</span>
        </div>
        {data.description && (
          <p className="text-xs text-gray-500 mt-1">{data.description}</p>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
    </>
  );
});

CustomNode.displayName = 'CustomNode';
export default CustomNode;
