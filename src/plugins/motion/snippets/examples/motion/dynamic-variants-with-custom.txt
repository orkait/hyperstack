const variants = {
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  }),
  hidden: { opacity: 0, y: 30 }
};

{items.map((item, i) => (
  <motion.div
    key={item}
    custom={i}
    variants={variants}
    initial="hidden"
    animate="visible"
  />
))}