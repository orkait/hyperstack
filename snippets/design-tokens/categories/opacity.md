/* Opacity scale */
@theme {
  --opacity-disabled: 0.5;    /* exact WCAG-aligned disabled state */
  --opacity-muted: 0.65;      /* secondary text, subtle elements */
  --opacity-ghost: 0.4;       /* very subtle ghost elements */
  --opacity-overlay: 0.5;     /* modal backdrop overlay */
  --opacity-overlay-heavy: 0.75; /* strong modal overlay */
  --opacity-glass: 0.8;       /* frosted glass backgrounds */
  --opacity-glass-light: 0.6; /* lighter glass variant */
  --opacity-skeleton: 0.08;   /* skeleton loading shimmer base */
  --opacity-hover: 0.9;       /* subtle hover brightness */
}

/* Semantic usage in components */
@layer components {
  [disabled], [aria-disabled="true"] {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  .text-muted { opacity: var(--opacity-muted); }

  .glass {
    background: oklch(from var(--color-surface) l c h / var(--opacity-glass));
    backdrop-filter: blur(12px) saturate(150%);
    -webkit-backdrop-filter: blur(12px) saturate(150%);
  }
}