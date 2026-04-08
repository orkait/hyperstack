function StaggerList() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate("li", { opacity: 1, y: 0 }, { delay: stagger(0.1) });
  }, []);

  return (
    <ul ref={scope}>
      {items.map(item => (
        <li key={item} style={{ opacity: 0, y: 20 }}>{item}</li>
      ))}
    </ul>
  );
}