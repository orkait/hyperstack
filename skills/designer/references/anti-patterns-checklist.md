# Anti-Pattern Checklist

Run against EVERY design before shipping. Zero tolerance for any match.

---

## The AI Slop Signature (Instant Recognition)

- [ ] No `#6366F1` or indigo gradient (AI purple)
- [ ] No grid of identical cards with identical padding (card soup)
- [ ] No `font-weight: 500` everywhere (flat hierarchy)
- [ ] No `#F9FAFB` background (cold Tailwind grey)
- [ ] No missing states (need hover, focus, loading, error, empty)
- [ ] No `animate-bounce` or `animate-pulse` on static elements
- [ ] No 3+ font families
- [ ] No line-height 1.75 on app UI (that's prose)
- [ ] No Absolute Relative Everywhere when using FIGMA MCP, solve via flex or grids while keeping identity of the page
---

## Color

- [ ] Not using hex/HSL for design system (use OKLCH)
- [ ] Not pure #000 text on pure #FFF (use near-black on tinted white)
- [ ] Not same primary for charts AND UI
- [ ] Dark mode is redesigned, not inverted
- [ ] Warm/cool neutrals committed (not mixed)

## Typography

- [ ] Type scale uses mathematical ratio (1.25/1.333/1.414)
- [ ] Weight contrast exists (heading != body weight)
- [ ] Headings have negative tracking (-0.01 to -0.03em)
- [ ] Body text at zero tracking
- [ ] Max 65ch prose width
- [ ] Max 2 font families

## Spacing

- [ ] All values are multiples of 4px
- [ ] Spacing varies by semantic context (section > card > inline)
- [ ] Content has max-width constraint

## Components

- [ ] All interactive elements have hover state
- [ ] Focus rings visible (2px, not outline: none)
- [ ] Loading state for every async operation
- [ ] Empty state for every data container
- [ ] Touch targets >= 44px on mobile
- [ ] No emojis as icons (use SVG)
- [ ] cursor: pointer on all clickable elements

## Motion

- [ ] prefers-reduced-motion implemented
- [ ] No linear easing
- [ ] No transitions > 500ms for UI
- [ ] Only transform + opacity animated (GPU-accelerated)
- [ ] Hover-only features have tap alternatives

## Layout

- [ ] Z-index uses named scale (not 9999)
- [ ] Images have aspect-ratio or width+height
- [ ] Sticky nav accounts for its own height
