function DeleteButton() {
  const { deleteElements, getNodes, getEdges } = useReactFlow();
  const onClick = async () => {
    const selectedNodes = getNodes().filter((n) => n.selected);
    const selectedEdges = getEdges().filter((e) => e.selected);
    await deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  };
  return <button onClick={onClick}>Delete Selected</button>;
}