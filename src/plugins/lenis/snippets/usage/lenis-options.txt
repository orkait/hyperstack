<ReactLenis
  root
  options={{
    lerp: 0.1,
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    orientation: "vertical",
    smoothWheel: true,
    smoothTouch: false,
  }}
>
  {children}
</ReactLenis>