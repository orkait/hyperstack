import type { ToolServer } from "../../../shared/tool-types.js";

export function register(server: ToolServer): void {
  server.resource(
    "lenis-cheatsheet",
    "lenis://react/cheatsheet",
    { description: "Lenis React quick reference cheatsheet", mimeType: "text/markdown" },
    async () => {
      const text = `# Lenis React - Cheatsheet

## Install
\`\`\`bash
npm install lenis
\`\`\`

## Required CSS
\`\`\`tsx
import "lenis/dist/lenis.css"; // NEVER skip this
\`\`\`

## Import
\`\`\`tsx
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef, LenisOptions } from "lenis/react";
\`\`\`

## Quick Patterns

### Basic full-page setup
\`\`\`tsx
// Must be 'use client' in Next.js
<ReactLenis root options={{ lerp: 0.1 }}>
  {children}
</ReactLenis>
\`\`\`

### Next.js App Router (keep layout.tsx as RSC)
\`\`\`tsx
// components/smooth-scroll-provider.tsx
"use client";
export function SmoothScrollProvider({ children }) {
  return <ReactLenis root options={{ lerp: 0.1 }}>{children}</ReactLenis>;
}
// app/layout.tsx (Server Component)
<SmoothScrollProvider>{children}</SmoothScrollProvider>
\`\`\`

### useLenis - scroll callback
\`\`\`tsx
useLenis(({ scroll, progress, velocity }) => {
  // fires every frame while scrolling
});
\`\`\`

### useLenis - scroll to element
\`\`\`tsx
const lenis = useLenis();
lenis?.scrollTo("#section", { offset: -80, duration: 1.2 });
\`\`\`

### Stop / start scroll (e.g. modal open)
\`\`\`tsx
const lenis = useLenis();
lenis?.stop();  // lock
lenis?.start(); // unlock
\`\`\`

### GSAP integration (autoRaf: false)
\`\`\`tsx
<ReactLenis root options={{ autoRaf: false }}>
  ...
</ReactLenis>
// In a child component:
const lenis = useLenis();
useEffect(() => {
  if (!lenis) return;
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.on("scroll", ScrollTrigger.update);
  return () => lenis.off("scroll", ScrollTrigger.update);
}, [lenis]);
\`\`\`

### Framer Motion integration (autoRaf: false)
\`\`\`tsx
import { frame } from "motion";
const lenis = useLenis();
useEffect(() => {
  if (!lenis) return;
  const update = ({ timestamp }) => lenis.raf(timestamp);
  frame.update(update, true);
  return () => frame.cancel(update);
}, [lenis]);
\`\`\`

## Key LenisOptions
| Option | Default | Notes |
|---|---|---|
| lerp | 0.1 | Smoothing factor. Lower = smoother. 0.05–0.15 range |
| duration | - | For programmatic scrolls. Overrides lerp |
| orientation | vertical | 'vertical' or 'horizontal' |
| smoothWheel | true | Mouse wheel smooth scroll |
| smoothTouch | false | Touch smooth scroll - avoid on iOS |
| autoRaf | true | Set false for GSAP/Framer sync |
| infinite | false | Infinite loop scroll |

## Common Pitfalls
- Missing \`import "lenis/dist/lenis.css"\` - scroll breaks visually
- Using \`autoRaf: true\` with GSAP ticker - causes desync / double frames
- Calling \`useLenis()\` outside \`<ReactLenis>\` - returns undefined, crashes
- Missing \`"use client"\` in Next.js App Router - Lenis uses refs and effects
- \`smoothTouch: true\` on iOS - perceivable input lag on low-end devices
`;
      return { contents: [{ uri: "lenis://react/cheatsheet", mimeType: "text/markdown", text }] };
    },
  );
}
