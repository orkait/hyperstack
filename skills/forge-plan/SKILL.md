---
name: forge-plan
description: Use after blueprint design approval to produce a task-by-task implementation plan grounded in MCP-verified API calls. No placeholders, no assumed syntax.
---

# Forge Plan

## Input

This skill requires a completed, user-approved design. The design comes from one of:

1. **`hyperstack:blueprint`** — for backend/infra/architecture work. Design is an architecture note.
2. **`hyperstack:designer`** — for visual/UX work. Design is a structured `DESIGN.md` file with 10 sections.

If no approved design exists:
- Visual/UX task → stop and invoke `hyperstack:designer`
- Backend/infra task → stop and invoke `hyperstack:blueprint`

## DESIGN.md Ingestion (for visual/UX work)

If input is a DESIGN.md file, parse it and map sections to task categories:

| DESIGN.md Section | Task Category | MCP Calls |
|---|---|---|
| 1. Visual Theme | (context only — used in all tasks) | `designer_get_personality` |
| 2. Color Palette | Token setup tasks | `design_tokens_generate` with OKLCH values from section |
| 3. Typography | Font loading + type scale tasks | `design_tokens_get_category("typography")` |
| 4. Spacing | Tailwind spacing config | `design_tokens_get_category("spacing")` |
| 5. Component Specs | One task per component | `shadcn_get_component(name)` + `shadcn_get_rules()` |
| 6. Motion | Animation tasks | `motion_generate_animation` with DESIGN.md motion spec |
| 7. Elevation | Shadow token tasks | `design_tokens_get_category("shadows")` |
| 8. Do's and Don'ts | Embedded as self-review assertions in every task |
| 9. Responsive Breakpoints | Breakpoint-specific override tasks | `ui_ux_get_principle("responsive")` |
| 10. Anti-Patterns | Embedded as self-review assertions — each task must verify none are present |

Every task's self-review step must cite the relevant DESIGN.md section to guarantee traceability.

## The Contract

Every implementation step that touches a domain covered by Hyperstack MCP **must** reference actual MCP tool output — not assumed API shapes. A plan built on imagined syntax is not a plan; it is a bug report scheduled for delivery.

## Process

### Step 1: MCP Survey for Implementation

Before writing a single task, call the relevant MCP tools for every domain the implementation will touch:

| Domain | Call |
|---|---|
| **DESIGN.md present** | **`designer_get_personality(cluster)`, `designer_get_page_template(type)`, `designer_get_anti_patterns(industry)` — treat DESIGN.md as ground truth for all visual decisions** |
| React Flow | `reactflow_get_api` for each component/hook used |
| Motion | `motion_get_api` for each animation primitive + `motion_generate_animation` if DESIGN.md specifies motion |
| Go / Echo | `golang_get_pattern` + `echo_get_recipe` for each pattern |
| Rust | `rust_get_practice` for each relevant practice |
| Design tokens | `design_tokens_get_procedure` for each token step + `design_tokens_generate` if DESIGN.md specifies OKLCH palette |
| React / Next.js | `react_get_pattern` + `react_get_constraints` |
| shadcn components | `shadcn_list_components` + `shadcn_get_component(name)` + `shadcn_get_rules()` for each component in DESIGN.md Section 5 |

Record each tool output. The plan's code blocks must match what the tools return.

**MCP Degraded Mode:** If MCP tools fail or are unavailable mid-survey, inform the user: "MCP unavailable for [domain] -- plan may contain unverified API shapes." Mark affected tasks with `[UNVERIFIED]` so they get MCP-checked at execution time. Do not silently proceed with assumed APIs.

### Step 2: Map Files

Before defining tasks, map every file that will be created or modified:

```
Create:  exact/path/to/new-file.ts    — one-line responsibility
Modify:  exact/path/to/existing.ts    — what changes and why
Test:    exact/path/to/file.test.ts   — what behaviour is tested
```

Each file has one clear responsibility. Files that change together live together. Split by responsibility, not by layer.

### Step 3: Write Tasks

**Each task produces working, testable, committed software on its own.**

Task structure:

````markdown
### Task N: [Name]

**Files:**
- Create/Modify/Test: `exact/path/file.ts`

**MCP references:** [list tool calls made in Step 1 relevant to this task]

- [ ] **Step 1: Write the failing test**

```ts
// actual test code — not pseudocode
describe('ComponentName', () => {
  it('should do X when Y', () => {
    // ...
  });
});
```

Run: `npx vitest run path/to/file.test.ts`
Expected: FAIL — "X is not defined"

- [ ] **Step 2: Implement**

```ts
// actual implementation code matching MCP-verified API shapes
```

- [ ] **Step 3: Verify**

