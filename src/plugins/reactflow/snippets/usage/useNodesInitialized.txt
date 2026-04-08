const initialized = useNodesInitialized();

useEffect(() => {
  if (initialized) {
    // Safe to run layout algorithms or fitView
  }
}, [initialized]);