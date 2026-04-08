/* Density mode system */
:root {
  --density-scale: 1;       /* default */
  --density-text-adjust: 0; /* rem offset for font sizes */
}

.density-compact {
  --density-scale: 0.75;
  --density-text-adjust: -0.0625rem; /* -1px */

  /* Override spacing tokens */
  --spacing-card: 1.25rem;      /* vs 1.75rem default */
  --spacing-card-sm: 0.875rem;  /* vs 1.25rem default */
  --spacing-section-y: 4rem;    /* vs 6rem default */
  --spacing-grid-cards: 1rem;   /* vs 1.5rem default */

  /* Override sizing tokens */
  --btn-h-md: 2rem;             /* vs 2.5rem default */
  --btn-h-lg: 2.25rem;          /* vs 2.75rem default */
  --input-h-md: 2rem;           /* vs 2.5rem default */
  --input-h-lg: 2.25rem;        /* vs 2.75rem default */
}

.density-comfortable {
  --density-scale: 1.125;
  --density-text-adjust: 0.0625rem; /* +1px */

  --spacing-card: 2.25rem;      /* vs 1.75rem default */
  --spacing-card-sm: 1.625rem;  /* vs 1.25rem default */
  --spacing-section-y: 8rem;    /* vs 6rem default */
  --spacing-grid-cards: 2rem;   /* vs 1.5rem default */

  --btn-h-md: 2.75rem;          /* vs 2.5rem default */
  --btn-h-lg: 3rem;             /* vs 2.75rem default */
  --input-h-md: 2.75rem;        /* vs 2.5rem default */
}

/* Usage: apply class to <html> or top-level wrapper */