const cleanup = inView(element, (entry) => {
  console.log("in view");
  return () => console.log("left view");
});