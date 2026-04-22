/* ============================================================
   DESIGN TOKEN SYSTEM — Spacing (4px grid + named semantics)
   ============================================================ */

@theme {
  --spacing: 0.25rem; /* 4px base multiplier */
}

:root {
  /* Section-level spacing */
  --spacing-section-y: 6rem;       /* 96px */
  --spacing-section-x: 1.5rem;     /* 24px mobile */

  /* Component spacing */
  --spacing-card: 1.75rem;         /* 28px */
  --spacing-card-sm: 1.25rem;      /* 20px */
  --spacing-grid-cards: 1.5rem;    /* 24px */
  --spacing-grid-cards-lg: 2rem;   /* 32px */
  --spacing-inline: 0.5rem;        /* 8px — icon + label */
  --spacing-form-gap: 1.25rem;     /* 20px */
  --spacing-nav-x: 1.5rem;         /* 24px */
  --spacing-nav-y: 1rem;           /* 16px */

  /* Container widths */
  --spacing-container-max: 80rem;     /* 1280px */
  --spacing-container-md: 65rem;      /* 1040px */
  --spacing-container-narrow: 42rem;  /* 672px */
}

@media (min-width: 768px) {
  :root {
    --spacing-section-x: 3rem; /* 48px desktop */
  }
}