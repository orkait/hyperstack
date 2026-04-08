# Drag & Drop from Sidebar

```tsx
function Sidebar() {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div draggable onDragStart={(e) => onDragStart(e, 'customNode')}>
        Custom Node
      </div>
    </aside>
  );
}

function Flow() {
  const { screenToFlowPosition, addNodes } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNodes({
      id: crypto.randomUUID(),
      type,
      position,
      data: { label: `New ${type}` },
    });
  }, [screenToFlowPosition, addNodes]);

  return (
    <ReactFlow onDragOver={onDragOver} onDrop={onDrop} ... />
  );
}
```
