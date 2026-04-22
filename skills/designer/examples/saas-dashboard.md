# DESIGN.md — Acme Analytics Dashboard

## 1. Visual Theme & Atmosphere

**Emotional Target:** Technical precision with warmth
**Personality Cluster:** premium-precision
**Design System Inspiration:** Linear (opacity hierarchy, 8px grid) + Vercel (aggressive whitespace)
**One-Sentence Identity:** A data tool that feels considered, not cold — precision without sterility.

> Clean, structured, data-forward. Every pixel serves information density without sacrificing readability. Warm neutrals prevent the "cold spreadsheet" feel. The design says "engineered by someone who uses this daily." A playful illustration or decorative gradient would NOT fit here.

## 2. Color Palette

### Brand Ramp (OKLCH, H=220 - trust blue)
| Stop | OKLCH | Hex Approx | Role |
|---|---|---|---|
| 50 | oklch(0.97 0.015 220) | #F0F4FA | Background tints |
| 100 | oklch(0.94 0.03 220) | #DEE8F5 | Hover backgrounds |
| 200 | oklch(0.88 0.05 220) | #BDCFEB | Focus ring light |
| 300 | oklch(0.78 0.08 220) | #8CADD4 | Icon fill |
| 400 | oklch(0.68 0.12 220) | #5B8BC0 | Dark mode primary |
| 500 | oklch(0.55 0.14 220) | #3B6EA8 | Primary (light) |
| 600 | oklch(0.47 0.13 220) | #2D5A8E | Hover state |
| 700 | oklch(0.38 0.11 220) | #234A74 | Dark text |
| 800 | oklch(0.28 0.08 220) | #1A3756 | Strong borders |
| 900 | oklch(0.20 0.06 220) | #122840 | Headings |
| 950 | oklch(0.14 0.04 220) | #0D1C2E | Near-black brand |

### Semantic Tokens
| Token | Light | Dark | Role |
|---|---|---|---|
| --background | oklch(0.985 0.005 60) | oklch(0.14 0.008 260) | Page bg |
| --foreground | oklch(0.15 0.008 60) | oklch(0.93 0.008 260) | Body text |
| --primary | brand-500 | brand-400 | CTAs, active |
| --destructive | oklch(0.55 0.20 25) | oklch(0.65 0.20 25) | Errors |
| --success | oklch(0.55 0.15 155) | oklch(0.65 0.15 155) | Positive |
| --border | oklch(0.90 0.008 60) | oklch(1 0 0 / 0.08) | Dividers |
| --ring | brand-500 | brand-400 | Focus ring |

### Dark Mode Strategy
Warm charcoal base (oklch 0.14, not pure black). Surface elevation via progressively lighter backgrounds (not shadows). Borders as 8% white overlay. Brand shifts from 500 to 400 for perceptual parity.

## 3. Typography

| Level | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|
| Display | clamp(2.5rem, 1.5rem + 2.5vw, 3.5rem) | 700 | -0.03em | 1.1 |
| H1 | clamp(2rem, 1.25rem + 1.875vw, 2.75rem) | 600 | -0.02em | 1.15 |
| H2 | clamp(1.5rem, 1.125rem + 0.9375vw, 1.875rem) | 600 | -0.01em | 1.25 |
| H3 | 1.25rem (20px) | 600 | -0.01em | 1.3 |
| Body | 1rem (16px) fixed | 400 | 0 | 1.5 |
| Body SM | 0.875rem (14px) | 400 | 0 | 1.4 |
| Caption | 0.75rem (12px) | 500 | 0 | 1.5 |
| Mono | 0.8125rem (13px) | 400 | 0 | 1.5 |

**Font Pairing:** Inter + JetBrains Mono
**Rationale:** Inter at negative tracking achieves Linear's "set" feel. JetBrains Mono for data values, metrics, code.

## 4. Spacing

| Token | Value | Use |
|---|---|---|
| --spacing-section-y | 64px (4rem) | Vertical section padding |
| --spacing-card | 24px (1.5rem) | Card padding |
| --spacing-stack | 16px (1rem) | Vertical stack gap |
| --spacing-inline | 8px (0.5rem) | Inline element gap |
| --spacing-grid-cards | 24px (1.5rem) | Card grid gap |

**Density Mode:** Normal (dashboard, not marketing)
**Grid:** 12 columns, 24px gutters, 48px margins (desktop), 20px (mobile)
**Content Max Width:** 1280px

## 5. Component Specifications

### Button
| Variant | Background | Text | Hover |
|---|---|---|---|
| Primary | brand-500 | white | brand-600 |
| Secondary | transparent | foreground | accent bg |
| Ghost | transparent | foreground | surface-1 bg |
| Destructive | destructive | white | destructive/90% |

Sizes: sm (34px), md (42px), lg (50px). Focus: 2px ring, 2px offset. Disabled: 0.5 opacity. Loading: spinner, same width.

## 6. Motion

| Token | Duration | Easing | Use |
|---|---|---|---|
| --duration-fast | 150ms | ease-out | Hover, focus |
| --duration-normal | 200ms | ease-out | Transitions |
| --duration-slow | 300ms | ease-out | Panel open |

Exits: subtract 50ms from enter. prefers-reduced-motion: 0.01ms !important.

## 7. Elevation

5-level warm shadows (light). Bg-color elevation (dark).
Z-index: dropdown(1000), sticky(1020), modal(1050), tooltip(1070), toast(1080).

## 8. Do's and Don'ts

| # | Do | Don't | Evidence |
|---|---|---|---|
| 1 | Right-align quantitative data | Left-align numbers | Pencil & Paper enterprise tables |
| 2 | Monospace font for metrics | Sans for numbers | Decimal alignment |
| 3 | Chunk dashboard into 4-5 groups | 20+ ungrouped widgets | Miller's Law |
| 4 | Single primary CTA per view | Multiple highlighted actions | Von Restorff |
| 5 | Keyboard shortcuts for power users | Mouse-only navigation | Developer convention |
| 6 | Skeleton loaders for data | Spinners for charts | Doherty Threshold |
| 7 | Warm near-black text | Pure #000 | Irradiation effect |
| 8 | Row hover on tables | No hover state | Readability |
| 9 | Toast for saves, inline for errors | Modal for confirmable saves | Feedback patterns |
| 10 | Fixed left column in wide tables | Scrolling identifier column | NNG 4 table tasks |

## 9. Responsive Breakpoints

| Breakpoint | Change |
|---|---|
| 375px | Single column, bottom tab nav, cards stack |
| 768px | 2-column grid, sidebar collapses to hamburger |
| 1024px | Sidebar visible, 3-column content |
| 1280px | Full layout, comfortable spacing |
| 1440px | Max-width constraint, increasing margins |

## 10. Anti-Patterns

- No AI purple gradient (industry: analytics)
- No card soup (each card must have distinct data type)
- No animate-bounce on any element
- Monospace for ALL numerical values (not sans)
- Every data panel has loading skeleton AND empty state
