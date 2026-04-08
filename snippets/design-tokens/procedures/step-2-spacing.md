:root {
  /* Backgrounds */
  --color-bg: var(--color-neutral-50);
  --color-bg-subtle: var(--color-neutral-100);
  --color-surface: #ffffff;
  --color-surface-raised: var(--color-neutral-50);

  /* Borders */
  --color-border: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);
  --color-border-focus: var(--color-brand-500);

  /* Text */
  --color-text: var(--color-neutral-900);
  --color-text-muted: var(--color-neutral-500);
  --color-text-subtle: var(--color-neutral-400);
  --color-text-inverted: #ffffff;

  /* Interactive */
  --color-primary: var(--color-brand-500);
  --color-primary-hover: var(--color-brand-600);
  --color-primary-fg: #ffffff;
  --color-secondary: var(--color-neutral-200);
  --color-secondary-hover: var(--color-neutral-300);
  --color-secondary-fg: var(--color-neutral-900);

  /* Status */
  --color-success: oklch(0.55 0.14 145);
  --color-success-bg: oklch(0.96 0.04 145);
  --color-success-fg: #ffffff;
  --color-error: oklch(0.55 0.20 25);
  --color-error-bg: oklch(0.97 0.04 25);
  --color-error-fg: #ffffff;
  --color-warning: oklch(0.65 0.18 75);
  --color-warning-bg: oklch(0.97 0.04 75);
  --color-warning-fg: oklch(0.20 0.05 75);
}

.dark {
  --color-bg: oklch(0.15 0.008 265);
  --color-bg-subtle: oklch(0.18 0.008 265);
  --color-surface: oklch(0.21 0.008 265);
  --color-surface-raised: oklch(0.24 0.008 265);
  --color-border: oklch(0.28 0.008 265);
  --color-border-strong: oklch(0.35 0.008 265);
  --color-text: oklch(0.95 0.008 265);
  --color-text-muted: oklch(0.65 0.008 265);
  --color-text-subtle: oklch(0.50 0.008 265);
  --color-primary: var(--color-brand-400);
  --color-primary-hover: var(--color-brand-300);
  --color-primary-fg: oklch(0.15 0.005 291);
}