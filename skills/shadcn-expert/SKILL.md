---
name: shadcn-expert
category: domain
description: Advanced shadcn/ui architect specializing in Base UI, Tailwind v4, data-slot patterns, and component composition. Use when building, auditing, or refactoring UI components with shadcn/ui. ONLY applies when the user has explicitly chosen shadcn as the component library — do not assume.
---

# shadcn/ui Expert (Base UI Edition)

## The Iron Law

```
NO COMPONENT WITHOUT shadcn_get_rules FIRST
```

You MUST call `shadcn_get_rules` before proposing any new component or modification. Do not rely on memory for architectural constraints. Base UI edition differs from standard shadcn (Radix) in multiple ways.

**Violating the letter of this rule is violating the spirit of this rule.**

## When This Skill Applies

**Only when:** the user has explicitly chosen shadcn/ui (Base UI edition) as the component library for the project.

**Do NOT apply when:**
- User said they want raw Tailwind (no component library)
- User chose Material UI, Mantine, Chakra, Ant Design, or another library
- User hasn't specified a library yet — ask them first
- The project already uses a different component system — respect it

**If unclear:** ask `hyperstack:designer` (Question 11 asks about framework/stack and includes component library choice). Do not assume shadcn by default.

## Position in the Ecosystem

```
hyperstack:designer produces DESIGN.md
       │
       ▼ (if shadcn chosen in Q11)
hyperstack:forge-plan reads DESIGN.md
       │
       ▼
hyperstack:shadcn-expert (THIS skill)
       │
       ├─▶ shadcn_get_rules (architectural constraints)
       ├─▶ shadcn_get_composition(page_type) (which components per section)
       ├─▶ shadcn_get_component(name) (full spec per component)
       └─▶ shadcn_get_snippet(name) (usage examples)
       │
       ▼
Implementation tasks per DESIGN.md Section 5
```

## MCP Tools (call these, do not guess)

| Tool | Purpose | When |
|---|---|---|
| `shadcn_get_rules` | Architectural rules + checklist | Before ANY component work |
| `shadcn_list_components` | All curated components | When choosing which component to use |
| `shadcn_get_component(name)` | Full spec: primitive, data-slots, variants, sizes | Before implementing a specific component |
| `shadcn_get_snippet(name)` | Canonical usage example | When you need a reference implementation |
| `shadcn_get_composition(page_type)` | Which components compose for a page type | After `designer_get_page_template` — bridges design → components |

## How to Use (Internal Training)

1. **Verify scope**: Confirm shadcn is the chosen library for this project. If not, stop — different library has different patterns.
2. **Survey first**: Call `shadcn_list_components` to know what exists. Maintain consistency with existing components.
3. **Rules baseline**: Call `shadcn_get_rules` to get the current architectural constraints. Do NOT rely on memory.
4. **Learn from source**: Call `shadcn_get_component(related)` — if building `Switch`, read `Checkbox` first.
5. **Reference snippet**: Call `shadcn_get_snippet(name)` to see intended usage.
6. **Enforce data-slot**: Every sub-component MUST have `data-slot="..."`. Parent components style children via `*:data-[slot=x]:...`.

## Architectural Nuances

- **Base UI over Radix**: This library uses `@base-ui/react`, not `@radix-ui/react-*`. Base UI uses `render` prop pattern for deep integration.
- **Slot-Based Styling**: `data-slot` attributes enable parent-to-child styling like `*:data-[slot=select-value]:line-clamp-1`.
- **OKLCH Color Space**: All semantic tokens are `oklch(L C H)` — not HSL, not hex. Use `designer_get_preset` or `design_tokens_generate` to get correct values.
- **Tailwind v4 Variables**: Components use CSS variables (`--available-height`, `--transform-origin`) for dynamic sizing, not hardcoded pixels.
- **Container Queries**: Components like `Field` use `@container/field-group` — responsive to container width, not viewport.

## Common Gotchas (STOP if you see these)

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

## Pre-Completion Checklist

Every component must pass:

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

## Integration with Designer + Forge-Plan

**Upstream (how shadcn-expert gets invoked):**
- `hyperstack:forge-plan` processes a DESIGN.md Section 5 (Components)
- For each component in the spec, forge-plan calls `shadcn_get_component(name)`
- forge-plan references this skill for architectural guidance

**Downstream (what shadcn-expert produces):**
- Component code that matches DESIGN.md Section 5 variants + states
- All P7 (Components) rules from designer enforced
- Ready for `hyperstack:ship-gate` DESIGN.md compliance check

**Reverse escalation:**
- If DESIGN.md spec is incompatible with shadcn architecture (e.g., specifies a radius that violates the component's base style), escalate to `hyperstack:designer` to reconcile — don't silently adapt.

## Red Flags — STOP (this skill itself)

These are rationalizations you will have when applying this skill. Every one is wrong.

| Thought | Reality |
|---|---|
| "The user didn't say 'shadcn' explicitly, but I'll assume it" | Do NOT assume. Ask or check designer Q11. |
| "I know the shadcn rules from training data" | Training data has standard shadcn (Radix). This is Base UI edition. Call `shadcn_get_rules`. |
| "data-slot is just a naming convention" | No — it is the primary styling selector for parent→child styling. Mandatory. |
| "I'll use Radix because it's more common" | The project chose Base UI. Use @base-ui/react. |
| "Hardcoding pixel positions is faster" | Use Base UI props. Hardcoded px breaks responsive behavior. |
| "This Dialog has 5 slots, I'll combine into one component" | No. Split into sub-components. Monolithic Dialogs are anti-pattern. |
| "I'll skip 'use client' since it seems stateless" | Does it use `data-open` or any state modifier? Then it needs `'use client'`. Check before skipping. |
| "The cn utility is optional" | It is mandatory. All className merging goes through `cn`. |
| "I'll pick variant names that match the brand" | No. Stick to `default/outline/secondary/ghost/destructive`. Custom variants break the system. |
| "shadcn components work with any color system" | No — this edition is OKLCH-native. Hex values break the token system. |
| "I'll use raw HTML since Base UI doesn't have this primitive" | Check first. If truly missing, document why and use semantic HTML. |
