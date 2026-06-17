---
name: lab
category: core
description: Use when designing or revamping a frontend section or whole page and you want to explore real-React variants in an isolated, dev-only lab before writing production code. Cook variants for one target at a time, lock the winner, watch an additive page assemble in /lab-view, then wire it properly. Forces real-stack previews (not throwaway HTML/Figma), desktop+mobile side by side, and a clean codebase with only the current target's scratch alive.
---

# The Lab - variant-driven frontend design in the real stack

Design-by-mockup lies. HTML comps and Figma frames never survive contact with the
real component tree, the real responsive rules, or the real design tokens - so what
the user approves is not what ships. The Lab fixes that: explore variants **in the
real framework** (real components, real breakpoints) but **isolated from production**,
build the page **additively** one locked target at a time, and only write production
code once the whole assembled page is approved.

## The Iron Laws

```
1. ONE TARGET IN COOK
   Only the current target's variants exist as scratch code. Everything else is
   either a clean locked winner or not written yet. Never two targets in flight.

2. COOK EMPTIES ON LOCK
   The instant a target is locked, delete the losing variants and clear the cook.
   No variant graveyard. Git history is the backup if a loser is ever wanted back.

3. VIEW BEFORE CODE
   No production wiring until /lab-view (the whole assembled page) is approved.
   The lab is where decisions happen; production is where they get implemented.

4. SCAFFOLD IS THROWAWAY
   Scoped lab CSS, CDN fonts, and inline styles are prototype-only and NEVER ship.
   Final wiring re-implements with real design tokens + self-hosted fonts + proper
   folders. The lab buys speed of iteration, not shippable code.

5. DEV-ONLY
   Every lab route is gated by the framework's dev flag (e.g. import.meta.env.DEV).
   The lab must not exist in a production build.
```

Violating the letter = violating the spirit.

## The 3 moving pieces

| Piece | What it is |
|---|---|
| **target** | The unit of work being refined. One section **or** one whole page - **never more than a page**. Bounds scope so the cook stays legible. |
| **/lab-cook** | The kitchen. Renders **only the current target's variants**. Empties on lock. |
| **/lab-view** | The connected additive page - every locked target stitched top-to-bottom. The realistic "this is the page" preview, before any production code. |

Both routes share the same **site navbar** (so previews sit under realistic chrome)
and a **toggleable mobile-view sidebar** (a ~390px phone frame mirroring the main
preview), so desktop and mobile can be judged together on demand.

## The harness layout (both routes)

```
┌──────────────────────────────────────────────────┐
│ [lab navbar - plain, very low height]   [☾/☀][▢]  │  ← theme toggle · mobile-sidebar toggle
├───────────────────────────────────────┬┄┄┄┄┄┄┄┄┄┄┄┤
│  ┌─ site navbar (shared) ────────────┐ ┊  mobile   ┊
│  ├───────────────────────────────────┤ ┊  sidebar  ┊  ← toggled on/off
│  │  MAIN preview (desktop width)     │ ┊  (~390px, ┊     from the navbar
│  │   cook → current target variants  │ ┊   mirrors ┊
│  │   view → full connected page      │ ┊   main)   ┊
│  └───────────────────────────────────┘ ┊           ┊
└───────────────────────────────────────┴┄┄┄┄┄┄┄┄┄┄┄┘
```

- **lab navbar** top-right has exactly two controls: `[ light · dark ]` theme toggle
  (preview both themes) and `[ mobile ]` toggle that **shows/hides the mobile-view
  sidebar** (the ~390px phone mirror). Default state is the project's choice; the
  point is mobile is one click away, judged beside desktop, before any lock.
- **cook** main = the variants of the target in flight.
- **view** main = every locked target, connected.

Concrete React/route scaffolding: `references/harness-blueprint.md`.

## The labcycle (CLUD) - per target

| Step | Verb | What happens to the code |
|---|---|---|
| 1 | **Create** | Write N variants (default 3) of the target into the cook scratch. `/lab-cook` shows only these. |
| 2 | **Update** | Not satisfied → rewrite the cook scratch with fresh variants, **same target**. Loop until satisfied. |
| 3 | **Lock** | Promote the winner → extract into a clean locked component, add to the ordered locked list → it appears in `/lab-view`. |
| 4 | **Destroy** | Delete the losing variants and **empty the cook scratch**. No dead code remains. |
| 5 | **Next** | Repeat for the next target. |

