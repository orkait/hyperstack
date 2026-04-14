---
name: designer
category: domain
description: >-
  Evidence-based design decision engine. Intention gate that produces non-slop
  UI/UX by forcing every visual choice through industry context, cognitive science,
  design master principles, and anti-pattern detection before code generation.
  Outputs DESIGN.md contract all subsequent implementation must follow.
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
references:
  - references/design-md-template.md
  - references/website-experience-cheatsheet.md
  - examples/saas-dashboard.md
  - examples/developer-tool.md
  - examples/ecommerce-checkout.md
---

# Designer Skill — Intention Gate

> AI UIs all look same because AI skip decision process, jump to code.
> Skill force every design decision through evidence before code generation.
> No visual code until DESIGN.md contract produced and approved.

## IRON LAW

```
NO VISUAL CODE WITHOUT APPROVED DESIGN.md
```

Single line JSX, CSS, or styling → no DESIGN.md → BREAKING THIS RULE. No exceptions. "Simple button" still needs personality, color, state decisions.

## HARD GATE

```
DO NOT GENERATE VISUAL CODE UNTIL:
  1. Intent extracted (Phase 1)
  2. MCP tools consulted (Phase 2)
  3. Anti-patterns checked (Phase 3)
  4. DESIGN.md generated + presented (Phase 4)
  5. User approved DESIGN.md
```

## 1% RULE

1% chance task involves new page/view, new component, changing look/feel/motion/interaction, landing page, dashboard, form, data display, "make it look like X", "redesign" → invoke skill BEFORE writing any code.

**Apply when:** task changes how something **looks, feels, moves, or is interacted with.**
**Skip when:** pure backend, single CSS bug fix (same colors/spacing), adding to existing design system with established tokens, perf optimization no visual change, infrastructure.

## RED FLAGS — STOP

| Thought | Reality |
|---|---|
| "Small component, no full DESIGN.md needed" | Wrong decisions ship. Design it. |
| "I'll use default shadcn styles" | Unexamined defaults = AI slop. |
| "User said 'just make it work'" | Means "make sense visually." Needs design. |
| "I know what SaaS dashboard looks like" | Know AI-slop version. Designer prevents that. |
| "I'll fix design after user sees code" | AI slop fingerprint sticky. Users stop caring first. |
| "MCP tools overkill" | You don't decide. Call them. |
| "I'll generate DESIGN.md after coding" | Post-hoc justification ≠ design. Design FIRST. |
| "User iterating fast, no time for gate" | Speed ≠ permission to ship slop. Gate first. |
| "Quick mockup only" | Quick mockups become shipped products. |
| "Figma has design, I'll translate" | No design resolution = absolute/relative dump. |
| "I'll pick colors as I go" | How AI slop made. Pick deliberately. |
| "Dark mode = invert light mode" | No. Exact anti-pattern this skill prevents. |
| "Skill is slow" | 2 min. Wrong design = 2 weeks to undo. |

---

## Position in Hyperstack Workflow

```
user request → blueprint (visual routing) → designer (THIS) → DESIGN.md
                                                                    ↓
                                                               forge-plan → execution → ship-gate → deliver

Downstream: forge-plan, shadcn-expert, motion_generate_animation, design_tokens_generate, behaviour-analysis, ship-gate
Reverse escalation: forge-plan → designer (gap), behaviour-analysis → designer (unclear), ship-gate → designer (compliance fail)
```

## Three-Layer Stack

| Layer | Plugin | Question | Tools |
|---|---|---|---|
| Decision | `designer` (this) | Which design? | 17 MCP tools |
| Rules | `ui-ux` | What principles? | 6 MCP tools |
| Values | `design-tokens` | What exact CSS? | 7 MCP tools |
| Components | `shadcn` | Which components? | 4 MCP tools |
| Motion | `motion` | Exact animation code? | 7 MCP tools |

---

## Website Experience Non-Negotiables

Every DESIGN.md must resolve these 7:

1. **Primary path** — user's main JTBD + single primary action
2. **Information scent** — "Where am I, what can I do, what happens next?"
3. **State coverage** — loading, empty, error, success, disabled, destructive
4. **Form/auth friction** — labels persistent, validation humane, paste allowed, password managers supported
5. **Performance budget** — LCP, INP, CLS, payload-sensitive media targets
6. **Accessibility floor** — focus visibility, focus not obscured, target size, reduced motion, keyboard usage
7. **Responsive content priority** — what survives first on mobile, what deferred

Use [website-experience-cheatsheet](references/website-experience-cheatsheet.md).

## User Preferences Override Defaults

Priority order:
1. Explicit user preferences + constraints
2. Existing workspace reality (framework, component lib, design system, tokens, frontend patterns)
3. Approved product/brand requirements
4. Designer auto-resolved defaults

User says "use these colors", "keep current design system", "match this app shell", "no shadcn" → preference wins.

---

# PHASE 1: INTENT EXTRACTION

Two modes. Default **Base** unless user says "advanced" or "detailed."

## Base Mode (3 Questions + Confirm)

**Step 0:** Existing project → inspect workspace: framework, package manifests, component lib, token system, core frontend files, explicit visual prefs in repo.

**Step 1:** Call `designer_resolve_intent(product_description)`. Auto-detects: industry, personality, style, mode, density, color mood, must-haves, never-uses.

**Step 2:** Ask 3 essential questions:

| # | Question | Why |
|---|---|---|
| 1 | What is product? (1 sentence) | Everything derives from this |
| 2 | Brand color? (hex, name, or "generate") | Can't guess brand |
| 3 | What sections/pages to build? | What to implement |

**Step 3:** Present auto-resolved defaults as suggestions. Ask if user prefs or workspace patterns override. Offer: *"Say 'advanced' for full control, or pick preset to start."*

## Presets (Fast Start)

User says "make it feel like Linear" or "start from Stripe" → `designer_get_preset(name)`, use as DESIGN.md foundation, customize brand color only.

| Preset | Best For | Key Trait |
|---|---|---|
| `linear` | SaaS, productivity | Opacity hierarchy, 8px grid, 150ms |
| `stripe` | Payment, docs, premium SaaS | Weight 300/500, CIELAB contrast |
| `vercel` | Dev tools, technical | -0.04em tracking, zero chromatic bias |
| `apple` | Consumer, mobile-first | 17px body, spring physics, 44pt targets |
| `carbon` | Enterprise, regulated | Zero radius, IBM Plex, WCAG AA |
| `shadcn` | React + Tailwind | OKLCH, opacity borders, brand-agnostic |
| `notion` | Content, editorial | Warm cream bg, serif headings, 65ch prose |
| `supabase` | Dev tools, dark-first | Emerald on black, compact, code-native |
| `figma` | Creative tools, startups | Multi-color, spring animations, vivid |

Call `designer_list_presets` to show all. Preset fills Sections 1-7 automatically. Customize: brand color, sections/pages, industry do's/don'ts.

## Advanced Mode (12 Questions)

