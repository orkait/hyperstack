# Copy & Paste Nodes

```tsx
function useCopyPaste() {
  const { getNodes, getEdges, addNodes, addEdges, screenToFlowPosition } = useReactFlow();
  const clipboard = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

  const copy = useCallback(() => {
    const selected = getNodes().filter((n) => n.selected);
    const selectedIds = new Set(selected.map((n) => n.id));
    const connectedEdges = getEdges().filter(
      (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
    );
    clipboard.current = { nodes: selected, edges: connectedEdges };
  }, [getNodes, getEdges]);

  const paste = useCallback(() => {
    const { nodes: copiedNodes, edges: copiedEdges } = clipboard.current;
    if (copiedNodes.length === 0) return;

    const idMap = new Map<string, string>();
    const newNodes = copiedNodes.map((n) => {
      const newId = crypto.randomUUID();
      idMap.set(n.id, newId);
      return { ...n, id: newId, position: { x: n.position.x + 50, y: n.position.y + 50 }, selected: true };
    });

    const newEdges = copiedEdges.map((e) => ({
      ...e,
      id: crypto.randomUUID(),
      source: idMap.get(e.source) ?? e.source,
      target: idMap.get(e.target) ?? e.target,
    }));

    addNodes(newNodes);
    addEdges(newEdges);
  }, [addNodes, addEdges]);

  return { copy, paste };
}
```
