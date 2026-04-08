function Tabs({ tabs, selected }) {
  return tabs.map(tab => (
    <li key={tab.id} onClick={() => select(tab)}>
      {tab.label}
      {selected === tab && (
        <motion.div layoutId="underline" className="underline" />
      )}
    </li>
  ));
}