const [isPresent, safeToRemove] = usePresence();

useEffect(() => {
  if (!isPresent) {
    // run custom exit animation, then:
    safeToRemove();
  }
}, [isPresent]);