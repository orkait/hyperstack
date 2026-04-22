# Design Intent Questions

Two modes: **Base** (3 questions, fast) and **Advanced** (12 questions, full control).

---

## Base Mode (3 Questions)

| # | Question | Example Answer |
|---|---|---|
| **1** | What is the product? (1 sentence) | "A project management tool for DevOps engineers" |
| **2** | Brand color? (hex, name, or "generate") | "#0070F3" or "emerald" or "generate based on industry" |
| **3** | What sections/pages to build? | "Dashboard with sidebar, metrics, logs, settings" |

Everything else (user type, emotion, style, density, font, motion, framework, constraints) is auto-resolved from Q1 via `designer_resolve_intent` and presented for confirmation.

---

## Advanced Mode (12 Questions)

Every answer changes the output. Questions ordered from high-level (personality) to specific (tokens).

### Q1: What is the product? (1 sentence)

**Determines:** Industry category, anti-pattern set, style priority
**Example:** "A project management tool for software engineers"
**Resolution:** Maps to `designer_get_industry_rules` — returns recommended style, color mood, must-haves, never-uses

---

## Q2: Who is the primary user?

| User Type | Defaults |
|---|---|
| Developer | Dark default, monospace accents, keyboard-first, compact density |
| Consumer | Light default, friendly typography, mobile-first, comfortable density |
| Enterprise | Structured, conservative, data-dense, normal density |
| Child | Playful, large touch targets (48px+), high contrast, claymorphism |
| Creative | Rich motion, bold colors, portfolio-native |
| Healthcare | Calm, accessible (AAA), large text, minimal motion |

---

## Q3: What emotional target? (pick one)

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

---

## Q4: Light or dark default?

Not a preference — a product and brand decision:
- **Developer tools** → dark (convention, reduces eye strain in code)
- **Marketing/consumer** → light (reading context, warm backgrounds)
- **Editorial/content** → light (paper metaphor)
- **Gaming/media** → dark (immersive, cinematic)
- **Data dashboards** → either, but must be intentional

---

## Q5: What is the primary brand color?

If given: extract hue, derive full OKLCH ramp (11 stops)
If "generate": pick based on industry + emotional target:

| Industry | Color Mood |
|---|---|
| SaaS | Trust blue + single accent |
| Healthcare | Calm blue + health green |
| Fintech | Navy + trust blue + gold |
| Luxury | Black + gold, minimal palette |
| AI/Tech | Neutral + one distinct (NOT #6366F1) |
| Education | Friendly pastels, warm accents |
| Wellness | Earth tones, sage green, soft coral |

---

## Q6: Design density?

| Mode | Section Padding | Card Padding | Body Size | Use |
|---|---|---|---|---|
| Comfortable | 96px | 40px | 18px | Marketing, editorial, consumer |
| Normal | 64px | 28px | 16px | SaaS, dashboards, apps |
| Compact | 48px | 20px | 14px | Data tables, admin, dev tools |

---

## Q7: Design style? (or "recommend")

7 primary styles: minimalism, glassmorphism, soft-ui, dark-oled, vibrant-block, claymorphism, aurora-ui

If "recommend": resolved from industry + emotional target via `designer_resolve_intent`

---

## Q8: Font personality?

| Personality | Pairing | Use |
|---|---|---|
| Technical | Geist + Geist Mono | Dev tools, SaaS, dashboards |
| Elegant | Cormorant + Montserrat | Luxury, editorial, premium |
| Friendly | Plus Jakarta Sans + mono | Consumer, education, SaaS |
| System | Inter (or system stack) | Universal, no strong personality |
| Editorial | Playfair Display + Lora | Content sites, blogs, news |

---

## Q9: Motion level?

| Level | What It Includes |
|---|---|
| Static | No animations at all |
| Subtle | Hover states + transitions only (150-200ms) |
| Moderate | + scroll reveals, micro-interactions (200-300ms) |
| Rich | + parallax, page transitions, animated backgrounds (300-500ms) |

Always respects `prefers-reduced-motion` regardless of level chosen.

---

## Q10: What sections/pages?

**Landing pages:** Hero, Features, Testimonials, CTA, Footer, Pricing, FAQ
**Dashboards:** Sidebar, Header, Content area, Data panels, Settings
**Apps:** Navigation, Content, Modals, Forms, Empty states, Error states

---

## Q11: Framework/stack?

Recommended: **shadcn/ui + Tailwind v4** (widest ecosystem support)
Others: React + Tailwind, Next.js + Tailwind, HTML + Tailwind, Vue, Svelte

---

## Q12: Specific constraints?

- Accessibility level: AA (default) or AAA (healthcare, government, education)
- Performance budget: < 150KB JS, < 2s load (affects motion choices)
- Dark mode required: yes/no
- Brand keywords (e.g., "warm", "technical", "bold")
- Existing design system to integrate with