## Two phases

**Phase 0 - Setup (once per project).** Build the harness: the lab navbar (+ theme &
device toggles), the shared site navbar, the mobile-view sidebar, `/lab-cook`,
`/lab-view`, and the cook→lock→view plumbing. All dev-gated. Carry any already-decided
sections in as the first locked entries.

**Phase 1 - Steady state (every target, repeats).**

```
1. Ask TARGET        → which section, or the whole page? (never more than a page)
2. Ask 1-3 SCOPE Qs  → pin direction/constraints BEFORE building (references/scope-questions.md)
3. Build VARIANTS    → default 3, in /lab-cook, desktop main + mobile sidebar
4. UPDATE (iterate)  → not happy? fresh variants, same target, loop
5. LOCK              → winner → /lab-view; cook empties (Iron Laws 1 & 2)
6. → next target
```

When **/lab-view is complete and approved** → leave the lab and do **final wiring**
(below). The lab's job is done; nothing in it ships as-is.

## Variant rules

- **Default 3 per round.** Genuinely distinct - a different *idea* or layout per
  variant, not three recolors of one. If the user dislikes all three, the next round
  should change the *approach*, not nudge pixels.
- **Always desktop + mobile.** Never present a desktop-only variant; the mobile
  sidebar exists for this.
- **Honest content only.** Real metrics, real copy. No fabricated numbers, logos, or
  testimonials - placeholder lies poison the decision.
- **Label every variant**: short name + one-line note on the trade-off.
- **One question to lock.** After showing variants, ask which to lock (or what to
  change), then act. Do not assume.

## Final wiring (handoff out of the lab)

Once `/lab-view` is approved, re-implement for production - this is a separate phase,
not part of the lab:

| Throwaway (lab) | Ships (final) |
|---|---|
| scoped `lab.css`, hard-coded OKLCH | real design-system tokens (`design-tokens` skill) |
| Google-fonts CDN `<link>` | self-hosted fonts (`@fontsource`, etc.) |
| inline `style={{}}` | token-backed utilities / component styles |
| `src/lab/` scratch | `components/sections/` proper folder + reusable parts |
| dev-gated `/lab-view` | swap into the real production route |

Then run `ship-gate` (and `designer_verify_implementation` if a `DESIGN.md` exists)
before claiming done.

## Red flags - STOP

| Thought | Reality |
|---|---|
| "I'll keep all sections' variants in one registry" | That's a board, not a cook. One target's scratch at a time (Iron Law 1). |
| "Lock it but keep the other two around just in case" | No graveyard. Delete on lock; git remembers (Iron Law 2). |
| "The lab looks great, let me ship this code" | Lab CSS/fonts/inline are throwaway. Wire it properly first (Iron Law 4). |
| "I'll just tweak the production landing directly" | Then you lose the isolated additive view. Use the lab. |
| "Three variants but they're basically the same" | Distinct ideas, not recolors. Change the approach. |
| "Show desktop now, mobile later" | Toggle the mobile sidebar on and judge both before locking. |
| "I'll start building before asking scope" | Ask target + 1-3 scope Qs first, or you build the wrong thing. |
| "Mount the lab route unconditionally" | Dev-gate it. The lab never ships (Iron Law 5). |
| "Use realistic-looking fake stats" | Honest content only. Fake proof poisons the decision. |

## Integration

- **Upstream**: `designer` (a `DESIGN.md` contract sets the visual language each
  variant must honor) and `brainstorming` (settle intent before cooking).
- **During**: `behaviour-analysis` on a locked target before moving on (states,
  edge cases, a11y).
- **Final wiring**: `design-tokens` (migrate scoped CSS → tokens), `frontend-design`
  / `shadcn-expert` (production components), then `ship-gate` + `designer_verify_implementation`.

The lab does not replace the design decision (that is `designer`); it is the place to
make and validate that decision in the real stack, one target at a time, before
committing production code.
