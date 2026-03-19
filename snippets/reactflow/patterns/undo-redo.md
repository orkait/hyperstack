# Undo / Redo with Zundo

```bash
npm install zundo
```

```ts
import { create } from 'zustand';
import { temporal } from 'zundo';

const useFlowStore = create<FlowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
    }),
    {
      // Only track meaningful changes, not every drag pixel
      equality: (past, current) =>
        JSON.stringify(past.nodes.map(n => ({ id: n.id, position: n.position, data: n.data }))) ===
        JSON.stringify(current.nodes.map(n => ({ id: n.id, position: n.position, data: n.data }))),
      limit: 50,
    }
  )
);

// Hook for undo/redo
export function useFlowHistory() {
  return useFlowStore.temporal.getState();
}
```

**Usage:**
```tsx
function UndoRedoControls() {
  const { undo, redo, pastStates, futureStates } = useFlowHistory();
  return (
    <Panel position="top-right">
      <button onClick={() => undo()} disabled={pastStates.length === 0}>Undo</button>
      <button onClick={() => redo()} disabled={futureStates.length === 0}>Redo</button>
    </Panel>
  );
}
```
