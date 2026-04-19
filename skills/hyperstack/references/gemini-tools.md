# Gemini CLI Tool Reference

When skills reference tools, use these equivalents in Gemini CLI:

| Claude Code tool | Gemini CLI equivalent |
|---|---|
| `Skill` (invoke skill) | `activate_skill` |
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace_in_file` |
| `Bash` | `run_shell_command` |
| `Grep` | `search_files` |
| `Glob` | `list_files` |
| `Agent` (subagent) | No direct equivalent - execute inline |
| `TaskCreate` / `TaskUpdate` | No direct equivalent - track in a markdown checklist |

## Skill Invocation

```
activate_skill("hyperstack:blueprint")
activate_skill("hyperstack:debug-discipline")
activate_skill("hyperstack:ship-gate")
```

## Notes

- Gemini loads skill metadata at session start via `GEMINI.md`
- Skills are activated on demand via `activate_skill`
- MCP tools work as normal - the MCP server is harness-independent
