<ReactFlow
  edgesReconnectable
  onReconnect={(oldEdge, newConnection) =>
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
  }
  onReconnectStart={() => setIsReconnecting(true)}
  onReconnectEnd={() => setIsReconnecting(false)}
/>