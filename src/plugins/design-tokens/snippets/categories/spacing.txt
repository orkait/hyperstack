/* Tailwind v4 base multiplier — DO NOT override individual steps here */
@theme {
  --spacing: 0.25rem; /* 4px base — generates p-1=4px, p-2=8px, p-4=16px... */
}

/* Named semantic spacing tokens */
:root {
  --spacing-section-y: 6rem;       /* 96px — major vertical section padding */
  --spacing-section-x: 1.5rem;     /* 24px — horizontal section padding (mobile) */
  --spacing-card: 1.75rem;         /* 28px — card internal padding */
  --spacing-card-sm: 1.25rem;      /* 20px — small card padding */
  --spacing-grid-cards: 1.5rem;    /* 24px — gap between grid cards */
  --spacing-grid-cards-lg: 2rem;   /* 32px — larger gap variant */
  --spacing-inline: 0.5rem;        /* 8px — inline element gaps (icon + label) */
  --spacing-form-gap: 1.25rem;     /* 20px — gap between form fields */
  --spacing-nav-x: 1.5rem;         /* 24px — horizontal nav padding */
  --spacing-nav-y: 1rem;           /* 16px — vertical nav padding */
  --spacing-container-max: 80rem;  /* 1280px — max content width */
  --spacing-container-md: 65rem;   /* 1040px — medium content width */
  --spacing-container-narrow: 42rem; /* 672px — prose/narrow content */
}

/* Named tokens generate Tailwind utilities automatically in v4 */
/* Usage: p-card, py-section-y, gap-grid-cards, max-w-container-max */