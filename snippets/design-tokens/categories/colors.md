/* Layer 1 – Primitives (@theme) */
@theme {
  --color-brand-50: oklch(0.97 0.02 291);
  --color-brand-100: oklch(0.94 0.04 291);
  --color-brand-200: oklch(0.88 0.06 291);
  --color-brand-300: oklch(0.78 0.09 291);
  --color-brand-400: oklch(0.70 0.12 291);
  --color-brand-500: oklch(0.62 0.14 291);
  --color-brand-600: oklch(0.54 0.14 291);
  --color-brand-700: oklch(0.46 0.13 291);
  --color-brand-800: oklch(0.38 0.11 291);
  --color-brand-900: oklch(0.28 0.08 291);
  --color-brand-950: oklch(0.18 0.05 291);
}

/* Layer 2 – Semantics (:root / .dark) */
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
}

.dark {
  --color-bg: oklch(0.18 0.008 265);
  --color-bg-subtle: oklch(0.21 0.008 265);
  --color-surface: oklch(0.24 0.008 265);
  --color-border: oklch(0.30 0.008 265);
  --color-border-strong: oklch(0.36 0.008 265);
  --color-text: oklch(0.94 0.008 265);
  --color-text-muted: oklch(0.60 0.008 265);
  --color-primary: var(--color-brand-400);
  --color-primary-hover: var(--color-brand-300);
  --color-primary-fg: oklch(0.18 0.005 291);
}

/* Layer 3 – @theme inline (bridges CSS vars to Tailwind utilities) */
@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-fg);
  --color-border: var(--color-border);
  --color-muted: var(--color-text-muted);
}