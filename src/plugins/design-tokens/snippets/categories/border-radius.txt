/* Border radius scale */
@theme {
  --radius-none: 0;
  --radius-xs: 0.125rem;   /* 2px — sharp, subtle rounding */
  --radius-sm: 0.25rem;    /* 4px — inputs, tags */
  --radius-md: 0.375rem;   /* 6px — buttons, cards */
  --radius-lg: 0.5rem;     /* 8px — modals, large cards */
  --radius-xl: 0.75rem;    /* 12px — feature cards */
  --radius-2xl: 1rem;      /* 16px — large containers */
  --radius-3xl: 1.5rem;    /* 24px — hero sections */
  --radius-full: 9999px;   /* pill */
}

/* Semantic radius tokens */
:root {
  --radius-btn: var(--radius-md);      /* 6px */
  --radius-input: var(--radius-sm);    /* 4px */
  --radius-card: var(--radius-lg);     /* 8px */
  --radius-card-feature: var(--radius-xl); /* 12px */
  --radius-modal: var(--radius-xl);    /* 12px */
  --radius-badge: var(--radius-full);  /* pill */
  --radius-tag: var(--radius-sm);      /* 4px */
  --radius-tooltip: var(--radius-sm);  /* 4px */
  --radius-popover: var(--radius-lg);  /* 8px */
  --radius-avatar: var(--radius-full); /* circular */
}