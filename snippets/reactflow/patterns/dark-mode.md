# Dark Mode with Tailwind

React Flow v12 supports `colorMode` prop:

```tsx
<ReactFlow colorMode="dark" ... />
// or follow system:
<ReactFlow colorMode="system" ... />
```

For Tailwind + shadcn, map CSS variables:
```css
.react-flow.dark {
  --xy-background-color: hsl(var(--background));
  --xy-node-background-color: hsl(var(--card));
  --xy-node-border-color: hsl(var(--border));
  --xy-node-color: hsl(var(--card-foreground));
  --xy-edge-stroke: hsl(var(--muted-foreground));
  --xy-minimap-background: hsl(var(--card));
  --xy-controls-button-background: hsl(var(--card));
  --xy-controls-button-color: hsl(var(--card-foreground));
}
```
