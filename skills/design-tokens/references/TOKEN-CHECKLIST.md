# Complete Token Categories — Reference Values

Every production design system needs all 10 categories below. Missing any creates inconsistency.

## 1. Colors

### Ramps (in @theme)
3 ramps × 11 stops = 33 primitive tokens
- Brand (identity): 50–950
- Pop/Accent (energy): 50–950
- Neutral (surfaces/text): 50–950

### Semantic (:root / .dark)
19 shadcn/ui roles: background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, input, ring

Extended: success (+foreground), warning (+foreground), info (+foreground), brand, energy

8 chart colors: chart-1 through chart-8
8 sidebar tokens: sidebar, sidebar-foreground, sidebar-primary, etc.
10 ReactFlow tokens: flow-background, flow-node, flow-node-border, etc.

## 2. Spacing

Base: `--spacing: 0.25rem` (4px unit, Tailwind v4 computes all numeric utilities)

Named semantic (generates utilities):
| Token | Value | Utility |
|-------|-------|---------|
| --spacing-section-y | 6rem (96px) | py-section-y |
| --spacing-section-y-tablet | 4rem (64px) | py-section-y-tablet |
| --spacing-section-y-mobile | 3rem (48px) | py-section-y-mobile |
| --spacing-section-x | 4rem (64px) | px-section-x |
| --spacing-section-x-tablet | 2rem (32px) | px-section-x-tablet |
| --spacing-section-x-mobile | 1.25rem (20px) | px-section-x-mobile |
| --spacing-card-lg | 2.5rem (40px) | p-card-lg |
| --spacing-card | 1.75rem (28px) | p-card |
| --spacing-card-sm | 1.25rem (20px) | p-card-sm |
| --spacing-grid-2col | 3rem (48px) | gap-grid-2col |
| --spacing-grid-cards | 2rem (32px) | gap-grid-cards |
| --spacing-stack | 1rem (16px) | gap-stack |
| --spacing-inline | 0.5rem (8px) | gap-inline |

## 3. Typography

### Font families
| Token | Value |
|-------|-------|
| --font-sans | Primary UI font + fallbacks |
| --font-mono | Code font + fallbacks |

### Type scale (with clamp for fluid headings)
| Token | Value |
|-------|-------|
| --text-display | clamp(3rem, 6vw, 4.5rem) |
| --text-heading-1 | clamp(2.5rem, 5vw, 3.5rem) |
| --text-heading-2 | clamp(1.75rem, 3.5vw, 2.5rem) |
| --text-heading-3 | clamp(1.25rem, 2.5vw, 1.5rem) |
| --text-subtitle | clamp(1rem, 1.5vw, 1.25rem) |
| --text-body-lg | clamp(1rem, 1.25vw, 1.125rem) |
| --text-body | 1rem |
| --text-body-sm | 0.875rem |
| --text-caption | 0.8125rem |
| --text-overline | 0.75rem |
| --text-code | 0.8125rem |

### Line heights
| Token | Value | Use |
|-------|-------|-----|
| --leading-display | 1.08 | Tight for large text |
| --leading-heading-1 | 1.1 | |
| --leading-heading-2 | 1.15 | |
| --leading-heading-3 | 1.3 | |
| --leading-subtitle | 1.5 | |
| --leading-body | 1.75 | Comfortable reading |
| --leading-body-sm | 1.6 | |
| --leading-caption | 1.5 | |
| --leading-overline | 1.4 | |

### Weights
400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Tracking (letter-spacing)
| Token | Value |
|-------|-------|
| --tracking-tighter | -0.03em |
| --tracking-tight | -0.02em |
| --tracking-snug | -0.01em |
| --tracking-normal | 0em |
| --tracking-wide | 0.02em |
| --tracking-wider | 0.06em |
| --tracking-widest | 0.10em |

## 4. Component Sizing

