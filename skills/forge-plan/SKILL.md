---
name: forge-plan
category: core
description: Use after blueprint design approval to produce a task-by-task implementation plan grounded in MCP-verified API calls. No placeholders, no assumed syntax.
---

# Forge Plan

## Input

Requires a completed, user-approved design from one of:

1. **`hyperstack:blueprint`** → backend/infra/architecture work. Design = architecture note.
2. **`hyperstack:designer`** → visual/UX work. Design = structured `DESIGN.md` with 10 sections.

No approved design:
- Visual/UX task → stop, invoke `hyperstack:designer`
- Backend/infra task → stop, invoke `hyperstack:blueprint`

## DESIGN.md Ingestion (visual/UX work)

Parse DESIGN.md and map sections to task categories:

| DESIGN.md Section | Task Category | MCP Calls |
|---|---|---|
| 1. Visual Theme | (context only - used in all tasks) | `designer_get_personality` |
| 2. Color Palette | Token setup tasks | `design_tokens_generate` with OKLCH values |
| 3. Typography | Font loading + type scale tasks | `design_tokens_get_category("typography")` |
| 4. Spacing | Tailwind spacing config | `design_tokens_get_category("spacing")` |
| 5. Component Specs | One task per component | shadcn → `shadcn_get_rules` + `shadcn_get_composition` + `shadcn_get_component`. Raw Tailwind → `ui_ux_get_component_pattern` + hand-build. Other library → use that library's own docs. |
| 6. Motion | Animation tasks | `motion_generate_animation` with DESIGN.md motion spec |
| 7. Elevation | Shadow token tasks | `design_tokens_get_category("shadows")` |
| 8. Do's and Don'ts | Embedded as self-review assertions in every task |
| 9. Responsive Breakpoints | Breakpoint-specific override tasks | `ui_ux_get_principle("responsive")` |
| 10. Anti-Patterns | Embedded as self-review assertions - each task must verify none present |

Every task's self-review step must cite the relevant DESIGN.md section for traceability.

## The Contract

Every implementation step touching a domain covered by Hyperstack MCP **must** reference actual MCP tool output. Plan built on imagined syntax = bug report scheduled for delivery.

## Process

### Step 1: MCP Survey for Implementation

Before writing a single task, call relevant MCP tools for every domain the implementation will touch:

| Domain | Call |
|---|---|
| **DESIGN.md present** | **`designer_get_personality(cluster)`, `designer_get_page_template(type)`, `designer_get_anti_patterns(industry)` - DESIGN.md is ground truth for all visual decisions** |
| React Flow | `reactflow_get_api` for each component/hook used |
| Motion | `motion_get_api` for each animation primitive + `motion_generate_animation` if DESIGN.md specifies motion |
| Go / Echo | `golang_get_pattern` + `echo_get_recipe` for each pattern |
| Rust | `rust_get_practice` for each relevant practice |
| Design tokens | `design_tokens_get_procedure` per token step + `design_tokens_generate` if DESIGN.md specifies OKLCH palette |
| React / Next.js | `react_get_pattern` + `react_get_constraints` |
| shadcn (only if Q11b chose shadcn) | `shadcn_get_rules` (first) + `shadcn_get_composition(page_type)` + `shadcn_get_component(name)` + `shadcn_get_snippet(name)`. Invoke `hyperstack:shadcn-expert` for architectural guidance. |
| Raw Tailwind (only if Q11b chose raw Tailwind) | `ui_ux_get_component_pattern(name)` per component. Hand-build from DESIGN.md Section 5. No library wrapper. |
| Other component library (MUI, Mantine, Chakra, Ant Design) | Use the library's own docs. Hyperstack has no plugin for these. Flag to user. |

Record each tool output. Plan's code blocks must match what tools return.

**MCP Degraded Mode:** Tools fail → inform user: "MCP unavailable for [domain] - plan may contain unverified API shapes." Mark affected tasks `[UNVERIFIED]`. Don't silently proceed with assumed APIs.

### Step 2: Map Files

Before defining tasks, map every file to be created or modified:

```
Create:  exact/path/to/new-file.ts    - one-line responsibility
Modify:  exact/path/to/existing.ts    - what changes and why
Test:    exact/path/to/file.test.ts   - what behaviour is tested
```

Each file has one clear responsibility. Files that change together live together. Split by responsibility, not by layer.

### Step 3: Write Tasks

**Each task produces working, testable, committed software on its own.**

Task structure:

````markdown
### Task N: [Name]

**Files:**
- Create/Modify/Test: `exact/path/file.ts`

**MCP references:** [tool calls from Step 1 relevant to this task]

- [ ] **Step 1: Write the failing test**

```ts
describe('ComponentName', () => {
  it('should do X when Y', () => {
    // ...
  });
});
```

Run: `npx vitest run path/to/file.test.ts`
Expected: FAIL - "X is not defined"

- [ ] **Step 2: Implement**

```ts
// actual implementation matching MCP-verified API shapes
```

- [ ] **Step 3: Verify**

Run: `npx vitest run path/to/file.test.ts`
Expected: PASS - 1/1

- [ ] **Step 4: Commit**

```bash
git add path/to/file.ts path/to/file.test.ts
git commit -m "feat: [specific description]"
```
````

