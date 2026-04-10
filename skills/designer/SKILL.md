---
name: designer
description: >-
  Evidence-based design decision engine. An intention gate that produces non-slop
  UI/UX by forcing every visual choice through industry context, cognitive science,
  design master principles, and anti-pattern detection before code generation.
  Outputs a DESIGN.md contract that all subsequent implementation must follow.
metadata:
  author: booleanstack
  version: "3.0.0"
  labels: [design, ui, ux, design-system, anti-slop]
triggers:
  - design a
  - build me a
  - landing page
  - dashboard design
  - make it look
  - visual direction
  - ui design
  - design system
  - DESIGN.md
  - create a page
  - website for
  - app design
  - redesign
  - style guide
activation:
  mode: fuzzy
  priority: high
  triggers:
    - design
    - landing page
    - dashboard
    - visual
    - DESIGN.md
    - ui
    - ux
references:
  - references/design-md-template.md
  - examples/saas-dashboard.md
  - examples/developer-tool.md
  - examples/ecommerce-checkout.md
---

# Designer Skill — Intention Gate

> AI-generated UIs all look the same because AI skips the decision process and jumps to code.
> This skill forces every design decision through evidence before code generation.
> No visual code until a DESIGN.md contract is produced and approved.

---

## Hard Gate

```
DO NOT GENERATE ANY VISUAL CODE UNTIL:
  1. Intent extracted (Phase 1)
  2. MCP tools consulted (Phase 2)
  3. Anti-patterns checked (Phase 3)
  4. DESIGN.md generated and presented (Phase 4)
  5. User has approved the DESIGN.md

No exceptions. A "simple button" still needs personality, color, and state decisions.
```

**Apply when:** the task changes how something **looks, feels, moves, or is interacted with**.
**Skip when:** pure backend, single CSS bug fix, adding to existing design system with established tokens, performance optimization with no visual change.

---

## Position in the Hyperstack Workflow

```
                           ┌─────────────────────────────────────┐
 user request              │                                     │
     │                     │  Upstream:                          │
     ▼                     │  - hyperstack (root orchestrator)   │
 ┌───────────┐              │  - blueprint (visual routing)       │
 │ blueprint │─── visual? ──┼─▶ designer (THIS SKILL)             │
 └───────────┘              │                                     │
     │                     │  Produces:                          │
     │ non-visual           │  - DESIGN.md contract (file)        │
     │                     │                                     │
     ▼                     │  Downstream consumers:              │
 ┌───────────┐              │  - forge-plan (reads DESIGN.md)     │
 │ forge-plan│◀─ DESIGN.md ─┤  - shadcn-expert (per-section code) │
 └───────────┘              │  - motion_generate_animation        │
     │                     │  - design_tokens_generate           │
     ▼                     │  - behaviour-analysis (audit spec)  │
 execution                 │  - ship-gate (compliance check)     │
     │                     │                                     │
     ▼                     │  Reverse escalation (allowed):      │
 ┌───────────┐              │  - forge-plan → designer            │
 │ ship-gate │              │    (if visual gap discovered)       │
 └───────────┘              │  - behaviour-analysis → designer    │
     │                     │    (if expected behavior unclear)   │
     ▼                     │                                     │
 deliver                   └─────────────────────────────────────┘
```

## The Three-Layer Stack

| Layer | Plugin | Question | Tools |
|---|---|---|---|
| **Decision** | `designer` (this skill) | Which design? | 17 MCP tools |
| **Rules** | `ui-ux` | What principles? | 6 MCP tools |
| **Values** | `design-tokens` | What exact CSS? | 7 MCP tools |
| **Components** | `shadcn` | Which components to compose? | 4 MCP tools |
| **Motion** | `motion` | Exact animation code? | 7 MCP tools |

---

# PHASE 1: INTENT EXTRACTION

Two modes. Default to **Base** unless user says "advanced" or "detailed."

## Base Mode (3 Questions + Confirm)

**Step 1:** Call `designer_resolve_intent` with product description. Auto-detects: industry, personality, style, mode, density, color mood, must-haves, never-uses.

**Step 2:** Ask 3 essential questions:

| # | Question | Why |
|---|---|---|
| 1 | What is the product? (1 sentence) | Everything derives from this |
| 2 | Brand color? (hex, name, or "generate") | Can't guess someone's brand |
| 3 | What sections/pages to build? | What to implement |

**Step 3:** Present auto-resolved defaults AND suggest a preset. Offer: *"Say 'advanced' for full control, or pick a preset to start from."*

## Presets (Fast Start)

If user says "make it feel like Linear" or "start from Stripe" or "use the Notion style" — call `designer_get_preset(name)` and use it as the DESIGN.md foundation. Customize brand color only.

| Preset | Best For | Key Trait |
|---|---|---|
| `linear` | SaaS, productivity tools | Opacity hierarchy, 8px grid, snappy 150ms |
| `stripe` | Payment, docs, premium SaaS | Weight 300/500, CIELAB contrast, editorial polish |
| `vercel` | Dev tools, technical products | -0.04em tracking, zero chromatic bias, 96px sections |
| `apple` | Consumer, mobile-first | 17px body, spring physics, 44pt targets |
| `carbon` | Enterprise, regulated industries | Zero radius, IBM Plex, WCAG AA out of box |
| `shadcn` | Any React + Tailwind project | OKLCH, opacity borders, brand-agnostic default |
| `notion` | Content, editorial, notes | Warm cream bg, serif headings, 65ch prose |
| `supabase` | Developer tools, dark-first | Emerald on black, compact, code-native |
| `figma` | Creative tools, startups | Multi-color, spring animations, vivid |

Call `designer_list_presets` to show all with details. Call `designer_get_preset(name)` for full token config + CSS.

**Preset workflow:** Preset fills Sections 1-7 of DESIGN.md automatically. You only need to customize: brand color, specific sections/pages, and industry-specific do's/don'ts.

## Advanced Mode (12 Questions)

