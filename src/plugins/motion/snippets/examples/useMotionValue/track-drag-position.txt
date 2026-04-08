function DragTracker() {
  const x = useMotionValue(0);
  const background = useTransform(x, [-200, 200], ["#ff0000", "#0000ff"]);

  return (
    <motion.div
      drag="x"
      style={{ x, background }}
    />
  );
}