### Step 4: Self-Review

After writing the complete plan, check inline:

1. **Spec coverage** → task for every requirement in the approved design? List gaps.
2. **Placeholder scan** → search for "TBD", "TODO", "add error handling", "similar to Task N", "implement later", steps without code blocks. Fix every instance.
3. **MCP verification** → every domain-specific code block traces back to a tool call in Step 1.
4. **Type consistency** → types, method names, prop names consistent across tasks.
5. **Step atomicity** → each step = 2-5 minutes of work. "Implement the entire service layer" is not a step.

### Step 5: Handoff

Save plan to `docs/plans/YYYY-MM-DD-[feature-name].md` and commit.

Then offer:

> "Plan saved to `[path]`. Three execution options:
>
> 1. **Autonomous** - execute all tasks end-to-end without pausing. Tests, reviews, ship-gate run automatically. Only stops on failure.
> 2. **Subagent-driven** (`hyperstack:subagent-ops`) - fresh agent per task, automated two-stage review between tasks.
> 3. **Inline with checkpoints** (`hyperstack:engineering-discipline`) - execute tasks in this session, pause for human review at phase gates.
>
> Which approach?"

## No Placeholders - Ever

Plan failures → never write:
- "TBD" / "TODO" / "fill in later"
- "Add appropriate error handling"
- "Write tests for the above" without actual test code
- "Similar to Task N" → repeat the code, tasks may be read out of order
- Steps describing what to do without showing how
- References to types or functions not defined in any task

## The Iron Law

```
NO PLANS WITHOUT FRESH MCP-VERIFIED DATA
```

Every API call, prop name, hook signature, or library pattern must trace to an MCP tool call made in THIS session. Not last session. Not from memory.

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "I know how React Flow Handle works, no need to check" | Plan will have wrong prop names. Call the tool. |
| "I'll write the test structure, developer can fill in assertions" | That's a placeholder. Write the real test. |
| "This task is too small for a full test" | No task is too small for a failing test. |
| "I'll reference the survey output later" | Do the survey before writing. Not after. |
| "I already surveyed this library last week" | State drifts. MCP data updates. Call again. |
| "The MCP tool output is obvious" | Cite the actual output. |
| "I'll TBD the uncertain parts" | TBD = plan failure. Resolve uncertainty before writing the task. |
| "Similar to Task N saves time" | Plans get read out of order. Repeat the code. |
| "I don't need to run the tool for this common pattern" | Common patterns drift. Call the tool. |
| "User is waiting, I'll skip the survey" | Plan without survey = bug report. Do the survey. |
| "This is a minor refactor" | Minor refactors move responsibility. Plans for responsibility changes need MCP verification. |

## Integration

- **Requires (backend/infra):** `hyperstack:blueprint` approved design
- **Requires (visual/UX):** `hyperstack:designer` approved DESIGN.md
- **Executes via:** Autonomous mode, `hyperstack:subagent-ops`, or `hyperstack:engineering-discipline`
- **Completes via:** `hyperstack:ship-gate` → `hyperstack:deliver`

## Reverse Escalation

| Discovery | Escalate to | Action |
|---|---|---|
| DESIGN.md section ambiguous or contradictory | `hyperstack:designer` | Pause plan, resolve, append clarification to DESIGN.md, resume |
| Component needed not in DESIGN.md Section 5 | `hyperstack:designer` | Invoke designer with specific gap, append to DESIGN.md |
| MCP tool returns conflicting shapes with DESIGN.md | `hyperstack:designer` | DESIGN.md may need to acknowledge framework constraints |
| Architecture gap (non-visual) | `hyperstack:blueprint` | Re-enter blueprint for architecture decision |

Don't silently invent what DESIGN.md doesn't specify. Escalate back to designer.


## Lifecycle Integration

### Agent Workflow Chains

**Website/Frontend Agent:**
```
blueprint → designer → forge-plan (THIS) → [execution] → ship-gate → deliver
                            ↓
                      DESIGN.md ingestion
                            ↓
                  [shadcn-expert if Q11b=shadcn]
```

**Backend/Infra Agent:**
```
blueprint → forge-plan (THIS) → [execution] → ship-gate → deliver
                ↓
          architecture note
```

**Execution handoff (user chooses):**
- `autonomous-mode` → full auto end-to-end
- `subagent-ops` → fresh agent per task
- `engineering-discipline` → manual with checkpoints

### Upstream Dependencies
- `blueprint` → approved architecture note (backend/infra)
- `designer` → approved DESIGN.md (visual/UX)

### Downstream Consumers
- `autonomous-mode` | `subagent-ops` | `engineering-discipline` → executes plan
- `shadcn-expert` → if Q11b=shadcn, per-component guidance
- `worktree-isolation` → clean workspace before execution

### Reverse Escalation
| Discovery | Escalate to | Action |
|---|---|---|
| DESIGN.md section ambiguous | `designer` | Pause, resolve, append to DESIGN.md |
| Component not in DESIGN.md Section 5 | `designer` | Add to DESIGN.md |
| MCP tool conflicts with DESIGN.md | `designer` | Reconcile framework constraints |
| Architecture gap (non-visual) | `blueprint` | Re-enter for decision |
