# DESIGN.md — Maison Noir (Luxury E-commerce)

## 1. Visual Theme & Atmosphere

**Emotional Target:** Premium exclusivity
**Personality Cluster:** premium-precision (with cinematic-dark influences)
**Design System Inspiration:** Stripe (weight-300 elegance, CIELAB color) + Apple (whitespace, Clarity/Deference/Depth)
**One-Sentence Identity:** A digital boutique that feels like entering a physical luxury store - every element breathes confidence and restraint.

> Dark-accented minimalism. Black + gold palette with surgical whitespace. Photography does the selling - the UI is invisible chrome around product imagery. Typography is light (weight 300-400), tracking is tight, line-heights are precise. A bright gradient, a rounded-xl card, or a playful illustration would destroy the atmosphere. This design whispers; it never shouts.

## 2. Color Palette

### Brand Ramp (OKLCH, H=85 - warm gold)
| Stop | OKLCH | Hex Approx | Role |
|---|---|---|---|
| 50 | oklch(0.97 0.015 85) | #FAF8F0 | Cream tints |
| 100 | oklch(0.94 0.03 85) | #F0EBD8 | Hover backgrounds |
| 300 | oklch(0.78 0.08 85) | #C4A96C | Icon fill |
| 400 | oklch(0.72 0.10 85) | #B8983A | Dark mode gold |
| 500 | oklch(0.65 0.12 85) | #A68520 | Primary gold (light) |
| 600 | oklch(0.55 0.10 85) | #8A6E1A | Hover |
| 900 | oklch(0.20 0.04 85) | #2A2110 | Near-black gold |

### Semantic Tokens
| Token | Light | Dark | Role |
|---|---|---|---|
| --background | oklch(0.995 0.003 85) | oklch(0.08 0.005 85) | Page bg (warm near-white / near-black) |
| --foreground | oklch(0.12 0.005 85) | oklch(0.94 0.005 85) | Body text |
| --primary | brand-500 (gold) | brand-400 | CTAs, highlights |
| --accent | oklch(0.12 0.005 85) | oklch(0.94 0.005 85) | Black accent (inverts with mode) |
| --destructive | oklch(0.55 0.18 25) | oklch(0.65 0.18 25) | Errors |
| --success | oklch(0.55 0.12 155) | oklch(0.65 0.12 155) | Order confirmed |
| --border | oklch(0.90 0.008 85) | oklch(1 0 0 / 0.06) | Subtle dividers |

### Dark Mode Strategy
Near-black with warm gold tint (oklch 0.08 0.005 85). Surface elevation via lighter warm steps. Gold accent brightens to 400 for contrast. Borders as 6% white overlay. Product images pop against dark background (intentional contrast).

## 3. Typography

| Level | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|
| Display | clamp(3rem, 2rem + 2.5vw, 4rem) | 300 | -0.03em | 1.05 |
| H1 | clamp(2rem, 1.5rem + 1.5vw, 2.75rem) | 300 | -0.02em | 1.1 |
| H2 | 1.5rem (24px) | 400 | -0.02em | 1.2 |
| H3 | 1.125rem (18px) | 500 | -0.01em | 1.3 |
| Body | 1rem (16px) | 300 | 0 | 1.6 |
| Body SM | 0.875rem (14px) | 400 | 0 | 1.5 |
| Overline | 0.6875rem (11px) | 500 | 0.10em | 1.4 |
| Price | 1.25rem (20px) | 400 | -0.01em | 1.2 |

**Font Pairing:** Cormorant Garamond (display/headings) + Montserrat (body/UI)
**Rationale:** Cormorant at weight 300 with tight tracking = editorial luxury. Montserrat at weight 300-400 for clean, readable UI. Overlines in uppercase Montserrat with wide tracking for category labels.

## 4. Spacing

| Token | Value | Use |
|---|---|---|
| --spacing-section-y | 96px (6rem) | Vertical breathing room |
| --spacing-card | 40px (2.5rem) | Product card padding |
| --spacing-stack | 24px (1.5rem) | Vertical content gap |
| --spacing-inline | 12px (0.75rem) | Inline element gap |
| --spacing-grid-products | 32px (2rem) | Product grid gap |

