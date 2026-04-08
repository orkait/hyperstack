# Auto Layout with Dagre

```bash
npm install @dagrejs/dagre
```

```tsx
import Dagre from '@dagrejs/dagre';

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: node.measured?.width ?? 172,
      height: node.measured?.height ?? 36,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - (node.measured?.width ?? 172) / 2,
        y: pos.y - (node.measured?.height ?? 36) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
```
