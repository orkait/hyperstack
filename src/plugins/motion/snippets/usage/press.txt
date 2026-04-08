const cleanup = press(element, (event) => {
  console.log("press start");
  return () => console.log("press end");
});