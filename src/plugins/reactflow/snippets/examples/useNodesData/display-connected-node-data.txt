function DisplayNode({ id }) {
  const connections = useHandleConnections({ type: 'target' });
  const sourceIds = connections.map((c) => c.source);
  const sourcesData = useNodesData(sourceIds);

  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <div>Connected sources: {sourcesData.map((d) => d.data.label).join(', ')}</div>
    </div>
  );
}