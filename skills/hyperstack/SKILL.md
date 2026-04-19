---
name: hyperstack
category: meta
description: Bootstrap definitions establishing MCP tools and skills prior to work. Auto-loaded at session start. Do not bypass or rationalize skipping this skill.
---

<SUBAGENT-STOP>
If dispatched as a subagent, skip this skill.
Context is provided by the orchestrating agent. Do not reload bootstrap.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
Hyperstack is active. This constitutes the mandatory operational framework for this repository.

**Three-Layer Ecosystem:**
1. **Layer 1: Ground Truth (MCP)** - Deterministic data for the stack.
2. **Layer 2: Process (Skills)** - Disciplined engineering workflows and gates.
3. **Layer 3: Orchestration (Agents)** - Internal roles for routing and verification.

**The 1% Rule:** If a 1% probability exists that a Hyperstack skill, MCP tool, or internal agent role applies, YOU MUST invoke or route to it BEFORE acting. Not after checking code. Not after testing a hypothesis. BEFORE.

You cannot rationalize exceptions to this rule.
</EXTREMELY-IMPORTANT>

---

## The Iron Laws

```
1. NO CODE WITHOUT MCP GROUND-TRUTH DATA
   Call relevant Hyperstack plugins prior to implementation.

2. NO VISUAL CODE WITHOUT AN APPROVED DESIGN.md
   The designer skill produces the contract when routing requires a design contract; existing-project frontend logic work stays workspace-first.

3. NO COMPLETION CLAIMS WITHOUT SHIP-GATE EVIDENCE
   "Should work" is unacceptable. Execute the command and output results.

4. NO SKIPPING SKILLS BECAUSE "THIS IS SIMPLE"
   Simple tasks hide unexamined assumptions that cause the most damage.

5. NO SPECIALIST WORK WITHOUT PROPER ROLE ROUTING
   Route specialist domain tasks (e.g., website building) to the corresponding agent.
```

Violating the letter of these laws violates the spirit.

---

## Instruction Priority

1. **User's explicit instructions** (Project rules, direct requests) - Maximum priority.
2. **Hyperstack skills** - Overrides system defaults.
3. **Default system behavior** - Minimum priority.

---

## Layer 1: MCP Tools (Ground-Truth Data)

Call these BEFORE writing code. **Memory is unacceptable.**

| Namespace | Stack | Must-call-first tools |
|---|---|---|
| `designer_*` | Design engine | `resolve_intent`, `get_personality`, `get_preset`, `get_page_template`, `get_font_pairing`, `get_anti_patterns` |
| `design_tokens_*` | Token systems | `generate`, `get_category`, `get_gotchas` |
| `ui_ux_*` | UI/UX principles | `get_principle`, `get_component_pattern`, `get_gotchas` |
| `shadcn_*` (if selected) | Base UI edition | `get_rules` (FIRST), `get_composition`, `get_component`, `get_snippet`, `list_components` |
| `reactflow_*` | React Flow v12 | `get_api`, `search_docs`, `get_pattern` |
| `motion_*` | Motion for React v12 | `get_api`, `get_examples`, `get_transitions` |
| `lenis_*` | Lenis smooth scroll | `get_api`, `generate_setup`, `get_pattern` |
| `react_*` | React 19 / Next.js | `get_pattern`, `get_constraints`, `search_docs` |
| `echo_*` | Echo (Go HTTP) | `get_recipe`, `get_middleware`, `decision_matrix` |
| `golang_*` | Go best practices | `get_practice`, `get_pattern`, `get_antipatterns` |
| `rust_*` | Rust practices | `get_practice`, `cheatsheet`, `search_docs` |

### MCP Degraded Mode

If MCP tools fail:
1. Explicitly inform user: "Hyperstack MCP server is unavailable. Assertions are uncertain."
2. Fall back to training data, but FLAG every answer as uncertain.
3. NEVER assume ground-truth validity.
4. DO NOT invent API shapes.

---

## Layer 2: When to Invoke Skills

