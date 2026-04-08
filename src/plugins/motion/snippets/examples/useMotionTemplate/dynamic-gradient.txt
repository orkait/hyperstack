function DynamicGradient() {
  const x = useMotionValue(0);
  const angle = useTransform(x, [-200, 200], [0, 360]);
  const background = useMotionTemplate`linear-gradient(${angle}deg, #ff0000, #0000ff)`;

  return <motion.div drag="x" style={{ x, background }} />;
}