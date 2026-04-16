---
name: forge-plan
category: core
description: Executed after blueprint/designer approval. Produces task-by-task implementation plan grounded in MCP-verified APIs. Zero placeholders.
---

# Forge Plan

## Input

Requires approved design:
1. **`hyperstack:blueprint`** → Backend/infra/architecture. Input: architecture note.
2. **`hyperstack:designer`** → Visual/UX. Input: 10-section `DESIGN.md`.

No design present:
- Visual/UX task → STOP. Invoke `designer`.
- Backend/infra task → STOP. Invoke `blueprint`.

## DESIGN.md Ingestion (Visual/UX)

Parse DESIGN.md into task categories:

| DESIGN.md Section | Task Category | MCP Calls |
|---|---|---|
| 1. Visual Theme | Context | `designer_get_personality` |
| 2. Color Palette | Token setup | `design_tokens_generate` (OKLCH) |
| 3. Typography | Font loading + scale | `design_tokens_get_category("typography")` |
| 4. Spacing | Tailwind config | `design_tokens_get_category("spacing")` |
| 5. Component Specs | Component impl | shadcn: `shadcn_get_rules`, `get_composition`, `get_component`. Raw Tailwind: `ui_ux_get_component_pattern`. |
| 6. Motion | Animation build | `motion_generate_animation` |
| 7. Elevation | Shadow tokens | `design_tokens_get_category("shadows")` |
| 8. Do's & Don'ts | Self-review | Embedded assertions in tasks |
| 9. Responsive | Breakpoint config | `ui_ux_get_principle("responsive")` |
| 10. Anti-Patterns| Self-review | Embedded validations |

## The Contract

Every implementation step touching an MCP domain MUST reference tool output. Imagined syntax = rejected plan.

## Process

### Step 1: MCP Survey

Query tools BEFORE writing:

| Domain | Call |
|---|---|
| **DESIGN.md present** | **`designer_get_personality`, `get_page_template`, `get_anti_patterns`** |
| React Flow | `reactflow_get_api` |
| Motion | `motion_get_api`, `motion_generate_animation` |
| Go / Echo | `golang_get_pattern`, `echo_get_recipe` |
| Rust | `rust_get_practice` |
| Design tokens | `design_tokens_get_procedure`, `design_tokens_generate` |
| React / Next.js | `react_get_pattern`, `react_get_constraints` |
| shadcn (if selected) | `shadcn_get_rules` (FIRST), `get_composition`, `get_component`, `get_snippet`. Invoke `shadcn-expert` for guidance. |
| Raw Tailwind (if selected) | `ui_ux_get_component_pattern` |
| Other library | Read library documentation |

**Degraded Mode:** If MCP fails, inform user: "MCP unavailable for [domain]. Plan contains unverified API shapes." Mark tasks `[UNVERIFIED]`.

### Step 2: Map Files

```
Create:  path/to/new-file.ts    - one-line purpose
Modify:  path/to/existing.ts    - what changes + why
Test:    path/to/file.test.ts   - behaviour tested
```
Split by responsibility, not by layer. Files changing together live together.

### Step 3: Write Tasks

Task structure MUST be autonomous and testable:

````markdown
### Task N: [Name]

**Files:**
- Create/Modify: `path/file.ts`

**MCP references:** [cite Step 1 outputs]

- [ ] **Step 1: Failing test**
```ts
describe('Component', () => { it('does X', () => { ... }); });
```
Run: `npx vitest run path/file.test.ts` (Expected: FAIL)

- [ ] **Step 2: Implement**
```ts
// actual verified implementation
```

- [ ] **Step 3: Verify**
Run: `npx vitest run path/file.test.ts` (Expected: PASS)

- [ ] **Step 4: Commit**
```bash
git add file.ts file.test.ts
git commit -m "feat: [desc]"
```
````

### Step 4: Self-Review

1. **Spec coverage:** Cover every requirement?
2. **Placeholder scan:** Hunt and destroy "TBD", "TODO", "implement later", "similar to Task N". 
3. **MCP verification:** All APIs trace back?
4. **Type consistency:** Signatures match?
5. **Atomicity:** Steps represent 2-5 minutes of work?

### Step 5: Handoff

Save to `docs/plans/YYYY-MM-DD-[feature].md`. Commit. Ask user:

> "Plan saved. Execution options:
> 1. **Autonomous** (`autonomous-mode`) - End-to-end auto.
> 2. **Subagent-driven** (`subagent-ops`) - Strict agent handoff per task.
> 3. **Manual checkpoints** (`engineering-discipline`) - Execute, pause for human review."

## NO PLACEHOLDERS 

Never write:
- "TBD" / "fill in later"
- "Add error handling" (write it)
- "Write tests for above" (provide code)
- "Similar to Task N" (copy it)

## IRON LAW

```
NO PLANS WITHOUT FRESH MCP-VERIFIED DATA
```

Prop names and hook signatures trace to THIS session's MCP output. Not memory. Not last session.

## RED FLAGS - STOP

| Thought | Reality |
|---|---|
| "I know the React Flow API." | Write wrong props. Call tool. |
| "Tester writes assertions." | Placeholder detected. Write the test. |
| "Too small for test." | All tasks require tests. |
| "Run survey later." | Survey dictates plan. Run first. |
| "Tool output obvious." | Cite it anyway. |
| "TBD uncertain parts." | Resolve before writing. |
| "Similar to Task N." | Plans read piecemeal. Repeat code. |

## Reverse Escalation

| Discovery | Escalate to | Action |
|---|---|---|
| DESIGN.md ambiguous | `designer` | Append clarification. Resume. |
| Missing component | `designer` | Invoke for gap. Update DESIGN.md. |
| MCP tool conflict | `designer` | Acknowledge framework constraints. |
| Architecture gap | `blueprint` | Formalize structural decision. |

## Lifecycle

**Frontend Agent:**
`blueprint` → `designer` → `forge-plan` (THIS) → `[execution]` → `ship-gate` → `deliver`

**Backend Agent:**
`blueprint` → `forge-plan` (THIS) → `[execution]` → `ship-gate` → `deliver`
