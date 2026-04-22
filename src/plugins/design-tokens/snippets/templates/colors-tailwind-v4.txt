/* ============================================================
   DESIGN TOKEN SYSTEM — Colors (Tailwind v4 + shadcn/ui)
   Architecture: @theme primitives → :root/:dark semantics → @theme inline utilities
   ============================================================ */

@import "tailwindcss";

/* ── Layer 1: Primitive ramps ─────────────────────────────── */
@theme {
  /* Brand ramp — change hue angle here to swap palette globally */
  --color-brand-50:  oklch(0.97 0.02 291);
  --color-brand-100: oklch(0.94 0.04 291);
  --color-brand-200: oklch(0.88 0.06 291);
  --color-brand-300: oklch(0.78 0.09 291);
  --color-brand-400: oklch(0.70 0.12 291);
  --color-brand-500: oklch(0.62 0.14 291);  /* default primary */
  --color-brand-600: oklch(0.54 0.14 291);  /* hover */
  --color-brand-700: oklch(0.46 0.13 291);
  --color-brand-800: oklch(0.38 0.11 291);
  --color-brand-900: oklch(0.28 0.08 291);
  --color-brand-950: oklch(0.18 0.05 291);

  /* Warm neutral ramp */
  --color-neutral-50:  oklch(0.98 0.008 60);
  --color-neutral-100: oklch(0.96 0.008 60);
  --color-neutral-200: oklch(0.92 0.008 60);
  --color-neutral-300: oklch(0.84 0.008 60);
  --color-neutral-400: oklch(0.72 0.008 60);
  --color-neutral-500: oklch(0.58 0.010 60);
  --color-neutral-600: oklch(0.46 0.010 60);
  --color-neutral-700: oklch(0.35 0.010 60);
  --color-neutral-800: oklch(0.26 0.010 60);
  --color-neutral-900: oklch(0.18 0.008 60);
  --color-neutral-950: oklch(0.12 0.005 60);
}

/* ── Layer 2: Semantic tokens ─────────────────────────────── */
:root {
  --color-bg: var(--color-neutral-50);
  --color-bg-subtle: var(--color-neutral-100);
  --color-surface: #ffffff;
  --color-border: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);
  --color-text: var(--color-neutral-900);
  --color-text-muted: var(--color-neutral-500);
  --color-primary: var(--color-brand-500);
  --color-primary-hover: var(--color-brand-600);
  --color-primary-fg: #ffffff;
  --color-success: oklch(0.55 0.14 145);
  --color-success-bg: oklch(0.96 0.04 145);
  --color-error: oklch(0.55 0.20 25);
  --color-error-bg: oklch(0.97 0.04 25);
  --color-warning: oklch(0.65 0.18 75);
  --color-warning-bg: oklch(0.97 0.04 75);
  --color-warning-fg: oklch(0.20 0.05 75);
}

.dark {
  --color-bg: oklch(0.15 0.008 265);
  --color-bg-subtle: oklch(0.18 0.008 265);
  --color-surface: oklch(0.21 0.008 265);
  --color-border: oklch(0.28 0.008 265);
  --color-border-strong: oklch(0.35 0.008 265);
  --color-text: oklch(0.95 0.008 265);
  --color-text-muted: oklch(0.65 0.008 265);
  --color-primary: var(--color-brand-400);
  --color-primary-hover: var(--color-brand-300);
  --color-primary-fg: oklch(0.15 0.005 291);
}

/* ── Layer 3: Tailwind utility bridge ─────────────────────── */
@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-muted: var(--color-text-muted);
  --color-border: var(--color-border);
  --color-surface: var(--color-surface);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-fg);
  --color-success: var(--color-success);
  --color-error: var(--color-error);
  --color-warning: var(--color-warning);
}

/* Dark mode variant */
@custom-variant dark (&:is(.dark *));