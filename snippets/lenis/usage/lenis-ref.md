import { useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";

export function SmoothLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  function scrollToSection(id: string) {
    lenisRef.current?.lenis?.scrollTo(`#${id}`, { duration: 1.0 });
  }

  return (
    <ReactLenis root ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}