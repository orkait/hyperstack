const [color, cycleColor] = useCycle("#f00", "#0f0", "#00f");

return <motion.div animate={{ backgroundColor: color }} onClick={() => cycleColor()} />;