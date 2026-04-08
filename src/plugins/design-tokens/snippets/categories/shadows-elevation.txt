/* Shadow / Elevation scale */
:root {
  /* Warm-tinted shadows — oklch, NOT rgba(0,0,0) */
  --shadow-xs: 0 1px 2px 0 oklch(0.30 0.02 60 / 0.08);
  --shadow-sm:
    0 1px 3px 0 oklch(0.30 0.02 60 / 0.10),
    0 1px 2px -1px oklch(0.30 0.02 60 / 0.06);
  --shadow-md:
    0 4px 6px -1px oklch(0.30 0.02 60 / 0.10),
    0 2px 4px -2px oklch(0.30 0.02 60 / 0.06);
  --shadow-lg:
    0 10px 15px -3px oklch(0.30 0.02 60 / 0.10),
    0 4px 6px -4px oklch(0.30 0.02 60 / 0.05);
  --shadow-xl:
    0 20px 25px -5px oklch(0.30 0.02 60 / 0.10),
    0 8px 10px -6px oklch(0.30 0.02 60 / 0.04);
  --shadow-2xl:
    0 25px 50px -12px oklch(0.30 0.02 60 / 0.25);

  /* Focus ring */
  --shadow-focus: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary);

  /* Semantic elevation tokens */
  --shadow-btn: var(--shadow-xs);
  --shadow-card: var(--shadow-sm);
  --shadow-modal: var(--shadow-xl);
  --shadow-dropdown: var(--shadow-lg);
  --shadow-tooltip: var(--shadow-md);
}

/* Dark mode — use bg-color elevation, skip shadows */
.dark {
  --shadow-xs: none;
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
  --shadow-xl: none;
  --shadow-2xl: none;

  /* Dark elevation via background lightness steps */
  --color-surface-1: oklch(0.22 0.008 265); /* slightly elevated */
  --color-surface-2: oklch(0.26 0.008 265);
  --color-surface-3: oklch(0.30 0.008 265);
  --color-surface-4: oklch(0.35 0.008 265); /* modal/floating level */
}