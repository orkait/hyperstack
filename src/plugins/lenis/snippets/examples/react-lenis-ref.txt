import { useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";

export function SmoothLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}