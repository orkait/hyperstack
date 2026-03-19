# Performance Optimization

## Rules
1. **Define nodeTypes/edgeTypes outside the component** or useMemo — never inline.
2. **Use stable selectors** with Zustand to prevent unnecessary re-renders.
3. **Avoid useNodes/useEdges** in components that don't need the full array — use useNodesData(ids) instead.
4. **Enable onlyRenderVisibleElements** for large graphs (1000+ nodes).
5. **Use useReactFlow().getNodes()** for on-demand access instead of subscribing.

```tsx
// BAD: re-renders on every node change
const nodes = useNodes();

// GOOD: only re-renders when specific node data changes
const nodeData = useNodesData('node-1');

// GOOD: on-demand access, no re-renders
const { getNodes } = useReactFlow();
const handleClick = () => {
  const nodes = getNodes();
};
```

## Large graph settings
```tsx
<ReactFlow
  onlyRenderVisibleElements
  minZoom={0.1}
  maxZoom={4}
  elevateNodesOnSelect={false}
  elevateEdgesOnSelect={false}
/>
```
