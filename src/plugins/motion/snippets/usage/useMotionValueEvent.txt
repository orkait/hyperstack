const x = useMotionValue(0);

useMotionValueEvent(x, "change", (latest) => {
  console.log("x changed to", latest);
});

useMotionValueEvent(x, "animationComplete", () => {
  console.log("Animation finished");
});