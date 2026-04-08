# SubFlows (Parent/Child Nodes)

```tsx
const nodes = [
  {
    id: 'group-1',
    type: 'group',
    position: { x: 0, y: 0 },
    style: { width: 400, height: 300 },
    data: {},
  },
  {
    id: 'child-1',
    parentId: 'group-1',
    extent: 'parent' as const,  // constrain to parent bounds
    expandParent: true,          // auto-expand parent if needed
    position: { x: 20, y: 40 }, // relative to parent
    data: { label: 'Child 1' },
  },
  {
    id: 'child-2',
    parentId: 'group-1',
    extent: 'parent' as const,
    position: { x: 200, y: 40 },
    data: { label: 'Child 2' },
  },
];
```

**Rules:**
- Parent nodes must appear before children in the nodes array.
- Child positions are relative to the parent.
- Use `extent: 'parent'` to keep children inside the parent bounds.
- Use `expandParent: true` for auto-expanding group.
- Set `zIndexMode="auto"` on ReactFlow for proper z-ordering in sub-flows.
