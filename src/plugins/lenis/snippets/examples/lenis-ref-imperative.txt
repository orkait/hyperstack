import { useRef, useEffect } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";

export function App() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    // Manually tick when needed (e.g. autoRaf: false)
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {/* ... */}
    </ReactLenis>
  );
}