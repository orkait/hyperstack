# Color Ramp Role Map

Each stop in a color ramp has a specific intended use. Inspired by Radix's per-step documentation.

## Brand Ramp (--color-brand-*)

| Stop | Light mode role | Dark mode role |
|------|----------------|---------------|
| 50 | Section background tint, hover states | — |
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

## Pop / Accent Ramp (--color-pop-*)

| Stop | Role |
|------|------|
| 50 | Soft tint (eyebrow badge background, swap state) |
| 100 | Badge fill, notification dot bg, energy tint |
| 200 | Light decorative fill |
| 300 | Hover state for pop elements |
| 400 | Border accent (badge border, active accent) |
| 500 | Secondary button fill, callout accent, energy color |
| 600 | Hover/active state for pop buttons |
| 700 | Label text on pop-50/100 fills (ensures AA contrast) |
| 800–950 | Dark mode equivalents (reversed — 800 as text, 950 as bg) |

## Neutral / Warm Ramp (--color-warm-*)

| Stop | Semantic mapping |
|------|-----------------|
| 50 | `--background` (light) — page bg |
| 100 | `--muted` — alternate section bg, inset panels |
| 200 | `--border` — dividers, input outlines |
| 300 | Stronger border — hover states, active outlines |
| 400 | `--muted-foreground` in some contexts, placeholder text |
| 500 | `--muted-foreground` — secondary text |
| 600 | Tertiary dark — footer text in light mode |
| 700 | `--muted` (dark) — dark mode muted surfaces |
| 800 | `--card` (dark) — dark mode card background |
| 900 | `--background` (dark) — dark mode page bg |
| 950 | Deepest — dark mode deep surfaces, overlays |

## Ramp Construction Rules

1. All 11 stops (50–950) required per ramp — no gaps
2. Lightness (L) must be monotonically decreasing from 50 → 950
3. Chroma (C) peaks at 400–600, tapers at extremes
4. Hue (H) stays within ±5° across the ramp for coherence
5. Neutrals: chroma between 0.003–0.015 (any lower reads gray, not warm)
6. Text stops (700–900 on light fills) must achieve 4.5:1 contrast with their corresponding fill stops (50–200)
