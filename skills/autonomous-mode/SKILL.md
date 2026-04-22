---
name: autonomous-mode
category: core
description: Use when the user chooses fully autonomous execution. Aggressively uses the entire Hyperstack to implement the solution end-to-end without asking for human review.
---

# Autonomous Mode

## What This Is

You are unleashed. Execute the full plan end-to-end, aggressively using every Hyperstack MCP tool, web search, and skill to make evidence-backed decisions. You do not ask the user for review, clarification on covered topics, or permission between tasks. You think, you verify, you implement, you move.

The user gets the finished product. Not questions. Not checkpoints. Not "does this look right?"

## The Iron Law

```
AUTONOMOUS DOES NOT MEAN UNDISCIPLINED.
AUTONOMOUS MEANS YOU ARE THE DISCIPLINE.
```

You use the entire Hyperstack aggressively:
- Every MCP tool that could be relevant -- call it
- Every quality gate -- run it yourself
- Every decision point -- make it with evidence, log the reasoning, keep moving
- Every ambiguity -- resolve it using MCP data, web search, codebase patterns, and engineering judgment
- Every uncertainty -- ground it with a deterministic check before proceeding

You are the senior engineer, the reviewer, the QA, and the decision-maker. The user trusts you to use Hyperstack to its full capacity and deliver a correct solution.

## When to Use

- User explicitly chose autonomous execution
- Plan has been approved (via `blueprint` or `run-plan` validation)
- User said something like "just do it", "go ahead", "autonomous", "don't ask, build it"

## The Autonomous Loop: Reason-Act-Verify

Every action in autonomous mode follows this tight loop. This is not optional -- it is the structure that prevents drift.

```
REASON: State what you're about to do and why (one line, logged in decision log)
ACT:    Execute the action (write code, run command, call MCP tool)
VERIFY: Check the result against a deterministic signal (test output, exit code, MCP data, type check)
        If PASS → next action
        If FAIL → course-correct (see Self-Correction Hierarchy)
```

Never skip the VERIFY step. "It looks right" is not verification. A passing test, a zero exit code, a matching MCP output -- those are verification.

## Process

### Step 1: Pre-Flight

Before writing any code:

1. **Worktree** -- set up a clean workspace via `hyperstack:worktree-isolation`
2. **Aggressive MCP survey** -- for EVERY domain the plan touches, call the MCP tools proactively. Do not wait until you need them. Load ground truth for all relevant APIs upfront:

   | Domain in plan | Call NOW |
   |---|---|
   | React Flow | `reactflow_search_docs` + `reactflow_list_apis` + `reactflow_get_api` for each component |
   | Motion | `motion_search_docs` + `motion_list_apis` |
   | Go / Echo | `golang_search_docs` + `echo_list_recipes` + `echo_list_middleware` |
   | Rust | `rust_search_docs` + `rust_list_practices` |
   | React / Next.js | `react_search_docs` + `react_list_patterns` + `react_get_constraints` |
   | Design tokens | `design_tokens_list_categories` + `design_tokens_get_gotchas` |
   | UI/UX | `ui_ux_list_principles` + `ui_ux_get_gotchas` |

3. **Baseline** -- run the full test suite. Record the pass count. This is your before-state.
4. **Task list** -- create tasks from the plan. All visible, all pending.
5. **Decision log** -- start a running log of autonomous decisions. Format: `Decision: [what] | Evidence: [source] | Alternatives rejected: [what and why]`. This log is presented to the user at delivery.

### Step 2: Execute All Tasks

For each task in order:

1. Mark in progress
2. **MCP verify** -- call specific MCP tools for the APIs/patterns used in THIS task. Cross-reference against Step 1 survey. If anything was missed, update now.
3. **Test first** -- write the failing test. Run it. Confirm it fails for the right reason. (Inline `test-first` discipline -- you execute the discipline directly, not via Skill tool.)
4. **Implement** -- write minimal code to pass. Use MCP-verified API shapes. No guessing.
5. **Verify** -- run the test. Run full suite. Zero regressions. Check exit codes, not vibes.
6. **Self-review** -- read your own diff for this task. Check: matches plan? No debug artifacts? No unintended scope? If you spot something wrong, fix it immediately.
7. **Commit** -- atomic commit with descriptive message
8. Mark complete, move to next

### Self-Correction Hierarchy

When something goes wrong during execution, follow this hierarchy in order. Each level is tried before escalating to the next.

```
Level 1: MCP GROUND TRUTH
         Call the relevant MCP tool. The answer is usually in the docs.

Level 2: CODEBASE PATTERN MATCH
         Grep for similar working implementations in the existing codebase.
         What works elsewhere that's similar to what's broken?

Level 3: WEB SEARCH
         Search the web for the specific error, API, or pattern.
         Use targeted queries: "[library] [version] [specific error or API name]"
         Cross-reference results against MCP data -- web results can be outdated.
         Prefer: official docs, GitHub issues, Stack Overflow answers with accepted solutions.
         Reject: blog posts with no version info, AI-generated content, results for wrong versions.

Level 4: DEBUG DISCIPLINE
         Full root cause investigation via debug-discipline:
         Read error in full → reproduce → check recent changes → trace data flow
         Form hypothesis → test minimally → fix
         If fixed within 2 attempts: continue
         If 3rd attempt fails: ABORT (see abort conditions)

Level 5: ABORT
         You've exhausted self-correction. Stop and report to user.
```

**Web search is not a first resort.** MCP data is ground truth. Codebase patterns are proven. Web search is for when those two are insufficient -- unfamiliar errors, third-party library quirks, platform-specific issues, or gaps in MCP coverage.

