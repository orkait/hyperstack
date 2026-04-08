const controls = useDragControls();

<div onPointerDown={(e) => controls.start(e)}>Drag handle</div>
<motion.div drag dragControls={controls} dragListener={false}>
  Draggable content
</motion.div>