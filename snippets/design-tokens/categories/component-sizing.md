/* Component sizing tokens */
:root {
  /* Touch targets (WCAG 2.5.5) */
  --size-touch-min: 44px;         /* WCAG minimum */
  --size-touch-comfortable: 48px; /* recommended */

  /* Button sizes */
  --btn-h-xs: 1.75rem;    /* 28px */
  --btn-h-sm: 2rem;       /* 32px */
  --btn-h-md: 2.5rem;     /* 40px */
  --btn-h-lg: 2.75rem;    /* 44px — matches touch-min */
  --btn-h-xl: 3.25rem;    /* 52px */

  --btn-px-xs: 0.625rem;  /* 10px */
  --btn-px-sm: 0.875rem;  /* 14px */
  --btn-px-md: 1rem;      /* 16px */
  --btn-px-lg: 1.25rem;   /* 20px */
  --btn-px-xl: 1.75rem;   /* 28px */

  --btn-text-xs: 0.6875rem; /* 11px */
  --btn-text-sm: 0.8125rem; /* 13px */
  --btn-text-md: 0.9375rem; /* 15px */
  --btn-text-lg: 1rem;      /* 16px */
  --btn-text-xl: 1.0625rem; /* 17px */

  /* Input sizes */
  --input-h-sm: 2rem;      /* 32px */
  --input-h-md: 2.5rem;    /* 40px */
  --input-h-lg: 2.75rem;   /* 44px */
  --input-px-md: 0.875rem; /* 14px */
  --input-px-lg: 1rem;     /* 16px */

  /* Icon sizes */
  --icon-xs: 0.75rem;   /* 12px */
  --icon-sm: 1rem;      /* 16px */
  --icon-md: 1.25rem;   /* 20px */
  --icon-lg: 1.5rem;    /* 24px */
  --icon-xl: 2rem;      /* 32px */
  --icon-2xl: 3rem;     /* 48px */

  /* Avatar sizes */
  --avatar-xs: 1.5rem;   /* 24px */
  --avatar-sm: 2rem;     /* 32px */
  --avatar-md: 2.5rem;   /* 40px */
  --avatar-lg: 3rem;     /* 48px */
  --avatar-xl: 4rem;     /* 64px */
  --avatar-2xl: 5rem;    /* 80px */
}

/* Component class example */
@layer components {
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-inline);
    height: var(--btn-h-md);
    padding-inline: var(--btn-px-md);
    font-size: var(--btn-text-md);
    font-weight: var(--font-weight-strong);
    border-radius: var(--radius-md);
    transition: background-color 150ms ease-out, opacity 150ms ease-out;
    cursor: pointer;
    user-select: none;
  }
  .btn-sm {
    height: var(--btn-h-sm);
    padding-inline: var(--btn-px-sm);
    font-size: var(--btn-text-sm);
  }
  .btn-lg {
    height: var(--btn-h-lg);
    padding-inline: var(--btn-px-lg);
    font-size: var(--btn-text-lg);
  }
}