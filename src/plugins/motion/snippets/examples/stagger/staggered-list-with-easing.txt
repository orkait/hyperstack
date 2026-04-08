const [scope, animate] = useAnimate();

animate("li", { opacity: 1, x: 0 }, {
  delay: stagger(0.1, { startDelay: 0.2, from: "center", ease: "easeOut" })
});