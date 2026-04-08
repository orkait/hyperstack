# Context Menu

```tsx
function Flow() {
  const [menu, setMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null);
  const { deleteElements, getNode } = useReactFlow();

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  return (
    <>
      <ReactFlow
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={() => setMenu(null)}
      />
      {menu && (
        <div style={{ position: 'fixed', left: menu.x, top: menu.y }} className="bg-white shadow rounded p-2">
          {menu.nodeId && (
            <button onClick={() => { deleteElements({ nodes: [{ id: menu.nodeId! }] }); setMenu(null); }}>
              Delete Node
            </button>
          )}
        </div>
      )}
    </>
  );
}
```
