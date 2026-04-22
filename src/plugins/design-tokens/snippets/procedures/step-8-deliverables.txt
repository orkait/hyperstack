/* Run contrast checks on these pairs: */
/* --color-text on --color-bg → target 7:1 (AAA) */
/* --color-text-muted on --color-bg → target 4.5:1 (AA) */
/* --color-primary-fg on --color-primary → target 4.5:1 (AA) */
/* --color-success-fg on --color-success → target 4.5:1 (AA) */
/* --color-error-fg on --color-error → target 4.5:1 (AA) */
/* --color-border on --color-bg → target 1.1:1+ (perceptible) */

/* Tools: */
/* - https://oklch.com — build and preview oklch colors */
/* - https://www.myndex.com/APCA/ — APCA contrast checker */
/* - Storybook a11y addon — automated component-level checks */

/* Check for stale hue references: */
/* grep -r "violet-\|purple-\|blue-" src/  (old hardcoded Tailwind hue names) */