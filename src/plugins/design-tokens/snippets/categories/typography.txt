/* Typography scale tokens */
:root {
  /* Font families */
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
  --font-display: "Cal Sans", var(--font-sans); /* optional display font */

  /* Type scale — fluid for headings, fixed for body */
  --text-display: clamp(3rem, 5vw + 1rem, 4.5rem);     /* 48–72px */
  --text-h1: clamp(2.25rem, 3.5vw + 0.5rem, 3rem);     /* 36–48px */
  --text-h2: clamp(1.75rem, 2.5vw + 0.25rem, 2.25rem); /* 28–36px */
  --text-h3: clamp(1.375rem, 1.5vw + 0.25rem, 1.5rem); /* 22–24px */
  --text-subtitle: 1.125rem;  /* 18px — fixed */
  --text-body: 1rem;          /* 16px — fixed, never fluid */
  --text-body-sm: 0.875rem;   /* 14px */
  --text-caption: 0.75rem;    /* 12px */
  --text-overline: 0.6875rem; /* 11px — all-caps label */

  /* Line heights — tight for large, generous for small */
  --leading-display: 1.05;
  --leading-heading: 1.2;
  --leading-subtitle: 1.35;
  --leading-body: 1.7;
  --leading-body-sm: 1.6;
  --leading-caption: 1.5;

  /* Letter spacing */
  --tracking-tight: -0.03em;   /* display headings */
  --tracking-heading: -0.02em; /* h1–h2 */
  --tracking-snug: -0.01em;    /* h3 */
  --tracking-normal: 0em;      /* body */
  --tracking-wide: 0.06em;     /* overlines */
  --tracking-wider: 0.10em;    /* strong overlines */

  /* Font weights */
  --font-weight-display: 800;
  --font-weight-heading: 700;
  --font-weight-subheading: 600;
  --font-weight-body: 400;
  --font-weight-strong: 500;
  --font-weight-mono: 450;

  /* Prose max-width */
  --prose-width: 65ch;
}

/* Semantic typography classes */
@layer components {
  .text-display {
    font-size: var(--text-display);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-tight);
    font-weight: var(--font-weight-display);
  }
  .text-h1 {
    font-size: var(--text-h1);
    line-height: var(--leading-heading);
    letter-spacing: var(--tracking-heading);
    font-weight: var(--font-weight-heading);
  }
  .text-h2 {
    font-size: var(--text-h2);
    line-height: var(--leading-heading);
    letter-spacing: var(--tracking-heading);
    font-weight: var(--font-weight-heading);
  }
  .text-h3 {
    font-size: var(--text-h3);
    line-height: var(--leading-subtitle);
    letter-spacing: var(--tracking-snug);
    font-weight: var(--font-weight-subheading);
  }
  .text-overline {
    font-size: var(--text-overline);
    line-height: var(--leading-caption);
    letter-spacing: var(--tracking-wider);
    font-weight: var(--font-weight-subheading);
    text-transform: uppercase;
  }
}