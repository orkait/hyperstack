const x = useMotionValue(0);

// Read/write
x.get();         // current value
x.set(100);      // set (batched to next frame)
x.jump(50);      // immediate set, reset velocity
x.getVelocity(); // per-second velocity
x.isAnimating(); // boolean
x.stop();        // stop active animation
x.on("change", v => console.log(v));