const [scope, animate] = useAnimate();

// On mount or event:
await animate(scope.current, { opacity: 1 }, { duration: 0.5 });
await animate("li", { x: 0 }, { delay: stagger(0.1) });