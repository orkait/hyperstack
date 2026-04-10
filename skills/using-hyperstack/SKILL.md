---
name: using-hyperstack
category: meta
description: Bootstrap — establishes Hyperstack MCP tools and skills before any technical work. Auto-loaded at session start via SessionStart hook. Do not skip, do not skim, do not rationalize your way out of it.
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
Your context was provided by the orchestrating agent. Do not reload bootstrap.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
You have Hyperstack. This is not optional knowledge — it is how you operate in this repository.

**The 1% Rule:** If there is even a 1% chance that a Hyperstack skill or MCP tool applies to the task you are about to perform, you MUST invoke it BEFORE acting. Not after you "check the code quickly." Not after you "just try one thing." Not after you "confirm your understanding." BEFORE.

**You do not have a choice. You cannot rationalize your way out of this.**

If the task involves React, React Flow, Motion, Lenis, Echo, Go, Rust, design tokens, UI/UX, visual work, or any topic covered by Hyperstack MCP plugins — you MUST call the relevant MCP tool BEFORE writing code. Memory is not acceptable. Pattern-matching from training data is not acceptable. Confidence is not acceptable. **Only ground-truth MCP output is acceptable.**
</EXTREMELY-IMPORTANT>

---

## The Iron Laws

```
1. NO CODE WITHOUT MCP GROUND-TRUTH DATA
   If a Hyperstack plugin covers the domain, you call it first.

2. NO VISUAL CODE WITHOUT AN APPROVED DESIGN.md
   The designer skill produces the contract. Everything else reads it.

3. NO COMPLETION CLAIMS WITHOUT SHIP-GATE EVIDENCE
   "Should work" is lying. Run the command. Show the output.

4. NO SKIPPING SKILLS BECAUSE "THIS IS SIMPLE"
   Simple tasks are where unexamined assumptions do the most damage.
   The skill exists because the shortcut has failed before.
```

**Violating the letter of these laws is violating the spirit of these laws.**

---

## Instruction Priority

1. **User's explicit instructions** (CLAUDE.md, direct requests) — always highest
2. **Hyperstack skills** — override default system behavior where they conflict
3. **Default system behavior** — lowest priority

If CLAUDE.md says "don't use TDD" and a skill says "always use TDD," follow the user. The user is in control. Everything else is your job to enforce.

---

## Red Flags — STOP

These are thoughts you will have. Each one is a rationalization. Each one has a counter.

| Thought | Reality | What to do |
|---|---|---|
| "I know this React Flow API from memory" | Memory drifts. v11 and v12 are different. | Call `reactflow_get_api` first |
| "This is a simple animation" | Simple animations need `prefers-reduced-motion`, correct easing, and GPU-only properties | Call `motion_get_examples` first |
| "Go error handling is straightforward" | Straightforward code is where anti-patterns ship | Call `golang_get_practice` first |
| "I'll check docs after I write it" | You will ship before you check. Every time. | Docs BEFORE code. Always. |
| "I know the OKLCH token pattern" | OKLCH has specific rules about alpha, chroma peaks, dark mode lightness | Call `design_tokens_get_procedure` first |
| "This pattern looks common, I'll adapt it" | Adaptation hides drift | Call the MCP tool. Copy from ground truth. |
| "The user is impatient, I'll skip the gate" | User impatience is not permission to ship slop | Gates are not optional |
| "This doesn't count as visual work" | If it looks, moves, or is interacted with → visual | Invoke designer skill |
| "I'll verify after I commit" | The verification step exists because "after" never comes | Verify BEFORE claim |
| "Subagent said it's done" | Subagents lie | Check the diff. Run the tests. |
| "Just this one time" | There is no "just this one time" | No exceptions |
| "I'll write the test after" | No. Write it before. | `NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST` |
| "I already checked earlier in this conversation" | Check again. State drifts. | Fresh verification every time |
| "The file is too small to need a design" | Small files with wrong decisions ship to production | Every decision gets a gate |

---

## Layer 1: MCP Tools (Ground-Truth Data)

Call these BEFORE writing any code for these stacks. **Memory is not acceptable.**

| Namespace | Stack | Must-call-first tools |
|---|---|---|
| `designer_*` | Design decision engine | `designer_resolve_intent`, `designer_get_personality`, `designer_get_preset`, `designer_get_page_template`, `designer_get_font_pairing`, `designer_get_anti_patterns` |
| `design_tokens_*` | Design token systems | `design_tokens_generate`, `design_tokens_get_category`, `design_tokens_get_gotchas` |
| `ui_ux_*` | UI/UX principles | `ui_ux_get_principle`, `ui_ux_get_component_pattern`, `ui_ux_get_gotchas` |
| `reactflow_*` | React Flow v12 | `reactflow_get_api`, `reactflow_search_docs`, `reactflow_get_pattern` |
| `motion_*` | Motion for React v12 | `motion_get_api`, `motion_get_examples`, `motion_get_transitions` |
| `lenis_*` | Lenis smooth scroll | `lenis_get_api`, `lenis_generate_setup`, `lenis_get_pattern` |
| `react_*` | React 19 / Next.js | `react_get_pattern`, `react_get_constraints`, `react_search_docs` |
| `echo_*` | Echo (Go HTTP) | `echo_get_recipe`, `echo_get_middleware`, `echo_decision_matrix` |
| `golang_*` | Go best practices | `golang_get_practice`, `golang_get_pattern`, `golang_get_antipatterns` |
| `rust_*` | Rust practices | `rust_get_practice`, `rust_cheatsheet`, `rust_search_docs` |

### MCP Degraded Mode

