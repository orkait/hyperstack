<motion.div
  drag
  dragTransition={{
    power: 0,
    modifyTarget: target => Math.round(target / 50) * 50
  }}
/>