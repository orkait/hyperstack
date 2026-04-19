---
name: designer
category: domain
description: >-
  Evidence-based decision engine. Forces visual choices through industry context, cognitive science, and anti-pattern checks. Outputs DESIGN.md contract.
---

# Designer Skill - Intention Gate

> AI UIs look identical because AI skips decision process and jumps to code.
> Force every decision through evidence before code generation.
> No new visual-semantic surface without approved design contract.

## IRON LAW

```
NO VISUAL CODE WITHOUT APPROVED DESIGN.md
```

Single line JSX/CSS without DESIGN.md = violation when the route requires a design contract. This gate is conditional, not universal.

## HARD GATE

```
DO NOT GENERATE VISUAL CODE UNTIL:
  0. Design Director Critique (Phase 0)
  1. Intent extracted (Phase 1)
  2. MCP tools & references consulted (Phase 2)
  3. Constraints and Anti-patterns checked (Phase 3)
  4. DESIGN.md generated + presented (Phase 4)
  5. User approved DESIGN.md
```

## 1% RULE

1% chance task involves a new surface, a visual-semantic change, or no trustworthy existing pattern match → invoke BEFORE code.
**Apply:** New page, redesign, new component system, motion system change, or existing-project UI work with no safe pattern match.
**Skip:** Pure backend, non-visual CSS bug fixing, infrastructure.

## RED FLAGS - STOP

| Thought | Reality |
|---|---|
| "Small component, no redesign needed." | Wrong decisions ship. Design it. |
| "I'll use default styles." | Defaults = AI slop. |
| "I'll fix design later." | Fixes never happen. Design FIRST. |
| "MCP tools overkill." | You don't decide. Call them. |
| "Speed required, skip gate." | Speed ≠ permission to ship slop. |

## Knowledge Base (References & MCP)

The data you need to make decisions is external. **Do not hallucinate it.**
- **MCP Tools:** `designer_resolve_intent`, `designer_get_personality`, `designer_get_industry_rules`, etc.
- **Local References:** If MCP is unavailable, use `view_file` to read the files in `skills/designer/references/`:
  - `personality-atlas.md`
  - `cognitive-laws-cheatsheet.md`
  - `industry-matrix.md`
  - `anti-patterns-checklist.md`
  - `website-experience-cheatsheet.md`

---

# PHASE 0: DESIGN DIRECTOR CRITIQUE

Before running any tool or compiling a configuration, **you must emit a `<designer_critique>` thought block.** You are not a coder here; you are an opinionated Creative Director protecting the user from derivative AI sludge.

Inside `<designer_critique>`, you must answer:
1. **Defend against Slop:** What is the laziest, most generic "Tailwind template" way this request could be built? Explicitly declare how you will avoid it.
2. **Define the Metaphor:** Establish a real-world physical metaphor. (e.g., "This isn't a spreadsheet; it's a pilot's HUD.")
3. **Anchor Constraints:** Pick exactly 1 Cognitive Law and 1 Design Master principle that will strictly govern this layout.

*Only after emitting this critique may you proceed to Phase 1.*

---

# PHASE 1: INTENT EXTRACTION

**Step 1:** Use `designer_resolve_intent` (or read `references/questions.md`).
**Step 2:** Ensure you know the Product, Brand Color, Target Audience, Emotional Target, and Component Library (e.g., shadcn vs raw Tailwind).
**Step 3:** Confirm the route actually requires a `design_contract`. Existing-project frontend logic work should usually stay in workspace-first planning instead.

User preferences override auto-resolved defaults. Auto-resolved defaults are suggestions, not authority.

---

# PHASE 2: DESIGN SYSTEM RESOLUTION

Gather context (in parallel):
1. **Get Personality:** `designer_get_personality` (or read `personality-atlas.md`). Sets core visual vocabulary (tracking, radius, motion).
2. **Get Industry Rules:** `designer_get_industry_rules` (or read `industry-matrix.md`).
3. **Get Page Anatomy:** `designer_get_page_template` (or read `composition-cheatsheet.md`).

---

# PHASE 3: CONSTRAINT APPLICATION

Cross-reference your resolved specs against the hard constraints. Use `view_file` on `references/anti-patterns-checklist.md` and `references/website-experience-cheatsheet.md` if MCP fails.
- **P1 Accessibility:** 4.5:1 contrast, 44px targets, `prefers-reduced-motion`.
- **P2 Interaction:** Hover states on all interactive elements.
- **P3 Responsive:** Mobile-first, 4px grid spacing, 65ch prose width limit.
- **P4 Typography:** Fixed 16px body, fluid headings (`clamp`).
- **P5 Color:** Use OKLCH. No pure pure #000/#FFF. Warm/cool neutral commitment.

---

# PHASE 4: GENERATE DESIGN.md (Conditional)

Only run this phase when route classification says `requires_design_contract = true`.

Assemble 10 sections. Wait for user approval. NO CODE YET.
1. Visual Theme (Emotional target, personality).
2. Color Palette (OKLCH, semantic, dark mode).
3. Typography (Scale, pairing).
4. Spacing (Grid, density, content width).
5. Component Specs (Variants + states).
6. Motion (Durations, easing, reduced-motion).
7. Elevation (Shadow tokens, z-index).
8. Do's & Don'ts (Industry-traced).
9. Responsive (375/768/1024/1280/1440px targets).
10. Anti-Patterns (Slop checks passed).

---

# PHASE 5: CODE GENERATION

Post-approval implementation order:
1. CSS custom properties (`:root`) → `design_tokens_generate`.
2. Base layout → grid + spacing.
3. Typography.
4. Components (ALL states).
5. Motion (After layout).
6. Responsive.
7. Accessibility (Focus, ARIA).
8. Final audit.

---

# INTEGRATION CONTRACTS

**Upstream (`hyperstack:blueprint`):** New-surface or visual-semantic intent detected → run pipeline → return approved conditional `design_contract` / DESIGN.md path.

**Downstream (`hyperstack:forge-plan`):**
DESIGN.md saved → `forge-plan` reads 10 sections → generates tasks.

**To `shadcn` Plugin (If selected):**
Call `shadcn_get_rules` FIRST. `shadcn_get_composition`, `shadcn_list_components`. `shadcn_get_component` per DESIGN.md. No hallucinated components.

**To `hyperstack:ship-gate`:**
When present, DESIGN.md acts as ground truth for testing expected behaviours, states, animations, and non-slop compliance. When absent, verification falls back to workspace patterns plus route-level proof requirements.

**Announce invocation:** *"Using hyperstack:designer - stepping into Creative Director persona to produce DESIGN.md."*
