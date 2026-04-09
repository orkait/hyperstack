---
name: parallel-dispatch
description: Use when facing 2+ independent tasks that can be investigated or executed without shared state or sequential dependencies.
---

# Parallel Agent Dispatch

## When to Use

When you have multiple independent problems -- different test files, different subsystems, different bugs -- investigating them sequentially wastes time. Each investigation is independent and can happen concurrently.

**Use when:**
- 2+ failures with different root causes
- Multiple subsystems broken independently
- Each problem can be understood without context from others
- No shared state between investigations

**Don't use when:**
- Failures are related (fixing one might fix others)
- Agents would edit the same files
- You need to understand full system state first
- Exploratory debugging (you don't know what's broken yet)

## The Pattern

### 1. Identify Independent Domains

Group failures by what's broken:
- File A: Authentication flow
- File B: Data pipeline
- File C: UI rendering

If fixing A might fix B, they are NOT independent. Investigate together.

### 2. Craft Focused Prompts

Each agent gets:
- **Specific scope:** One file or subsystem
- **Clear goal:** What success looks like
- **Constraints:** What NOT to touch
- **MCP instruction:** Which tools to call for verification
- **Output format:** Summary of findings and changes

### 3. Dispatch in Parallel

Use the Agent tool with multiple calls in a single message. Each agent runs concurrently.

Do NOT dispatch multiple agents that modify the same files. Conflicts are guaranteed.

### 4. Review and Integrate

When agents return:
1. Read each summary
2. Check for conflicts (did any agent touch files outside its scope?)
3. Run full test suite
4. If conflicts exist, resolve manually before committing

## Prompt Template

```
Fix the [N] failing tests in [file path]:

1. "[test name]" - [symptom]
2. "[test name]" - [symptom]

Context: [what this subsystem does, recent changes]

Your task:
1. Read the test file
2. Identify root cause (use hyperstack:debug-discipline approach)
3. For [domain] code, call [MCP tool] to verify API shapes
4. Fix the root cause (not symptoms)
5. Verify all tests pass

Do NOT modify files outside [scope].

Return: Summary of root cause and changes made.
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Too broad scope ("fix all tests") | One domain per agent |
| No context (just "fix it") | Include error messages, file paths |
| No constraints | Specify what NOT to change |
| Vague output request | Ask for specific summary format |
| Related failures split across agents | Investigate together first |
| Same files given to multiple agents | Guaranteed merge conflicts |

## Red Flags -- STOP

| Thought | Reality |
|---|---|
| "Dispatch 5 agents for speed" | More agents does not mean faster if they conflict. |
| "I'll let agents figure out the scope" | Vague scope produces vague results. |
| "These might be related but I'll parallelize anyway" | Related bugs in parallel = wasted work. Investigate first. |
| "Skip the integration check" | Agents don't know about each other. You must verify. |

## Integration

- **Pairs with:** `hyperstack:debug-discipline` (each agent follows debugging discipline)
- **Pairs with:** `hyperstack:ship-gate` (verify integrated result before completion)
- **Used by:** `hyperstack:subagent-ops` (for independent review dispatches)
