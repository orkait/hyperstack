const [edgePath, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  borderRadius: 8, // rounded corners
  offset: 25, // step offset
});