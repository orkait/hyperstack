# Design System Benchmark Matrix

Compare against these 5 standards. Score: ✓ (full), ◐ (partial), ✗ (missing).

## 42 Categories

**Colors (5):** Semantic roles, primitive ramps, light/dark, chart colors, OKLCH/P3
**Typography (6):** Font families, type scale tokens, line heights, weights, tracking, fluid type
**Spacing (3):** Base unit, semantic tokens, layout spacing
**Shape (1):** Radius scale (5+ levels + pill)
**Elevation (2):** Shadow scale, warm-tinted shadows
**Motion (3):** Easing curves, duration scale, reduced motion
**Sizing (4):** Button, input, icon, avatar sizes
**Layout (3):** Breakpoints, containers, grid system
**Z-Index & Opacity (2):** Named z-index, opacity tokens
**Accessibility (3):** AA contrast, focus rings, touch targets
**Domain (3):** Viz states, canvas/flow, sidebar/shell
**Infrastructure (4):** Token format, TS patterns, density, Figma
**Docs (3):** Human reference, LLM prompt, HTML showcase

## Industry Scores (2025)

| System | Score | Notes |
|--------|-------|-------|
| Material 3 | 35/42 | Strong motion/density/Figma. No warm shadows. |
| Carbon (IBM) | 37/42 | Best spacing/grid. No OKLCH or fluid type. |
| Radix | 28/42 | Best color DX + alpha. Minimal spacing/motion/grid. |
| shadcn/ui | 22/42 | Best CSS var architecture. Relies on Tailwind defaults. |
| Tailwind v4 | 20/42 | Best engine. No semantic layer, no domain tokens. |

Target: 38–42 for a complete custom system (Figma kit is typical remaining gap).
