function ResizableNode({ data, selected }) {
  return (
    <>
      <NodeResizer isVisible={selected} minWidth={150} minHeight={80} />
      <Handle type="target" position={Position.Left} />
      <div className="p-4 h-full flex items-center justify-center">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}