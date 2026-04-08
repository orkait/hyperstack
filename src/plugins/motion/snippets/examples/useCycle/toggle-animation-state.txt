function Toggle() {
  const [isOn, toggle] = useCycle(false, true);
  return (
    <motion.div
      animate={{ scale: isOn ? 1.2 : 1 }}
      onClick={() => toggle()}
    />
  );
}