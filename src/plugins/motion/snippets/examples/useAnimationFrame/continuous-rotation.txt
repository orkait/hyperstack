function RotatingCube() {
  const ref = useRef(null);

  useAnimationFrame((time) => {
    if (ref.current) {
      ref.current.style.transform = `rotateY(${time * 0.05}deg)`;
    }
  });

  return <div ref={ref}>Rotating</div>;
}