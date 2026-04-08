useAnimationFrame((time, delta) => {
  ref.current.style.transform = `rotateY(${time * 0.1}deg)`;
});