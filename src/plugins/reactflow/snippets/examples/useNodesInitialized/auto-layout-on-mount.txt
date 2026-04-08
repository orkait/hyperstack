function LayoutFlow() {
  const { fitView } = useReactFlow();
  const initialized = useNodesInitialized();

  useEffect(() => {
    if (initialized) {
      // Run Dagre/ELK layout here, then fitView
      fitView({ duration: 300 });
    }
  }, [initialized, fitView]);

  return <ReactFlow nodes={nodes} edges={edges} />;
}