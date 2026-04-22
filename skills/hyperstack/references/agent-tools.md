# Code Tool Reference

When skills reference tools

| Operation | Tool |
|---|---|
| Invoke a skill | `Skill` tool with `skill: "hyperstack:skill-name"` |
| Spawn a subagent | `Agent` tool |
| Track tasks | `TaskCreate`, `TaskUpdate`, `TaskList` |
| Read a file | `Read` |
| Write a file | `Write` |
| Edit a file | `Edit` |
| Run a command | `Bash` |
| Search file contents | `Grep` |
| Find files by pattern | `Glob` |
| Search the web | `WebSearch` |

## Skill Invocation

```
Skill({ skill: "hyperstack:blueprint" })
Skill({ skill: "hyperstack:debug-discipline" })
Skill({ skill: "hyperstack:ship-gate" })
```

## Notes

- Never use `Read` on skill files directly - use the `Skill` tool
- `Agent` tool spawns a subagent with isolated context - provide full task text, do not assume shared context
