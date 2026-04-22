# Lenis React - Quick Reference

## Required CSS

```css
/* In your global CSS file — or use: import 'lenis/dist/lenis.css' */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}
```

## Preventing Scroll on Nested Elements

```html
<!-- Exclude element from Lenis (native scroll) -->
<div data-lenis-prevent>...</div>

<!-- Wheel-only prevention -->
<div data-lenis-prevent-wheel>...</div>

<!-- Touch-only prevention -->
<div data-lenis-prevent-touch>...</div>
```

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Scroll jumps with GSAP ScrollTrigger | RAF loop conflict | Use `autoRaf: false` + `gsap.ticker.add()` |
| `useLenis` returns undefined | Component outside `<ReactLenis>` tree | Move provider higher, or use `root` prop |
| Lenis not working in Next.js | Missing `'use client'` | Add directive to provider component |
| Modal/overlay blocks page scroll | Lenis still active | Call `lenis.stop()` on open, `lenis.start()` on close |
| iOS touch feels laggy | `smoothTouch: true` | Set `smoothTouch: false` (default) |
| `scroll-behavior: smooth` conflicts | CSS fighting Lenis | Add `.lenis.lenis-smooth { scroll-behavior: auto !important; }` |
| Anchor links don't work | Lenis intercepting | Lenis handles anchors — use `scrollTo` or `data-lenis-prevent` |

## lerp Decision Guide

| Site Type | Recommended lerp |
|---|---|
| Marketing / landing | 0.08 – 0.12 |
| Creative / portfolio | 0.05 – 0.08 |
| App / dashboard | 0.1 (default) |

## Package Import Reference

| Package | Status | Import |
|---|---|---|
| `lenis` | Current (v1+) | `import { ReactLenis, useLenis } from 'lenis/react'` |
| `@studio-freight/lenis` | Legacy | `import Lenis from '@studio-freight/lenis'` |
| `@studio-freight/react-lenis` | Legacy | `import { ReactLenis } from '@studio-freight/react-lenis'` |