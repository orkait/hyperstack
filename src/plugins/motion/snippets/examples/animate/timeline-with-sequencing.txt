async function playIntro() {
  const controls = animate([
    [".title", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 }],
    [".subtitle", { opacity: [0, 1] }, { duration: 0.4, at: "-0.2" }],
    [".cta", { scale: [0.8, 1], opacity: [0, 1] }, { duration: 0.3, at: "+0.1" }],
  ]);

  await controls;
  console.log("Intro complete");
}