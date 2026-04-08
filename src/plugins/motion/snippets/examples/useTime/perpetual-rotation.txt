function Spinner() {
  const time = useTime();
  const rotate = useTransform(time, [0, 2000], [0, 360], { clamp: false });

  return <motion.div style={{ rotate, width: 50, height: 50 }} />;
}