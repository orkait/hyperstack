function AddNodeButton() {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const onClick = () => {
    addNodes({
      id: crypto.randomUUID(),
      position: screenToFlowPosition({ x: 200, y: 200 }),
      data: { label: 'New Node' },
    });
  };
  return <button onClick={onClick}>Add Node</button>;
}