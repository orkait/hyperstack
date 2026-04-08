# Custom Connection Line

```tsx
import type { ConnectionLineComponentProps } from '@xyflow/react';

function CustomConnectionLine({
  fromX, fromY, toX, toY, connectionStatus,
}: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        stroke={connectionStatus === 'valid' ? '#22c55e' : '#ef4444'}
        strokeWidth={2}
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle cx={toX} cy={toY} r={4} fill={connectionStatus === 'valid' ? '#22c55e' : '#ef4444'} />
    </g>
  );
}

// Usage:
<ReactFlow connectionLineComponent={CustomConnectionLine} />
```

The `connectionStatus` is 'valid' when hovering over a compatible handle.
