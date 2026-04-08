:root {
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
}

.dark {
  --shadow-xs: none; --shadow-sm: none;
  --shadow-md: none; --shadow-lg: none; --shadow-xl: none;
  --color-surface-1: oklch(0.22 0.008 265);
  --color-surface-2: oklch(0.26 0.008 265);
  --color-surface-3: oklch(0.30 0.008 265);
}