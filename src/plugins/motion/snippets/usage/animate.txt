// Single element
animate("#box", { x: 100 }, { duration: 0.5 });

// Motion value
const x = motionValue(0);
animate(x, 100, { type: "spring" });

// Timeline sequence
animate([
  ["#title", { opacity: 1 }, { duration: 0.5 }],
  ["#content", { y: 0 }, { duration: 0.3, at: "-0.2" }],
]);