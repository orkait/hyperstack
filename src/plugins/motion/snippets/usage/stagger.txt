// With useAnimate
animate("li", { opacity: 1 }, { delay: stagger(0.1) });

// From center
animate("li", { opacity: 1 }, { delay: stagger(0.1, { from: "center" }) });

// With variants
const container = {
  show: { transition: { delayChildren: stagger(0.1) } }
};