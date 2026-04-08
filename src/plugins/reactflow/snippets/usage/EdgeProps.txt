import type { EdgeProps, Edge } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';

// Step 1: Define your edge type (optional)
type CustomEdgeType = Edge<{ weight: number }, 'weighted'>;

// Step 2: Use EdgeProps<YourEdgeType>
function WeightedEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style }: EdgeProps<CustomEdgeType>) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      <text x={labelX} y={labelY} textAnchor="middle">{data?.weight}</text>
    </>
  );
}

// Step 3: Register in edgeTypes (outside component!)
const edgeTypes = { weighted: WeightedEdge };