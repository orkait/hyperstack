const prefersReduced = useReducedMotion();

return (
  <motion.div
    animate={{ x: prefersReduced ? 0 : 100 }}
  />
);