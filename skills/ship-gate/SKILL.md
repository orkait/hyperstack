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
1. IDENTIFY  - What command proves this claim?
2. RUN       - Execute it fresh. Not from memory. Not from a prior run in this session.
3. READ      - Full output. Exit code. Error count. Every line.
4. VERIFY    - Does output confirm the claim?
               NO  → State actual status with evidence
               YES → State claim WITH evidence attached
5. CLAIM     - Only now.
```

Skipping any step = lying, not verifying.

**CRITICAL: Evidence must be visible in this message.** Not "I ran the command." Not "I checked earlier." Actual command output, pasted into this message, proves your claim. No output = no claim.

## Evidence Format

Every completion claim requires evidence embedded in your message. Here is what valid evidence looks like:

### For test claims:
```
✅ Tests pass:

$ npm test
PASS  src/components/__tests__/Button.test.tsx
  Button
    ✓ renders with label (5ms)
    ✓ handles click event (3ms)
    ✓ disables when prop is set (2ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

**Not valid:** "Tests pass" with no output. "I ran npm test" with no results. "Should pass" with no evidence.

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

Code implementation:
<Handle position={Position.Top} type={HandleType.Target}>
```

**If you cannot show evidence, you cannot make the claim.** Period.

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

If the task involved `hyperstack:designer` (a DESIGN.md exists in the repo), the completion claim must pass this automated gate:

### Step 1: Auto-Invoke Verification Tool

Before claiming any visual task is complete, you MUST run the automated compliance checker:

```bash
# Call the MCP tool directly (or via your agent framework)
designer_verify_implementation(
  design_md_path: "path/to/DESIGN.md",
  code_paths: ["src/components/**/*.tsx", "src/styles/**/*.css"]
)
```

This tool programmatically verifies all 10 DESIGN.md sections against your code:

| DESIGN.md Section | What the tool checks |
|---|---|
| 2. Color Palette | All OKLCH tokens present in code. Contrast ratio >= WCAG AA. |
| 3. Typography | Font family loaded. Type scale tokens defined. Tracking/line-height match DESIGN.md. |
| 4. Spacing | Spacing tokens on 4px grid. No arbitrary pixel values. |
| 5. Components | ALL required states present (default/hover/focus/active/disabled/loading). Semantic HTML used (`<button>`, not `<div onclick>`). |
| 6. Motion | `prefers-reduced-motion` respected. No `linear` easing. No `> 500ms` UI transitions. |
| 7. Elevation | Shadow tokens defined. Z-index uses named scale (no `9999`). |
| 8. Do's and Don'ts | Each Do/Don't from DESIGN.md checked against code. None violated. |
| 9. Responsive | Layout tested at 375/768/1024/1440px. No horizontal scroll. Prose max-width 65ch. |
| 10. Anti-Patterns | All AI slop patterns absent: no `#6366F1`, no `font-weight: 500` everywhere, no missing states, no `animate-bounce` on static, no 3+ font families, no `rgba(0,0,0)` shadows. |

### Step 2: Show the Tool Output

The tool returns a compliance matrix. Paste it into your message as evidence:

```
✅ DESIGN.md Compliance Check:

designer_verify_implementation output:
[tool result showing 10/10 sections passing]

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

**If any section fails:** Do NOT claim completion.
- Option A: Fix the code to pass the check
- Option B: Escalate back to `hyperstack:designer` to revise DESIGN.md if the design was wrong

**If DESIGN.md doesn't exist for a visual task:** That's a process failure upstream. Stop and invoke `hyperstack:designer` before shipping anything.

## Red Flags - STOP

These are rationalizations. Every one has been used to ship bugs. Every one has a counter.

| Thought | Reality |
|---|---|
| "Should work now" | "Should" is not evidence. Run the command. |
| "I'm confident in this change" | Confidence is not evidence. Run the command. |
| "Subagent said it's done" | Subagents lie. Check the VCS diff. Run the tests. |
| "Minor change, no need to recheck" | Minor changes cause regressions. Run the command. |
| "Tests were passing before my change" | Irrelevant. Run them again now. |
| "MCP tool confirmed the pattern" | That confirms the pattern - not that your code is correct. Run the command. |
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
| **"I ran the tests, they passed"** (no output shown) | **Evidence not shown = claim not made. Paste the full test output into your message.** |
| **"The code looks correct"** (claiming DESIGN.md compliance) | **Looks are not verification. Run designer_verify_implementation. Show the tool output.** |
| **"I did the DESIGN.md checks manually"** (grep, eyeballing) | **Manual checks miss edge cases. Use the automated tool. Tool output is your evidence.** |
| **"DESIGN.md doesn't exist yet, I'll implement first"** | **DESIGN.md is a blocker. No visual code without it. Invoke hyperstack:designer before writing CSS/components.** |
| **"The tool output would take too long to generate"** | **It takes 2 seconds. Pasting it takes 10 more seconds. Fixing undetected bugs takes days. Generate the output.** |

## Integration

Run this skill before:
- Any `git commit` or PR creation
- Marking any task as complete in TodoWrite
- Reporting status to the user
- Claiming a bug is fixed
- Handing work off to a subagent or reviewer
- Transitioning between phases in `hyperstack:engineering-discipline`
