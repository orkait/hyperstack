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
