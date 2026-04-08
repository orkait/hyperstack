const [items, setItems] = useState(["A", "B", "C", "D"]);

<Reorder.Group axis="y" values={items} onReorder={setItems}>
  <AnimatePresence>
    {items.map(item => (
      <Reorder.Item
        key={item}
        value={item}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
      >
        {item}
      </Reorder.Item>
    ))}
  </AnimatePresence>
</Reorder.Group>