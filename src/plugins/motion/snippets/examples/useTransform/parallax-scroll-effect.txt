function Parallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return <motion.div style={{ y }} />;
}