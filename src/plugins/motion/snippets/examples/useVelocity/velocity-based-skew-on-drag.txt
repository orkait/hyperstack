function SkewDrag() {
  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);
  const skewX = useTransform(xVelocity, [-1000, 0, 1000], [-15, 0, 15]);

  return <motion.div drag="x" style={{ x, skewX }} />;
}