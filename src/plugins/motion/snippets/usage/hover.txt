const cleanup = hover(element, (event) => {
  console.log("hover start");
  return () => console.log("hover end");
});