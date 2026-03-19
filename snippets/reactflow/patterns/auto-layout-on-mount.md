# Auto Layout on Mount

Use `useNodesInitialized` to wait for all nodes to be measured before running layout:

```tsx
function LayoutFlow({ initialNodes, initialEdges }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const initialized = useNodesInitialized();

  useEffect(() => {
    if (!initialized) return;

    // Run layout (e.g., Dagre)
    const { nodes: layouted } = getLayoutedElements(nodes, edges, 'TB');
    setNodes(layouted);

    // Fit after layout settles
    requestAnimationFrame(() => fitView({ duration: 300 }));
  }, [initialized]);

  return (
    <ReactFlow
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
      fitView
    />
  );
}
```
