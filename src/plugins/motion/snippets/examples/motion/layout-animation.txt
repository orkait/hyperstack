function Toggle() {
  const [isOn, setIsOn] = useState(false);
  return (
    <div
      onClick={() => setIsOn(!isOn)}
      style={{ justifyContent: isOn ? "flex-end" : "flex-start" }}
    >
      <motion.div layout />
    </div>
  );
}