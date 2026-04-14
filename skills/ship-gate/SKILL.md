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

Not run in this message → cannot claim it passes. Claiming completion without evidence = dishonesty.

Violating the letter = violating the spirit.

## The Gate

```
1. IDENTIFY  → What command proves this claim?
2. RUN       → Execute it fresh. Not from memory. Not from a prior run.
3. READ      → Full output. Exit code. Error count. Every line.
4. VERIFY    → Does output confirm the claim?
               NO  → State actual status with evidence
               YES → State claim WITH evidence attached
5. CLAIM     → Only now.
```

Skipping any step = lying, not verifying.

**Evidence must be visible in this message.** Not "I ran the command." Not "I checked earlier." Actual command output pasted into this message. No output = no claim.

## Evidence Format

### For test claims:
```
✅ Tests pass:

$ npm test
PASS  src/components/__tests__/Button.test.tsx
  Button
    ✓ renders with label (5ms)
    ✓ handles click event (3ms)

Tests: 3 passed, 3 total
```

### For type checks:
```
✅ Types check:

$ tsc --noEmit
[no output = success]
```

### For build claims:
```
✅ Build succeeds:

$ npm run build
[build output showing exit 0]
```

### For MCP-verified patterns:
```
✅ Code matches MCP output:

MCP tool: reactflow_get_api(Handle)
Output: props = { children, position, type }

Code: <Handle position={Position.Top} type={HandleType.Target}>
```

Cannot show evidence → cannot make the claim.

## Verification Map

| Claim | Required | Not sufficient |
|---|---|---|
| Tests pass | Test command output showing 0 failures | "Should pass", previous run, looking at the code |
| Build succeeds | Build command: exit 0 | Linter passing, "no obvious errors" |
| Bug is fixed | Reproduce original symptom: now passes | Code changed, "logically fixed" |
| Type checks | `tsc --noEmit`: 0 errors | "Looks typed correctly" |
| MCP data applied correctly | Code matches MCP output shown in session | "I followed the pattern" |
| Requirements met | Line-by-line checklist against the spec | Tests passing |
| Subagent completed | VCS diff confirms actual changes | Subagent reports "done" |
| Regression covered | Red-green cycle verified | "I wrote a test for it" |
| **DESIGN.md compliance** | **Implementation matches all 10 DESIGN.md sections. All component states present. No anti-patterns from Section 10.** | **"Looks right", "follows the design"** |

## DESIGN.md Compliance Gate (visual/UX tasks only)

If DESIGN.md exists in the repo, completion claim must pass this gate:

### Step 1: Run Automated Compliance Checker

```bash
designer_verify_implementation(
  design_md_path: "path/to/DESIGN.md",
  code_paths: ["src/components/**/*.tsx", "src/styles/**/*.css"]
)
```

| DESIGN.md Section | What the tool checks |
|---|---|
| 2. Color Palette | All OKLCH tokens present. Contrast >= WCAG AA. |
| 3. Typography | Font family loaded. Type scale tokens defined. Tracking/line-height match DESIGN.md. |
| 4. Spacing | Spacing tokens on 4px grid. No arbitrary pixel values. |
| 5. Components | ALL required states present (default/hover/focus/active/disabled/loading). Semantic HTML used. |
| 6. Motion | `prefers-reduced-motion` respected. No `linear` easing. No `> 500ms` UI transitions. |
| 7. Elevation | Shadow tokens defined. Z-index uses named scale (no `9999`). |
| 8. Do's and Don'ts | Each Do/Don't from DESIGN.md checked against code. None violated. |
| 9. Responsive | Layout tested at 375/768/1024/1440px. No horizontal scroll. Prose max-width 65ch. |
| 10. Anti-Patterns | No AI slop: no `#6366F1`, no `font-weight: 500` everywhere, no missing states, no `animate-bounce` on static, no 3+ font families, no `rgba(0,0,0)` shadows. |

### Step 2: Show the Tool Output

```
✅ DESIGN.md Compliance Check:

Section 1 (Theme): PASS
Section 2 (Colors): PASS - all OKLCH tokens present
Section 3 (Typography): PASS - fonts loaded, scale defined
Section 4 (Spacing): PASS - 4px grid enforced
Section 5 (Components): PASS - all states present
Section 6 (Motion): PASS - prefers-reduced-motion respected
Section 7 (Elevation): PASS - shadow/z-index tokens used
Section 8 (Do's/Don'ts): PASS - no violations
Section 9 (Responsive): PASS - tested at all breakpoints
Section 10 (Anti-Patterns): PASS - no slop detected
```

### Step 3: Handle Failures

Any section fails → do NOT claim completion.
- Option A: Fix the code to pass the check
- Option B: Escalate to `hyperstack:designer` to revise DESIGN.md if the design was wrong

DESIGN.md doesn't exist for a visual task → process failure upstream. Stop and invoke `hyperstack:designer` before shipping anything.

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "Should work now" | "Should" ≠ evidence. Run the command. |
| "I'm confident in this change" | Confidence ≠ evidence. Run the command. |
| "Subagent said it's done" | Subagents lie. Check the VCS diff. Run the tests. |
| "Minor change, no need to recheck" | Minor changes cause regressions. Run the command. |
| "Tests were passing before my change" | Irrelevant. Run them again now. |
| "MCP tool confirmed the pattern" | Confirms the pattern, not that your code is correct. Run the command. |
| "I'll verify after I push" | After you push it's in CI. Verify BEFORE. |
| "I already ran it earlier this conversation" | State drifts. Run it again. |
| "The linter is passing" | Linter ≠ compiler ≠ runtime. Run the full verification. |
| "Partial check is enough" | Partial verification = theater. Full check. |
| "I ran the tests, they passed" (no output shown) | Evidence not shown = claim not made. Paste the full output. |
| "The code looks correct" (claiming DESIGN.md compliance) | Looks ≠ verification. Run `designer_verify_implementation`. Show tool output. |
| "I did the DESIGN.md checks manually" | Manual checks miss edge cases. Use the automated tool. |
| "DESIGN.md doesn't exist yet, I'll implement first" | DESIGN.md is a blocker. Invoke `hyperstack:designer` before writing CSS/components. |
| "Just this once" | No exceptions. |

## Integration

Run this skill before:
- Any `git commit` or PR creation
- Marking any task as complete
- Reporting status to the user
- Claiming a bug is fixed
- Handing work off to a subagent or reviewer
- Transitioning between phases in `hyperstack:engineering-discipline`


## Lifecycle Integration

### Agent Workflow Chains

**All execution paths converge here:**
```
[autonomous-mode | subagent-ops | engineering-discipline] → ship-gate (THIS) → deliver
```

**DESIGN.md compliance (visual/UX only):**
```
ship-gate → designer_verify_implementation → [PASS → deliver | FAIL → fix or escalate]
```

### Upstream Dependencies
- `autonomous-mode` → final gate before delivery
- `subagent-ops` → final gate after all tasks
- `engineering-discipline` → per-task + final gate

### Downstream Consumers
- `deliver` → only proceeds if ship-gate passes

### Escalation Paths
| Failure | Escalate to | Action |
|---|---|---|
| DESIGN.md compliance fails | `designer` | Fix code or revise DESIGN.md |
| Tests fail | `debug-discipline` → fix → re-run ship-gate |
| Type/lint errors | Fix → re-run ship-gate |