**Density Mode:** Comfortable (luxury = breathing room)
**Grid:** 12 columns, 32px gutters, 64px margins (desktop), 24px (mobile)
**Content Max Width:** 1280px
**Product Grid:** 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)

## 5. Component Specifications

### Product Card
- Full-bleed product image (aspect-ratio 3:4 portrait)
- Brand name (overline, uppercase, wide tracking)
- Product name (H3, weight 400)
- Price (prominent, right-aligned for comparison)
- Hover: subtle scale(1.02) on image, 300ms ease-out
- No add-to-cart on card (click through to detail page)

### Cart / Checkout
- Two-column: form (60%) + sticky order summary (40%)
- Single column on mobile with collapsible summary
- Max 7 form fields (Baymard optimal)
- Card number auto-chunked
- Trust badges: SSL + payment icons adjacent to submit
- Submit: "Place order - $X,XXX.XX" (specific amount)

### Button
| Variant | Style | Use |
|---|---|---|
| Primary | Gold bg (#A68520), white text | Add to bag, Place order |
| Secondary | Black bg, white text | Continue shopping |
| Ghost | Transparent, gold text, gold border | Secondary actions |
| Destructive | None - use text link for remove | Remove from cart |

Sizes: md (44px), lg (52px). No sm variant (luxury = generous sizing).

## 6. Motion

| Token | Duration | Use |
|---|---|---|
| --duration-fast | 200ms | Hover states |
| --duration-normal | 300ms | Transitions, cart updates |
| --duration-slow | 500ms | Page transitions, image reveals |

**Easing:** ease-out for all. No bounce, no spring (luxury = restraint).
**Product images:** Fade-in on scroll reveal, 500ms.
**Cart add:** Subtle animation to cart icon, not disruptive.
**prefers-reduced-motion:** All to 0.01ms.

## 7. Elevation

| Level | Light | Dark |
|---|---|---|
| 0 | none | --surface-0 |
| 1 | 0 1px 3px oklch(0.20 0.005 85 / 0.04) | --surface-1 |
| 2 | 0 4px 12px oklch(0.20 0.005 85 / 0.06) | --surface-2 |

Only 3 levels. Luxury = flat. Minimal shadow. Elevation from whitespace, not depth effects.

## 8. Do's and Don'ts

| # | Do | Don't | Evidence |
|---|---|---|---|
| 1 | Weight 300 for display, 400 for body | Weight 600+ for headings | Stripe weight vocabulary |
| 2 | Product photography as hero content | Illustrations or stock photos | Luxury e-commerce convention |
| 3 | Generous whitespace (96px sections) | Dense layouts | Macro whitespace = premium signal |
| 4 | Serif for display headings | Sans-serif for everything | Editorial luxury personality |
| 5 | Gold + black only (2 colors) | Multi-color palette | Restraint = exclusivity |
| 6 | Guest checkout always available | Forced account creation | Baymard: 26% abandon |
| 7 | Specific order total on submit button | Generic "Place order" | Conversion: specific > generic |
| 8 | Fade-in product images on scroll | Bounce/spring animations | Cinematic, not playful |
| 9 | Monospace for prices in comparisons | Sans for numbers in tables | Decimal alignment |
| 10 | Minimal nav: logo + search + cart | Full mega-menu on home | Let products speak |

## 9. Responsive Breakpoints

| Breakpoint | Change |
|---|---|
| 375px | Single column, bottom sticky cart bar, hamburger nav |
| 768px | 2-column product grid, sidebar cart drawer |
| 1024px | 3-column grid, full nav visible |
| 1280px | 4-column grid, full layout |
| 1440px | Max-width, increasing margins |

## 10. Anti-Patterns

**Industry violations (luxury e-commerce):**
- No block-based colorful sections
- No playful colors or rounded-xl cards
- No cheap-feeling discount badges (use understated "complimentary shipping")
- No AI purple gradient

**AI slop checks:**
- [x] Unique brand color (warm gold, not indigo)
- [x] Weight contrast (300 display vs 400 body - Stripe-inspired)
- [x] Serif + sans pairing (not Inter-only)
- [x] Warm near-white bg (not cold #F9FAFB)
- [x] All states: hover, focus, loading, error, empty, disabled
- [x] prefers-reduced-motion implemented
