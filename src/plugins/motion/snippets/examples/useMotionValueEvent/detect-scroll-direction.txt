function ScrollDirection() {
  const { scrollY } = useScroll();
  const [direction, setDirection] = useState("down");

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = scrollY.getPrevious();
    setDirection(current > prev ? "down" : "up");
  });

  return <div>Scrolling {direction}</div>;
}