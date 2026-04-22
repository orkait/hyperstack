# DESIGN.md — DevForge CLI Dashboard

## 1. Visual Theme & Atmosphere

**Emotional Target:** Technical mastery
**Personality Cluster:** technical-developer
**Design System Inspiration:** Linear (opacity hierarchy) + Vercel (Geist typography, aggressive whitespace)
**One-Sentence Identity:** A tool built by developers for developers — keyboard-first, information-dense, zero friction.

> Dark-first, terminal-native. Monospace for values, sans for UI. The interface disappears — users see their data, not chrome. A rounded-corner pastel card or playful illustration would be alien here. Every interaction is < 200ms.

## 2. Color Palette

### Brand Ramp (OKLCH, H=160 - emerald)
| Stop | OKLCH | Role |
|---|---|---|
| 50 | oklch(0.97 0.02 160) | Tint (light mode only) |
| 400 | oklch(0.68 0.16 160) | Dark mode primary |
| 500 | oklch(0.55 0.18 160) | Light mode primary |
| 600 | oklch(0.47 0.16 160) | Hover |
| 900 | oklch(0.20 0.08 160) | Dark text |

### Semantic Tokens
| Token | Dark (default) | Light |
|---|---|---|
| --background | oklch(0.08 0.005 260) | oklch(0.99 0.003 260) |
| --foreground | oklch(0.92 0.008 260) | oklch(0.15 0.008 260) |
| --primary | brand-400 | brand-500 |
| --surface-1 | oklch(0.12 0.005 260) | oklch(0.97 0.005 260) |
| --surface-2 | oklch(0.16 0.005 260) | oklch(0.95 0.005 260) |
| --border | oklch(1 0 0 / 0.06) | oklch(0 0 0 / 0.08) |

### Dark Mode Strategy
True dark default. Near-black base (oklch 0.08). Surface elevation via lighter bg steps. Emerald accent high enough L (0.68) for contrast. Borders as 6% white overlay.

## 3. Typography

| Level | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|
| H1 | 2rem (32px) | 600 | -0.02em | 1.15 |
| H2 | 1.5rem (24px) | 600 | -0.01em | 1.25 |
| H3 | 1.125rem (18px) | 500 | -0.01em | 1.3 |
| Body | 0.875rem (14px) fixed | 400 | 0 | 1.5 |
| Code | 0.8125rem (13px) | 400 | 0 | 1.6 |

**Font Pairing:** Geist + Geist Mono
**Rationale:** Angular terminals read "technical". Negative tracking (-0.02em default) makes text feel "set" not "typed". Mono for all data values, commands, paths.

## 4. Spacing

**Density Mode:** Compact
| Token | Value |
|---|---|
| --spacing-section-y | 48px |
| --spacing-card | 16px |
| --spacing-stack | 12px |
| --spacing-inline | 8px |

**Grid:** 12 columns, 16px gutters, sidebar 280px fixed.

## 5. Component Specifications

### Command Palette (Cmd+K)
- Opens in 100ms, closes in 80ms
- Full-width search, instant results
- Arrow keys navigate, Enter selects, Escape closes
- Recent commands, fuzzy matching

### Button
Sizes: sm (28px), md (34px), lg (42px). Compact — desktop-first.
Ghost variant default. Primary only for final actions.

## 6. Motion

| Token | Duration |
|---|---|
| --duration-fast | 100ms |
| --duration-normal | 150ms |
| --duration-slow | 200ms |

Everything under 200ms. No bounce, no spring, no decoration. Snappy.

## 7. Do's and Don'ts

| # | Do | Don't | Evidence |
|---|---|---|---|
| 1 | Command palette (Cmd+K) | Mouse-only navigation | Developer convention |
| 2 | Keyboard shortcuts for all actions | Hidden behind menus | Fitts' Law (infinite target) |
| 3 | Monospace for paths, commands, values | Sans for technical data | Readability |
| 4 | Compact density (14px body, tight spacing) | Comfortable density | Information density |
| 5 | Dark default | Light default | Developer convention |
| 6 | Glow on accent elements | Box shadows | Dark OLED style |
| 7 | Instant feedback (< 100ms) | Loading spinners for fast ops | Doherty Threshold |
| 8 | Code blocks with copy button | Uncopiable code | Developer UX |
