function CustomHandle({ type, position, id }) {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode?.id !== useNodeId();

  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={{ background: isTarget ? '#22c55e' : '#6b7280' }}
    />
  );
}