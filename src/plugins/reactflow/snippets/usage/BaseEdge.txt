import { BaseEdge, getStraightPath } from '@xyflow/react';

function CustomEdge({ sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return <BaseEdge path={edgePath} />;
}