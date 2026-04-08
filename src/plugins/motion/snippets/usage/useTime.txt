const time = useTime();
const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false });

return <motion.div style={{ rotate }} />;