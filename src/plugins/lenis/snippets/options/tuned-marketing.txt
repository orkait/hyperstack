<ReactLenis
  root
  options={{
    lerp: 0.08,
    duration: 1.4,
    easing: (t) => 1 - Math.pow(1 - t, 5),
    smoothWheel: true,
    smoothTouch: false,
  }}
>