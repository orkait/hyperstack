import { useRef } from "react";
import { useLenis } from "lenis/react";

export function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null);

  useLenis(({ scroll }) => {
    if (!ref.current) return;
    const offset = scroll * 0.3;
    ref.current.style.transform = `translateY(${offset}px)`;
  });

  return (
    <section>
      <div ref={ref} className="parallax-bg" />
    </section>
  );
}