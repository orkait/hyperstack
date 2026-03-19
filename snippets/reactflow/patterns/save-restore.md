# Save & Restore Flow

```tsx
function SaveRestore() {
  const { toObject, setNodes, setEdges, setViewport } = useReactFlow();

  const onSave = useCallback(() => {
    const flow = toObject();
    localStorage.setItem('flow', JSON.stringify(flow));
  }, [toObject]);

  const onRestore = useCallback(() => {
    const json = localStorage.getItem('flow');
    if (!json) return;
    const flow = JSON.parse(json);
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    if (flow.viewport) {
      setViewport(flow.viewport);
    }
  }, [setNodes, setEdges, setViewport]);

  return (
    <Panel position="top-right">
      <button onClick={onSave}>Save</button>
      <button onClick={onRestore}>Restore</button>
    </Panel>
  );
}
```
