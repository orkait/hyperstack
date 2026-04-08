const constraintsRef = useRef(null);

<motion.div ref={constraintsRef} style={{ overflow: "hidden" }}>
  <motion.div
    drag
    dragConstraints={constraintsRef}
    dragElastic={0.2}
  />
</motion.div>