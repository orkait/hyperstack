import { ReactLenis } from "lenis/react";

export function ScrollContainer({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      options={{ lerp: 0.08, orientation: "vertical" }}
      className="h-screen overflow-hidden"
    >
      {children}
    </ReactLenis>
  );
}