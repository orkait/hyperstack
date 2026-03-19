# Prevent Cycles (DAG Validation)

```tsx
import { getOutgoers } from '@xyflow/react';

function hasCycle(node: Node, target: Node, nodes: Node[], edges: Edge[], visited = new Set<string>()): boolean {
  if (visited.has(node.id)) return false;
  visited.add(node.id);
  if (node.id === target.id) return true;

  for (const outgoer of getOutgoers(node, nodes, edges)) {
    if (hasCycle(outgoer, target, nodes, edges, visited)) return true;
  }
  return false;
}

// Use as isValidConnection:
<ReactFlow
  isValidConnection={(connection) => {
    const nodes = getNodes();
    const edges = getEdges();
    const target = nodes.find((n) => n.id === connection.target);
    const source = nodes.find((n) => n.id === connection.source);
    if (!target || !source) return false;
    return !hasCycle(target, source, nodes, edges);
  }}
/>
```
