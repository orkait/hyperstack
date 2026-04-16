---
name: ship-gate
category: core
description: Execute before claiming work is complete, fixed, or passing. Run the verification command and show output. No evidence = no claim.
---

# Verification Before Completion


## The Gate

```
1. IDENTIFY  → Which command proves this claim?
2. RUN       → Execute it fresh. Not from memory.
3. READ      → Full output. Exit code. Error count.
4. VERIFY    → Output confirms claim?
               NO  → State status + provide evidence.
               YES → State claim + provide evidence.
5. CLAIM     → Only now.
```

Skipping steps = lying.
**Evidence MUST be visible.** Paste actual command output. "I ran the command" is unacceptable. No output = no claim.

## Evidence Format

Show output in message:

**Tests:** `$ npm test` → `Tests: 3 passed, 3 total`
**Types:** `$ tsc --noEmit` → `[no output = success]`
**Build:** `$ npm run build` → `[exit 0]`
**MCP:** Code block must explicitly match specific MCP tool response.

Cannot show evidence → cannot make claim.

## Verification Map

| Claim | Required | Not sufficient |
|---|---|---|
| Tests pass | Test command output showing 0 failures | "Should pass", previous run |
| Build succeeds | Build command: exit 0 | Linter passing |
| Bug is fixed | Reproduce original symptom: now passes | "Logically fixed" |
| Type checks | `tsc --noEmit`: 0 errors | "Looks typed correctly" |
| MCP pattern | Code matches current session MCP output | "Following pattern" |
| Requirements | Line-by-line checklist against spec | Tests passing |
| Subagent done | VCS diff confirms actual changes | Subagent reports "done" |
| Regression | Red-green cycle verified | "I wrote a test" |
| **DESIGN compliance** | **Implementation matches all 10 sections.** | **"Looks right"** |

## DESIGN.md Compliance Gate (Visual/UX)

If DESIGN.md exists, completion requires this gate:

### Step 1: Automated Checker

```bash
designer_verify_implementation(
  design_md_path: "path/to/DESIGN.md",
  code_paths: ["src/components/**/*.tsx", "src/styles/**/*.css"]
)
```

| DESIGN.md Section | What the tool checks |
|---|---|
| 2. Color Palette | All OKLCH tokens present. Contrast >= WCAG AA. |
| 3. Typography | Fonts loaded. Scale defined. Tracking matches. |
| 4. Spacing | 4px grid. No arbitrary pixels. |
| 5. Components | ALL states (default/hover/focus/active/disabled/loading). |
| 6. Motion | `prefers-reduced-motion`. No `linear`. Transitions < 500ms. |
| 7. Elevation | Shadow tokens defined. Z-index uses scale. |
| 8. Do's and Don'ts | Each rule checked against code. |
| 9. Responsive | 375/768/1024/1440px tested. Prose <= 65ch. |
| 10. Anti-Patterns | No `#6366F1`, no `500` weight everywhere, no `rgba` shadows. |

### Step 2: Show Output

Paste the `designer_verify_implementation` output block representing PASS on all 10 sections.

### Step 3: Handle Failures

Any section fails → DO NOT claim completion.
- Option A: Fix code.
- Option B: Escalate to `designer` to revise DESIGN.md.

No DESIGN.md on visual task? Stop. Invoke `designer`.


## Lifecycle

**All execution paths converge here:**
`[autonomous-mode | subagent-ops | engineering-discipline] → ship-gate (THIS) → deliver`

**DESIGN.md flow:**
`ship-gate → designer_verify_implementation → [PASS → deliver | FAIL → fix/escalate]`

**Escalations:**
- DESIGN.md check fails → `designer`
- Tests fail → `debug-discipline` 
- Type/lint errors → Fix → re-run ship-gate
