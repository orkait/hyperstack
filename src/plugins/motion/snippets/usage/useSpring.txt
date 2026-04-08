// Direct control
const x = useSpring(0);
x.set(100); // springs to 100

// Track another value
const scrollY = useMotionValue(0);
const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 });