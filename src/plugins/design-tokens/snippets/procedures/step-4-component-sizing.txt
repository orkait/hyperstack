@theme {
  /* 4px base — sets the multiplier for p-1, p-2, p-4, etc. */
  --spacing: 0.25rem;
}

/* Named semantic tokens in :root */
:root {
  --spacing-section-y: 6rem;        /* 96px */
  --spacing-section-x: 1.5rem;      /* 24px mobile, override at md */
  --spacing-card: 1.75rem;          /* 28px */
  --spacing-card-sm: 1.25rem;       /* 20px */
  --spacing-grid-cards: 1.5rem;     /* 24px */
  --spacing-inline: 0.5rem;         /* 8px */
  --spacing-form-gap: 1.25rem;      /* 20px */
}

@media (min-width: 768px) {
  :root {
    --spacing-section-x: 3rem;      /* 48px desktop */
  }
}