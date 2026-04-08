/* @theme inline READS from CSS vars at runtime */
/* This means dark mode changes propagate to Tailwind utilities automatically */
@theme inline {
  /* Map semantic tokens to Tailwind utility names */
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-muted: var(--color-text-muted);
  --color-border: var(--color-border);
  --color-surface: var(--color-surface);

  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-fg);
  --color-secondary: var(--color-secondary);
  --color-secondary-foreground: var(--color-secondary-fg);

  --color-success: var(--color-success);
  --color-success-foreground: var(--color-success-fg);
  --color-error: var(--color-error);
  --color-error-foreground: var(--color-error-fg);
  --color-warning: var(--color-warning);
  --color-warning-foreground: var(--color-warning-fg);
}

/* Now these work as Tailwind utilities: */
/* bg-background, text-foreground, bg-primary, text-primary-foreground */
/* border-border, text-muted, bg-surface, bg-success, text-error... */