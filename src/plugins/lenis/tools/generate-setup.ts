import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function register(server: McpServer): void {
  server.tool(
    "lenis_generate_setup",
    "Generate complete Lenis setup code from a natural-language description. Handles Next.js, GSAP, Framer Motion, basic React, and custom container scenarios.",
    {
      description: z
        .string()
        .describe(
          "Describe your setup (e.g., 'next.js app router with gsap scrolltrigger', 'basic react spa', 'framer motion integration', 'next.js with accessibility support', 'horizontal scroll container')",
        ),
    },
    async ({ description }) => {
      const desc = description.toLowerCase();

      const isNextJs = desc.includes("next") || desc.includes("app router") || desc.includes("app dir");
      const isGSAP = desc.includes("gsap") || desc.includes("scroll trigger") || desc.includes("scrolltrigger");
      const isFramer = desc.includes("framer") || desc.includes("motion");
      const isHorizontal = desc.includes("horizontal");
      const isAccessibility = desc.includes("a11y") || desc.includes("accessibility") || desc.includes("reduced motion");
      const isContainer = desc.includes("container") || desc.includes("panel") || desc.includes("section");

      let code = "";
      let notes = "";

      if (isGSAP && isNextJs) {
        code = `// components/lenis-gsap-provider.tsx
"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function GSAPSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    return () => lenis.off("scroll", ScrollTrigger.update);
  }, [lenis]);

  return null;
}

export function LenisGSAPProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
      <GSAPSync />
      {children}
    </ReactLenis>
  );
}

// app/layout.tsx
import { LenisGSAPProvider } from "@/components/lenis-gsap-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisGSAPProvider>{children}</LenisGSAPProvider>
      </body>
    </html>
  );
}`;
        notes = "- autoRaf: false is critical — prevents Lenis and GSAP from each running their own RAF loop\n- gsap.ticker.lagSmoothing(0) prevents stutter after tab switches\n- lenis.raf() expects ms — multiply GSAP seconds by 1000";
      } else if (isGSAP) {
        code = `// lenis-gsap-setup.tsx
"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function GSAPSync() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    return () => lenis.off("scroll", ScrollTrigger.update);
  }, [lenis]);
  return null;
}

export function App() {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
      <GSAPSync />
      {/* your app */}
    </ReactLenis>
  );
}`;
        notes = "- Set autoRaf: false to prevent double-frame rendering with GSAP\n- Multiply GSAP ticker time (seconds) by 1000 for lenis.raf()";
      } else if (isFramer) {
        code = `// components/lenis-framer-provider.tsx
"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { frame } from "motion";

function FramerSync() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);
    return () => frame.cancel(update);
  }, [lenis]);
  return null;
}

export function LenisFramerProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
      <FramerSync />
      {children}
    </ReactLenis>
  );
}${isNextJs ? `

// app/layout.tsx
import { LenisFramerProvider } from "@/components/lenis-framer-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisFramerProvider>{children}</LenisFramerProvider>
      </body>
    </html>
  );
}` : ""}`;
        notes = "- Import frame from 'motion' (not 'framer-motion') — this is the v11+ low-level scheduler\n- frame.update(fn, true) loops on every frame\n- autoRaf: false prevents duplicate ticking";
      } else if (isHorizontal) {
        code = `// components/horizontal-scroll.tsx
"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      options={{
        orientation: "horizontal",
        gestureOrientation: "both",
        lerp: 0.1,
      }}
      className="w-screen overflow-x-hidden"
    >
      <div className="flex flex-nowrap">
        {children}
      </div>
    </ReactLenis>
  );
}`;
        notes = "- orientation: 'horizontal' tells Lenis which axis to scroll\n- gestureOrientation: 'both' captures both wheel and touch gestures\n- The inner div should use flex-nowrap to allow horizontal overflow";
      } else if (isAccessibility) {
        code = `// components/smooth-scroll-provider.tsx
"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}${isNextJs ? `

// app/layout.tsx
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}` : ""}`;
        notes = "- Skipping ReactLenis falls back to native scroll — no extra setup needed\n- WCAG 2.1 SC 2.3.3 (AAA): smooth scrolling must respect prefers-reduced-motion";
      } else if (isNextJs) {
        code = `// components/smooth-scroll-provider.tsx
"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      {children}
    </ReactLenis>
  );
}

// app/layout.tsx
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}`;
        notes = "- Keep app/layout.tsx as a Server Component — extract 'use client' into SmoothScrollProvider\n- This preserves RSC boundaries and server rendering for child pages\n- The CSS import in the client component is required";
      } else if (isContainer) {
        code = `// components/scroll-panel.tsx
"use client";

import { useRef } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function ScrollPanel({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis options={{ lerp: 0.1 }}>
      <div style={{ height: "100vh", position: "relative" }}>
        {children}
      </div>
    </ReactLenis>
  );
}`;
        notes = "- ReactLenis without root creates a scoped container scroll\n- The wrapper needs a fixed height for the scroll to work\n- Use wrapper/content refs via LenisOptions for full control";
      } else {
        code = `// App.tsx — basic React SPA setup
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      <main>
        {/* your content */}
      </main>
    </ReactLenis>
  );
}`;
        notes = "- root={true} attaches Lenis to the window scroll\n- lerp: 0.1 is the recommended starting value — tune between 0.05 (smoother) and 0.15 (snappier)\n- The CSS import is required — it sets up the scroll container styles";
      }

      const text = `# Lenis Setup: ${description}\n\n\`\`\`tsx\n${code}\n\`\`\`\n\n## Notes\n\n${notes}`;
      return { content: [{ type: "text", text }] };
    },
  );
}
