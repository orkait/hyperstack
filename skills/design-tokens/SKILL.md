---
name: design-tokens
description: Build complete, production-grade design token systems for web apps. Covers color ramps (OKLCH), spacing (4px grid), typography scales, component sizing, surface elevation, motion, density modes, grid systems, accessibility auditing, and cross-file consistency. Use when creating a design system from scratch, auditing an existing one, migrating to Tailwind v4 + shadcn/ui tokens, or when the user mentions design tokens, theming, or a complete visual foundation. Outputs CSS custom properties, TypeScript pattern libraries, documentation, and HTML showcases.
license: MIT
metadata:
  author: booleanstack
  version: "1.0"
---

# Design Token System — Build Procedure

Build a complete token system, not just a color palette. A production system covers **10 categories**: colors, spacing, typography, component sizing, border radius, shadows/elevation, motion, z-index, opacity, and grid/layout. Missing any of these is an incomplete system.

## Architecture: Three-layer tokens

Always use three layers. This is non-negotiable for maintainability.

```
Layer 1: Primitives    (@theme)       → raw values, ramp stops
Layer 2: Semantics     (:root/.dark)  → role-based mappings
Layer 3: Domain        (separate CSS) → app-specific (viz, editor, etc.)
```

**Tailwind v4 + shadcn/ui bridge pattern:**
- `:root` / `.dark` → semantic tokens in oklch (theme-swapped)
- `@theme inline` → bridges semantics to Tailwind utilities (`bg-primary`, `text-foreground`)
- `@theme` → primitives that generate utilities directly (`bg-brand-500`, `p-4`, `p-card`)
- `@custom-variant dark (&:is(.dark *));` → replaces old `darkMode: 'class'`

## Procedure

### Step 1: Color ramps — hue-agnostic naming

Build 3 ramps (11 stops each): **brand**, **pop**, **neutral**. Name by ROLE not hue.

```css
/* ✅ Change values to swap palette — zero class renames */
--color-brand-500: oklch(0.62 0.14 291);  /* currently: dusty lavender */
--color-pop-500: oklch(0.71 0.14 58);     /* currently: soft apricot */

/* ❌ Renaming these requires codebase-wide search-replace */
--color-violet-500: oklch(0.62 0.14 291);
```

Use **OKLCH** color space — perceptually uniform, P3 gamut, Tailwind v4 native. Each ramp stop has a role — read `references/COLOR-ROLES.md` for the full per-stop role map.

### Step 2: Semantic tokens (:root / .dark)

Map ramp stops to intent-based names. Every `:root` token MUST have a `.dark` override.

**Dark mode rules:**
- Backgrounds → warm charcoal (not cold navy). Surface elevation uses progressively lighter bg, not just more shadow.
- Primary → brighten (brand-600 → brand-400) for contrast on dark surfaces
- Borders → lighten (warm-200 → warm-700)

**Status colors (success, error, warning, info):** Always provide solid + soft variants. After generating, darken the solid variants until they pass AA contrast (4.5:1) with white text — typical fix: reduce OKLCH Lightness from ~0.63 to ~0.55.

### Step 3: Spacing — 4px base + named semantics

```css
@theme {
  --spacing: 0.25rem;                /* p-1=4px, p-4=16px — Tailwind computes all */
  --spacing-section-y: 6rem;         /* → py-section-y (96px) */
  --spacing-card: 1.75rem;           /* → p-card (28px) */
  --spacing-grid-cards: 2rem;        /* → gap-grid-cards (32px) */
  --spacing-stack: 1rem;             /* → gap-stack (16px) */
}
```

Named tokens generate real Tailwind utilities. Always add responsive variants (`-tablet`, `-mobile`).

### Step 4: Typography — tokens, not magic numbers

Define EVERYTHING as `@theme` tokens: sizes (`--text-*`), line heights (`--leading-*`), weights (`--font-weight-*`), tracking (`--tracking-*`). Then compose into utility classes that ONLY use `var()`:

```css
.text-heading-2 {
  font-size: var(--text-heading-2);
  line-height: var(--leading-heading-2);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-tight);  /* NOT -0.02em */
}
```

Use `clamp()` for fluid headings. Build a complete tracking scale: tighter → tight → snug → normal → wide → wider → widest.

### Step 5: Complete the remaining categories

Most systems stop at colors + typography. Read `references/TOKEN-CHECKLIST.md` for every category with exact values. Quick checklist:

