# Codex Tool Reference

When skills reference tools, use these equivalents in Codex:

| Claude Code tool | Codex equivalent |
|---|---|
| `Skill` (invoke skill) | Native skill system via `.codex/` |
| `Read` | `cat` or file read tools |
| `Write` | File write tools |
| `Edit` | File edit tools |
| `Bash` | Shell execution |
| `Grep` | Search tools |
| `Agent` (subagent) | Parallel task execution |
| `TaskCreate` / `TaskUpdate` | Checklist in working notes |

## Skill Invocation

Skills are available via the `.codex/INSTALL.md` bootstrap. Invoke by name:

```
hyperstack:blueprint
hyperstack:debug-discipline
hyperstack:ship-gate
```

## Notes

- Codex discovers skills from the `.codex/` directory after install
- MCP tools work as normal — the MCP server is harness-independent
- Check `.codex/INSTALL.md` in this repo for full setup instructions