Call `designer_resolve_intent` first. Show suggested default alongside each question. Present in batches of 3-4 (Hick's Law).

### Q1: What is the product? (1 sentence)
Determines industry category, anti-pattern set, style priority.

### Q2: Who is the primary user?

| User Type | Defaults |
|---|---|
| Developer | Dark default, monospace accents, keyboard-first, compact density |
| Consumer | Light default, friendly typography, mobile-first, comfortable density |
| Enterprise | Structured, conservative, data-dense, normal density |
| Child | Playful, large touch targets (48px+), high contrast, claymorphism |
| Creative | Rich motion, bold colors, portfolio-native |
| Healthcare | Calm, accessible (AAA), large text, minimal motion |

### Q3: What emotional target?

| Target | Visual Direction |
|---|---|
| Trustworthy | Professional palette, serif or clean sans, conservative radius |
| Playful | Vivid colors, rounded shapes (16-24px), spring animations |
| Premium | Tight tracking (-0.02em+), generous whitespace, single accent, subtle shadows |
| Energetic | High chroma (C 0.15+), large type (32px+ headings), rich motion |
| Calm | Muted palette, warm neutrals, generous line height, minimal motion |
| Technical | Dark default, monospace accents, compact density, snappy motion |
| Bold | Maximum contrast, large type, strong color blocks |
| Editorial | Serif headings, generous reading (18px body, 1.75 line-height), warm backgrounds |

### Q4: Light or dark default?
Not a preference — a product decision. Developer tools → dark. Marketing → light. Editorial → light. Gaming → dark. Dashboards → either, but intentional.

### Q5: Brand color?
If given: extract hue, derive OKLCH ramp (11 stops). If "generate": pick from industry color mood.

| Industry | Color Mood |
|---|---|
| SaaS | Trust blue + single accent |
| Healthcare | Calm blue + health green |
| Fintech | Navy + trust blue + gold |
| Luxury | Black + gold, minimal palette |
| AI/Tech | Neutral + one distinct (NOT #6366F1) |
| Education | Friendly pastels, warm accents |
| Wellness | Earth tones, sage green, soft coral |

### Q6: Density?

| Mode | Section Padding | Card Padding | Body Size | Use |
|---|---|---|---|---|
| Comfortable | 96px | 40px | 18px | Marketing, editorial, consumer |
| Normal | 64px | 28px | 16px | SaaS, dashboards, apps |
| Compact | 48px | 20px | 14px | Data tables, admin, dev tools |

### Q7: Design style?
7 primary: minimalism, glassmorphism, soft-ui, dark-oled, vibrant-block, claymorphism, aurora-ui. If "recommend": resolved from industry + emotional target.

### Q8: Font personality?

| Personality | Pairing | Use |
|---|---|---|
| Technical | Geist + Geist Mono | Dev tools, SaaS, dashboards |
| Elegant | Cormorant + Montserrat | Luxury, editorial, premium |
| Friendly | Plus Jakarta Sans + mono | Consumer, education, SaaS |
| System | Inter (or system stack) | Universal, no strong personality |
| Editorial | Playfair Display + Lora | Content sites, blogs, news |

### Q9: Motion level?

| Level | What It Includes |
|---|---|
| Static | No animations at all |
| Subtle | Hover states + transitions only (150-200ms) |
| Moderate | + scroll reveals, micro-interactions (200-300ms) |
| Rich | + parallax, page transitions, animated backgrounds (300-500ms) |

Always respects `prefers-reduced-motion` regardless of level.

### Q10: Sections/pages?
Landing: Hero, Features, Testimonials, CTA, Footer, Pricing, FAQ. Dashboard: Sidebar, Header, Content, Data panels. Apps: Navigation, Content, Modals, Forms, Empty states.

### Q11: Framework?
Default: shadcn/ui + Tailwind v4. Others: React, Next.js, HTML + Tailwind, Vue, Svelte.

### Q12: Constraints?
WCAG AA (default) or AAA. Performance budget (< 150KB JS, < 2s load). Dark mode required. Brand keywords.

**Do NOT proceed to Phase 2 until Q1, Q5, Q10 answered.**

---

# PHASE 2: DESIGN SYSTEM RESOLUTION

Every MCP call must fill a specific section of the DESIGN.md. No call without a purpose.

## Core Calls (Every Design Task — 4 calls)

These 4 calls fill 80% of the DESIGN.md. Run them in parallel.

### Call 1: `designer_resolve_intent(product_description)`
**FILLS:** All sections (defaults for everything)
**PURPOSE:** Auto-detects industry, personality, style, mode, density, color mood, must-haves, never-uses. Without this, you're guessing.
**USE RESULT TO:** Set defaults for the entire DESIGN.md. Present to user for confirmation in Phase 1.

### Call 2: `designer_get_personality(resolved_cluster)`
**FILLS:** Section 1 (theme), Section 2 (color direction), Section 3 (typography), Section 4 (spacing), Section 6 (motion), Section 7 (elevation)
**PURPOSE:** Returns the concrete visual vocabulary — specific tracking values, radius range, shadow style, motion timing, density, CSS example. This is the single most important data source for the DESIGN.md.
**USE RESULT TO:** Set every visual property. The personality vocabulary IS the design system skeleton.

### Call 3: `designer_get_page_template(page_type)`
**FILLS:** Section 5 (components), Section 9 (responsive)
**PURPOSE:** Returns section anatomy with component inventory and which cognitive laws apply to this page type. Without this, you're inventing sections from scratch.
**USE RESULT TO:** Define what sections to build, what components each needs, what responsive behavior each requires.

### Call 4: `designer_get_anti_patterns(industry: resolved_industry)`
**FILLS:** Section 8 (do's/don'ts), Section 10 (anti-patterns)
**PURPOSE:** Returns the specific violations this industry must avoid. Without this, you might put AI purple on a bank or neon on a healthcare app.
**USE RESULT TO:** Write the Do's/Don'ts section and the anti-pattern checklist. Every "Don't" must come from this list.

## Context Calls (Only When the Product Needs Them)

These are NOT routine. Call ONLY when the product has these specific features.

| Product Feature | Call | FILLS | WHY (what decision it changes) |
|---|---|---|---|
| **Landing page** | `designer_get_landing_pattern("hero-section")` | Section 5 | Conversion stats change hero layout: value prop in 3s, CTA above fold, 40-80px bleed |
| **Landing page** | `designer_get_landing_pattern("section-ordering")` | Section 5 | Unbounce 41K pages: Hero→Proof→Problem→Features→Testimonials→Pricing→FAQ→CTA |
| **Landing page** | `designer_get_landing_pattern("social-proof")` | Section 5 | Named metrics (+30-70%) vs logos (+260%) vs badges (+55%) changes proof section design |
| **Landing page** | `designer_get_landing_pattern("cta-optimization")` | Section 8 | First-person CTAs +90%, single CTA +266%, "no credit card" +34% |
| **Pricing page** | `designer_get_landing_pattern("pricing-psychology")` | Section 5 | Ariely decoy changes tier structure: 3 tiers, highlight middle, expensive first |
| **Forms** | `designer_get_interaction_pattern("form-design")` | Section 5 | Validation timing (blur not input), label placement (top not placeholder), max field count |
| **Navigation** | `designer_get_interaction_pattern("navigation")` | Section 5 | Hamburger is 39% slower on desktop (NNG). Tab bars +58% engagement. Changes nav type. |
| **Onboarding** | `designer_get_interaction_pattern("onboarding")` | Section 5 | 3-5 checklist items outperform 8+. Interactive > passive. Changes onboarding structure. |
| **Data tables** | `designer_get_interaction_pattern("skeleton-vs-spinner")` | Section 6 | Skeleton for known structure, spinner for discrete actions. Changes loading pattern. |
| **Error handling** | `designer_get_ux_writing("error-messages")` | Section 8 | NNG rubric: what happened + why + how to fix. Changes error message format. |
| **CTAs/buttons** | `designer_get_ux_writing("button-labels")` | Section 8 | "Start my trial" +90% vs "Start your trial". Changes button copy strategy. |
| **Premium feel** | `designer_get_design_system("stripe")` or `("vercel-geist")` | Section 1 | Specific values to reference: Stripe weight 300/500, Vercel -0.04em tracking |
| **Enterprise** | `designer_get_design_system("ibm-carbon")` | Section 1 | Carbon's 12px spacing-04, IBM Plex, a11y-first component architecture |

## Token Calls (Phase 5 only — when generating code)

Do NOT call these during design resolution. Call them when writing actual CSS.

```
design_tokens_get_category("colors")     → OKLCH ramp construction procedure
design_tokens_get_category("typography") → type scale token definitions
design_tokens_get_category("spacing")    → 4px grid token definitions
design_tokens_generate(description)      → generate complete Tailwind v4 CSS
```

---

# PHASE 3: CONSTRAINT APPLICATION

Cross-reference every decision against the rules below.

---

# DESIGN RULES BY PRIORITY

*Follow P1→P10. Higher priority = fix first. Every rule has a source.*

## P1: Accessibility (CRITICAL)

| Rule | Standard | Avoid |
|---|---|---|
| `contrast-body` | 4.5:1 minimum for body text (AA); 7:1 for AAA | Testing only in light mode |
| `contrast-large` | 3:1 for text >= 18px bold or >= 24px | Assuming brand colors pass |
| `contrast-ui` | 3:1 for UI components, borders, icons | Low-contrast borders in dark mode |
| `focus-rings` | 2px ring, 2px offset, primary color on ALL interactive elements | `outline: none` without replacement |
| `touch-targets` | Min 44x44px (WCAG 2.5.5); recommended 48x48px; gap >= 8px | Touch targets < 44px on mobile |
| `color-not-only` | Color + icon/text for every state (error, success, warning) | Red border as sole error indicator |
| `reduced-motion` | `prefers-reduced-motion: reduce` with `!important` in `@layer base` | Missing media query (WCAG 2.3.3) |
| `keyboard-nav` | Tab order = visual order; Enter/Space activates; Escape closes | Unreachable interactive elements |
| `skip-links` | `<a href="#main">Skip to main content</a>` as first body element | No skip link on nav-heavy pages |
| `alt-text` | Descriptive for informational images; `alt=""` for decorative | `alt="image"` or missing alt |
| `aria-labels` | `aria-label` on icon-only buttons (on the button, not the icon) | Unlabeled icon buttons |
| `heading-hierarchy` | Sequential h1→h2→h3, no skipping levels | h1 → h3 (skipped h2) |
| `zoom-support` | Layout works at 400% zoom; never `user-scalable=no` | Disabling pinch-to-zoom |
| `semantic-html` | `<nav>`, `<main>`, `<button>`, `<a href>` — not divs with onclick | `<div onclick>` instead of `<button>` |

## P2: Touch & Interaction (CRITICAL)

| Rule | Standard | Avoid |
|---|---|---|
| `hover-states` | All interactive elements have visible hover feedback | Silent no-ops on hover |
| `cursor-pointer` | `cursor: pointer` on all clickable elements | Clickable divs without cursor change |
| `loading-feedback` | Spinner/skeleton for ALL async operations > 300ms | Frozen UI during async |
| `hover-vs-tap` | `@media (hover: hover)` for hover effects; click/tap for all primary actions | Features only accessible via hover |
| `disabled-states` | `opacity: 0.5` + `pointer-events: none` + `aria-disabled` | Disabled buttons still clickable |
| `empty-states` | Headline + copy + CTA for every empty data container | Blank screen with no explanation |
| `error-feedback` | Error message inline + summary at top (identical wording) | "Something went wrong" with no next step |
| `tap-feedback` | Visual feedback within 100ms of tap (opacity, scale, ripple) | No visual response on tap |
| `gesture-alternative` | Every gesture has a visible button equivalent | Gesture-only actions |
| `safe-area` | Keep primary targets away from notch, gesture bar, screen edges | Tappable content under OS chrome |

## P3: Layout & Responsive (HIGH)

| Rule | Standard | Avoid |
|---|---|---|
| `mobile-first` | Write mobile styles first; override with `min-width` queries | Desktop-first with `max-width` |
| `breakpoints` | 375 / 768 / 1024 / 1280 / 1440px (content-driven) | Arbitrary device-specific breakpoints |
| `content-max-width` | `max-width: 1280px` for page; `65ch` for prose text | Full-width paragraphs on ultrawide |
| `4px-grid` | ALL spacing = multiples of 4px (4,8,12,16,20,24,32,40,48,64,96) | Values like 11px, 17px, 23px |
| `spacing-hierarchy` | Space within groups < space between groups | Same padding everywhere |
| `z-index-scale` | Named: dropdown(1000), sticky(1020), modal(1050), tooltip(1070), toast(1080) | `z-index: 9999` anywhere |
| `aspect-ratio` | `aspect-ratio` or `width`+`height` on all images | Images without dimensions (CLS) |
| `sticky-offset` | Fixed/sticky nav → `padding-top: nav-height` on body | Nav covering first section |
| `viewport-units` | `min-h-dvh` not `100vh` on mobile | `100vh` (broken on iOS) |
| `12-col-grid` | 12 columns, 24px gutters desktop, 16px mobile, 48-64px margins | No grid system |
| `no-horizontal-scroll` | Content fits viewport width on all devices | Horizontal scroll on mobile |
| `container-width` | Consistent max-width on desktop (1280px / 1440px) | No width constraint |

## P4: Typography (HIGH)

| Rule | Standard | Avoid |
|---|---|---|
| `type-scale` | Mathematical ratio: 1.25 (compact), 1.333 (standard), 1.414 (dramatic) | Random sizes (17px, 23px, 37px) |
| `body-fixed` | Body text at 16px fixed; NEVER fluid `clamp()` for body | `clamp()` on body (causes reflow) |
| `heading-fluid` | Headings use `clamp()` for fluid scaling | Fixed heading sizes |
| `line-height-invert` | Display 1.05-1.15; Heading 1.2-1.3; Body 1.5 (app) or 1.6-1.75 (prose) | Same line-height everywhere |
| `tracking` | Headings: -0.01 to -0.03em; Body: 0; Overlines: +0.06 to +0.10em | Negative tracking on body text |
| `weight-contrast` | Heading 600-800, body 400 — hierarchy readable from weight alone | `font-weight: 500` everywhere |
| `max-2-families` | Sans + mono for apps; serif + sans for editorial | 3+ font families |
| `prose-width` | `max-width: 65ch` on all body text containers | Full-width text (90+ chars) |
| `fallback-stack` | `ui-sans-serif, system-ui, sans-serif` always included | Missing fallback fonts |
| `readable-mobile` | Minimum 16px body on mobile (avoids iOS auto-zoom) | 14px body on mobile |

## P5: Color System (HIGH)

| Rule | Standard | Avoid |
|---|---|---|
| `oklch` | OKLCH for all design tokens — perceptually uniform, P3 gamut | Hex/HSL for design systems |
| `no-pure-bw` | Near-black `oklch(0.12-0.15 0.005 H)` + near-white `oklch(0.97-0.99 0.005 H)` | Pure #000 on #FFF |
| `warm-cool-commit` | Commit to warm OR cool neutrals throughout; never mix | Warm bg + cool borders |
| `semantic-tokens` | 3-layer: primitive ramps → semantic tokens → Tailwind bridge | Raw hex in components |
| `dark-mode` | Redesign, don't invert. Warm charcoal bg. Lighter surfaces per elevation. | Inverting light mode |
| `status-colors` | Success/error/warning/info each with solid + soft variant; L ~0.55 for AA | Same color for solid and soft |
| `no-ai-purple` | Custom brand hue, not #6366F1 | AI purple as unconscious default |
| `chart-tokens` | Dedicated `--chart-*` tokens separate from `--primary` | Reusing brand for charts |
| `shadow-tint` | Warm-tinted oklch shadows, never `rgba(0,0,0,...)` | Cold black shadows |
| `dark-elevation` | Progressively lighter bg per level (shadows invisible on dark) | Box shadows in dark mode |
| `color-dark-mode-test` | Test contrast separately in dark mode (don't assume light values work) | One-mode testing |

## P6: Motion & Animation (MEDIUM)

| Rule | Standard | Avoid |
|---|---|---|
| `duration-scale` | 100-150ms hover; 200ms default; 300ms panel; 400-500ms complex | > 500ms for UI transitions |
| `exit-faster` | Exit animations 50-100ms shorter than enter | Same duration for enter/exit |
| `easing` | ease-out (enter), ease-in (exit), ease-in-out (reposition) | Linear easing for UI motion |
| `gpu-only` | Animate only `transform` and `opacity` | Animating width/height/top/left |
| `no-decorative` | Animation must serve information (state change, spatial continuity) | `animate-bounce` on static icons |
| `max-2-animated` | Max 2 animated elements per viewport simultaneously | 6 elements animating on load |
| `spring-context` | Spring/bounce only for playful/consumer contexts | Bounce in enterprise |
| `interruptible` | User tap/gesture cancels in-progress animation immediately | Blocked input during animation |
| `stagger-sequence` | Stagger list item entrance 30-50ms per item; not all-at-once | All items appearing simultaneously |

## P7: Components (MEDIUM)

| Rule | Standard | Avoid |
|---|---|---|
| `all-states` | Every component: default, hover, active, focus, disabled, loading | Missing states |
| `button-loading` | Spinner replaces text, same width (prevent CLS) | Button width changing |
| `input-labels` | Visible persistent label above input | Placeholder-as-label |
| `input-validation` | Validate on blur; real-time only when correcting existing error | Validating on focus |
| `password-toggle` | Show/hide with text label; never disable paste | Paste disabled |
| `empty-state` | Headline + copy + single CTA; never blank | "No data" |
| `icon-system` | SVG icons (Lucide/Heroicons/Phosphor), never emojis | Emojis as icons |
| `confirmation` | Title = action question; buttons = specific verbs | "Are you sure?" / "OK" |
| `error-messages` | What happened + why + how to fix; never blame user | "Error 403" |
| `nav-active` | Current page visually indicated in nav | No active indicator |
| `consistent-radius` | Same radius for same component type across product | Mixing 4px and 24px randomly |
| `elevation-consistent` | Consistent shadow/elevation scale for cards, sheets, modals | Random shadow values |

## P8: UX Writing (MEDIUM)

| Rule | Standard | Avoid |
|---|---|---|
| `button-labels` | Verb + object: "Download report", "Add to cart" | "Submit", "Click here", "OK" |
| `first-person-cta` | "Start my trial" > "Start your trial" (+90% ContentVerve) | Second-person CTAs |
| `single-cta` | One primary CTA per view (+266% conversions) | Multiple competing CTAs |
| `plain-language` | Grade 4-6 reading level; max 25 words per sentence | "Purchase", "Commence" |
| `sentence-case` | Sentence case headings | Title Case Everywhere |
| `specific-headlines` | "3 items in your cart" (specific) | "Almost there!" (clever) |
| `loading-copy` | < 2s: spinner only; 2-10s: "Saving..."; 10s+: progressive | "Loading..." for everything |
| `no-blame` | "That password doesn't match" | "You entered wrong password" |
| `no-clear-on-error` | Preserve all user input on form error | Clearing form on error |
| `inclusive-language` | "select" not "click"; "they/their"; "primary/subordinate" | "click", "master/slave" |

## P9: Landing Page Conversion (MEDIUM)

| Rule | Evidence | Standard |
|---|---|---|
| `hero-3sec` | NNG: 57% viewing time above fold | Value prop in 3 seconds |
| `false-floor` | NNG: 102% more views above fold | Bleed 40-80px of next section |
| `section-order` | Unbounce 41K pages | Hero→Proof→Problem→Features→Testimonials→Pricing→FAQ→CTA→Footer |
| `social-proof` | TrustRadius: 30-70% lift | Named metrics > logos > badges > generic |
| `pricing-3tier` | ProfitWell 12K SaaS | 3 tiers, highlight middle, expensive first |
| `trust-signals` | 61% didn't buy without seals | Trust signal near every CTA |
| `page-speed` | Google: 1s→3s = +32% bounce | Sub-2s load; AVIF > WebP > JPEG |
| `cta-above-fold` | HubSpot 40K pages: +30% | CTA above fold, repeated after sections |
| `grade-5-7` | Unbounce: +56% vs grade 8-9 | Copy at grade 5-7 reading level |
| `form-fields` | Baymard: -4-6% per field beyond 8 | Max 7-8 fields; inline validation |
| `mobile-cta` | 82.9% mobile traffic | Sticky CTA bar, thumb-zone placement |

## P10: Charts & Data (LOW)

| Rule | Standard | Avoid |
|---|---|---|
| `right-align-numbers` | Right-align quantitative data in monospace font | Left-aligned numbers |
| `table-row-hover` | Subtle background highlight on row hover | No row tracking |
| `table-pagination` | Pagination > infinite scroll for tables | Infinite scroll on tables |
| `fixed-headers` | Freeze row/column headers during scroll | Scrolling headers |
| `no-rainbow` | Viridis/Okabe-Ito; max 8 categories | Rainbow colormap |
| `data-ink` | Erase elements without info loss (Tufte) | Gridlines dominating data |
| `chart-a11y` | Color + pattern/shape; provide table alternative | Color-only data encoding |

---

# PERSONALITY ATLAS

> Source: 58 real company design systems. Design is communication before aesthetics.

```
Layer 1: Personality  → What does this product say about itself?
Layer 2: Language     → What visual vocabulary carries that personality?
Layer 3: Rules        → What constraints enforce it consistently?
```

Without Layer 1, Layers 2 and 3 produce polished randomness.

## 1. Premium Precision

**Communicates:** "Engineered by people who care about every pixel."

**Exemplars:**
- **Linear** — tight type (-0.03em), 3-variable color system (base, accent, contrast), opacity-based hierarchy
- **Vercel** — black+white, Geist font (angular terminals, -0.04em display tracking), 96-128px section padding
- **Apple** — SF Pro Display/Text split at 20pt, 44pt touch targets non-negotiable, Clarity/Deference/Depth
- **Stripe** — weight 300 body / 500 headers (zero 400 or 700), CIELAB 5-step = 4.5:1 guaranteed, multi-point gradient meshes

| Property | Value | Why |
|---|---|---|
| Colors | Mono + single accent | Multiple colors compete. One directs. |
| Typography | -0.02 to -0.03em headings, weight 300-600 | Tight = "deliberately set". Low weight = restraint. |
| Radius | 0-8px | Sharp = engineered. |
| Shadows | None or ultra-subtle | Precision demands lightness. |
| Motion | 200-250ms, ease-out, no bounce | Motion serves info, not personality. |
| Density | Normal | Balanced. |
| Default | Light | Content visibility. |

**Use:** SaaS, dev tools (light), docs, B2B. **Never:** Children's, gaming, playful brands.

## 2. Technical Developer

**Communicates:** "Built by developers, for developers."

**Exemplars:**
- **Supabase** — dark emerald, code-first, SQL editor as hero
- **Warp** — IDE-like, block-based, terminal IS the product
- **Cursor** — sleek dark, keyboard-first, every action has shortcut
- **Raycast** — command palette is entire UX, bento grid, every interaction < 100ms

| Property | Value | Why |
|---|---|---|
| Colors | Dark bg (oklch 0.08-0.14), green/cyan accents | Dark reduces strain. Green/cyan = terminal convention. |
| Typography | Monospace for data, sans for UI chrome | Monospace = data. Sans = chrome. That IS the hierarchy. |
| Radius | 4-8px | Functional middle. |
| Shadows | Glow on accent (0 0 20px oklch(accent / 0.15)) | Box-shadows feel wrong on dark. Glow feels native. |
| Motion | 100-200ms, snappy | Devs notice 50ms lag. |
| Density | Compact (14px body, 48px sections, 20px cards) | Info density is a feature. |
| Default | Dark | 8+ hours in dark IDEs. |

**Critical:** Command palette (Cmd+K) is NOT optional for 50+ feature apps. Keyboard shortcuts on every action. Code blocks with syntax highlighting + copy button.

**Use:** Dev tools, CLIs, APIs, code editors. **Never:** Consumer, marketing, healthcare, government.

## 3. Warm Editorial

**Communicates:** "Reading this should feel like opening a well-made book."

**Exemplars:**
- **Notion** — serif headings, cream backgrounds, editor disappears
- **Airbnb** — warm coral (#FF5A5F), photography-driven, rounded-xl
- **Medium** — serif body, 1.75 line-height, platform IS the reading experience

| Property | Value | Why |
|---|---|---|
| Colors | Warm-tinted: oklch(0.98 0.012 78) not oklch(0.98 0 0) | 0.012 chroma at hue 78 transforms "cold SaaS" into "premium notebook." Highest-leverage single decision. |
| Typography | Serif or humanist sans, 18px body, 1.6-1.75 lh | Serif = trust. Larger body + generous leading = comfort. |
| Radius | 12-20px | Rounded = friendly (Gestalt). Cap 20px — beyond = childish. |
| Shadows | Warm-tinted (oklch(0.22 0.006 56 / 0.06)) | Cold rgba shadows feel disconnected on warm surfaces. |
| Motion | 200-300ms, ease-in-out, gentle | "Considered." Spring/bounce = tonally wrong. |
| Density | Comfortable (96px sections, 40px cards, 18px body) | Reading requires breathing room. |
| Default | Light | Paper metaphor. |

**Use:** Content, editorial, consumer, hospitality. **Never:** Dev tools, data-dense, fintech.

## 4. Bold Energetic

**Communicates:** "We're confident and not afraid to stand out."

**Exemplars:**
- **Figma** — multi-color (each feature = own color), vibrant
- **Framer** — bold black + blue, motion-first
- **PostHog** — playful dark, hedgehog branding, dev-friendly tone

| Property | Value | Why |
|---|---|---|
| Colors | 4-6 vivid, complementary/triadic, C 0.15+ | Energy requires contrast. Mono kills it. Cap 6 = chaos limit. |
| Typography | Display 700-900, 32px+ headings, -0.02 to -0.03em | Large heavy type demands attention. That's the point. |
| Radius | 12-16px | Confident. Not sharp (cold) or super-round (childish). |
| Shadows | Colored (0 8px 24px oklch(brand / 0.10)) | Colored shadows reference brand. More expressive. |
| Motion | 200-400ms, spring (cubic-bezier(0.34, 1.56, 0.64, 1)) | Bold = bold motion. Under 400ms for UI. |
| Default | Light | Bold colors need light contrast. Dark mutes vibrancy. |

**Use:** Creative tools, startups, social, youth. **Never:** Banking, healthcare, government, B2B.

## 5. Cinematic Dark

**Communicates:** "This is an experience, not a tool."

**Exemplars:**
- **ElevenLabs** — audio waveform aesthetics define the visual language
- **RunwayML** — AI content IS the hero, UI is invisible framing
- **SpaceX** — full-bleed mission photography, futuristic through restraint

| Property | Value | Why |
|---|---|---|
| Colors | Near-black (oklch 0.05-0.10), single neon accent | True black = 60% OLED power savings at 100% brightness. Single accent = Von Restorff focal. |
| Typography | Light weight 300-400 at large display, tight tracking | Light on dark = ethereal. Heavy on dark = oppressive. |
| Radius | 0-6px | Sharp = futuristic. Rounded adds warmth that conflicts. |
| Shadows | Glow (0 0 40px oklch(accent / 0.20)), no box-shadow | Shadows invisible on dark. Glow = native to dark. |
| Motion | 400-600ms cinematic, parallax, ease-in-out | Speed destroys cinematic feel. ONLY personality where 500ms+ is OK for reveals. |
| Density | Comfortable (120px sections) | Dense breaks immersive spell. Each section is a "scene." |
| Default | Dark | Personality IS darkness. Light mode may not be appropriate. |

**Use:** Media, entertainment, gaming, music, AI creative. **Never:** Productivity, forms-heavy, government, healthcare.

## 6. Enterprise Trust

**Communicates:** "Your data is safe with us."

**Exemplars:**
- **IBM** — Carbon, IBM Plex, every component ships WCAG 2.1 AA, 3:1 focus ring contrast
- **Coinbase** — institutional blue, says "bank" not "startup"
- **Salesforce** — Lightning system, handles complexity through structure

| Property | Value | Why |
|---|---|---|
| Colors | Blue/navy (oklch 0.45-0.55 0.15-0.18 240-260), 1 brand + 1 accent | Blue = most cross-culturally consistent trust signal (Frontiers in Psychology, Goldstein 1942). |
| Typography | Formal sans (IBM Plex, Inter), 400 body, 600 heading | No serif (editorial), no display weight (startup). Moderate = structured. |
| Radius | 4-8px | Professional. 0px = brutalist. 12px+ = consumer. |
| Motion | 150-200ms, ease-out | 8+ hour workday. Decorative motion = distraction. State feedback only. |
| Default | Light | Institutional convention. |

**Trust signals required:** SOC2/ISO badges, uptime guarantees, SSO/SAML, audit logs, role-based access visible.

**Use:** B2B, fintech, healthcare management, gov tech. **Never:** Consumer, creative, gaming.

## Choosing a Personality

Industry × user type × emotional target. When signals conflict, **industry wins** — it's the harder constraint. A playful bank loses trust. A conservative game loses engagement.

| Emotional Target | Maps To |
|---|---|
| Trustworthy | enterprise-trust |
| Playful | bold-energetic |
| Premium | premium-precision |
| Energetic | bold-energetic |
| Calm | warm-editorial |
| Technical | technical-developer |
| Bold | bold-energetic |
| Editorial | warm-editorial |

---

# INDUSTRY RULES

> Source: ui-ux-pro-max (161 rules), awesome-design-md (58 companies). Banking != gaming != healthcare.

## SaaS
**Style:** Soft UI | **Color:** Trust blue + accent | **Must:** Hover transitions, empty states, onboarding checklist (3-5 items) | **Never:** Excessive animation, AI purple, > 2 accent colors

## Analytics / Dashboard
**Style:** Minimalism | **Color:** Neutral + data viz (Okabe-Ito/viridis) | **Must:** Data export, filtering, sortable tables, keyboard nav, monospace numbers, right-align quantities | **Never:** Ornate design, decorative images, rainbow colormaps

## Healthcare
**Style:** Soft UI | **Color:** Calm blue + green, C < 0.12 | **Must:** **WCAG AAA**, calm colors, 48px+ targets, crisis resources | **Never:** Neon, motion-heavy, < 14px text, gamification without clinical validation | **Legal:** HIPAA (no PHI in URLs, session timeouts)

## Fintech
**Style:** Minimalism | **Color:** Navy + blue + gold | **Must:** Security signals, trust badges near monetary actions, number formatting (locale-aware), audit trail | **Never:** Playful design, AI purple, unclear fees (FTC risk), animations on transactions

## Creative Agency
**Style:** Vibrant Block | **Color:** Bold, high chroma | **Must:** Case studies, full-bleed imagery, scroll animations, portfolio grid | **Never:** Corporate minimalism, stock photos, template layouts

## Developer Tool
**Style:** Dark OLED | **Color:** Dark + accent (emerald/cyan) | **Must:** Code examples, keyboard shortcuts, Cmd+K, syntax highlighting, copy buttons | **Never:** Heavy chrome, poor keyboard support, light mode forced default | **Key:** Docs quality IS product quality

## AI / Chatbot
**Style:** Minimalism | **Color:** Neutral + one accent (NOT #6366F1 unless intentional) | **Must:** Streaming text < 100ms first token, typing indicators, tool/function indicators, code blocks + copy | **Never:** Heavy chrome, AI purple as default, anthropomorphized persona (Clippy problem)

## E-commerce (Luxury)
**Style:** Minimalism | **Color:** Black + gold | **Must:** Product photography as hero, trust signals, size guides, guest checkout (26% abandon if forced account) | **Never:** Block-based colorful, playful, cheap discount badges ("complimentary shipping" not "FREE SHIPPING!!!")

## Government
**Style:** Minimalism | **Color:** High contrast, institutional | **Must:** **WCAG AAA**, skip links, grade 4-6 language, breadcrumbs, multi-language, print-friendly | **Never:** Ornate, low contrast, motion, decorative images, jargon

## Mental Health
**Style:** Soft UI | **Color:** Muted pastels, warm | **Must:** Calm aesthetics, privacy-first, breathing room, crisis resources every screen | **Never:** Neon, motion overload, gamification, social pressure, dark default, aggressive notifications

## Education
**Style:** Soft UI / Clay | **Color:** Friendly pastels | **Must:** Progress indicators, achievement feedback, clear nav, full a11y | **Never:** Complex layouts, dense tables, dark default, small text

## Wellness
**Style:** Soft UI | **Color:** Earth tones, sage, coral | **Must:** Calm, breathing space, warm photography, gentle CTAs | **Never:** Dark default, aggressive motion, neon, dense layouts

For full detail on any industry: `designer_get_industry_rules(industry)`

---

# COGNITIVE LAWS (11)

> Source: Laws of UX, NNG, Smashing Magazine. Not opinions — empirically documented facts.

## Fitts' Law
**`T = a + b * log2(2D/W)`** — Halving distance > doubling size.
- Touch targets >= 44px (WCAG) / 48px (Material). Screen edges = infinite targets for mouse, hardest for touch.
- Submit CTA at bottom of form (pointer already near last field). Destructive actions >= 8px from safe actions.
- Increase padding without visible border for invisible hit-area expansion.
**Violations:** Icon-only buttons (16px visual != 44px target), Delete beside Save with < 8px gap.

## Hick's Law
**`RT = a + b * log2(n + 1)`** — 2→4 choices costs more than 20→22. First added choices are most expensive.
- Minimize choices at irreversible points. Wizard pattern for multi-step. Surface recommended option.
- **Critical:** Applies to decisions, not recognition. 15-item nav with clear categories = fine. 15-option modal = not.
**Violations:** All features on first login, pricing with no highlighted plan, 50+ unsorted dropdowns.

## Miller's Law
**7 +/- 2 chunks** (Cowan 2001: 4 +/- 1 without rehearsal). Unit = chunk, not item.
- "(919) 555-2743" = 3 chunks vs "9195552743" = 10 items. 73% lower cognitive load.
- Auto-chunk numbers, max 7 nav items, group forms into <= 5 fields/section.
**Violations:** Flat 12+ item nav, unbroken reference codes, 20+ ungrouped settings.

## Gestalt Principles
**Proximity > Similarity > Closure > Continuity > Common Fate**
- **Proximity:** Label-input gap (4-8px) < input-to-next-label (16-24px). Equal spacing = invisible structure.
- **Similarity:** All links share treatment. Primary != secondary button weight.
- **Closure:** Partial card at viewport bottom = scroll hook. Skeleton screens exploit this.
- **Continuity:** Vertical form alignment. Zigzag layouts break scanning (NNG confirmed).
- **Common Fate:** Skeleton placeholders pulse at identical timing. Offset = separate blocks.

## Von Restorff Effect
ONE highlighted element per view. Multiple highlights cancel out.
- One CTA. One recommended pricing plan. Red dot badge = only red in monochromatic UI.
**Violations:** Multiple "highlighted" CTAs, 6 elements animating on load.

## Serial Position Effect
First (primacy) and last (recency) remembered most. Middle forgotten.
- Nav: important at edges. Pricing: recommended first or last. Onboarding: aha moment early, friction last.
- Form fields: easy first (name, email), hard middle (tax ID).

## F-Pattern (NNG: 232 users, 1.5M fixations)
Dense text → horizontal top sweep → shorter lower sweep → vertical left scan. Right side = near-zero attention. Users read ~28% of words. 80% viewing time on left half.
- Front-load sentences. "Billing settings" not "Settings for billing". H2/H3 every 200-300 words.

## Z-Pattern
Sparse visual pages (< 50 words). Logo top-left → trust top-right → diagonal → **CTA bottom-right** (terminal point).

## Jakob's Law
Users prefer your site to work like other sites. Radio = single, checkbox = multi, toggle = binary. Blue underline = link (removing = -10-15% clicks). Cart top-right. Redesign: preview + opt-in + revert (Snapchat 2018: lost 3M+ users on forced redesign).

## Doherty Threshold (IBM 1982)
< 100ms instantaneous. 100-400ms immediate. **> 400ms flow breaks.** > 1s abandonment. > 10s gone.
- Optimistic UI (update first, API in background). Skeleton > spinner. Autocomplete < 300ms. Keystroke-to-display < 50ms.

## Peak-End Rule (Kahneman 1993)
Remembered = avg(peak intensity + final moment). Duration neglect.
- Order confirmation = peak AND end (Mailchimp "High Five"). Onboarding completion = peak (Slack first message). Error recovery = peak management (Stripe specific messages). No-friction cancellation > dark-pattern 5-step.

**Cross-law interactions:**
- Hick + Serial Position on nav: fewer items + important at edges
- Fitts + Von Restorff on CTAs: large + visually isolated = compound positive
- Doherty + Peak-End: design loading reveal as positive peak
- Hick vs disclosure: < 20% usage = hide; 80%+ = visible

---

# VISUAL COMPOSITION

> Source: NNG (1.5M fixations, 57,453 fold fixations), A List Apart, Smashing Magazine

## Visual Hierarchy — 6 Levers (in priority order)

1. **Size** — Bigger = more important. Max 3 size variations. Never equal size for different priorities.
2. **Contrast** — Squint test: blur 5-10px, primary action must be first visible. Timid contrast = mistake, not decision.
3. **Color** — Warm/saturated advances, cool/muted recedes. Red = destructive only. 8% male colorblindness.
4. **Typography** — Weight is primary signal. If everything emphasized, nothing is.
5. **Spacing** — More surrounding space = more attention (spotlight). Use before borders/fills.
6. **Position** — Top-left = most attention. Optical center sits above mathematical center.

## CRAP Principles
- **Contrast:** If different, make VERY different. "Same-same" = no hierarchy.
- **Repetition:** All links same treatment. Consistency = implicit rules.
- **Alignment:** Left-align is simplest valid system. Never center multi-line paragraphs.
- **Proximity:** Label-input 4-8px. Form groups 24-32px. Sections 48-96px. Same gap everywhere = invisible structure.

## Whitespace
**Micro** (tracking, leading, label-input): governs readability. **Macro** (sections, margins, hero): governs perceived value. Luxury = generous macro. Crowded = "affordable." **Active** whitespace = spotlight (Apple product isolation). **Passive** = structural (margins, padding). Cramped = signals low value.

## The Fold (NNG: 57,453 fixations)
- Above fold: **102% more views** than below. 57% of viewing time above fold.
- **Never fill exact viewport height** — bleed 40-80px of next section. False floor = users think page is done.
- First 100px must be relevant or users leave.

## Reading Patterns
- **F-Pattern:** Dense text. Right side = zero attention. Front-load sentences.
- **Layer-Cake:** Most effective. Headings = summaries not labels. "Users abandon at address validation" > "Overview."
- **Z-Pattern:** Sparse visual < 50 words. CTA at terminal point (bottom-right).
- **Spotted:** Specific targets (prices, dates). Distinct visual treatment.

## Grids
- 12-column: divides by 1/2/3/4/6/12. Desktop 24px gutters, mobile 16px, margins 48-64px / 20px.
- Baseline: 8px rhythm. Line heights = multiples (16, 24, 32, 40px).
- Full 12/12 (hero), wide 10/12, standard 8/12 (forms), narrow 6/12, sidebar 4/12.

## Optical Alignment
Mathematical != optical. Icons in buttons: 1-2px up. Text in buttons: more bottom padding. Hero headlines: raise 5-8% above mathematical center. Circles must be physically larger than squares to appear equal.

---

# UX WRITING

> Source: Mailchimp, NNG, GOV.UK, Copyhackers, Microsoft. Words are 50% of the interface.

## Button Labels
- "Start **my** trial" > "Start **your** trial" (+90% ContentVerve). First-person = endowment effect.
- Verb + object: "Download report", "Add to cart". Single CTA per screen (+266%).
- Front-load verb. "No credit card required" near CTA (+34%).
- **Never:** "Click here", "Submit", "OK", "Yes/No", "Learn More" as primary.

## Voice & Tone (Mailchimp)
Voice (constant): plainspoken, genuine, translators, dry humor. Tone (variable): adjust to reader's state. "Clear > clever, always." Active voice: "You can edit" not "can be edited."

## Plain Language (GOV.UK)
Reading age 9. Max 25 words/sentence. buy not purchase, help not assist, about not approximately, start not commence. 80% prefer clear English. Block caps 13-18% harder to read.

## Error Messages (NNG + GOV.UK + Stripe)
**What happened + Why + How to fix.** Never blame user. Never clear input. Inline + summary (identical wording). Validate on blur, real-time only when correcting existing error.
- Good: "That email is already registered. Try signing in." Bad: "Error 403"
- Stripe: "Your bank declined. No payment was made. Try a different card."
- NNG: Craigslist D (2.08), J.Crew A (3.67).

## Placeholder Text (NNG)
**Never as label** (disappears on focus, memory burden, users skip thinking pre-filled). Acceptable: format hints only ("MM/DD/YYYY"). Floating labels = compromise.

## Confirmation Dialogs
Kill "Are you sure?" (teaches reflexive clicking). Title = action as question ("Delete this project?"). Body = consequences ("12,847 subscribers. Cannot be undone."). Buttons = specific verbs ("Delete project" / "Keep project"). Destructive: red button, focus on Cancel, max distance between buttons.

## Empty States
Every empty state = onboarding moment. Headline + copy + CTA. First-use: encouraging. Cleared: congratulatory. No results: helpful path forward. Never blank.

## Loading States
< 2s: spinner only. 2-10s: "Saving..." 10s+: "Uploading (3 of 12)..." Present participle. Match verb to action.

## Headlines
Front-load keywords (scan first 2-3 words). Sentence case. Under 8 words. Specific: "3 items in cart" > "Almost there!" Match mental model: clicked "Billing" → heading is "Billing."

## Inclusive Language (Microsoft)
"select" not "click". "they/their." "primary/subordinate" not "master/slave." People-first disability language.

---

# DESIGN MASTERS — 5 CONVERGENCE POINTS

> 7 masters (Rams, Norman, Vignelli, Spiekermann, Ive, Tufte, Kare) converged independently.

## Rams: 10 Principles
Innovative (remove friction, not add spectacle), Useful (function + psychology + aesthetics), Aesthetic (integral to usefulness), Understandable (zero-onboarding), Unobtrusive (canvas disappears), Honest (no dark patterns), Long-lasting (avoids fashion), Thorough (404 pages, empty states = design surfaces), Environmentally friendly (performance = design value), **As little design as possible** (remove features, not just decorations).

## Norman: 6 Principles
**Signifiers** (what designers actually control — blue underline = link), **Mapping** (controls match results), **Feedback** (immediate < 100ms, calibrated), **Constraints** (define what's impossible), **Conceptual Models** (user mental model must match design model). **Two Gulfs:** Execution (can I do it?) and Evaluation (did it work?). Good design narrows both.

## Vignelli: Grid + Type Discipline
Max 2 type sizes per screen. 2x ratio minimum for hierarchy. "White space > black of type." Grid removes arbitrary placement. "Design without discipline is anarchy."

## Spiekermann: Type = Brand
Custom typeface = purchased differentiation. Open apertures for screen legibility (Meta > Helvetica). Size and tracking are inverse. "No excuse for bad screen type."

## Tufte: Data-Ink Ratio
Maximize toward 1.0. "Can this be erased without info loss?" Kill chartjunk. Lie Factor = effect shown / effect in data (1.0 = honest). Small multiples. Sparklines.

## Ive/Apple: Simplicity = Purpose
"Simplicity is not the absence of clutter — that's a consequence." 9:1 rejection ratio. Clarity (transparent carrier), Deference (UI steps back), Depth (spring physics = signifiers).

## Kare: Icons as Universal Language
Meaningful (real metaphors), Memorable (one-trial learning), Clear (traffic sign test). "Nobody needs to redesign the stop sign every two years."

## The 5 Convergences

| # | Principle | Implication |
|---|---|---|
| 1 | **Reduction is the hardest work** | Every element must earn its place. Default = removal. |
| 2 | **Constraints enable, not limit** | Type scale, spacing grid, palette = preconditions for quality. |
| 3 | **Timelessness over trend** | Build for structure. Glassmorphism fades. Good typography is permanent. |
| 4 | **Function precedes form, but form is not optional** | Poor hierarchy = harder to use, not just ugly. |
| 5 | **Design communicates trust** | Don't blame users. Don't manipulate. Don't lie with graphics. |

---

# AI SLOP FINGERPRINT

If ANY present, go back to Phase 3:

| # | Pattern | Fix |
|---|---|---|
| 1 | `#6366F1` gradient (AI purple) | Custom brand hue in OKLCH |
| 2 | Grid of identical cards, identical padding | Vary sizes, bento/asymmetric |
| 3 | `font-weight: 500` everywhere | Weight contrast: 700+ heading, 400 body |
| 4 | `#F9FAFB` background (cold grey) | Warm near-white: oklch(0.98 0.008-0.015 60-80) |
| 5 | Missing states | Design ALL states for every component |
| 6 | `animate-bounce`/`pulse` on static elements | Animation only for loading/state changes |
| 7 | 3+ font families | Max 2 (sans + mono) |
| 8 | Line-height 1.75 on app UI | 1.5 for app; 1.75 is prose only |
| 9 | Absolute/relative from Figma MCP | Solve via flex/grid |
| 10 | `rgba(0,0,0,...)` shadows | oklch-tinted warm shadows |
| 11 | Same color for UI AND charts | Separate `--chart-*` tokens |
| 12 | No `prefers-reduced-motion` | Media query with `!important` |
| 13 | Pure #000 on #FFF | Near-black on tinted white |
| 14 | `outline: none` without replacement | 2px ring, 2px offset |
| 15 | Touch targets < 44px | Pad to 44px minimum |

---

# PHASE 4: GENERATE DESIGN.md

Assemble all decisions into 10-section DESIGN.md. See [template](references/design-md-template.md) for full format. See [examples](examples/) for worked outputs.

```
1. Visual Theme & Atmosphere — emotional target, personality, system inspiration, identity
2. Color Palette — brand ramp (OKLCH 11 stops), semantic tokens, dark mode strategy
3. Typography — scale table, font pairing + rationale, fluid vs fixed
4. Spacing — semantic tokens, density, grid (12-col), content max-width
5. Component Specs — button/input/card/nav with ALL variants + ALL states
6. Motion — duration scale, easing rules, prefers-reduced-motion strategy
7. Elevation — shadow system (light), bg-color elevation (dark), z-index scale
8. Do's and Don'ts — 10 rules for THIS product, each traced to evidence
9. Responsive — behavior at 375/768/1024/1280/1440px
10. Anti-Patterns — industry violations, AI slop checks this design passes
```

**Present to user. Wait for approval. No code until approved.**

---

# PHASE 5: CODE GENERATION

After DESIGN.md approved:

1. CSS custom properties (`:root` tokens) — call `design_tokens_generate`
2. Base layout — grid + spacing
3. Typography — apply scale
4. Components — with ALL states (default, hover, active, focus, disabled, loading)
5. Motion — after layout correct
6. Responsive — mobile-first
7. Accessibility — focus, ARIA, touch targets
8. Final audit — run against anti-pattern checklist + pre-delivery checks

---

# QUALITY GATES (5)

| Gate | Test | Fail = |
|---|---|---|
| **Personality** | Emotional target in one sentence? | AI slop |
| **Industry** | Follows `designer_get_industry_rules`? | Contextual failure |
| **Anti-Pattern** | Zero matches from fingerprint list? | Fix first |
| **Accessibility** | Passes all P1 rules? | Not shippable |
| **DESIGN.md** | Coherent DESIGN.md writable from output? | Generated, not designed |

---

# PRE-DELIVERY CHECKLIST

## Visual Quality
- [ ] No AI purple as default
- [ ] Weight contrast (heading != body)
- [ ] Warm/cool neutrals committed
- [ ] Near-black + near-white (not pure)
- [ ] All spacing = 4px multiples
- [ ] Consistent radius per component type

## States
- [ ] Hover on all interactive elements
- [ ] Focus ring (2px) on all interactive elements
- [ ] Loading state for every async operation
- [ ] Error state for every form input
- [ ] Empty state for every data container
- [ ] Disabled: opacity 0.5 + pointer-events none

## Accessibility
- [ ] Body contrast >= 4.5:1 (both modes)
- [ ] Touch targets >= 44px
- [ ] prefers-reduced-motion implemented
- [ ] No color-only indicators
- [ ] All images have alt text
- [ ] Skip links present
- [ ] Semantic HTML (nav, main, button, a href)
- [ ] Heading hierarchy sequential

## Responsive
- [ ] Tested at 375, 768, 1024, 1440px
- [ ] Content max-width constraint
- [ ] No horizontal scroll on mobile
- [ ] Prose max-width: 65ch
- [ ] dvh not vh for mobile full-height

## Motion
- [ ] No > 500ms UI transitions
- [ ] No linear easing
- [ ] Only transform + opacity animated
- [ ] No decorative bounce/pulse
- [ ] Exits faster than entrances

## Code
- [ ] No emojis as icons (SVG only)
- [ ] cursor: pointer on clickable elements
- [ ] No arbitrary z-index
- [ ] Images have aspect-ratio or dimensions
- [ ] No Figma absolute/relative dump
- [ ] No form clearing on error

---

# INTEGRATION CONTRACTS

Explicit handoffs between designer and other hyperstack skills/plugins. Each contract specifies what data flows, in what format, and what the consumer does with it.

## Upstream: How designer gets invoked

### From `hyperstack:blueprint`
**Trigger:** User request contains visual/UX intent
**Input:** Raw user request + any codebase context from blueprint Step 1
**Contract:** Blueprint Step 2 routes visual tasks here instead of running Steps 4-6 locally
**Return:** Approved DESIGN.md path

### From `hyperstack` (root orchestrator)
**Trigger:** Phase 2 (Reasoning) detects visual work
**Input:** Raw user request
**Contract:** Root skill's Phase 2 routes here before engineering-discipline for any visual task

### From user direct invocation
**Trigger:** User says "design", "build me a", "landing page", "DESIGN.md", or any visual phrase
**Input:** Product description
**Contract:** Run full pipeline starting at Phase 1

## Downstream: What designer hands off

### To `hyperstack:forge-plan` (primary consumer)
**Trigger:** After Phase 4 (DESIGN.md approved by user)
**Output:** File at `docs/DESIGN.md` or `<project>/DESIGN.md`
**Contract:** forge-plan reads the 10 sections of DESIGN.md and generates tasks per section:
  - Section 2 (Color) → task: generate CSS custom properties via `design_tokens_generate`
  - Section 3 (Typography) → task: set up font loading + type scale
  - Section 4 (Spacing) → task: configure Tailwind spacing tokens
  - Section 5 (Components) → tasks: one per component, call `shadcn_get_component` for each
  - Section 6 (Motion) → task: call `motion_generate_animation` with DESIGN.md motion spec
  - Section 7 (Elevation) → task: define shadow tokens
  - Section 9 (Responsive) → tasks: breakpoint-specific overrides
  - Section 8 (Do's/Don'ts) → assertions embedded in every task's self-review

**Invocation:** After user approves DESIGN.md, say: *"DESIGN.md approved and saved at `<path>`. Invoking `hyperstack:forge-plan` with this as input spec."*

### To `shadcn` MCP plugin (for component code)
**Trigger:** When forge-plan processes a component section of DESIGN.md
**Call pattern:**
```
For each component in DESIGN.md Section 5:
  shadcn_list_components               → find matching shadcn primitives
  shadcn_get_component(name)            → fetch source code
  shadcn_get_rules()                    → get composition rules
  shadcn_get_snippet(name)              → get usage example
```
**Contract:** shadcn returns Base UI + Tailwind v4 component code that matches the DESIGN.md's variants, states, sizes.

### To `motion_generate_animation` MCP tool
**Trigger:** DESIGN.md Section 6 specifies motion level != "static"
**Call pattern:**
```
motion_generate_animation({
  description: "<from DESIGN.md Section 6>",
  durations: { fast: "150ms", normal: "200ms", slow: "300ms" },  // from DESIGN.md
  easing: "ease-out",  // from DESIGN.md
  prefersReducedMotion: true  // always
})
```
**Contract:** Returns Framer Motion JSX code ready to paste into components.

### To `design_tokens_generate` MCP tool
**Trigger:** DESIGN.md Section 2-4 contains OKLCH values and token definitions
**Call pattern:**
```
design_tokens_generate({
  description: "<extracted from DESIGN.md>",
  brand: <from DESIGN.md Section 2>,
  neutral: <from DESIGN.md Section 2>,
  typography: <from DESIGN.md Section 3>,
  spacing: <from DESIGN.md Section 4>,
})
```
**Contract:** Returns complete Tailwind v4 CSS with `@theme`, `:root`, `.dark` blocks.

### To `hyperstack:behaviour-analysis` (validation loop)
**Trigger:** After implementation is complete, before ship-gate
**Input:** DESIGN.md path + implementation code paths
**Contract:** behaviour-analysis uses DESIGN.md as the "expected behaviour" ground truth for its interaction matrix:
  - Section 5 (Components) → expected states per component
  - Section 6 (Motion) → expected timing/easing
  - Section 8 (Do's/Don'ts) → assertions to verify
  - Section 10 (Anti-patterns) → violations to search for

### To `hyperstack:ship-gate` (compliance check)
**Trigger:** Before completion claim
**Input:** DESIGN.md path + git diff
**Contract:** ship-gate verifies:
  - All DESIGN.md Section 5 components have ALL required states implemented
  - DESIGN.md Section 10 anti-patterns are absent from the code
  - OKLCH tokens from DESIGN.md Section 2 are present in CSS
  - `prefers-reduced-motion` implemented (DESIGN.md Section 6)

## Reverse Escalation (allowed back-edges)

### From `forge-plan` back to `designer`
**Trigger:** forge-plan discovers a visual gap mid-plan (section of DESIGN.md is ambiguous, or new component needed that wasn't in DESIGN.md)
**Action:** forge-plan pauses, invokes designer with the specific gap, appends the result to DESIGN.md, resumes

### From `behaviour-analysis` back to `designer`
**Trigger:** Implementation passes heuristics but DESIGN.md expected-behavior is unclear or contradictory
**Action:** Escalate to designer with the contradiction, user resolves, DESIGN.md updated

### From `ship-gate` back to `designer`
**Trigger:** ship-gate finds a DESIGN.md compliance failure that isn't a code bug (e.g., DESIGN.md specifies something that can't be built in the chosen framework)
**Action:** Re-enter designer to revise DESIGN.md Section 11 (framework/stack constraints)

---

## Announcement Protocol

Per `using-hyperstack` iron law: Every skill invocation must be announced.

When invoked: *"Using hyperstack:designer — producing DESIGN.md contract for [task type]."*
When handing off: *"DESIGN.md complete at [path]. Invoking hyperstack:forge-plan with this as input spec."*
When escalating back: *"[from-skill] escalating to designer — [reason]."*