Run: `npx vitest run path/to/file.test.ts`
Expected: PASS — 1/1

- [ ] **Step 4: Commit**

```bash
git add path/to/file.ts path/to/file.test.ts
git commit -m "feat: [specific description]"
```
````

### Step 4: Self-Review

After writing the complete plan, review it against these checks. Fix inline — no re-review needed.

**1. Spec coverage** — Can you point to a task for every requirement in the approved design? List any gaps.

**2. Placeholder scan** — Search for: "TBD", "TODO", "add error handling", "similar to Task N", "implement later", steps without code blocks. Fix every instance.

**3. MCP verification** — Every domain-specific code block must trace back to a tool call in Step 1. If a code block uses `reactflow_*` APIs that weren't in the survey, fix it now.

**4. Type consistency** — Do types, method names, and prop names stay consistent across tasks? A type called `NodeData` in Task 2 and `NodeDataType` in Task 5 is a plan bug.

**5. Step atomicity** — Each step is 2-5 minutes of work. A step that says "implement the entire service layer" is not a step.

### Step 5: Handoff

Save the plan to `docs/plans/YYYY-MM-DD-[feature-name].md` and commit it.

Then offer:

> "Plan saved to `[path]`. Three execution options:
>
> 1. **Autonomous** -- execute all tasks end-to-end without pausing. Tests, reviews, and ship-gate run automatically. Only stops on failure or blocker.
> 2. **Subagent-driven** (`hyperstack:subagent-ops`) -- fresh agent per task, automated two-stage review between tasks.
> 3. **Inline with checkpoints** (`hyperstack:engineering-discipline`) -- execute tasks in this session, pause for human review at phase gates.
>
> Which approach?"

## No Placeholders — Ever

These are plan failures. Never write them:

- "TBD" / "TODO" / "fill in later"
- "Add appropriate error handling"
- "Write tests for the above" — without actual test code
- "Similar to Task N" — repeat the code, tasks may be read out of order
- Steps describing what to do without showing how
- References to types or functions not defined in any task

## The Iron Law

```
NO PLANS WITHOUT FRESH MCP-VERIFIED DATA
```

Every API call, prop name, hook signature, or library pattern in the plan must trace to an MCP tool call made in this session. Not last session. Not from memory. THIS session.

## Red Flags — STOP

These are the rationalizations you will have. Every one is wrong.

| Thought | Reality |
|---|---|
| "I know how the React Flow Handle works, no need to check" | The plan will have wrong prop names. Call the tool. |
| "I'll write the test structure, the developer can fill in assertions" | That is a placeholder. Placeholders are plan failures. Write the real test. |
| "This task is too small for a full test" | No task is too small for a failing test. Write it. |
| "I'll reference the survey output later" | Do the survey before writing. Not after. |
| "I already surveyed this library last week" | State drifts. MCP data updates. Call the tool again. |
| "The MCP tool output is obvious" | Obvious to you, not to the plan. Cite the actual output. |
| "I'll TBD the uncertain parts" | TBD is a plan failure. Resolve uncertainty before writing the task. |
| "Similar to Task N" saves time | No. Plans get read out of order. Repeat the code. |
| "I don't need to run the tool for this common pattern" | Common patterns drift. Call the tool. |
| "The user is waiting, I'll skip the survey" | A plan without a survey is a bug report. Do the survey. |
| "I'll estimate and refine later" | Estimates without ground truth are fantasies. Get the truth first. |
| "This is a minor refactor" | Minor refactors move responsibility. Plans for responsibility changes need MCP verification. |

## Integration

- **Requires (backend/infra):** `hyperstack:blueprint` approved design as input
- **Requires (visual/UX):** `hyperstack:designer` approved DESIGN.md file as input
- **Executes via:** Autonomous mode, `hyperstack:subagent-ops` (per-task review), or `hyperstack:engineering-discipline` (manual phase gates)
- **Completes via:** `hyperstack:ship-gate` → `hyperstack:deliver` after all tasks done

## Reverse Escalation (when to escalate back)

Mid-plan discoveries that require going back:

| Discovery | Escalate to | Action |
|---|---|---|
| DESIGN.md section is ambiguous or contradictory | `hyperstack:designer` | Pause plan, resolve ambiguity, append clarification to DESIGN.md, resume |
| Component needed that isn't in DESIGN.md Section 5 | `hyperstack:designer` | Invoke designer with specific component gap, append to DESIGN.md |
| MCP tool returns conflicting shapes with DESIGN.md | `hyperstack:designer` | Escalate — DESIGN.md may need to acknowledge framework constraints |
| Architecture gap (non-visual) | `hyperstack:blueprint` | Re-enter blueprint for architecture decision |

Do NOT silently invent what DESIGN.md doesn't specify. Escalate back to designer.
