const x = useMotionValue(0);
const xVelocity = useVelocity(x);
// Chain for acceleration:
const xAcceleration = useVelocity(xVelocity);