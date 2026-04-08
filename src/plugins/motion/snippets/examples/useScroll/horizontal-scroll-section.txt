function HorizontalScroll() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={containerRef} style={{ height: "400vh" }}>
      <div style={{ position: "sticky", top: 0, overflow: "hidden" }}>
        <motion.div style={{ x, display: "flex" }}>
          {panels.map(panel => <Panel key={panel.id} {...panel} />)}
        </motion.div>
      </div>
    </section>
  );
}