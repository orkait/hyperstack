---
name: shadcn-expert
category: domain
description: Advanced shadcn/ui architect specializing in Base UI, Tailwind v4, data-slot patterns, and component composition. Use when building, auditing, or refactoring UI components with shadcn/ui. ONLY applies when the user has explicitly chosen shadcn as the component library - do not assume.
---

# shadcn/ui Expert (Base UI Edition)

## The Iron Law

```
NO COMPONENT WITHOUT shadcn_get_rules FIRST
```

Call `shadcn_get_rules` before proposing any new component or modification. Base UI edition differs from standard shadcn (Radix) in multiple ways. Memory is not acceptable.

Violating the letter = violating the spirit.

## When This Skill Applies

**Only when:** user has explicitly chosen shadcn/ui (Base UI edition) as the component library.

**Do NOT apply when:**
- User wants raw Tailwind (no component library)
- User chose Material UI, Mantine, Chakra, Ant Design, or another library
- User hasn't specified a library yet → ask them first
- Project already uses a different component system → respect it

**If unclear:** ask `hyperstack:designer` (Question 11 covers component library choice). Do not assume shadcn by default.

## Position in the Ecosystem

```
hyperstack:designer → DESIGN.md
       │
       ▼ (if shadcn chosen in Q11)
hyperstack:forge-plan reads DESIGN.md
       │
       ▼
hyperstack:shadcn-expert (THIS skill)
       │
       ├─▶ shadcn_get_rules (architectural constraints)
       ├─▶ shadcn_get_composition(page_type)
       ├─▶ shadcn_get_component(name)
       └─▶ shadcn_get_snippet(name)
       │
       ▼
Implementation tasks per DESIGN.md Section 5
```

## MCP Tools

| Tool | Purpose | When |
|---|---|---|
| `shadcn_get_rules` | Architectural rules + checklist | Before ANY component work |
| `shadcn_list_components` | All curated components | When choosing which component to use |
| `shadcn_get_component(name)` | Full spec: primitive, data-slots, variants, sizes | Before implementing a specific component |
| `shadcn_get_snippet(name)` | Canonical usage example | When you need a reference implementation |
| `shadcn_get_composition(page_type)` | Which components compose for a page type | After `designer_get_page_template` |

## How to Use

1. **Verify scope** → confirm shadcn is the chosen library. Not confirmed → stop.
2. **Survey first** → `shadcn_list_components` to know what exists
3. **Rules baseline** → `shadcn_get_rules` for current architectural constraints
4. **Learn from source** → `shadcn_get_component(related)` - building `Switch`? read `Checkbox` first
5. **Reference snippet** → `shadcn_get_snippet(name)` for intended usage
6. **Enforce data-slot** → every sub-component MUST have `data-slot="..."`. Parent styles children via `*:data-[slot=x]:...`

## Architectural Nuances

- **Base UI over Radix** → uses `@base-ui/react`, not `@radix-ui/react-*`. Base UI uses `render` prop pattern.
- **Slot-Based Styling** → `data-slot` attributes enable parent-to-child styling like `*:data-[slot=select-value]:line-clamp-1`
- **OKLCH Color Space** → all semantic tokens are `oklch(L C H)` - not HSL, not hex
- **Tailwind v4 Variables** → components use CSS variables for dynamic sizing, not hardcoded pixels
- **Container Queries** → components like `Field` use `@container/field-group` - responsive to container width, not viewport

## Premium Density & Dark-Surface Discipline

**Apply ONLY when DESIGN.md calls for a dense, dark, or devtool/agent-console aesthetic** (high information density, AMOLED/true-black, data-heavy panels). Do NOT impose this on a marketing site, a spacious consumer app, or a light-first brand - those stay on the generic shadcn defaults. This section is opt-in aesthetic guidance, not a baseline.

### Density

- **4px grid everywhere.** Spacing tokens on multiples of 4 (2px/6px only for ultra-compact inline cases). No arbitrary `13px`/`18px` gaps.
- **Fixed chrome heights.** Titlebar, panel header, tabbar, statusbar each get one fixed height token (e.g. 36 / 32 / 34 / 28). Reuse the token, don't re-pick per column.
- **Shared top-row height = aligned borders.** Every column's top row in a multi-pane layout must share the same `height` + `box-sizing: border-box` + `border-bottom`, or the bottom borders land at different Y and the misalignment shows.

### Dark surfaces

