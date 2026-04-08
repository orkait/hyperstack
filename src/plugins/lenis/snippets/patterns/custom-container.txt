"use client";

import { useRef } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function ScrollPanel({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <ReactLenis
      options={{
        lerp: 0.1,
        wrapper: wrapperRef.current ?? undefined,
        content: contentRef.current ?? undefined,
      }}
    >
      <div ref={wrapperRef} style={{ height: "100vh", overflow: "hidden" }}>
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </ReactLenis>
  );
}