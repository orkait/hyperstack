# Complete Token Categories — Production Checklist

Every production design system needs all 10 categories. Missing any = inconsistency.

## 1. Colors
- [ ] 3 ramps × 11 stops = 33 primitive tokens (@theme)
- [ ] 19+ semantic roles in :root/.dark (background, foreground, card, primary, muted, border, ring...)
- [ ] Status: success, warning, error, info (+ foreground for each)
- [ ] Chart: chart-1 through chart-8
- [ ] Sidebar tokens: sidebar, sidebar-foreground, sidebar-primary...
- [ ] All :root tokens have .dark overrides

## 2. Spacing
- [ ] --spacing: 0.25rem (base multiplier)
- [ ] Named semantic tokens: section-y, section-x, card, grid-cards, stack, inline
- [ ] Responsive variants: -tablet, -mobile

## 3. Typography
- [ ] Font families: --font-sans, --font-mono
- [ ] Type scale: display through overline (10 stops)
- [ ] Line heights: per role
- [ ] Font weights: 400/500/600/700/800
- [ ] Tracking scale: tighter through widest (7 stops)

## 4. Component Sizing
- [ ] Buttons: sm/md/lg/xl
- [ ] Inputs: sm/md/lg
- [ ] Icons: xs/sm/md/lg/xl
- [ ] Avatars: xs/sm/md/lg/xl
- [ ] Touch targets: --size-touch-min (44px), --size-touch-comfortable (48px)
- [ ] Nav height, page-max, content-max, prose-max

## 5. Border Radius
- [ ] Scale: none/sm/md/DEFAULT/lg/xl/2xl/3xl/pill
- [ ] Rule: buttons=pill, cards=lg, inputs=DEFAULT

## 6. Shadows/Elevation
- [ ] Scale: xs/sm/md/lg/xl/2xl/inner/none
- [ ] Component shadows: card, card-hover, button, nav
- [ ] Surface levels: 0-4 (bg+shadow combined)
- [ ] Dark mode: bg-color elevation (not shadow)

## 7. Motion
- [ ] Duration: instant/fast/normal/slow/slower/slowest
- [ ] Easing: default/in/out/bounce/spring/snappy
- [ ] prefers-reduced-motion in @layer base with !important

## 8. Z-Index
- [ ] Scale: base/dropdown(1000)/sticky(1020)/fixed(1030)/modal-backdrop(1040)/modal(1050)/popover(1060)/tooltip(1070)/toast(1080)/max(9999)

## 9. Opacity
- [ ] disabled(0.5)/muted(0.6)/overlay(0.45)/glass(0.80)/ghost(0.06)

## 10. Grid/Layout
- [ ] --grid-columns: 12
- [ ] --grid-gutter, --grid-gutter-sm
- [ ] --grid-margin, --grid-margin-md, --grid-margin-sm
- [ ] Density modes: compact(0.75×), comfortable(1.125×)
