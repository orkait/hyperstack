---
name: blueprint
category: core
description: Execute before any feature build, component creation, or behavior change. Performs MCP survey and enforces a hard design gate before implementation. Do not skip or rationalize skipping.
---

# Feature Planning


## The Hard Gate

<HARD-GATE>
Do not write code, scaffold files, or invoke implementation skills until:
1. Workspace inventory is explicit:
   - existing stack
   - owning modules
   - existing patterns
   - verification commands
2. MCP survey is complete for relevant domains.
3. Required artifacts are chosen correctly:
   - `workspace_inventory` → always
   - `task_handoff` → always
   - `design_contract` → required only when the task creates a new surface, changes visual semantics, or has no trustworthy existing pattern match
4. User explicitly approves the plan/design when the chosen artifacts require approval.

This applies to every task, regardless of perceived simplicity.
</HARD-GATE>

## The 1% Rule

If there is a 1% chance this task involves a new file, component, function, behavior change, runtime configuration, or visual/UX modification → run blueprint first. No exceptions.

Simple tasks conceal unexamined assumptions. A 5-minute design prevents hours of incorrect implementation.

## The Process

### Step 1: Context Scan

Read current state before querying the user:
- Relevant source files, recent commits, existing patterns.
- Existing logic applicable for reuse or extension.
- Relevant Hyperstack MCP domains.
- Build `workspace_inventory` first. This is mandatory even for client existing projects.

### Step 2: MCP Survey

| Domain is relevant | Call first |
|---|---|
| **Frontend logic in an existing pattern** | `react_*`, `ui_ux_*`, and stack-specific tools first. No automatic `DESIGN.md`. |
| **New surface / visual-semantic change / no existing pattern match** | **Invoke `skills/designer/SKILL.md`. Produces conditional `design_contract` / DESIGN.md when required.** |
| React Flow | `reactflow_search_docs` + `reactflow_list_apis` |
| Motion / animation | `motion_search_docs` + `motion_list_apis` |
| Lenis scroll | `lenis_search_docs` + `lenis_list_apis` |
| React / Next.js | `react_search_docs` + `react_list_patterns` |
| Go / Echo | `golang_search_docs` + `echo_list_recipes` |
| Rust | `rust_search_docs` + `rust_list_practices` |
| Design tokens | `design_tokens_list_categories` + `design_tokens_get_gotchas` |
| UI/UX | `ui_ux_list_principles` + `ui_ux_get_gotchas` |

Building plans on incorrect API assumptions or missing workspace reality creates immediate technical debt.

**Routing rule:**
- existing-project frontend logic work → keep routing workspace-first
- new page, redesign, component-system change, or visual-semantic change → `designer` owns the conditional design gate
- backend/infra/docs work → no `DESIGN.md` gate

### Step 3: Clarify Requirements

Ask single clarifying questions sequentially:
- Purpose and success criteria (what defines completion?).
- Constraints (performance targets, accessibility, existing patterns).
- Scope boundaries (what is explicitly excluded?).
- Change classification:
  - `backend_only`
  - `frontend_logic`
  - `frontend_visual`
  - `fullstack_slice`
  - `docs_config`

Wait for answers before proceeding. Decompose independent subsystems if necessary.

### Step 4: Propose 2-3 Approaches

Outline for each approach:
- Architectural trade-offs.
- MCP-backed APIs and patterns (cite tool output from Step 2).
- Your recommendation with supporting logic.

Always lead with a firm recommendation.

### Step 5: Present Design

Scale specificity to the complexity:
- **Architecture** → Module boundaries, data flow, abstractions.
- **Invariants** → Immutable runtime truths.
- **Interfaces** → Public APIs between modules and types.
- **Error paths** → Dependency failures, invalid inputs, async timeouts.

Obtain user confirmation. Revise if rejected. Do not proceed until approved.

### Step 6: Negative Doubt

Identify at least 5 failure modes before finalizing:
1. What breaks at runtime under normal conditions?
2. What edge cases are ignored?
3. Which invariants risk concurrent or unexpected state violation?
4. What relevant MCP `get_gotchas` apply?
5. Which external dependency updates could break this?

Address each explicitly: redesign or formally accept the risk.

### Step 7: Handoff to Implementation

Following approval:
- Save design note to the relevant documentation directory.
- For tasks that require a design contract, save DESIGN.md at `docs/DESIGN.md` or `<project>/DESIGN.md`.
- Invoke `hyperstack:forge-plan` to generate an MCP-verified implementation plan based on the approved design.


## Lifecycle Integration

### Agent Workflow Chains

**Website/Frontend Agent:**
`blueprint` (THIS) → workspace inventory + change classification → [`designer` only if required] → `forge-plan` → [execution] → `ship-gate` → `deliver`

**Backend/Infra Agent:**
`blueprint` (THIS) → `forge-plan` (architecture note) → [execution] → `ship-gate` → `deliver`

**Execution Options (selected at forge-plan handoff):**
- `autonomous-mode`: Full auto, stops upon failure.
- `subagent-ops`: Independent agents per task, two-stage review.
- `engineering-discipline`: Manual, phase-gated checkpoints.

### Upstream Dependencies
- `hyperstack`: Enforces 1% rule.

### Downstream Consumers
- `forge-plan`: Reads approved design, generates MCP task plan.
- `designer`: Invoked upon visual/UX routing detection.
- `run-plan`: Invoked to resume existing plans.

### Reverse Escalation
| Discovery | Escalate to | Action |
|---|---|---|
| New surface / visual-semantic change detected mid-task | `designer` | Pause, generate conditional `design_contract`, resume. |
| Architecture gap (non-visual) | `blueprint` | Pause, formalize architecture decision, resume. |
