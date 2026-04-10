---
name: using-hyperstack
description: Bootstrap - establishes Hyperstack MCP tools and skills before any technical work. Auto-loaded at session start.
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
Your context was provided by the orchestrating agent. Do not reload bootstrap.
</SUBAGENT-STOP>

**Subagent gate:** If you are a subagent, tool-use context, or delegated executor spawned to complete a specific task — not an interactive session with the user — stop reading here. Do not process the rest of this file. Your context was provided by the orchestrating agent and re-injecting bootstrap would pollute it.

<EXTREMELY-IMPORTANT>
You have Hyperstack. Before answering any technical question about the stacks listed below, you MUST call the relevant MCP tool. Do not answer from memory.
</EXTREMELY-IMPORTANT>

## Instruction Priority

1. User's explicit instructions (CLAUDE.md, direct requests) - always highest
2. Hyperstack skills - override default behavior
3. Default system behavior - lowest

## Layer 1: MCP Tools (Ground-Truth Data)

Call these BEFORE writing any code for these stacks. Memory is not acceptable.

| Namespace | Stack | Key tools |
|---|---|---|
| `reactflow_*` | React Flow v12 | `reactflow_get_api`, `reactflow_search_docs`, `reactflow_get_pattern` |
| `motion_*` | Motion for React v12 | `motion_get_api`, `motion_get_examples`, `motion_get_transitions` |
| `lenis_*` | Lenis smooth scroll | `lenis_get_api`, `lenis_generate_setup`, `lenis_get_pattern` |
| `react_*` | React 19 / Next.js | `react_get_pattern`, `react_get_constraints`, `react_search_docs` |
| `echo_*` | Echo (Go HTTP) | `echo_get_recipe`, `echo_get_middleware`, `echo_decision_matrix` |
| `golang_*` | Go best practices | `golang_get_practice`, `golang_get_pattern`, `golang_get_antipatterns` |
| `rust_*` | Rust practices | `rust_get_practice`, `rust_cheatsheet`, `rust_search_docs` |
| `designer_*` | Design decision engine | `designer_resolve_intent`, `designer_get_personality`, `designer_get_preset`, `designer_get_page_template`, `designer_get_font_pairing`, `designer_get_anti_patterns` |
| `design_tokens_*` | Design token systems | `design_tokens_generate`, `design_tokens_get_category`, `design_tokens_get_gotchas` |
| `ui_ux_*` | UI/UX principles | `ui_ux_get_principle`, `ui_ux_get_component_pattern`, `ui_ux_get_gotchas` |

### MCP Degraded Mode

If MCP tools fail or are unavailable:
1. Inform the user: "Hyperstack MCP server is unavailable - answers may be less precise"
2. Fall back to training data but explicitly flag uncertainty on every answer
3. Never silently answer as if ground-truth data was used

## Layer 2: Skills (Engineering Process)

Use the `Skill` tool to load these before the relevant task type.

### Announcement Iron Law

```
BEFORE invoking any Hyperstack skill, announce it:
"Using hyperstack:[skill-name] — [one-line purpose]"
```

This is non-negotiable. Silent skill invocations are invisible to the user and cannot be audited or corrected. Every step must be traceable.

### Workflow Skills (invoke in this order for feature work)

| Skill | When to invoke |
|---|---|
| `hyperstack:blueprint` | Before any feature build — MCP survey, design gate, negative doubt |
| `hyperstack:forge-plan` | After design approval — MCP-verified implementation plan |
| `hyperstack:run-plan` | Have an existing plan — validate it then execute |
| `hyperstack:engineering-discipline` | During execution — Senior SDE phase gates |
| `hyperstack:ship-gate` | Before any completion claim — evidence required |
| `hyperstack:deliver` | After all tasks complete — final verification and delivery |

### Execution Skills (invoke during implementation)

| Skill | When to invoke |
|---|---|
| `hyperstack:autonomous-mode` | User chose fully autonomous execution — runs all tasks end-to-end, only stops on failure |
| `hyperstack:subagent-ops` | Executing plans with independent tasks — fresh agent per task, two-stage review |
| `hyperstack:test-first` | Before writing any implementation code — red-green-refactor discipline |
| `hyperstack:worktree-isolation` | Before feature work — clean workspace isolation |
| `hyperstack:code-review` | After completing tasks or before merging — dispatch reviewer subagent |
| `hyperstack:parallel-dispatch` | 2+ independent failures or tasks — concurrent agent dispatch |

### Support Skills (invoke when the situation calls for it)

| Skill | When to invoke |
|---|---|
| `hyperstack:designer` | Before any visual/UX work — produces DESIGN.md contract that forge-plan consumes |
| `hyperstack:debug-discipline` | Any bug or unexpected behaviour — root cause first |
| `hyperstack:behaviour-analysis` | UI/UX audits, state machine correctness |
| `hyperstack:design-patterns-skill` | Selecting the right abstraction or design pattern |
| `hyperstack:security-review` | OWASP audits, API and infrastructure security |
| `hyperstack:readme-writer` | Evidence-based documentation |

### Workflow Chain

```
New work:   blueprint → [designer if visual] → forge-plan → choose execution mode → ship-gate → deliver
                    │                      │
                    │                      └── produces DESIGN.md (input to forge-plan)
                    │
Existing:              run-plan ──┤
                                  │
                                  ├→ autonomous-mode (full auto, stops only on failure)
                                  ├→ subagent-ops (fresh agent per task, two-stage review)
                                  └→ engineering-discipline (manual, human checkpoints)

Before execution:  worktree-isolation (clean workspace)
Debugging:         debug-discipline → parallel-dispatch (if independent failures)
```

**Visual work branch:** If the task changes how something looks, feels, moves, or is interacted with, `blueprint` routes through `designer` BEFORE `forge-plan`. The DESIGN.md produced by designer becomes the input spec for forge-plan.

**Skip designer when:** pure backend, single CSS bug fix, performance optimization with no visual change, infra/DevOps, documentation-only.

For non-trivial tasks, follow the chain in order. Do not skip steps.

**Platform tool equivalences:** See `skills/using-hyperstack/references/` for tool name mappings per harness.

### Skill Description Format (CSO)

All Hyperstack skill descriptions MUST follow this format:
- Start with "Use when..." describing triggering conditions
- Never summarize the skill's workflow or process in the description
- Keep under 500 characters

**Why:** When descriptions summarize workflow, the LLM shortcuts the full skill content and follows the summary instead. "Use when..." forces the LLM to load the full skill to learn what to do.

## Red Flags - STOP and Load MCP

| Thought | Correct action |
|---|---|
| "I know this React Flow API from memory" | Call `reactflow_get_api` first |
| "Go error handling is straightforward" | Call `golang_get_practice` first |
| "This is a simple animation" | Call `motion_get_api` or `motion_get_examples` first |
| "I'll write code then check the docs" | Load docs first. Always. |
| "I know the OKLCH token pattern" | Call `design_tokens_get_procedure` first |
| "This pattern looks common, I'll adapt it" | Call the relevant MCP tool. Memory drifts. |

## The Rule

If there is even a 1% chance an MCP tool or skill applies - use it BEFORE responding.

MCP tools for accuracy. Skills for process. Both are non-negotiable.
