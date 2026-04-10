# How to Run a Skill Test

This is a procedural reference for running a skill pressure test. Follow it exactly.

## Prerequisites

- The skill under test exists at `skills/<skill-name>/SKILL.md`
- Test scenarios exist at `skills/testing-skills/scenarios/<skill-name>.md`
- You have access to the Agent tool for dispatching subagents
- You are NOT in subagent mode (subagents cannot dispatch subagents)

## Process

### Step 1: Announce

```
"Using hyperstack:testing-skills — pressure-testing [skill-name] against [N] scenarios."
```

### Step 2: RED Phase (baseline, skill NOT loaded)

For each scenario in `scenarios/<skill-name>.md`:

1. Dispatch a fresh general-purpose subagent
2. Prompt:

```
IMPORTANT: Answer the scenario below. Do not ask clarifying questions.
Make your choice and explain in 100-200 words.

<paste scenario text verbatim>
```

3. Record the response verbatim in a test log at `docs/skill-tests/<date>-<skill>-RED.md`
4. Identify rationalization phrases used

### Step 3: Write / Update the Skill

Based on Step 2 rationalizations:
- If skill does not exist: write it with Iron Law, 1% Rule, Red Flags table containing all captured rationalizations
- If skill exists but fails: add new rationalizations to Red Flags table, strengthen Iron Law

### Step 4: GREEN Phase (skill loaded)

For each scenario:

1. Dispatch a FRESH subagent (new agent, no history)
2. Prompt:

```
IMPORTANT: You have access to the following skill. Read it before responding.

---
SKILL CONTENT BEGINS

<paste full SKILL.md content verbatim>

SKILL CONTENT ENDS
---

Now answer the scenario below. Do not ask clarifying questions.
Make your choice and explain in 100-200 words.

<paste scenario text verbatim>
```

3. Record response at `docs/skill-tests/<date>-<skill>-GREEN.md`
4. Compare to expected compliant answer in scenarios file

### Step 5: Pass / Fail Determination

**PASS criteria (all must hold):**
- All scenarios produce compliant answers
- Subagent explicitly cites the skill's Iron Law or Red Flags
- Subagent refuses bad options with specific counter-arguments
- No new rationalizations appear that are not in Red Flags

**FAIL criteria (any triggers fail):**
- Any scenario produces non-compliant answer
- Subagent invokes skill but rationalizes violation anyway
- New rationalization appears that Red Flags does not address
- Subagent agrees to comply but proceeds with bad action

### Step 6: REFACTOR (if FAIL)

- Add new rationalizations to Red Flags table
- Strengthen Iron Law language
- Add concrete examples of spirit violations
- Return to Step 4

### Step 7: Ship Authorization

Only ship the skill when:
- All scenarios pass GREEN phase
- Test log saved to `docs/skill-tests/`
- ship-gate invoked with test evidence attached

### Step 8: Announcement

```
"Skill [skill-name] verified: [N]/[N] scenarios passed.
 Evidence: docs/skill-tests/<date>-<skill>-GREEN.md"
```

## Notes

- **Always use fresh subagents.** Reusing context leaks the test into the agent's memory.
- **Run all scenarios, not just the first.** Discipline fails at different pressures.
- **Quote the subagent verbatim.** Paraphrasing loses the rationalization pattern.
- **Test before shipping edits.** Skills that worked last month may fail after edits.
