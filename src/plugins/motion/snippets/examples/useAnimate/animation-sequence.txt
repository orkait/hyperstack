const [scope, animate] = useAnimate();

async function handleClick() {
  await animate(scope.current, { scale: 1.2 });
  await animate(scope.current, { rotate: 360 });
  await animate(scope.current, { scale: 1 });
}