Call `designer_resolve_intent` first. Show suggested default per question. Present in batches of 3-4 (Hick's Law).

**Q1:** Product? (1 sentence) → determines industry, anti-pattern set, style priority

**Q2:** Primary user?
| User Type | Defaults |
|---|---|
| Developer | Dark default, monospace accents, keyboard-first, compact |
| Consumer | Light default, friendly typography, mobile-first, comfortable |
| Enterprise | Structured, conservative, data-dense, normal density |
| Child | Playful, 48px+ targets, high contrast, claymorphism |
| Creative | Rich motion, bold colors, portfolio-native |
| Healthcare | Calm, AAA, large text, minimal motion |

**Q3:** Emotional target?
| Target | Visual Direction |
|---|---|
| Trustworthy | Professional palette, serif/clean sans, conservative radius |
| Playful | Vivid colors, 16-24px radius, spring animations |
| Premium | -0.02em+ tracking, generous whitespace, single accent, subtle shadows |
| Energetic | C 0.15+, 32px+ headings, rich motion |
| Calm | Muted palette, warm neutrals, generous lh, minimal motion |
| Technical | Dark default, monospace accents, compact, snappy motion |
| Bold | Max contrast, large type, strong color blocks |
| Editorial | Serif headings, 18px body 1.75lh, warm bg |

**Q4:** Light or dark default? Product decision, not preference. Developer tools → dark. Marketing → light. Editorial → light. Gaming → dark.

**Q5:** Brand color? Given: extract hue, derive OKLCH ramp (11 stops). "generate": pick from industry color mood.
| Industry | Color Mood |
|---|---|
| SaaS | Trust blue + single accent |
| Healthcare | Calm blue + health green |
| Fintech | Navy + trust blue + gold |
| Luxury | Black + gold, minimal |
| AI/Tech | Neutral + one distinct (NOT #6366F1) |
| Education | Friendly pastels, warm accents |
| Wellness | Earth tones, sage, soft coral |

**Q6:** Density?
| Mode | Section Padding | Card Padding | Body | Use |
|---|---|---|---|---|
| Comfortable | 96px | 40px | 18px | Marketing, editorial, consumer |
| Normal | 64px | 28px | 16px | SaaS, dashboards, apps |
| Compact | 48px | 20px | 14px | Data tables, admin, dev tools |

**Q7:** Style? minimalism / glassmorphism / soft-ui / dark-oled / vibrant-block / claymorphism / aurora-ui. "recommend": resolved from industry + emotional target.

**Q8:** Font personality?
| Personality | Pairing | Use |
|---|---|---|
| Technical | Geist + Geist Mono | Dev tools, SaaS, dashboards |
| Elegant | Cormorant + Montserrat | Luxury, editorial, premium |
| Friendly | Plus Jakarta Sans + mono | Consumer, education, SaaS |
| System | Inter (or system stack) | Universal |
| Editorial | Playfair Display + Lora | Content, blogs, news |

**Q9:** Motion level?
| Level | Includes |
|---|---|
| Static | No animations |
| Subtle | Hover states + transitions (150-200ms) |
| Moderate | + scroll reveals, micro-interactions (200-300ms) |
| Rich | + parallax, page transitions, animated bg (300-500ms) |

Always respects `prefers-reduced-motion`.

**Q10:** Sections/pages? Landing: Hero, Features, Testimonials, CTA, Footer, Pricing, FAQ. Dashboard: Sidebar, Header, Content, Data panels.

**Q11: Framework + Component Library (TWO sub-questions):**

Q11a Framework: React + Tailwind v4 / Next.js + Tailwind v4 / Vue + Tailwind / Svelte + Tailwind / HTML + Tailwind / Other

Q11b Component Library:
- **shadcn/ui (Base UI)** → invokes `hyperstack:shadcn-expert`, uses `shadcn_*` MCP tools
- **Raw Tailwind** → hand-built from DESIGN.md, no lib
- **MUI / Mantine / Chakra / Ant Design** → use library's own docs (no hyperstack plugin)
- **Custom / existing** → read user's components, match patterns
- **Ask me to recommend** → recommend shadcn/ui for React+Tailwind, or raw Tailwind for max control

**DO NOT assume shadcn by default.** Ask explicitly. Libraries have incompatible architectures.

Routing: `shadcn/ui` → `hyperstack:shadcn-expert` | `Raw Tailwind` → forge-plan hand-writes | `Other` → library's own docs, flag to user | `Custom` → read existing first

**Q12:** Constraints? WCAG AA (default) or AAA. Performance budget (< 150KB JS, < 2s load). Dark mode required. Brand keywords.

**Do NOT proceed to Phase 2 until Q1, Q5, Q10 answered.**

---

# PHASE 2: DESIGN SYSTEM RESOLUTION

Every MCP call fills specific DESIGN.md section. No call without purpose.

## Core Calls (Every Design Task — 4 calls, run in parallel)

### Call 1: `designer_resolve_intent(product_description)`
**FILLS:** All sections (defaults)
**PURPOSE:** Auto-detects industry, personality, style, mode, density, color mood, must-haves, never-uses.
**USE:** Set defaults for entire DESIGN.md. Present to user in Phase 1.

### Call 2: `designer_get_personality(resolved_cluster)`
**FILLS:** Sections 1, 2, 3, 4, 6, 7
**PURPOSE:** Concrete visual vocabulary — tracking, radius range, shadow style, motion timing, density, CSS example. Single most important data source.
**USE:** Set every visual property. Personality vocabulary IS design system skeleton.

### Call 3: `designer_get_page_template(page_type)`
**FILLS:** Sections 5, 9
**PURPOSE:** Section anatomy with component inventory + cognitive laws for this page type.
**USE:** Define sections to build, components each needs, responsive behavior.

### Call 4: `designer_get_anti_patterns(industry: resolved_industry)`
**FILLS:** Sections 8, 10
**PURPOSE:** Specific violations this industry must avoid.
**USE:** Write Do's/Don'ts + anti-pattern checklist. Every "Don't" must come from this list.

## Context Calls (Only When Product Needs Them)

NOT routine. Call ONLY when product has these specific features:

| Product Feature | Call | FILLS | WHY (what decision changes) |
|---|---|---|---|
| Landing page | `designer_get_landing_pattern("hero-section")` | S5 | Conversion stats change hero layout: value prop 3s, CTA above fold, 40-80px bleed |
| Landing page | `designer_get_landing_pattern("section-ordering")` | S5 | Unbounce 41K pages: Hero→Proof→Problem→Features→Testimonials→Pricing→FAQ→CTA |
| Landing page | `designer_get_landing_pattern("social-proof")` | S5 | Named metrics (+30-70%) vs logos (+260%) vs badges (+55%) |
| Landing page | `designer_get_landing_pattern("cta-optimization")` | S8 | First-person CTAs +90%, single CTA +266%, "no credit card" +34% |
| Pricing page | `designer_get_landing_pattern("pricing-psychology")` | S5 | Ariely decoy: 3 tiers, highlight middle, expensive first |
| Forms | `designer_get_interaction_pattern("form-design")` | S5 | Validation timing (blur not input), label placement (top not placeholder) |
| Navigation | `designer_get_interaction_pattern("navigation")` | S5 | Hamburger 39% slower on desktop (NNG). Tab bars +58% engagement. |
| Onboarding | `designer_get_interaction_pattern("onboarding")` | S5 | 3-5 checklist items > 8+. Interactive > passive. |
| Data tables | `designer_get_interaction_pattern("skeleton-vs-spinner")` | S6 | Skeleton for known structure, spinner for discrete actions |
| Error handling | `designer_get_ux_writing("error-messages")` | S8 | NNG rubric: what happened + why + how to fix |
| CTAs/buttons | `designer_get_ux_writing("button-labels")` | S8 | "Start my trial" +90% vs "Start your trial" |
| Premium feel | `designer_get_design_system("stripe")` or `("vercel-geist")` | S1 | Stripe weight 300/500, Vercel -0.04em tracking |
| Enterprise | `designer_get_design_system("ibm-carbon")` | S1 | Carbon 12px spacing-04, IBM Plex, a11y-first |

## Token Calls (Phase 5 only — when generating code)

Do NOT call during design resolution:
```
design_tokens_get_category("colors")     → OKLCH ramp construction
design_tokens_get_category("typography") → type scale token defs
design_tokens_get_category("spacing")    → 4px grid token defs
design_tokens_generate(description)      → complete Tailwind v4 CSS
```

---

# PHASE 3: CONSTRAINT APPLICATION

Cross-reference every decision against rules below. P1 → P10. Higher = fix first.

## P1: Accessibility (CRITICAL)

| Rule | Standard | Avoid |
|---|---|---|
| `contrast-body` | 4.5:1 body (AA); 7:1 AAA | Testing light mode only |
| `contrast-large` | 3:1 for ≥18px bold or ≥24px | Assuming brand colors pass |
| `contrast-ui` | 3:1 UI components, borders, icons | Low-contrast borders in dark |
| `focus-rings` | 2px ring, 2px offset, primary color, ALL interactive | `outline: none` without replacement |
| `touch-targets` | 44x44px min (WCAG); 48x48px recommended; 8px gap | Targets < 44px mobile |
| `color-not-only` | Color + icon/text for every state | Red border as sole error indicator |
| `reduced-motion` | `prefers-reduced-motion: reduce` with `!important` in `@layer base` | Missing media query |
| `keyboard-nav` | Tab order = visual order; Enter/Space activates; Escape closes | Unreachable interactive elements |
| `skip-links` | `<a href="#main">Skip to main content</a>` first body element | No skip link on nav-heavy pages |
| `alt-text` | Descriptive for informational; `alt=""` decorative | `alt="image"` or missing |
| `aria-labels` | `aria-label` on icon-only buttons | Unlabeled icon buttons |
| `heading-hierarchy` | Sequential h1→h2→h3, no skipping | h1 → h3 |
| `zoom-support` | Works at 400% zoom; never `user-scalable=no` | Disabling pinch-to-zoom |
| `semantic-html` | `<nav>`, `<main>`, `<button>`, `<a href>` | `<div onclick>` |

## P2: Touch & Interaction (CRITICAL)

| Rule | Standard | Avoid |
|---|---|---|
| `hover-states` | All interactive = visible hover feedback | Silent no-ops |
| `cursor-pointer` | `cursor: pointer` on all clickable | Clickable divs without cursor |
| `loading-feedback` | Spinner/skeleton ALL async > 300ms | Frozen UI |
| `hover-vs-tap` | `@media (hover: hover)` for hover; click/tap for primary | Features only via hover |
| `disabled-states` | `opacity: 0.5` + `pointer-events: none` + `aria-disabled` | Disabled still clickable |
| `empty-states` | Headline + copy + CTA, every empty container | Blank screen |
| `error-feedback` | Inline message + summary at top (identical wording) | "Something went wrong" |
| `tap-feedback` | Visual feedback < 100ms of tap | No visual response |
| `gesture-alternative` | Every gesture = visible button equivalent | Gesture-only actions |
| `safe-area` | Primary targets away from notch, gesture bar, edges | Content under OS chrome |

## P3: Layout & Responsive (HIGH)

| Rule | Standard | Avoid |
|---|---|---|
| `mobile-first` | Mobile styles first; override with `min-width` | Desktop-first `max-width` |
| `breakpoints` | 375 / 768 / 1024 / 1280 / 1440px | Arbitrary device breakpoints |
| `content-max-width` | `max-width: 1280px` page; `65ch` prose | Full-width paragraphs on ultrawide |
| `4px-grid` | ALL spacing = multiples of 4px | 11px, 17px, 23px |
| `spacing-hierarchy` | Space within groups < space between groups | Same padding everywhere |
| `z-index-scale` | dropdown(1000) sticky(1020) modal(1050) tooltip(1070) toast(1080) | `z-index: 9999` |
| `aspect-ratio` | `aspect-ratio` or `width`+`height` on all images | Images without dimensions (CLS) |
| `sticky-offset` | Fixed/sticky nav → `padding-top: nav-height` on body | Nav covering first section |
| `viewport-units` | `min-h-dvh` not `100vh` mobile | `100vh` (broken iOS) |
| `12-col-grid` | 12 col, 24px gutters desktop, 16px mobile, 48-64px margins | No grid system |
| `no-horizontal-scroll` | Content fits viewport width | Horizontal scroll mobile |

## P4: Typography (HIGH)

| Rule | Standard | Avoid |
|---|---|---|
| `type-scale` | Ratio: 1.25 compact / 1.333 standard / 1.414 dramatic | Random sizes (17px, 23px) |
| `body-fixed` | Body 16px fixed; NEVER fluid `clamp()` | `clamp()` on body (causes reflow) |
| `heading-fluid` | Headings use `clamp()` | Fixed heading sizes |
| `line-height-invert` | Display 1.05-1.15; Heading 1.2-1.3; Body 1.5 app / 1.6-1.75 prose | Same lh everywhere |
| `tracking` | Headings -0.01 to -0.03em; Body 0; Overlines +0.06 to +0.10em | Negative tracking on body |
| `weight-contrast` | Heading 600-800, body 400 | `font-weight: 500` everywhere |
| `max-2-families` | Sans + mono for apps; serif + sans for editorial | 3+ families |
| `prose-width` | `max-width: 65ch` on body text | Full-width text |
| `fallback-stack` | `ui-sans-serif, system-ui, sans-serif` always | Missing fallbacks |
| `readable-mobile` | 16px min body mobile (avoids iOS auto-zoom) | 14px body mobile |

## P5: Color System (HIGH)

| Rule | Standard | Avoid |
|---|---|---|
| `oklch` | OKLCH for all design tokens | Hex/HSL for design systems |
| `no-pure-bw` | Near-black `oklch(0.12-0.15 0.005 H)` + near-white `oklch(0.97-0.99 0.005 H)` | Pure #000 on #FFF |
| `warm-cool-commit` | Commit to warm OR cool neutrals; never mix | Warm bg + cool borders |
| `semantic-tokens` | 3-layer: primitive ramps → semantic tokens → Tailwind bridge | Raw hex in components |
| `dark-mode` | Redesign, don't invert. Warm charcoal bg. Lighter surfaces per elevation. | Inverting light mode |
| `status-colors` | Success/error/warning/info each with solid + soft variant; L ~0.55 for AA | Same color for both variants |
| `no-ai-purple` | Custom brand hue, not #6366F1 | AI purple as unconscious default |
| `chart-tokens` | Dedicated `--chart-*` tokens separate from `--primary` | Reusing brand for charts |
| `shadow-tint` | Warm-tinted oklch shadows, never `rgba(0,0,0,...)` | Cold black shadows |
| `dark-elevation` | Progressively lighter bg per level | Box shadows in dark mode |
| `color-dark-mode-test` | Test contrast separately in dark mode | One-mode testing |

## P6: Motion & Animation (MEDIUM)

| Rule | Standard | Avoid |
|---|---|---|
| `duration-scale` | 100-150ms hover; 200ms default; 300ms panel; 400-500ms complex | > 500ms UI transitions |
| `exit-faster` | Exit 50-100ms shorter than enter | Same duration enter/exit |
| `easing` | ease-out (enter), ease-in (exit), ease-in-out (reposition) | Linear easing |
| `gpu-only` | Animate only `transform` and `opacity` | width/height/top/left |
| `no-decorative` | Animation must serve information | `animate-bounce` on static icons |
| `max-2-animated` | Max 2 animated elements per viewport | 6 elements animating on load |
| `spring-context` | Spring/bounce only for playful/consumer | Bounce in enterprise |
| `interruptible` | User gesture cancels in-progress animation | Blocked input during animation |
| `stagger-sequence` | Stagger list entrance 30-50ms per item | All items appear simultaneously |

## P7: Components (MEDIUM)

| Rule | Standard | Avoid |
|---|---|---|
| `all-states` | Every component: default, hover, active, focus, disabled, loading | Missing states |
| `button-loading` | Spinner replaces text, same width (no CLS) | Width changing |
| `input-labels` | Visible persistent label above input | Placeholder-as-label |
| `input-validation` | Validate on blur; real-time only when correcting | Validating on focus |
| `password-toggle` | Show/hide with text label; never disable paste | Paste disabled |
| `empty-state` | Headline + copy + single CTA | "No data" |
| `icon-system` | SVG icons (Lucide/Heroicons/Phosphor), never emojis | Emojis as icons |
| `confirmation` | Title = action question; buttons = specific verbs | "Are you sure?" / "OK" |
| `error-messages` | What happened + why + how to fix; never blame user | "Error 403" |
| `nav-active` | Current page visually indicated | No active indicator |
| `consistent-radius` | Same radius per component type | Mixing 4px and 24px |
| `elevation-consistent` | Consistent shadow/elevation scale | Random shadow values |

## P8: UX Writing (MEDIUM)

| Rule | Standard | Avoid |
|---|---|---|
| `button-labels` | Verb + object: "Download report", "Add to cart" | "Submit", "Click here", "OK" |
| `first-person-cta` | "Start my trial" > "Start your trial" (+90% ContentVerve) | Second-person CTAs |
| `single-cta` | One primary CTA per view (+266% conversions) | Multiple competing CTAs |
| `plain-language` | Grade 4-6, max 25 words/sentence | "Purchase", "Commence" |
| `sentence-case` | Sentence case headings | Title Case Everywhere |
| `specific-headlines` | "3 items in your cart" | "Almost there!" |
| `loading-copy` | < 2s spinner; 2-10s "Saving..."; 10s+ progressive | "Loading..." for everything |
| `no-blame` | "That password doesn't match" | "You entered wrong password" |
| `no-clear-on-error` | Preserve all user input on error | Clearing form on error |
| `inclusive-language` | "select" not "click"; "they/their"; "primary/subordinate" | "click", "master/slave" |

## P9: Landing Page Conversion (MEDIUM)

| Rule | Evidence | Standard |
|---|---|---|
| `hero-3sec` | NNG: 57% viewing time above fold | Value prop in 3 seconds |
| `false-floor` | NNG: 102% more views above fold | Bleed 40-80px of next section |
| `section-order` | Unbounce 41K pages | Hero→Proof→Problem→Features→Testimonials→Pricing→FAQ→CTA→Footer |
| `social-proof` | TrustRadius: 30-70% lift | Named metrics > logos > badges |
| `pricing-3tier` | ProfitWell 12K SaaS | 3 tiers, highlight middle, expensive first |
| `trust-signals` | 61% didn't buy without seals | Trust signal near every CTA |
| `page-speed` | Google: 1s→3s = +32% bounce | Sub-2s; AVIF > WebP > JPEG |
| `cta-above-fold` | HubSpot 40K pages: +30% | CTA above fold, repeated after sections |
| `grade-5-7` | Unbounce: +56% vs grade 8-9 | Copy at grade 5-7 |
| `form-fields` | Baymard: -4-6% per field beyond 8 | Max 7-8 fields |
| `mobile-cta` | 82.9% mobile traffic | Sticky CTA bar, thumb-zone placement |

## P10: Charts & Data (LOW)

| Rule | Standard | Avoid |
|---|---|---|
| `right-align-numbers` | Right-align quantitative data in monospace | Left-aligned numbers |
| `table-row-hover` | Subtle bg highlight on row hover | No row tracking |
| `table-pagination` | Pagination > infinite scroll | Infinite scroll on tables |
| `fixed-headers` | Freeze row/col headers during scroll | Scrolling headers |
| `no-rainbow` | Viridis/Okabe-Ito; max 8 categories | Rainbow colormap |
| `data-ink` | Erase elements without info loss (Tufte) | Gridlines dominating data |
| `chart-a11y` | Color + pattern/shape; provide table alternative | Color-only encoding |

---

# PERSONALITY ATLAS

> Source: 58 real company design systems. Design = communication before aesthetics.

```
Layer 1: Personality → what does product say about itself?
Layer 2: Language    → what visual vocabulary carries that?
Layer 3: Rules       → what constraints enforce it consistently?
```

## 1. Premium Precision
**Communicates:** "Engineered by people who care about every pixel."
**Exemplars:** Linear (tight type -0.03em, 3-variable color, opacity hierarchy), Vercel (black+white, Geist -0.04em, 96-128px sections), Apple (SF Pro 44pt targets, Clarity/Deference/Depth), Stripe (weight 300/500, CIELAB 5-step = 4.5:1)

| Property | Value | Why |
|---|---|---|
| Colors | Mono + single accent | Multiple colors compete. One directs. |
| Typography | -0.02 to -0.03em headings, weight 300-600 | Tight = deliberate. Low weight = restraint. |
| Radius | 0-8px | Sharp = engineered. |
| Shadows | None or ultra-subtle | Precision demands lightness. |
| Motion | 200-250ms, ease-out, no bounce | Motion serves info, not personality. |
| Density | Normal | Balanced. |
| Default | Light | Content visibility. |

**Use:** SaaS, dev tools (light), docs, B2B. **Never:** Children's, gaming, playful.

## 2. Technical Developer
**Communicates:** "Built by developers, for developers."
**Exemplars:** Supabase (dark emerald, code-first), Warp (IDE-like, terminal IS product), Cursor (sleek dark, keyboard-first), Raycast (command palette is entire UX, every action < 100ms)

| Property | Value | Why |
|---|---|---|
| Colors | Dark bg (oklch 0.08-0.14), green/cyan accents | Dark reduces strain. Green/cyan = terminal convention. |
| Typography | Monospace for data, sans for UI chrome | Monospace = data. Sans = chrome. That IS hierarchy. |
| Radius | 4-8px | Functional middle. |
| Shadows | Glow on accent (0 0 20px oklch(accent / 0.15)) | Box shadows wrong on dark. Glow feels native. |
| Motion | 100-200ms, snappy | Devs notice 50ms lag. |
| Density | Compact (14px body, 48px sections, 20px cards) | Info density = feature. |
| Default | Dark | 8+ hours in dark IDEs. |

**Critical:** Command palette (Cmd+K) NOT optional for 50+ feature apps. Keyboard shortcuts on every action. Code blocks: syntax highlighting + copy button.

**Use:** Dev tools, CLIs, APIs, editors. **Never:** Consumer, marketing, healthcare, government.

## 3. Warm Editorial
**Communicates:** "Reading this should feel like opening a well-made book."
**Exemplars:** Notion (serif headings, cream bg, editor disappears), Airbnb (warm coral #FF5A5F, photography-driven, rounded-xl), Medium (serif body, 1.75lh)

| Property | Value | Why |
|---|---|---|
| Colors | Warm-tinted: oklch(0.98 0.012 78) not oklch(0.98 0 0) | 0.012 chroma at hue 78 = "premium notebook" not "cold SaaS". Highest-leverage single decision. |
| Typography | Serif or humanist sans, 18px body, 1.6-1.75 lh | Serif = trust. Larger body + generous leading = comfort. |
| Radius | 12-20px | Rounded = friendly (Gestalt). Cap 20px — beyond = childish. |
| Shadows | Warm-tinted (oklch(0.22 0.006 56 / 0.06)) | Cold rgba shadows disconnected on warm surfaces. |
| Motion | 200-300ms, ease-in-out, gentle | Spring/bounce = tonally wrong. |
| Density | Comfortable (96px sections, 40px cards, 18px body) | Reading requires breathing room. |
| Default | Light | Paper metaphor. |

**Use:** Content, editorial, consumer, hospitality. **Never:** Dev tools, data-dense, fintech.

## 4. Bold Energetic
**Communicates:** "We're confident and not afraid to stand out."
**Exemplars:** Figma (multi-color, each feature = own color), Framer (bold black + blue, motion-first), PostHog (playful dark, hedgehog branding)

| Property | Value | Why |
|---|---|---|
| Colors | 4-6 vivid, complementary/triadic, C 0.15+ | Energy requires contrast. Mono kills it. Cap 6 = chaos limit. |
| Typography | Display 700-900, 32px+, -0.02 to -0.03em | Large heavy type demands attention. That's the point. |
| Radius | 12-16px | Confident. Not sharp (cold) or super-round (childish). |
| Shadows | Colored (0 8px 24px oklch(brand / 0.10)) | Colored shadows reference brand. More expressive. |
| Motion | 200-400ms, spring (cubic-bezier(0.34, 1.56, 0.64, 1)) | Bold = bold motion. Under 400ms for UI. |
| Default | Light | Bold colors need light contrast. Dark mutes vibrancy. |

**Use:** Creative tools, startups, social, youth. **Never:** Banking, healthcare, government, B2B.

## 5. Cinematic Dark
**Communicates:** "This is an experience, not a tool."
**Exemplars:** ElevenLabs (audio waveform aesthetics define visual language), RunwayML (AI content IS hero, UI = invisible framing), SpaceX (full-bleed mission photography, futuristic through restraint)

| Property | Value | Why |
|---|---|---|
| Colors | Near-black (oklch 0.05-0.10), single neon accent | True black = 60% OLED power savings at 100% brightness. Single accent = Von Restorff focal. |
| Typography | Light weight 300-400 at large display, tight tracking | Light on dark = ethereal. Heavy on dark = oppressive. |
| Radius | 0-6px | Sharp = futuristic. Rounded adds warmth that conflicts. |
| Shadows | Glow (0 0 40px oklch(accent / 0.20)), no box-shadow | Shadows invisible on dark. Glow = native. |
| Motion | 400-600ms cinematic, parallax, ease-in-out | Speed destroys cinematic feel. ONLY personality where 500ms+ OK for reveals. |
| Density | Comfortable (120px sections) | Dense breaks immersive spell. Each section = "scene." |
| Default | Dark | Personality IS darkness. Light mode may not be appropriate. |

**Use:** Media, entertainment, gaming, music, AI creative. **Never:** Productivity, forms-heavy, government, healthcare.

## 6. Enterprise Trust
**Communicates:** "Your data is safe with us."
**Exemplars:** IBM Carbon (every component ships WCAG 2.1 AA, 3:1 focus ring), Coinbase (institutional blue, says "bank" not "startup"), Salesforce (Lightning system, complexity through structure)

| Property | Value | Why |
|---|---|---|
| Colors | Blue/navy (oklch 0.45-0.55 0.15-0.18 240-260), 1 brand + 1 accent | Blue = most cross-culturally consistent trust signal (Frontiers in Psychology, Goldstein 1942). |
| Typography | Formal sans (IBM Plex, Inter), 400 body, 600 heading | No serif (editorial), no display weight (startup). Moderate = structured. |
| Radius | 4-8px | Professional. 0px = brutalist. 12px+ = consumer. |
| Motion | 150-200ms, ease-out | 8+ hour workday. Decorative motion = distraction. |
| Default | Light | Institutional convention. |

**Trust signals required:** SOC2/ISO badges, uptime guarantees, SSO/SAML, audit logs, RBAC visible.

**Use:** B2B, fintech, healthcare management, gov tech. **Never:** Consumer, creative, gaming.

## Choosing Personality

Industry × user type × emotional target. Signals conflict → **industry wins** (harder constraint).

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

> Source: ui-ux-pro-max (161 rules), awesome-design-md (58 companies).

| Industry | Style | Color | Must | Never | Notes |
|---|---|---|---|---|---|
| SaaS | Soft UI | Trust blue + accent | Hover transitions, empty states, onboarding checklist (3-5 items) | Excessive animation, AI purple, > 2 accents | |
| Analytics/Dashboard | Minimalism | Neutral + Okabe-Ito/viridis | Data export, filtering, sortable tables, keyboard nav, monospace numbers, right-align quantities | Ornate design, rainbow colormaps | |
| Healthcare | Soft UI | Calm blue + green, C < 0.12 | **WCAG AAA**, 48px+ targets, crisis resources | Neon, motion-heavy, < 14px text, gamification w/o clinical validation | HIPAA: no PHI in URLs, session timeouts |
| Fintech | Minimalism | Navy + blue + gold | Security signals, trust badges near monetary actions, locale-aware number formatting, audit trail | Playful design, AI purple, unclear fees (FTC risk), animations on transactions | |
| Creative Agency | Vibrant Block | Bold, high chroma | Case studies, full-bleed imagery, scroll animations, portfolio grid | Corporate minimalism, stock photos, template layouts | |
| Developer Tool | Dark OLED | Dark + emerald/cyan | Code examples, keyboard shortcuts, Cmd+K, syntax highlighting, copy buttons | Heavy chrome, poor keyboard support, forced light default | Docs quality IS product quality |
| AI/Chatbot | Minimalism | Neutral + one accent (NOT #6366F1) | Streaming text < 100ms first token, typing indicators, code blocks + copy | Heavy chrome, AI purple default, anthropomorphized persona | |
| E-commerce (Luxury) | Minimalism | Black + gold | Product photography as hero, trust signals, size guides, guest checkout (26% abandon if forced account) | Block-based colorful, cheap discount badges | "complimentary shipping" not "FREE SHIPPING!!!" |
| Government | Minimalism | High contrast, institutional | **WCAG AAA**, skip links, grade 4-6 language, breadcrumbs, multi-language, print-friendly | Ornate, motion, decorative images, jargon | |
| Mental Health | Soft UI | Muted pastels, warm | Calm aesthetics, privacy-first, breathing room, crisis resources every screen | Neon, gamification, social pressure, dark default, aggressive notifications | |
| Education | Soft UI / Clay | Friendly pastels | Progress indicators, achievement feedback, clear nav, full a11y | Complex layouts, dense tables, dark default, small text | |
| Wellness | Soft UI | Earth tones, sage, coral | Calm, breathing space, warm photography, gentle CTAs | Dark default, aggressive motion, neon, dense layouts | |

For full detail: `designer_get_industry_rules(industry)`

---

# COGNITIVE LAWS (11)

> Source: Laws of UX, NNG, Smashing Magazine. Not opinions — empirically documented.

## Fitts' Law
`T = a + b * log2(2D/W)` — Halving distance > doubling size.
- Touch targets ≥ 44px (WCAG) / 48px (Material). Screen edges = infinite mouse targets, hardest for touch.
- Submit CTA at bottom of form (pointer already near last field). Destructive actions ≥ 8px from safe.
- **Violations:** Icon-only buttons (16px visual ≠ 44px target), Delete beside Save < 8px gap.

## Hick's Law
`RT = a + b * log2(n + 1)` — 2→4 choices costs more than 20→22. First added choices most expensive.
- Minimize choices at irreversible points. Wizard pattern for multi-step. Surface recommended option.
- Applies to decisions, not recognition. 15-item nav with clear categories = fine. 15-option modal = not.
- **Violations:** All features on first login, pricing with no highlighted plan, 50+ unsorted dropdowns.

## Miller's Law
7 ±2 chunks (Cowan 2001: 4 ±1 without rehearsal). Unit = chunk, not item.
- "(919) 555-2743" = 3 chunks vs "9195552743" = 10 items. 73% lower cognitive load.
- Auto-chunk numbers, max 7 nav items, group forms ≤ 5 fields/section.
- **Violations:** Flat 12+ item nav, unbroken reference codes, 20+ ungrouped settings.

## Gestalt Principles
**Proximity > Similarity > Closure > Continuity > Common Fate**
- **Proximity:** Label-input gap 4-8px < input-to-next-label 16-24px. Equal spacing = invisible structure.
- **Similarity:** All links share treatment. Primary ≠ secondary button weight.
- **Closure:** Partial card at viewport bottom = scroll hook. Skeleton screens exploit this.
- **Continuity:** Vertical form alignment. Zigzag layouts break scanning (NNG confirmed).
- **Common Fate:** Skeleton placeholders pulse at identical timing.

## Von Restorff Effect
ONE highlighted element per view. Multiple highlights cancel.
- One CTA. One recommended pricing plan. Red dot badge = only red in monochromatic UI.
- **Violations:** Multiple "highlighted" CTAs, 6 elements animating on load.

## Serial Position Effect
First (primacy) and last (recency) remembered most. Middle forgotten.
- Nav: important at edges. Pricing: recommended first or last. Onboarding: aha moment early, friction last.
- Form fields: easy first (name, email), hard middle (tax ID).

## F-Pattern (NNG: 232 users, 1.5M fixations)
Dense text → horizontal top sweep → shorter lower sweep → vertical left scan. Right side = near-zero. 80% viewing time on left half.
- Front-load sentences. "Billing settings" not "Settings for billing". H2/H3 every 200-300 words.

## Z-Pattern
Sparse visual pages (< 50 words). Logo top-left → trust top-right → diagonal → **CTA bottom-right** (terminal point).

## Jakob's Law
Users prefer sites to work like other sites. Radio = single, checkbox = multi, toggle = binary. Blue underline = link (-10-15% clicks without it). Cart top-right. Redesign: preview + opt-in + revert.

## Doherty Threshold (IBM 1982)
< 100ms instantaneous. 100-400ms immediate. **> 400ms flow breaks.** > 1s abandonment. > 10s gone.
- Optimistic UI. Skeleton > spinner. Autocomplete < 300ms. Keystroke-to-display < 50ms.

## Peak-End Rule (Kahneman 1993)
Remembered = avg(peak intensity + final moment). Duration neglect.
- Order confirmation = peak AND end (Mailchimp "High Five"). Onboarding completion = peak. Error recovery = peak management (Stripe specific messages). No-friction cancellation > dark-pattern 5-step.

**Cross-law interactions:**
- Hick + Serial Position on nav: fewer items + important at edges
- Fitts + Von Restorff on CTAs: large + visually isolated = compound positive
- Doherty + Peak-End: design loading reveal as positive peak
- Hick vs disclosure: < 20% usage = hide; 80%+ = visible

---

# VISUAL COMPOSITION

> Source: NNG (1.5M fixations, 57,453 fold fixations), A List Apart, Smashing Magazine

## Visual Hierarchy — 6 Levers (priority order)

1. **Size** — Bigger = more important. Max 3 size variations. Never equal size for different priorities.
2. **Contrast** — Squint test: blur 5-10px, primary action must be first visible.
3. **Color** — Warm/saturated advances, cool/muted recedes. Red = destructive only.
4. **Typography** — Weight is primary signal. Everything emphasized = nothing emphasized.
5. **Spacing** — More surrounding space = more attention. Use before borders/fills.
6. **Position** — Top-left = most attention. Optical center above mathematical center.

## CRAP Principles
- **Contrast:** If different, make VERY different. Same-same = no hierarchy.
- **Repetition:** All links same treatment. Consistency = implicit rules.
- **Alignment:** Left-align = simplest valid system. Never center multi-line paragraphs.
- **Proximity:** Label-input 4-8px. Form groups 24-32px. Sections 48-96px. Same gap everywhere = invisible structure.

## Whitespace
**Micro** (tracking, leading, label-input): governs readability. **Macro** (sections, margins, hero): governs perceived value. Luxury = generous macro. Crowded = "affordable." Active whitespace = spotlight (Apple product isolation). Passive = structural.

## The Fold (NNG: 57,453 fixations)
- Above fold: **102% more views**. 57% viewing time above fold.
- **Never fill exact viewport height** — bleed 40-80px of next section. False floor = users think page done.
- First 100px must be relevant or users leave.

## Reading Patterns
- **F-Pattern:** Dense text. Right side = zero attention. Front-load sentences.
- **Layer-Cake:** Most effective. Headings = summaries not labels.
- **Z-Pattern:** Sparse visual < 50 words. CTA at terminal point (bottom-right).
- **Spotted:** Specific targets (prices, dates). Distinct visual treatment.

## Grids
12-column: divides by 1/2/3/4/6/12. Desktop 24px gutters, mobile 16px, margins 48-64px / 20px.
Baseline: 8px rhythm. Line heights = multiples (16, 24, 32, 40px).
Full 12/12 (hero), wide 10/12, standard 8/12 (forms), narrow 6/12, sidebar 4/12.

## Optical Alignment
Mathematical ≠ optical. Icons in buttons: 1-2px up. Text in buttons: more bottom padding. Hero headlines: raise 5-8% above mathematical center. Circles must be physically larger than squares to appear equal.

---

# UX WRITING

> Source: Mailchimp, NNG, GOV.UK, Copyhackers, Microsoft.

## Button Labels
- "Start **my** trial" > "Start **your** trial" (+90% ContentVerve). First-person = endowment effect.
- Verb + object: "Download report", "Add to cart". Single CTA per screen (+266%).
- Front-load verb. "No credit card required" near CTA (+34%).
- **Never:** "Click here", "Submit", "OK", "Yes/No", "Learn More" as primary.

## Voice & Tone (Mailchimp)
Voice (constant): plainspoken, genuine, dry humor. Tone (variable): adjust to reader's state. "Clear > clever, always." Active voice.

## Plain Language (GOV.UK)
Reading age 9. Max 25 words/sentence. buy not purchase, help not assist, start not commence. 80% prefer clear English. Block caps 13-18% harder to read.

## Error Messages (NNG + GOV.UK + Stripe)
**What happened + Why + How to fix.** Never blame user. Never clear input. Inline + summary (identical wording). Validate on blur.
- Good: "That email is already registered. Try signing in."
- Stripe: "Your bank declined. No payment was made. Try a different card."

## Placeholder Text (NNG)
**Never as label** (disappears on focus, memory burden). Acceptable: format hints only ("MM/DD/YYYY").

## Confirmation Dialogs
Title = action question ("Delete this project?"). Body = consequences ("12,847 subscribers. Cannot be undone."). Buttons = specific verbs ("Delete project" / "Keep project"). Destructive: red button, focus on Cancel, max distance between buttons.

## Empty States
Every empty state = onboarding moment. Headline + copy + CTA. First-use: encouraging. Cleared: congratulatory. No results: helpful path. Never blank.

## Loading States
< 2s: spinner only. 2-10s: "Saving..." 10s+: "Uploading (3 of 12)..." Present participle.

---

# DESIGN MASTERS — 5 CONVERGENCE POINTS

> 7 masters (Rams, Norman, Vignelli, Spiekermann, Ive, Tufte, Kare) converged independently.

## Rams: 10 Principles
Innovative (remove friction, not add spectacle), Useful (function + psychology + aesthetics), Aesthetic (integral to usefulness), Understandable (zero-onboarding), Unobtrusive (canvas disappears), Honest (no dark patterns), Long-lasting (avoids fashion), Thorough (404 pages, empty states = design surfaces), **As little design as possible.**

## Norman: 6 Principles
**Signifiers** (blue underline = link), **Mapping** (controls match results), **Feedback** (< 100ms, calibrated), **Constraints** (define what's impossible), **Conceptual Models** (user mental model must match design). Two Gulfs: Execution (can I do it?) and Evaluation (did it work?). Good design narrows both.

## Vignelli: Grid + Type Discipline
Max 2 type sizes per screen. 2x ratio minimum for hierarchy. "White space > black of type." Grid removes arbitrary placement.

## Spiekermann: Type = Brand
Custom typeface = purchased differentiation. Open apertures for screen legibility. Size and tracking are inverse.

## Tufte: Data-Ink Ratio
Maximize toward 1.0. "Can this be erased without info loss?" Lie Factor = effect shown / effect in data (1.0 = honest). Small multiples. Sparklines.

## Ive/Apple: Simplicity = Purpose
"Simplicity not absence of clutter — that's a consequence." Clarity (transparent carrier), Deference (UI steps back), Depth (spring physics = signifiers).

## Kare: Icons as Universal Language
Meaningful (real metaphors), Memorable (one-trial learning), Clear (traffic sign test).

## The 5 Convergences

| # | Principle | Implication |
|---|---|---|
| 1 | Reduction is hardest work | Every element earns place. Default = removal. |
| 2 | Constraints enable, not limit | Type scale, spacing grid, palette = preconditions for quality. |
| 3 | Timelessness over trend | Build for structure. Glassmorphism fades. Good typography permanent. |
| 4 | Function precedes form, but form not optional | Poor hierarchy = harder to use, not just ugly. |
| 5 | Design communicates trust | No blame, no manipulation, no lying with graphics. |

---

# AI SLOP FINGERPRINT

ANY present → go back to Phase 3:

| # | Pattern | Fix |
|---|---|---|
| 1 | `#6366F1` gradient (AI purple) | Custom brand hue in OKLCH |
| 2 | Grid of identical cards, identical padding | Vary sizes, bento/asymmetric |
| 3 | `font-weight: 500` everywhere | 700+ heading, 400 body |
| 4 | `#F9FAFB` background (cold grey) | oklch(0.98 0.008-0.015 60-80) |
| 5 | Missing states | Design ALL states |
| 6 | `animate-bounce`/`pulse` on static | Animation for loading/state changes only |
| 7 | 3+ font families | Max 2 (sans + mono) |
| 8 | Line-height 1.75 on app UI | 1.5 for app; 1.75 prose only |
| 9 | Absolute/relative from Figma MCP | Solve via flex/grid |
| 10 | `rgba(0,0,0,...)` shadows | oklch-tinted warm shadows |
| 11 | Same color for UI AND charts | Separate `--chart-*` tokens |
| 12 | No `prefers-reduced-motion` | Media query with `!important` |
| 13 | Pure #000 on #FFF | Near-black on tinted white |
| 14 | `outline: none` without replacement | 2px ring, 2px offset |
| 15 | Touch targets < 44px | Pad to 44px minimum |

---

# PHASE 4: GENERATE DESIGN.md

Assemble all decisions into 10-section DESIGN.md. See [template](references/design-md-template.md). See [examples](examples/) for worked outputs.

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

1. CSS custom properties (`:root` tokens) → call `design_tokens_generate`
2. Base layout → grid + spacing
3. Typography → apply scale
4. Components → ALL states (default, hover, active, focus, disabled, loading)
5. Motion → after layout correct
6. Responsive → mobile-first
7. Accessibility → focus, ARIA, touch targets
8. Final audit → anti-pattern checklist + pre-delivery checks

---

# QUALITY GATES (5)

| Gate | Test | Fail = |
|---|---|---|
| Personality | Emotional target in one sentence? | AI slop |
| Industry | Follows `designer_get_industry_rules`? | Contextual failure |
| Anti-Pattern | Zero matches from fingerprint? | Fix first |
| Accessibility | Passes all P1 rules? | Not shippable |
| DESIGN.md | Coherent DESIGN.md writable from output? | Generated, not designed |

---

# PRE-DELIVERY CHECKLIST

**Visual Quality**
- [ ] No AI purple as default
- [ ] Weight contrast (heading ≠ body)
- [ ] Warm/cool neutrals committed
- [ ] Near-black + near-white (not pure)
- [ ] All spacing = 4px multiples
- [ ] Consistent radius per component type

**States**
- [ ] Hover on all interactive
- [ ] Focus ring (2px) on all interactive
- [ ] Loading state for every async
- [ ] Error state for every form input
- [ ] Empty state for every data container
- [ ] Disabled: opacity 0.5 + pointer-events none

**Accessibility**
- [ ] Body contrast ≥ 4.5:1 (both modes)
- [ ] Touch targets ≥ 44px
- [ ] prefers-reduced-motion implemented
- [ ] No color-only indicators
- [ ] All images have alt text
- [ ] Skip links present
- [ ] Semantic HTML (nav, main, button, a href)
- [ ] Heading hierarchy sequential

**Responsive**
- [ ] Tested at 375, 768, 1024, 1440px
- [ ] Content max-width constraint
- [ ] No horizontal scroll mobile
- [ ] Prose max-width: 65ch
- [ ] dvh not vh for mobile full-height

**Motion**
- [ ] No > 500ms UI transitions
- [ ] No linear easing
- [ ] Only transform + opacity animated
- [ ] No decorative bounce/pulse
- [ ] Exits faster than entrances

**Code**
- [ ] No emojis as icons (SVG only)
- [ ] cursor: pointer on clickable
- [ ] No arbitrary z-index
- [ ] Images have aspect-ratio or dimensions
- [ ] No Figma absolute/relative dump
- [ ] No form clearing on error

---

# INTEGRATION CONTRACTS

## Upstream: How designer gets invoked

**From `hyperstack:blueprint`:** visual/UX intent detected → input raw request + codebase context → return approved DESIGN.md path

**From `hyperstack` root:** Phase 2 detects visual work → routes here before engineering-discipline for any visual task

**From user direct:** "design", "build me a", "landing page", "DESIGN.md", any visual phrase → run full pipeline from Phase 1

## Downstream: What designer hands off

**To `hyperstack:forge-plan` (primary consumer):**
After Phase 4 approved → file at `docs/DESIGN.md` or `<project>/DESIGN.md`

forge-plan reads 10 sections → generates tasks:
- S2 (Color) → task: `design_tokens_generate`
- S3 (Typography) → task: font loading + type scale
- S4 (Spacing) → task: configure Tailwind spacing tokens
- S5 (Components) → tasks: one per component. If Q11b=shadcn: `shadcn_get_component` for each. If raw Tailwind: hand-write from DESIGN.md. If other library: use its docs.
- S6 (Motion) → task: `motion_generate_animation` with DESIGN.md motion spec
- S7 (Elevation) → task: define shadow tokens
- S9 (Responsive) → tasks: breakpoint-specific overrides
- S8 (Do's/Don'ts) → assertions embedded in every task's self-review

Invocation: *"DESIGN.md approved and saved at `<path>`. Invoking `hyperstack:forge-plan` with this as input spec."*

**To `shadcn` MCP plugin — ONLY if Q11b=shadcn:**
```
shadcn_get_rules                        → architectural constraints (ALWAYS first)
shadcn_get_composition(page_type)       → which components compose for this page
shadcn_list_components                  → available catalog
for each component in DESIGN.md S5:
  shadcn_get_component(name)            → full spec: primitive, data-slots, variants
  shadcn_get_snippet(name)              → canonical usage example
```
No shadcn component matching DESIGN.md spec → escalate to `hyperstack:designer`, don't invent hybrid.

**To raw Tailwind — ONLY if Q11b=raw Tailwind:**
```
design_tokens_get_category("component-sizing")
ui_ux_get_component_pattern(name)
```
Hand-build from DESIGN.md S5 using Tailwind classes directly. Apply all P7 rules.

**To `motion_generate_animation`:**
```
motion_generate_animation({
  description: "<from DESIGN.md S6>",
  durations: { fast: "150ms", normal: "200ms", slow: "300ms" },
  easing: "ease-out",
  prefersReducedMotion: true  // always
})
```

**To `design_tokens_generate`:**
```
design_tokens_generate({
  description: "<from DESIGN.md>",
  brand: <from S2>,
  neutral: <from S2>,
  typography: <from S3>,
  spacing: <from S4>,
})
```

**To `hyperstack:behaviour-analysis`:**
After implementation complete, before ship-gate. DESIGN.md = "expected behaviour" ground truth:
- S5 → expected states per component
- S6 → expected timing/easing
- S8 → assertions to verify
- S10 → violations to search for

**To `hyperstack:ship-gate`:**
Before completion claim. Verifies:
- All S5 components have ALL required states implemented
- S10 anti-patterns absent from code
- OKLCH tokens from S2 present in CSS
- `prefers-reduced-motion` implemented (S6)

## Reverse Escalation

| Discovery | Source | Action |
|---|---|---|
| Visual gap mid-plan | forge-plan → designer | Append clarification to DESIGN.md, resume |
| DESIGN.md expected behavior unclear/contradictory | behaviour-analysis → designer | User resolves, DESIGN.md updated |
| DESIGN.md compliance fail not fixable in code | ship-gate → designer | Revise DESIGN.md framework constraints |

## Announcement Protocol

When invoked: *"Using hyperstack:designer — producing DESIGN.md contract for [task type]."*
When handing off: *"DESIGN.md complete at [path]. Invoking hyperstack:forge-plan with this as input spec."*
When escalating back: *"[from-skill] escalating to designer — [reason]."*