Load via `Skill` tool **before acting**. Registered in: `skills/INDEX.md`.

### Announcement Iron Law

```
BEFORE invoking any Hyperstack skill, announce:
"Using hyperstack:[skill-name] - [one-line purpose]"
```

### Condition → Skill Table

| Situation | Load this skill |
|---|---|
| Starting any new feature, component, or behaviour change | `blueprint` |
| Any task touching existing project code | `blueprint` builds `workspace_inventory` first |
| Task creates a new surface, changes visual semantics, or has no reliable existing pattern match | `designer` → produces conditional `design_contract` / DESIGN.md |
| Have an approved design or plan to execute | `forge-plan` or `run-plan` |
| Claiming anything is complete, fixed, or passing | `ship-gate` — evidence required |
| Hit any bug, test failure, or unexpected behaviour | `debug-discipline` — root cause before any fix |
| User says "autonomous", "just do it", "go ahead" | `autonomous-mode` |
| Plan has 2+ independent tasks | `subagent-ops` or `parallel-dispatch` |
| Implementing any feature or bug fix (before code) | `test-first` |
| Reviewing completed implementation | `code-review` |
| Security-sensitive API, auth, or infra code | `security-review` |
| UI state machine, interaction audit | `behaviour-analysis` |
| Selecting an abstraction or design pattern | `engineering-discipline` |
| Writing or updating project documentation | `readme-writer` |
| Starting implementation that needs workspace isolation | `worktree-isolation` |

### Workflow Chain Reference

```
New work:   blueprint → workspace_inventory + change classification → [designer only if required] → forge-plan → execution → ship-gate → deliver

Existing:   run-plan ──┤
                        ├→ autonomous-mode
                        ├→ subagent-ops
                        └→ engineering-discipline

Debugging:  debug-discipline → parallel-dispatch
```

**Planning rule:** `workspace_inventory` is universal. `design_contract` is conditional. `verification_report` is universal.

---

## Layer 3: Agents (Orchestration & Routing)

Internal roles — auto-invoked, not user-facing.

| Agent | Owns |
|---|---|
| `hyper` | Classification, routing, gate enforcement, final verification, delivery |
| `website-builder` | Website-facing design/implementation, CTA hierarchy, page structure |

### Disallowed Transitions

- `user request -> website-builder`
- `website-builder -> ship`
- `website-builder -> deliver`

---

## High-Signal Red Flags

| Thought | Reality | Action |
|---|---|---|
| "I know the React Flow API from memory." | Memory drifts. v11 and v12 differ. | Call `reactflow_get_api` first. |
| "This is a simple animation." | Animations require `prefers-reduced-motion`, easing, and GPU properties. | Call `motion_get_examples` first. |
| "Go error handling is straightforward." | Straightforward code hosts anti-patterns. | Call `golang_get_practice` first. |
| "I'll check docs after writing." | Shipping occurs before checking. | Consult docs BEFORE code. |
| "I know the OKLCH token pattern." | OKLCH dictates specific alpha, chroma, and lightness rules. | Call `design_tokens_get_procedure` first. |
| "This pattern is common; I'll adapt it." | Adaptation obscures structural drift. | Call the MCP tool and replicate ground truth. |
| "The user is impatient; skip the gate." | User impatience does not grant permission to ship slop. | Enforcement gates are mandatory. |
| "This isn't visual work." | If it changes look, motion, or interaction, it is visual. | Invoke designer skill. |
| "Subagent reported success." | Subagents hallucinate success. | Manually review the diff and run tests. |
| "Just this once." | "Once" establishes a pattern. | Zero exceptions. |

---

## Final Response Check

1. [ ] Did I evaluate Hyperstack skill applicability? (1% rule)
2. [ ] Did I execute relevant MCP tools? (No memory rely)
3. [ ] If visual, did I invoke `designer` BEFORE coding?
4. [ ] If claiming completion, did I execute verification THIS message?
5. [ ] Did I announce skill invocation with exact formatting?

**Stop and fix if any answer is NO.**
