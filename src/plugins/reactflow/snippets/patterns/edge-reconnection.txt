# Edge Reconnection

```tsx
import { reconnectEdge } from '@xyflow/react';

function Flow() {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, [setEdges]);

  return (
    <ReactFlow
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgesReconnectable
      onReconnect={onReconnect}
      onReconnectStart={(_, edge, handleType) => console.log('reconnect start', edge.id, handleType)}
      onReconnectEnd={(_, edge, handleType) => console.log('reconnect end', edge.id, handleType)}
    />
  );
}
```
