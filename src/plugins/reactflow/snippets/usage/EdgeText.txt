import { EdgeText, getBezierPath } from '@xyflow/react';

function CustomEdge({ sourceX, sourceY, targetX, targetY, label }) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  return (
    <>
      <path d={edgePath} className="react-flow__edge-path" />
      <EdgeText x={labelX} y={labelY} label={label} labelShowBg />
    </>
  );
}