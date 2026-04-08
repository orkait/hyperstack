"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { frame } from "motion";

function FramerSyncEffect() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    function update({ timestamp }: { timestamp: number }) {
      lenis.raf(timestamp);
    }

    frame.update(update, true);

    return () => {
      frame.cancel(update);
    };
  }, [lenis]);

  return null;
}

export function FramerLenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
      <FramerSyncEffect />
      {children}
    </ReactLenis>
  );
}