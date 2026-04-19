---
name: shadcn-expert
category: domain
description: Advanced shadcn/ui architect specializing in Base UI, Tailwind v4, data-slot patterns, and component composition. Use when building, auditing, or refactoring UI components with shadcn/ui. ONLY applies when the user has explicitly chosen shadcn as the component library - do not assume.
---

# shadcn/ui Expert (Base UI Edition)


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
hyperstack:blueprint → workspace_inventory + change classification
       │
       ▼ (if shadcn chosen and design contract required)
hyperstack:designer → conditional DESIGN.md / design_contract
       │
       ▼
hyperstack:forge-plan reads workspace + routed requirements
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
Implementation tasks per routed component requirements
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

**Upstream:** `hyperstack:forge-plan` processes routed component requirements. If a design contract exists, it uses the relevant component sections. Existing-project frontend logic work may stay workspace-first without forcing a design contract.

**Downstream:** Component code matching required variants + states, all P7 (Components) rules enforced, ready for `hyperstack:ship-gate`

**Reverse escalation:** If a routed design contract is incompatible with shadcn architecture, escalate to `hyperstack:designer` to reconcile. Don't silently adapt.



## Lifecycle Integration

### Agent Workflow Chains

**Website/Frontend Agent (if Q11b=shadcn):**
```
blueprint → workspace inventory / change classification → [designer only if required] → forge-plan → shadcn-expert (THIS) → [component implementation]
                                                                                                   ↓
                                                                                         [shadcn_* MCP tools]
```

### Upstream Dependencies
- Q11b chose shadcn/ui (Base UI edition)
- `forge-plan` → processes routed component requirements → calls shadcn_get_component per component

### Downstream Consumers
- Component code matching routed variants + states
- `ship-gate` → P7 (Components) rules enforced

### Reverse Escalation
| Discovery | Escalate to | Action |
|---|---|---|
| Design contract incompatible with shadcn architecture | `designer` | Reconcile design contract with Base UI constraints |

### When NOT to Use
- User chose raw Tailwind (no component library)
- User chose Material UI, Mantine, Chakra, Ant Design
- User hasn't specified component library yet → ask first
