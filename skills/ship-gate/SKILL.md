---
name: ship-gate
category: core
description: Use before claiming any work is complete, fixed, or passing. Run the verification command and show output before making any success claim.
---

# Verification Before Completion

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.
```

If you have not run the verification command in this message, you cannot claim it passes.

Claiming completion without evidence is not efficiency. It is dishonesty.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Gate

Before claiming any status or expressing satisfaction:

```
1. IDENTIFY  — What command proves this claim?
2. RUN       — Execute it fresh. Not from memory. Not from a prior run in this session.
3. READ      — Full output. Exit code. Error count. Every line.
4. VERIFY    — Does output confirm the claim?
               NO  → State actual status with evidence
               YES → State claim WITH evidence attached
5. CLAIM     — Only now.
```

Skipping any step = lying, not verifying.

## Verification Map

| Claim | What is required | What is not sufficient |
|---|---|---|
| Tests pass | Test command output showing 0 failures | "Should pass", previous run, looking at the code |
| Build succeeds | Build command: exit 0 | Linter passing, "no obvious errors" |
| Bug is fixed | Reproduce original symptom: now passes | Code changed, "logically fixed" |
| Type checks | `tsc --noEmit`: 0 errors | "Looks typed correctly" |
| MCP data applied correctly | Code matches MCP output shown in session | "I followed the pattern" |
| Requirements met | Line-by-line checklist against the spec | Tests passing |
| Subagent completed | VCS diff confirms actual changes | Subagent reports "done" |
| Regression covered | Red-green cycle verified (test fails without fix, passes with it) | "I wrote a test for it" |
| **DESIGN.md compliance (visual tasks)** | **Implementation matches each of the 10 DESIGN.md sections. ALL component states present. NO anti-patterns from Section 10.** | **"Looks right", "follows the design"** |

## DESIGN.md Compliance Gate (visual/UX tasks only)

If the task involved `hyperstack:designer` (a DESIGN.md exists), the completion claim must pass this gate:

| DESIGN.md Section | Verification Command/Check |
|---|---|
| 2. Color Palette | `grep -r "oklch" <css-files>` — all OKLCH tokens present. Run contrast checker. |
| 3. Typography | Font family loaded. Type scale tokens defined. Tracking values match. |
| 4. Spacing | Spacing tokens defined on 4px grid. No arbitrary pixel values. |
| 5. Components | For EACH component: `grep` for ALL required states (default/hover/focus/active/disabled/loading). `grep` for semantic HTML (`<button>`, not `<div onclick>`). |
| 6. Motion | `grep "prefers-reduced-motion"` — present. No `linear` easing. No `> 500ms` UI transitions. |
| 7. Elevation | Shadow tokens defined. Z-index uses named scale (no `9999`). |
| 8. Do's and Don'ts | Each Do/Don't checked against code. None violated. |
| 9. Responsive | Test at 375/768/1024/1440px — no horizontal scroll. Prose max-width 65ch present. |
| 10. Anti-Patterns | ALL AI slop fingerprint patterns absent: no `#6366F1`, no `font-weight: 500` everywhere, no missing states, no `animate-bounce` on static, no 3+ font families, no `rgba(0,0,0)` shadows on warm surfaces. |

**If any row fails:** Do NOT claim completion. Either fix the code, or escalate back to `hyperstack:designer` to revise DESIGN.md.

**If DESIGN.md doesn't exist for a visual task:** That's a process failure upstream. Stop and invoke `hyperstack:designer` before shipping anything.

## Red Flags — STOP

These are rationalizations. Every one has been used to ship bugs. Every one has a counter.

| Thought | Reality |
|---|---|
| "Should work now" | "Should" is not evidence. Run the command. |
| "I'm confident in this change" | Confidence is not evidence. Run the command. |
| "Subagent said it's done" | Subagents lie. Check the VCS diff. Run the tests. |
| "Minor change, no need to recheck" | Minor changes cause regressions. Run the command. |
| "Tests were passing before my change" | Irrelevant. Run them again now. |
| "MCP tool confirmed the pattern" | That confirms the pattern — not that your code is correct. Run the command. |
| "I'll verify after I push" | After you push it is in CI. Verify BEFORE. |
| "I followed the pattern correctly" | Following the pattern is not the same as the pattern working. Run the command. |
| "I already ran it earlier this conversation" | That was earlier. State drifts. Run it again. |
| "The linter is passing" | Linter is not compiler. Compiler is not runtime. Run the full verification. |
| "This is a minor syntax fix" | There is no such thing. Run the command. |
| "Partial check is enough" | Partial verification is theater. Do the full check. |
| "I'm tired, just this once" | Exhaustion is not an excuse. Stop and rest. Do not ship unverified. |
| "Different wording so rule doesn't apply" | Spirit of the rule is the letter of the rule. Run the command. |
| Using "should", "probably", "appears to" | These are the words you use when you are about to lie. Run the command. |
| "Just this once" | There is no "just this once." No exceptions. |

## Integration

Run this skill before:
- Any `git commit` or PR creation
- Marking any task as complete in TodoWrite
- Reporting status to the user
- Claiming a bug is fixed
- Handing work off to a subagent or reviewer
- Transitioning between phases in `hyperstack:engineering-discipline`
