function ImageReveal() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <motion.div ref={ref} style={{ clipPath }}>
      <img src="/photo.jpg" alt="Revealed" />
    </motion.div>
  );
}