**Web search IS mandatory when:**
- You encounter an error message you don't recognize and MCP has no relevant data
- You're using a library or API not covered by Hyperstack's MCP namespaces
- The MCP data seems outdated or incomplete for the specific version in use
- You're debugging a platform-specific issue (OS, browser, runtime version)

### Decision-Making Without the User

**On ambiguity in the plan:** Do not ask the user. Resolve using:
1. MCP tool output (ground truth)
2. Existing codebase patterns (grep for similar implementations)
3. Web search (if MCP and codebase are insufficient)
4. Engineering judgment (pick the simpler, more maintainable option)
5. Log every decision: `Decision: [what] | Evidence: [source] | Alternatives rejected: [why]`

**On missing information:** Do not guess. Exhaust the self-correction hierarchy first. If all 4 levels fail, this becomes an abort condition.

**On style/approach choices:** Follow existing codebase conventions. If no convention exists, pick the simpler option and log it.

### Step 3: Final Verification

After all tasks complete:

1. `git diff <base-branch>..HEAD` -- full diff review
2. Does the diff match the plan? Fix any drift.
3. Debug artifacts scan: remove console.logs, TODO comments, temporary code
4. Full test suite -- all green
5. Type/lint check -- zero errors
6. Run `hyperstack:ship-gate` -- evidence-backed completion verification

All of this runs without asking the user anything.

### Step 4: Deliver

Invoke `hyperstack:deliver`. This is the ONLY human touchpoint.

Present the user with:
- Summary of what was built (per-task, one line each)
- **Decision log** -- every autonomous decision with evidence and rejected alternatives
- Test results (before/after pass counts)
- Delivery options (PR / squash / branch)

## What Runs Automatically (Everything)

| Gate | How |
|---|---|
| MCP API verification | Aggressively, per-domain upfront + per-task inline |
| Web search | On unfamiliar errors, uncovered APIs, version-specific issues |
| Test-first discipline | Inline, every task, no exceptions |
| Full test suite | After every task + final |
| Debug-discipline | Inline on any failure, up to 3 attempts |
| Self-review | After every task + final diff review |
| Ship-gate | Final gate before delivery |
| Decision logging | Every autonomous choice recorded with evidence |

## Abort Conditions (the ONLY things that stop you)

1. **3-strike escalation** -- 3 failed fix attempts on a single task after exhausting the full self-correction hierarchy. Architectural problem you cannot solve alone. Stop and report with full evidence of what you tried.
2. **MCP down for critical domain** -- you cannot verify API shapes and the task requires domain-specific code. Try web search as fallback. If web results are insufficient or untrustworthy, stop and report.
3. **Test suite collapse** -- 3+ unrelated failures after a single task. Something systemic broke. Stop and report.
4. **Scope impossibility** -- you discover the plan requires something fundamentally impossible (missing dependency, incompatible library versions, circular requirement). Stop and report.
5. **Security concern** -- you discover the implementation would introduce a vulnerability (injection, auth bypass, data leak). Stop and report. Never ship insecure code autonomously.
6. **Information exhaustion** -- all 4 levels of self-correction (MCP, codebase, web search, debug-discipline) failed to resolve the issue. Stop and report what you tried at each level.

**Everything else -- you handle it.** Ambiguity, minor gaps, style decisions, refactoring choices, test strategy -- you decide, you document, you move.

## Drift Prevention

Autonomous execution is vulnerable to drift -- gradually deviating from the plan's intent through accumulated small decisions. Prevent this:

1. **Per-task plan check** -- before starting each task, re-read the plan's requirement for that task. After completing, verify the diff matches the requirement, not your interpretation of it.
2. **Scope fence** -- if you realize a task needs changes outside the plan's listed files, log it as out-of-scope and mention it at delivery. Do not silently expand scope.
3. **Decision log review** -- after every 3 tasks, scan your decision log. Are the decisions trending in a consistent direction, or are you course-correcting against your own earlier decisions? Repeated reversals signal you're drifting.
4. **Deterministic over probabilistic** -- when you can check something with a command (test, type check, lint, MCP call), always do that instead of reasoning about whether it's probably fine.

## Red Flags -- STOP

| Thought | Reality |
|---|---|
| "I'll skip the MCP check, I remember the API" | You are in autonomous mode. You have MORE responsibility to verify, not less. |
| "I'll skip the test for this task" | Autonomous does not mean undisciplined. Write the test. |
| "I'll ask the user about this" | Resolve it yourself with evidence. Only abort conditions reach the user. |
| "The test failed, I'll fix it in the next task" | Fix now. Autonomous mode does not carry debt forward. |
| "I'll skip self-review, ship-gate will catch it" | Self-review catches task-level issues. Ship-gate catches composition issues. Both run. |
| "This needs a change outside the plan's scope" | Log it, finish the plan, mention it at delivery. Do not scope-creep. |
| "I'm confused but I'll figure it out as I code" | Stop coding. Hit the self-correction hierarchy: MCP → codebase → web search → debug. |
| "The web search result looks right" | Cross-reference against MCP data and library version. Web results can be outdated. |
| "I've been making a lot of decisions, that's fine" | Review your decision log. Too many decisions may signal plan gaps. |

## Integration

- **Requires:** Approved plan from `hyperstack:forge-plan` or validated plan from `hyperstack:run-plan`
- **Uses aggressively:** All MCP tools, web search, `hyperstack:worktree-isolation`, `hyperstack:test-first` (inline), `hyperstack:debug-discipline` (inline on failure), `hyperstack:ship-gate` (final)
- **Completes via:** `hyperstack:deliver` (only human touchpoint)
