# Auto Layout with ELK

```bash
npm install elkjs
```

```tsx
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

async function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.measured?.width ?? 172,
      height: n.measured?.height ?? 36,
    })),
    edges: edges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
  };

  const layout = await elk.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const elkNode = layout.children?.find((n) => n.id === node.id);
      return { ...node, position: { x: elkNode?.x ?? 0, y: elkNode?.y ?? 0 } };
    }),
    edges,
  };
}
```
