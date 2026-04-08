---
name: ui-ux
description: Core UI/UX design principles for building production interfaces. Covers typography systems (scale ratios, line height rules, tracking), color theory (contrast, semantic mapping, warmth), spacing grids (4px/8px systems), visual hierarchy (elevation, density, depth), motion design (easing selection, duration, reduced motion), accessibility (WCAG AA/AAA, touch targets, focus management), responsive layout (breakpoints, fluid scaling), and component patterns (buttons, cards, forms, badges). Use when designing interfaces, reviewing designs for quality, building components, choosing fonts/colors/spacing, or when the user asks about UI best practices, accessibility, or visual polish.
license: MIT
metadata:
  author: booleanstack
  version: "1.0"
---

# UI/UX Fundamentals for Production Interfaces

This skill encodes the design reasoning that separates polished interfaces from generic ones. Use when making any visual decision.

## Typography

### Type scale

Use mathematical ratios, not random sizes. Recommended web app scale:

| Role | Size | Weight | Line height | Tracking |
|------|------|--------|-------------|----------|
| Display | 48–72px fluid | 800 | 1.05–1.1 | -0.03em |
| H1 | 40–56px fluid | 700 | 1.1 | -0.02em |
| H2 | 28–40px fluid | 700 | 1.15 | -0.02em |
| H3 | 20–24px fluid | 600 | 1.3 | -0.01em |
| Subtitle | 16–20px fluid | 500 | 1.5 | 0 |
| Body | 16px | 400 | 1.75 | 0 |
| Body small | 14px | 400 | 1.6 | 0 |
| Caption | 13px | 500 | 1.5 | 0 |
| Overline | 12px | 600 | 1.4 | +0.10em |

### Line height rules

- **Large text (24px+):** tight (1.05–1.2) — built-in optical spacing
- **Body text (14–18px):** generous (1.6–1.75) — reading comfort
- **Small text (12–13px):** moderate (1.4–1.5)
- **Rule:** as font size decreases, line height ratio increases

### Tracking rules

- **Headings:** negative (-0.01 to -0.03em) — improves density at large sizes
- **Body:** zero — default kerning is optimal
- **Overlines/caps:** positive (+0.06 to +0.10em) — spreads uppercase for legibility
- **Never** track body text negatively

### Fluid type

Use `clamp()` for headings: `font-size: clamp(min, preferred, max)`. Body stays fixed at 16px. Only headings need fluid scaling.

### Font pairing

Max 2 families. Sans + mono is safest for apps. Mono only for: code, technical values, badges, terminal output.

## Color

### OKLCH color space

Use OKLCH for new projects — perceptually uniform, P3 gamut, Tailwind v4 native. `oklch(L C H)`: Lightness (0–1), Chroma (0–0.4), Hue (0–360°). To darken: reduce L. To desaturate: reduce C. Each axis independent.

### Warm vs cool neutrals

Warm (chroma 0.005–0.015, hue 50–80°): inviting, premium. Cool (chroma ~0, hue 220–240°): technical, corporate. COMMIT to one — never mix warm bg with cool borders.

### Semantic color rules

| Role | Hue range | Soft variant |
|------|-----------|-------------|
| Success | Green (140–160°) | Light tinted bg + solid text |
| Warning | Amber (70–90°) | Light tinted bg + dark text |
| Destructive | Red (15–30°) | Light tinted bg + solid text |
| Info | Blue (240–260°) | Light tinted bg + solid text |

Solid variants must pass 4.5:1 contrast with white text. Fix by reducing OKLCH Lightness (L 0.63 → 0.55).

### WCAG contrast minimums

| Context | Ratio | Level |
|---------|-------|-------|
| Body text (< 18px) | 4.5:1 | AA |
| Large text (≥ 18px bold / ≥ 24px) | 3:1 | AA |
| UI components | 3:1 | AA |
| Enhanced body | 7:1 | AAA |

### Dark mode principles

