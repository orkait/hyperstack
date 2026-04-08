const { scrollYProgress } = useScroll();
const background = useTransform(
  scrollYProgress,
  [0, 0.5, 1],
  ["#ffffff", "#ff0000", "#000000"]
);

return <motion.div style={{ background }} />;