- [ ] Component sizing: buttons (sm/md/lg/xl), inputs (sm/md/lg), icons (xs–xl), avatars (xs–xl)
- [ ] Touch targets: `--size-touch-min: 44px` (WCAG), `--size-touch-comfortable: 48px` (Material)
- [ ] Grid: `--grid-columns: 12`, `--grid-gutter`, `--grid-margin` + responsive
- [ ] Surface elevation: 5 levels (flat → floating), combining bg color + shadow
- [ ] Duration: instant/fast/normal/slow/slower/slowest
- [ ] Easing: default/in/out/bounce/spring/snappy
- [ ] Z-index: base/dropdown/sticky/fixed/modal/popover/tooltip/toast/max
- [ ] Opacity: disabled/muted/overlay/glass/ghost
- [ ] Density: compact (0.75×) and comfortable (1.125×) modes via CSS class overrides

### Step 6: Accessibility audit

Run a contrast check on EVERY foreground + background combination. See `scripts/contrast-audit.py`.

| Pair | Minimum | Level |
|------|---------|-------|
| Body text on page bg | 4.5:1 | AA |
| Muted text on page bg | 4.5:1 | AA |
| Primary on card (links) | 4.5:1 | AA |
| White on primary (buttons) | 4.5:1 | AA |
| White on destructive/success/info | 4.5:1 | AA |
| Warning-fg on warning | 3:1 | AA-large |
| Border vs background | ≥1.1:1 | Visible |
| Focus ring vs surface | ≥3:1 | WCAG 2.4.7 |

**Also verify:** sRGB gamut (all OKLCH in-gamut), warm neutral chroma (C > 0.003), shadow warmth (oklch tint, never pure black).

**Fixing failures:** Reduce L in OKLCH while keeping C and H. This darkens the color without shifting its character.

### Step 7: Cross-file validation

After all files are built, verify:
1. Every `var()` reference resolves to a defined token
2. Every `:root` token has a `.dark` override
3. Token names match between CSS, TypeScript, and documentation
4. No hue-specific words in semantic names (grep for violet, peach, orange, etc.)
5. Typography utilities use `var()`, not hardcoded values
6. Button sizes in TS reference `--size-button-*` tokens

### Step 8: Deliverables

| File | Contents |
|------|----------|
| `globals.css` | All tokens + utility classes |
| `viz-tokens.css` | Domain-specific tokens (if needed) |
| `component-patterns.ts` | Typed variants, cn(), pattern objects |
| `DESIGN_TOKENS.md` | Human reference with tables + quality checklist |
| `COMPONENT_PROMPT.md` | LLM system prompt for component generation |
| `export-tokens.ts` | W3C DTCG format JSON export |
| `*-design-system.html` | Visual showcase (dark mode toggle, app mock, all categories) |

## Gotchas

- **`--spacing` in Tailwind v4** is a base multiplier, not a single token. `p-4` = `calc(0.25rem * 4)`. You don't define each stop.
- **Named spacing in `@theme`** generates utilities: `--spacing-card: 1.75rem` → `p-card`, `m-card`, `gap-card`.
- **`@theme inline` vs `@theme`**: `inline` bridges runtime CSS vars for theme-swapped values. Plain `@theme` defines static primitives.
- **Dark mode elevation**: Shadows are invisible on dark bg. MUST use progressively lighter background colors per level.
- **Density modes**: Implement as CSS classes (`.density-compact`) that override spacing + sizing tokens via `calc()`. Children inherit scaled values.
- **Touch target ≠ visual size**: A 34px button can have a 44px hit area via `.touch-target` pseudo-element.
- **OKLCH gamut**: High chroma + extreme lightness clips to sRGB. Always verify.
- **`prefers-reduced-motion`**: Must be in `@layer base` with `!important`. Applies to all elements + pseudos.
- **Contrast audit timing**: Run AFTER finalizing all colors. It's the last gate before lock.
- **Warm shadows**: Use oklch-tinted shadow colors (`oklch(0.22 0.006 56 / 0.08)`), never `rgba(0,0,0,...)`.
- **Stale comments**: After renaming ramps (violet→brand), grep ALL files for the old hue name. Comments leak.

## Benchmark checklist

Compare against Material 3, Carbon (IBM), Radix, shadcn/ui defaults. See `references/BENCHMARK.md` for the 42-category comparison matrix.