1. Don't invert — redesign. Use warm charcoal (#1C1917), not black.
2. Off-white text (#F3F0EB), not pure white. Reduces eye strain.
3. Higher elevation = lighter bg (shadows invisible on dark).
4. Reduce saturation slightly. Vivid on dark = neon.
5. Primary accents brighten for contrast (brand-600 → brand-400).

## Spacing

### 4px grid

All spacing = multiples of 4: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96px. Provides enough granularity without pixel-pushing.

### Spacing = hierarchy

- **Tight** (4–8px): related elements (icon + label)
- **Medium** (12–24px): grouped elements (card padding)
- **Loose** (32–64px): separated elements (grid gaps)
- **Section** (64–96px): major divisions

**Law:** space within groups < space between groups. This is the single most important spatial rule.

### Responsive spacing

Spacing reduces on mobile, but not proportionally:
- Section: 96px → 64px → 48px
- Card padding: 28–40px → 20–28px → 16–20px
- Grid gap: 32–48px → 24–32px → 16–24px

## Visual Hierarchy

### 5 elevation levels

| Level | Use | Dark mode |
|-------|-----|-----------|
| 0 (flat) | Page background | Darkest bg |
| 1 (subtle) | Inline cards | Slightly lighter |
| 2 (raised) | Standard cards | Lighter still |
| 3 (elevated) | Dropdowns, popovers | More lighter |
| 4 (floating) | Modals, dialogs | Lightest card bg |

### Depth layering

Surfaces nest: page → card → inset panel → floating popover. Each layer MUST be visually distinguishable via bg color difference, not just borders.

### Density modes

| Mode | Scale | Use |
|------|-------|-----|
| Compact | 0.75× | Data tables, viz, admin |
| Default | 1× | Standard UI |
| Comfortable | 1.125× | Reading, marketing |

## Motion

### Duration rules

| Duration | Use |
|----------|-----|
| 0ms | Instant state changes |
| 100–150ms | Hover, focus, toggles |
| 200ms | Default transitions |
| 300ms | Panel open/close |
| 400–500ms | Complex animations |

**Exits faster than entrances.** Users initiated the exit — they expect immediacy.

### Easing rules

| Easing | Use |
|--------|-----|
| ease-out | Entering (appearing) |
| ease-in | Exiting (closing) |
| ease-in-out | Repositioning (staying visible) |
| spring/bounce | Celebration, playful feedback |

**Never** use linear easing for UI motion.

### Reduced motion

ALWAYS include `prefers-reduced-motion: reduce` that disables ALL transitions/animations. Not optional.

## Accessibility

### Touch targets
- Minimum: 44×44px (WCAG), recommended: 48×48px (Material)
- Gap between targets: ≥ 8px
- Small icons can have larger hit area via padding/pseudo-elements

### Focus
- Every interactive element MUST have visible focus indicator
- 2px ring, 2px offset, primary color
- Trap focus in modals, return focus on close

### Color
- Never use color as ONLY state indicator — add icons/text/patterns
- Test with simulated color blindness

## Component Patterns

Read `references/COMPONENT-PATTERNS.md` for detailed button variants, card patterns, badge types, form patterns, and interactive state specifications.

## Gotchas

- **No pure black (#000)** for text → use very dark neutral (e.g., #1C1917). Pure black = excessive contrast.
- **No pure white (#FFF)** for backgrounds → use tinted white (e.g., #FAF8F5). Pure white is harsh.
- **Heading line heights must be tight** (1.1), not body line height (1.75).
- **Negative tracking on body text** kills readability.
- **Shadows should be warm-tinted** for warm UIs, not `rgba(0,0,0,...)`.
- **Borders need ≥ 1.1:1 contrast** with their background to be visible.
- **Prose max-width: 65ch** (~600px). Beyond this, eye tracking degrades.
- **Z-index without a scale** causes wars (999, 9999...). Define: dropdown=1000, modal=1050, tooltip=1070.
- **Disabled opacity: 0.5.** Less = unreadable. More = doesn't look disabled.
- **Font fallbacks**: always include `ui-sans-serif, system-ui, sans-serif`.
