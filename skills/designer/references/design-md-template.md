# DESIGN.md Template

Use this format for Phase 4 output. Every section is required.

---

```markdown
# DESIGN.md — [Product Name]

## 1. Visual Theme & Atmosphere

**Emotional Target:** [one sentence]
**Personality Cluster:** [cluster name]
**Design System Inspiration:** [1-2 premium systems and why]
**One-Sentence Identity:** [what makes this design non-generic]

> [2-3 sentence description of the overall feel, what this design communicates,
> and what would NOT fit in this design]

## 2. Color Palette

### Brand Ramp (OKLCH)
| Stop | OKLCH | Hex Approx | Role |
|---|---|---|---|
| 50 | oklch(0.97 0.02 H) | #... | Background tints |
| 100 | oklch(0.94 0.04 H) | #... | Hover backgrounds |
| ... | ... | ... | ... |
| 500 | oklch(0.62 0.14 H) | #... | Primary (light mode) |
| 600 | oklch(0.54 0.14 H) | #... | Hover state |
| 950 | oklch(0.18 0.05 H) | #... | Near-black brand |

### Semantic Tokens
| Token | Light Mode | Dark Mode | Role |
|---|---|---|---|
| --background | ... | ... | Page background |
| --foreground | ... | ... | Body text |
| --primary | brand-500 | brand-400 | CTAs, active states |
| --destructive | ... | ... | Errors, danger |
| --border | ... | ... | Dividers, outlines |
| --ring | ... | ... | Focus indicators |

### Dark Mode Strategy
[Warm charcoal / tonal elevation / opacity-based borders]

## 3. Typography

| Level | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|
| Display | clamp(3rem, ..., 4.5rem) | 800 | -0.03em | 1.05 |
| H1 | clamp(2.5rem, ..., 3.5rem) | 700 | -0.02em | 1.1 |
| H2 | clamp(2rem, ..., 2.75rem) | 700 | -0.02em | 1.2 |
| H3 | clamp(1.5rem, ..., 1.875rem) | 600 | -0.01em | 1.3 |
| Body | 1rem (16px) fixed | 400 | 0 | 1.5 |
| Body SM | 0.875rem (14px) | 400 | 0 | 1.4 |
| Caption | 0.75rem (12px) | 400 | 0 | 1.5 |

**Font Pairing:** [primary] + [secondary/mono]
**Rationale:** [why these fonts for this personality]

## 4. Spacing

| Token | Value | Use |
|---|---|---|
| --spacing-section-y | [value] | Vertical section padding |
| --spacing-card | [value] | Card internal padding |
| --spacing-stack | [value] | Vertical stack gap |
| --spacing-inline | [value] | Inline element gap |
| --spacing-grid-cards | [value] | Card grid gap |

**Density Mode:** [compact/normal/comfortable]
**Grid:** 12 columns, [gutter]px gutters, [margin]px margins
**Content Max Width:** [value]

## 5. Component Specifications

### Button
| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | --primary | --primary-fg | none | --primary/90% |
| Secondary | transparent | --fg | 1px --border | --accent bg |
| Ghost | transparent | --fg | none | --accent bg |
| Destructive | --destructive | white | none | --destructive/90% |

**States:** default, hover, active, focus (2px ring), disabled (0.5 opacity), loading (spinner, same width)
**Sizes:** sm (34px), md (42px), lg (50px)

### Input
[Similar table for all states]

### Card
[Anatomy, padding, elevation, interactive states]

## 6. Motion

| Token | Duration | Use |
|---|---|---|
| --duration-fast | 150ms | Hover, focus, toggles |
| --duration-normal | 200ms | Default transitions |
| --duration-slow | 300ms | Modal, panel open |
| --duration-slower | 500ms | Page transitions |

**Easing:** ease-out (enter), ease-in (exit), ease-in-out (reposition)
**Exits faster than entrances.**
**prefers-reduced-motion:** All animations to 0.01ms !important

## 7. Elevation

| Level | Shadow (Light) | Background (Dark) |
|---|---|---|
| 0 | none | --surface-0 |
| 1 | 0 1px 3px oklch(...) | --surface-1 |
| 2 | 0 4px 6px oklch(...) | --surface-2 |
| 3 | 0 10px 15px oklch(...) | --surface-3 |
| 4 | 0 20px 25px oklch(...) | --surface-4 |

**Z-Index:** base(0), dropdown(1000), sticky(1020), fixed(1030), modal-backdrop(1040), modal(1050), popover(1060), tooltip(1070), toast(1080)

## 8. Do's and Don'ts

| # | Do | Don't | Evidence |
|---|---|---|---|
| 1 | [specific to this product] | [specific] | [law/rule/source] |
| ... | ... | ... | ... |
| 10 | ... | ... | ... |

## 9. Responsive Breakpoints

| Breakpoint | Layout Change |
|---|---|
| 375px (base) | [mobile-first defaults] |
| 768px | [what changes: columns, nav, spacing] |
| 1024px | [what changes] |
| 1280px | [what changes] |
| 1440px | [max-width constraint activates] |

## 10. Anti-Patterns

**Industry-specific violations to avoid:**
- [specific to resolved industry]

**AI slop checks this design passes:**
- [ ] Unique brand color (not #6366F1)
- [ ] Weight contrast in typography
- [ ] All component states designed
- [ ] Warm neutrals (not cold grey)
- [ ] prefers-reduced-motion implemented
```
