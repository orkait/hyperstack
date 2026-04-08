function MultiHandleNode({ data }) {
  return (
    <div className="p-4 border rounded bg-white">
      <Handle type="target" position={Position.Top} id="a" />
      <Handle type="target" position={Position.Left} id="b" />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="source" position={Position.Right} id="d" />
    </div>
  );
}