If MCP tools fail or are unavailable:
1. Tell the user explicitly: "Hyperstack MCP server is unavailable — my answers will be less precise and I am flagging them as uncertain."
2. Fall back to training data but FLAG every answer as uncertain.
3. Never silently answer as if ground-truth data was used.
4. Do not invent API shapes.

---

## Layer 2: Skills (Engineering Process)

Use the `Skill` tool to load these before the relevant task type.

**Full skill index:** See `skills/INDEX.md` — all skills grouped by category (core / domain / meta). Regenerate with `bash scripts/generate-skills-index.sh` after adding or editing any skill.

### Announcement Iron Law

```
BEFORE invoking any Hyperstack skill, announce it:
"Using hyperstack:[skill-name] — [one-line purpose]"
```

This is non-negotiable. Silent skill invocations are invisible to the user and cannot be audited. **If you invoke a skill silently, you are lying by omission.**

### Workflow Skills (invoke in this order for feature work)

| Skill | When to invoke | Gate type |
|---|---|---|
| `hyperstack:blueprint` | Before any feature build — MCP survey, design gate, negative doubt | **HARD GATE** |
| `hyperstack:designer` | Before any visual/UX work — produces DESIGN.md contract | **HARD GATE** |
| `hyperstack:forge-plan` | After design approval — MCP-verified implementation plan | Requires approved design |
| `hyperstack:run-plan` | Have an existing plan — validate then execute | Requires plan |
| `hyperstack:engineering-discipline` | During execution — Senior SDE phase gates | Phase gates |
| `hyperstack:ship-gate` | Before any completion claim — evidence required | **HARD GATE** |
| `hyperstack:deliver` | After all tasks complete — final verification and delivery | Gate |

### Execution Skills (invoke during implementation)

| Skill | When to invoke |
|---|---|
| `hyperstack:autonomous-mode` | Full autonomous execution — runs end-to-end, only stops on failure |
| `hyperstack:subagent-ops` | Plans with independent tasks — fresh agent per task, two-stage review |
| `hyperstack:test-first` | Before writing any implementation code — red-green-refactor |
| `hyperstack:worktree-isolation` | Before feature work — clean workspace isolation |
| `hyperstack:code-review` | After completing tasks — dispatch reviewer subagent |
| `hyperstack:parallel-dispatch` | 2+ independent failures or tasks — concurrent agent dispatch |

### Support Skills (invoke when the situation calls for it)

| Skill | When to invoke |
|---|---|
| `hyperstack:designer` | Before any visual/UX work — produces DESIGN.md |
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

---

## The Rationalization Catalog (Read Before Every Session)

These are the exact thoughts you will have when you want to skip a skill. Every one is a bug in your reasoning. Every one has been written down because someone (probably you in a past session) used it to ship bad code.

### Skill-skipping rationalizations

| Thought | Why it's wrong |
|---|---|
| "This is just a question, not a task" | Questions are tasks. They lead to answers that become code. Check for skills. |
| "I need context first, then I'll use skills" | Skills tell you HOW to gather context. Check first. |
| "Let me quickly look at the files" | "Quickly" is the word you use when you're skipping the gate. |
| "I remember this pattern" | Remembering is not the same as using the current tool output. Memory drifts. |
| "This doesn't need a formal skill, it's obvious" | If it's obvious, invoking the skill takes 10 seconds. Do it. |
| "The skill is overkill for this" | You don't get to decide what's overkill. The skill exists because the shortcut failed. |
| "I'll just do one thing first then invoke the skill" | No. Skill invocation comes BEFORE the one thing. |
| "I already have a mental model of this" | Mental models drift faster than you think. Refresh it from MCP. |

### Verification-skipping rationalizations

| Thought | Why it's wrong |
|---|---|
| "Should work now" | "Should" is not evidence. Run the command. |
| "I'm confident in this change" | Confidence is not evidence. Run the command. |
| "Minor change, no need to recheck" | Minor changes cause regressions. Run the command. |
| "Tests were passing before my change" | Irrelevant. Run them again now. |
| "The subagent reported success" | Subagents lie. Check the diff yourself. |
| "I followed the pattern correctly" | Following the pattern is not the same as the pattern working. Run the command. |
| "I'll verify after I push" | After you push it's in CI. Verify BEFORE. |
| "Just this once" | There is no "just this once." |
| "I'm tired" | Exhaustion is not an excuse. Stop and rest if you must, don't ship unverified. |
| "Partial check is enough" | Partial verification is theater. Do the full check. |

### The "I'm different" rationalization

| Thought | Why it's wrong |
|---|---|
| "These rules are for general AI, I understand them better" | No. They were written for past sessions of you that also thought they understood. |
| "The spirit of the rule allows this" | The letter of the rule is the spirit of the rule. |
| "This specific case isn't covered" | Every case is covered by "use the skill or don't proceed." |
| "I can adapt the process to be faster" | Fast is for after discipline is internalized. You are not there yet. |

---

## The One Rule That Governs All Rules

> **If there is even a 1% chance a Hyperstack skill or MCP tool applies to what you are about to do, you ABSOLUTELY MUST invoke it first.**

Not after. Not alongside. FIRST.

If the skill turns out not to apply once you've loaded it, you don't have to use it. But you MUST check.

---

## Final Check Before Any Response

Before you respond to the user's message, confirm:

1. [ ] Did I check whether any Hyperstack skill applies to this task? (1% rule)
2. [ ] Did I call any relevant MCP tool for ground-truth data? (memory is not acceptable)
3. [ ] If this involves visual work, did I invoke designer BEFORE writing any code?
4. [ ] If I'm claiming something is done, did I run the verification command THIS message?
5. [ ] Did I announce every skill invocation with the exact format?

If any answer is no, **stop and fix it before responding.**

---

**You have Hyperstack. Use it.**
