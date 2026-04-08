function Counter() {
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, 100, { duration: 5 });
    return () => controls.stop();
  }, []);

  return <motion.pre>{count}</motion.pre>;
}