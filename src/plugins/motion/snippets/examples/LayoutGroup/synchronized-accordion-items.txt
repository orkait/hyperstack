<LayoutGroup>
  {items.map(item => (
    <motion.div key={item.id} layout>
      <motion.h3 layout>{item.title}</motion.h3>
      <AnimatePresence>
        {expanded === item.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {item.content}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  ))}
</LayoutGroup>