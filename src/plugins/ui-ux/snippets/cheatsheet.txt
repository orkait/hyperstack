# UI/UX Fundamentals Cheatsheet

## Typography
- Scale: 1.25 (minor third) or 1.333 (perfect fourth) ratio
- Display/H1/H2/H3: fluid with clamp() — body 16px stays fixed
- Large text (24px+): tight line height 1.05–1.2
- Body text (14–18px): generous line height 1.6–1.75
- Headings: negative tracking (-0.01 to -0.03em)
- Body: zero tracking — NEVER negative
- Overlines: positive tracking (+0.06 to +0.10em)
- Max 2 font families. Always include fallback: `ui-sans-serif, system-ui, sans-serif`
- Prose max-width: 65ch

## Color
- Use OKLCH — perceptually uniform, P3 gamut, independent axes
- Commit to warm OR cool neutrals — never mix
- Body text: 4.5:1 contrast (AA). Large text/UI: 3:1 (AA)
- Dark mode: warm charcoal (oklch 0.13–0.15 L), not #000
- Off-white text (oklch 0.94 L), not #fff
- Status solid variants: L ~0.55 for white text at 4.5:1
- Always provide solid + soft variants for status colors
- Warm shadows: oklch(0.22 0.006 56 / 0.08) — never rgba(0,0,0,...)

## Spacing
- 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96px
- Space within groups < space between groups (most important rule)
- Section: 96px → 64px → 48px (desktop → tablet → mobile)
- Card padding: 28–40px → 20–28px → 16–20px

## Elevation (5 levels)
- 0: page bg — 1: inline cards — 2: standard cards
- 3: dropdowns/popovers — 4: modals/dialogs
- Dark mode: no shadows — use progressively lighter bg per level

## Motion
- Exits faster than entrances (enter 200ms → exit 150ms)
- ease-out entering, ease-in exiting, ease-in-out repositioning
- NEVER linear easing for UI
- ALWAYS prefers-reduced-motion in @layer base with !important

## Accessibility
- Touch targets: min 44×44px (WCAG), 48×48px (recommended)
- Gap between targets: ≥8px
- Every interactive element needs visible focus: 2px ring, 2px offset, primary color
- Trap focus in modals, return on close
- Never color as only state indicator — add icons/text

## Components
- Buttons: sm=36px, md=40px, lg=44px height
- Disabled: exactly 0.5 opacity + pointer-events: none
- Z-index scale: dropdown=1000, sticky=1010, modal=1050, tooltip=1070, toast=1080