- **Elevation by lightness, not shadow.** On true-black, drop shadows are invisible - raise the surface token's lightness instead. Reserve shadows for overlays only; never put a border AND a shadow on the same card.
- **Shadows differ per theme.** If a component carries a shadow, define both: high alpha on dark, low alpha (~0.06-0.14) on light. Reusing dark alphas in light mode muddies the canvas.
- **Three border roles, distinct tokens:** section boundary (card/table outline), inner separator (row dividers, lower contrast), emphasis edge (hover/focus, used sparingly). One token for all three erases the inner/outer distinction.
- **`::selection` must stay readable in both themes** - a low-alpha accent tint makes selected text vanish; raise alpha (~0.4 dark / ~0.2 light) and set an explicit selection text color.
- **Live/pulse indicators animate opacity, not box-shadow** - a glowing shadow bleeds blur into neighboring rows.

### Color: action vs state

| Need | Use |
|---|---|
| Primary / secondary CTA button | **Neutral** (near-white on dark / near-black on light) `--primary` |
| Focus ring, selected row, checked box/radio, active step, link | **Accent** color (`--ring` / accent token) |
| Destructive CTA | **Red** status token (not accent, not neutral) |

Rule: **neutral = actions, accent = state.** A blue/accent primary button is the most common tell of a generic AI UI - avoid it in this aesthetic.

### Radius, icons, voice

- **Closed radius set.** Pick ~4 values (e.g. tight / control / container / pill) and never introduce off-scale radii (no stray 8/10/12/16).
- **One icon library, fixed stroke** (Lucide, 1.5 stroke), sized per context (titlebar ~18, button ~16, card-header ~11). No emoji, no unicode glyphs.
- **Voice:** sentence case for UI text; UPPERCASE + tracking only for eyebrow labels/badges; quantify over qualify (`12,847 rows`, not "many rows").

### Motion

- **Micro-interactions animate `background-color` only** (~120ms) - animating `color`/`opacity`/`transform` on icons jitters on common hardware.
- **Overlays are the exception** (dialog, command palette, drawer): backdrop `blur(12px)` + spring/expo curve on the panel, not flat opacity + linear `ease`. Reference easing tokens; don't hand-write `cubic-bezier`.
- **Overlays animate BOTH enter and exit.** Unmounting instantly produces an exit flash. Use a two-stage mount: keep the node mounted, flip a `visible` class to drive the transition, and delay unmount by the longest transition duration.
  - Drive the enter transition with `useLayoutEffect` (commit hidden styles, then set `visible` in the same paint) and the exit with a `setTimeout` matching the transition duration. **Do NOT use `requestAnimationFrame`.**
- Gate decorative/reveal motion behind `@media (prefers-reduced-motion: no-preference)`.

### App-shell composition

- **3-pane shell** = CSS grid, fixed side columns + `1fr` main (`220px 1fr 280px`), rows `titlebar 1fr statusbar`. Apply `contain: layout style paint` per panel to isolate scroll/streaming reflow.
- **Sidebar collapse needs dual transitions** - animate grid column width AND content opacity together, with `white-space: nowrap` on nav items, or text wraps mid-animation. `display:none` collapses height; don't use it.
- **Mobile (≤768px):** grid → single column, sidebar becomes `position: fixed` translateX drawer + tap-dismiss backdrop; nav items auto-close the drawer on click.
- **Hide scrollbar, keep scroll:** `::-webkit-scrollbar:horizontal { height:0 }` - never `overflow-x: hidden`, which kills the scroll entirely.

## Common Gotchas

| Anti-pattern | Fix |
|---|---|
| `import ... from "@radix-ui/react-*"` | Migrate to `@base-ui/react` |
| `className="trigger"` for identification | Use `data-slot="trigger"` instead |
| Hardcoded `top-8` for positioning | Use Base UI props like `sideOffset={8}` |
| Missing `'use client'` on stateful component | Add it to the top of the file |
| Monolithic Dialog (all logic in one component) | Split into `DialogHeader`, `DialogFooter`, etc. |
| Hex colors hardcoded in styles | Use OKLCH tokens from design system |
| Random variant names like 'primary-light' | Stick to `default/outline/secondary/ghost/destructive` |
| Spreading props onto wrong primitive | Always spread to the underlying `@base-ui/react` element |
| Accent/blue primary button in a dense/dark UI | Neutral for CTAs, accent for state (focus/selection/checked) |
| Border + shadow on the same card | Pick one; on dark, prefer border + surface-lightness elevation |
| Overlay unmounts instantly (exit flash) | Two-stage mount; delay unmount by transition duration. No `requestAnimationFrame` |
| Off-scale radii (8/10/12/16 mixed in) | Keep a closed 4-value radius set |
| Emoji/unicode glyphs as icons | Lucide only, fixed 1.5 stroke, sized per context |

