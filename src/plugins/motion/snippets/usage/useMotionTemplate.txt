const blur = useMotionValue(10);
const filter = useMotionTemplate`blur(${blur}px)`;

return <motion.div style={{ filter }} />;