| Token | Value | px |
|-------|-------|----|
| --size-button-sm | 2.125rem | 34 |
| --size-button-md | 2.625rem | 42 |
| --size-button-lg | 3.125rem | 50 |
| --size-button-xl | 3.625rem | 58 |
| --size-input-sm | 2rem | 32 |
| --size-input-md | 2.5rem | 40 |
| --size-input-lg | 3rem | 48 |
| --size-icon-xs | 0.75rem | 12 |
| --size-icon-sm | 1rem | 16 |
| --size-icon-md | 1.25rem | 20 |
| --size-icon-lg | 1.5rem | 24 |
| --size-icon-xl | 2rem | 32 |
| --size-avatar-xs | 1.5rem | 24 |
| --size-avatar-sm | 2rem | 32 |
| --size-avatar-md | 2.5rem | 40 |
| --size-avatar-lg | 3rem | 48 |
| --size-avatar-xl | 4rem | 64 |
| --size-nav-height | 4.125rem | 66 |
| --size-page-max | 80rem | 1280 |
| --size-content-max | 67.5rem | 1080 |
| --size-prose-max | 65ch | ~600 |
| --size-touch-min | 2.75rem | 44 |
| --size-touch-comfortable | 3rem | 48 |

## 5. Border Radius

none (0), sm (6px), md (8px), DEFAULT (10px), lg (12px), xl (16px), 2xl (20px), 3xl (24px), pill (9999px)

Rule: All buttons use pill. Cards use lg. Inputs use DEFAULT.

## 6. Shadows / Elevation

### Scale (warm-tinted oklch, never pure black)
xs → sm → md → lg → xl → 2xl → inner → none

### Component shadows
card, card-hover (brand glow), button (brand glow), button-hover, nav, feature, input-focus

### Surface elevation levels (bg + shadow combined)
| Level | Shadow | Use |
|-------|--------|-----|
| 0 | none | Page background |
| 1 | surface-1 | Subtle card |
| 2 | surface-2 | Standard card |
| 3 | surface-3 | Popover, dropdown |
| 4 | surface-4 | Modal, overlay |

Dark mode: levels use progressively lighter bg instead of heavier shadow.

## 7. Motion

### Duration
instant (0ms), fast (150ms), normal (200ms), slow (300ms), slower (500ms), slowest (700ms)

### Easing
| Curve | Use |
|-------|-----|
| default (0.4, 0, 0.2, 1) | General transitions |
| in (0.4, 0, 1, 1) | Exit animations |
| out (0, 0, 0.2, 1) | Enter animations |
| bounce (0.68, -0.55, 0.265, 1.55) | Playful (success) |
| spring (0.175, 0.885, 0.32, 1.275) | Overshoot (dropdown) |
| snappy (0.16, 1, 0.3, 1) | Button/interactive states |

### Motion patterns
- **Enter → Persist → Exit**: ease-out + normal → user interacts → ease-in + fast
- **Reduced motion**: disable all via `@media (prefers-reduced-motion: reduce)`

## 8. Z-Index

base (0), dropdown (1000), sticky (1020), fixed (1030), modal-backdrop (1040), modal (1050), popover (1060), tooltip (1070), toast (1080), max (9999)

## 9. Opacity

disabled (0.5), muted (0.6), overlay (0.45), glass (0.80), ghost (0.06)

## 10. Grid / Layout

| Token | Value |
|-------|-------|
| --grid-columns | 12 |
| --grid-gutter | 1.5rem (24px) |
| --grid-gutter-sm | 1rem (16px, mobile) |
| --grid-margin | 4rem (64px) |
| --grid-margin-md | 2rem (32px, tablet) |
| --grid-margin-sm | 1.25rem (20px, mobile) |

Column span helpers: full (12), half (6), third (4), quarter (3), two-thirds (8). All collapse to full width below 768px.

## Density Modes

| Mode | Factor | Scales |
|------|--------|--------|
| default | 1× | — |
| compact | 0.75× | spacing, sizing, body text, line heights |
| comfortable | 1.125× | spacing, sizing |

Implement as CSS class (`.density-compact`) that overrides tokens via `calc(base * factor)`.
