function ExitComponent() {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!isPresent) {
      animate(scope.current, { opacity: 0 }).then(safeToRemove);
    }
  }, [isPresent]);

  return <div ref={scope}>Content</div>;
}