## Pre-Completion Checklist

- [ ] Uses `@base-ui/react` primitive (not Radix)
- [ ] Every rendered element has `data-slot`
- [ ] `cva` used for variants (size, variant props)
- [ ] `cn` used for className merging
- [ ] `'use client'` on stateful components
- [ ] Props spread (`...props`) to underlying primitive
- [ ] Sub-components exported (`Dialog`, `DialogHeader`, `DialogFooter`)
- [ ] OKLCH tokens from design system (not hardcoded hex)
- [ ] Tailwind v4 native CSS variables for positioning
- [ ] All exports in PascalCase

**If DESIGN.md specifies a dense/dark/devtool aesthetic, also:**
- [ ] CTAs neutral, accent reserved for state (focus/selection/checked/links)
- [ ] Radii on the closed set; spacing on the 4px grid
- [ ] Overlays: backdrop blur + spring curve, enter AND exit animated (no `requestAnimationFrame`)
- [ ] Shadows defined per-theme (or omitted in favor of border + surface elevation)
- [ ] Icons from one library, fixed stroke, no emoji

## Integration with Designer + Forge-Plan

**Upstream:** `hyperstack:forge-plan` processes DESIGN.md Section 5 → calls `shadcn_get_component(name)` per component → references this skill for architectural guidance

**Downstream:** Component code matching DESIGN.md Section 5 variants + states, all P7 (Components) rules enforced, ready for `hyperstack:ship-gate`

**Reverse escalation:** DESIGN.md spec incompatible with shadcn architecture → escalate to `hyperstack:designer` to reconcile. Don't silently adapt.

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "User didn't say 'shadcn' explicitly, but I'll assume it" | Do NOT assume. Ask or check designer Q11. |
| "I know the shadcn rules from training data" | Training data has standard shadcn (Radix). This is Base UI edition. Call `shadcn_get_rules`. |
| "data-slot is just a naming convention" | It's the primary styling selector for parent→child styling. Mandatory. |
| "I'll use Radix because it's more common" | Project chose Base UI. Use `@base-ui/react`. |
| "Hardcoding pixel positions is faster" | Use Base UI props. Hardcoded px breaks responsive behavior. |
| "This Dialog has 5 slots, I'll combine into one component" | Split into sub-components. Monolithic Dialogs are anti-pattern. |
| "I'll skip 'use client' since it seems stateless" | Does it use `data-open` or any state modifier? → needs `'use client'`. Check before skipping. |
| "The cn utility is optional" | Mandatory. All className merging goes through `cn`. |
| "I'll pick variant names that match the brand" | Stick to `default/outline/secondary/ghost/destructive`. Custom variants break the system. |
| "shadcn components work with any color system" | OKLCH-native. Hex values break the token system. |
| "A blue primary button looks fine" (dense/dark UI) | That's the generic-AI tell. Neutral = actions, accent = state. |
| "I'll requestAnimationFrame the overlay enter" | Banned. Use `useLayoutEffect` + class flip; `setTimeout` for exit. |


## Lifecycle Integration

### Agent Workflow Chains

**Website/Frontend Agent (if Q11b=shadcn):**
```
designer → DESIGN.md → forge-plan → shadcn-expert (THIS) → [component implementation]
                                          ↓
                                [shadcn_* MCP tools]
```

### Upstream Dependencies
- `designer` → Q11b chose shadcn/ui (Base UI edition)
- `forge-plan` → processes DESIGN.md Section 5 → calls shadcn_get_component per component

### Downstream Consumers
- Component code matching DESIGN.md Section 5 variants + states
- `ship-gate` → P7 (Components) rules enforced

### Reverse Escalation
| Discovery | Escalate to | Action |
|---|---|---|
| DESIGN.md spec incompatible with shadcn architecture | `designer` | Reconcile DESIGN.md with Base UI constraints |

### When NOT to Use
- User chose raw Tailwind (no component library)
- User chose Material UI, Mantine, Chakra, Ant Design
- User hasn't specified component library yet → ask first
