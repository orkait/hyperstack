# Color Ramp Role Map

Per-stop semantic roles for all three ramps.

## Brand Ramp (--color-brand-*)

| Stop | Light mode role | Dark mode role |
|------|----------------|---------------|
| 50 | Section bg tint, hover states | — |
| 100 | Badge/tag fills, subtle backgrounds | Text on dark fills |
| 200 | Selected row bg, active tab bg, UI element fill | Subtitle text on dark fills |
| 300 | Hovered UI element, input focus border | — |
| 400 | Active nav pill, toggle-on state | Primary text on dark surfaces |
| 500 | Icon color, brand fill, solid background | Brighter solid for dark mode |
| 600 | Button background, link text, primary action | — |
| 700 | Dark CTA background, headings on color | — |
| 800 | Title text on 50/100 backgrounds | — |
| 900 | Footer, deep accents, dark surfaces | Base-level dark card |
| 950 | Darkest — dark mode page background | — |

## Pop/Accent Ramp (--color-pop-*)

| Stop | Role |
|------|------|
| 50 | Soft tint (eyebrow badge bg, swap state) |
| 100 | Badge fill, notification dot bg |
| 200 | Light decorative fill |
| 300 | Hover state for pop elements |
| 400 | Border accent (badge border, active accent) |
| 500 | Secondary button fill, callout accent |
| 600 | Hover/active for pop buttons |
| 700 | Label text on pop-50/100 fills (AA contrast) |
| 800–950 | Dark mode reversed (800=text, 950=bg) |

## Neutral Ramp (--color-warm-* / --color-neutral-*)

| Stop | Semantic mapping |
|------|-----------------|
| 50 | --background (light) — page bg |
| 100 | --muted — alternate section bg, inset panels |
| 200 | --border — dividers, input outlines |
| 300 | Stronger border — hover, active outlines |
| 400 | Placeholder text |
| 500 | --muted-foreground — secondary text |
| 600 | Tertiary text, footer in light mode |
| 700 | --muted (dark) — dark mode muted surfaces |
| 800 | --card (dark) — dark mode card background |
| 900 | --background (dark) — dark mode page bg |
| 950 | Deepest — dark mode overlays |

## Ramp Construction Rules

1. All 11 stops (50–950) required — no gaps
2. Lightness (L) monotonically decreasing 50→950
3. Chroma (C) peaks at 400–600, tapers at extremes
4. Hue (H) stays within ±5° across the ramp
5. Neutrals: chroma 0.003–0.015 (lower reads as cold gray)
6. Text stops (700–900) must achieve 4.5:1 on fill stops (50–200)
