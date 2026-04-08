const [edgePath, labelX, labelY, offsetX, offsetY] = getBezierPath({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  curvature: 0.25, // optional
});