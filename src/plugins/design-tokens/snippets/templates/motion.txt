/* ============================================================
   DESIGN TOKEN SYSTEM — Motion
   ============================================================ */

@theme {
  /* Durations */
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --duration-slowest: 600ms;

  /* Easing */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);           /* entering */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);            /* exiting */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);      /* repositioning */
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* playful */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  --ease-linear: linear;                             /* progress bars only */
}

:root {
  --transition-hover: background-color var(--duration-fast) var(--ease-out),
                      color var(--duration-fast) var(--ease-out),
                      border-color var(--duration-fast) var(--ease-out),
                      opacity var(--duration-fast) var(--ease-out);
  --transition-transform: transform var(--duration-normal) var(--ease-out);
  --transition-panel: transform var(--duration-slow) var(--ease-out),
                      opacity var(--duration-slow) var(--ease-out);
  --transition-fade: opacity var(--duration-normal) var(--ease-in-out);
}

/* REQUIRED — prefers-reduced-motion */
@layer base {
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}