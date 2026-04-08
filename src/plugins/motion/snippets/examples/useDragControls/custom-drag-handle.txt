function DragCard() {
  const controls = useDragControls();

  return (
    <motion.div drag="y" dragControls={controls} dragListener={false}>
      <div onPointerDown={(e) => controls.start(e)}>
        ⠿ Drag here
      </div>
      <div>Card content (not draggable from here)</div>
    </motion.div>
  );
}