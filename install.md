# Agent-First Installation Instructions for Hyperstack

If you are an AI assistant reading this file, please perform the following steps to install Hyperstack on the user's system. You must adapt these steps based on the environment/CLI you are currently running in (e.g., Claude Code, Cursor, Gemini CLI, Copilot CLI, OpenCode, Codex, Windsurf, etc.).

## What Hyperstack Gives the User

Two things, installed together:

1. **An MCP server** with 11 plugins and 79 tools - deterministic knowledge for React Flow v12, Motion v12, Lenis, React 19 / Next.js, Echo, Go, Rust, design tokens, UI/UX principles, shadcn/ui (Base UI edition), and the `designer` DESIGN.md pipeline.
2. **A skill system** with 21 skills including adversarial enforcement gates (`blueprint`, `designer`, `forge-plan`, `ship-gate`, `engineering-discipline`) and a SessionStart hook that force-injects the `using-hyperstack` skill at every session start.

Both must be installed for the system to work correctly. The MCP server alone gives the user tools; the skills alone give the user prose rules with no tools to call.

## Step 1: Detect Environment

Determine which CLI or IDE you are currently operating within. This dictates where the skills are cloned and which configuration file holds the MCP server definition.

## Step 2: Install the Skills

Clone this repository into the appropriate skills directory for your environment:

| Environment | Command |
|---|---|
| **Claude Code** | `git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack` |
| **Cursor** | `git clone https://github.com/orkait/hyperstack.git ~/.cursor/skills/hyperstack` |
| **Gemini CLI** | `git clone https://github.com/orkait/hyperstack.git ~/.gemini/skills/hyperstack` |
| **Copilot CLI** | Use plugin marketplace if available, otherwise clone into the user's configured skills path |
| **OpenCode / Codex** | Follow the platform's file-based skill installation path |
| **Other** | If your environment supports local file-based skills, clone the repo to the standard skills/extensions directory for your platform. If not supported, you may skip this step and proceed to installing the MCP server, but note that the SessionStart hook and adversarial enforcement will not activate. |

The repository includes a `hooks/session-start.mjs` entrypoint that injects the `using-hyperstack` skill content into every session automatically. This is how the enforcement (Iron Laws, 1% Rule, rationalization tables) reaches the agent without manual invocation. On platforms that support `.claude-plugin/hooks.json`, this happens automatically. On others, the skill is still readable but the hook will not fire.

## Step 3: Configure the MCP Server

Check if Docker is installed and running on the user's system.

### Option A: Docker (Preferred)

If Docker is available, add the following configuration to the appropriate MCP config file for the current environment (e.g., `~/.claude.json`, `~/.gemini/config.json`, or the relevant IDE config for Cursor/Windsurf):

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--memory=256m",
        "--cpus=0.5",
        "superorkait/hyperstack:latest"
      ]
    }
  }
}
```

The `--memory=256m` and `--cpus=0.5` flags are intentional resource limits. Do not remove them. The server runs fine within these constraints.

### Option B: Local Bun (Fallback)

If Docker is NOT available, run the server locally using Bun:

1. [Install Bun](https://bun.sh) if not already available (`curl -fsSL https://bun.sh/install | bash`)
2. Navigate to the directory where you cloned the repository (e.g., `~/.claude/skills/hyperstack`)
3. Run `bun install` in that directory
4. Add the following to the user's MCP config file, replacing `/absolute/path/to/...` with the actual clone path:

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "bun",
      "args": ["/absolute/path/to/hyperstack/bin/hyperstack.mjs"]
    }
  }
}
```

There is no build step. Bun runs TypeScript directly from source.

## Step 4: Verify Installation

Start a fresh session in the target environment (or restart the current one so the SessionStart hook fires).

**Verification A: Skills are loaded.** The agent should receive the `using-hyperstack` skill content at session start. Ask: *"What Hyperstack skills are available?"* The agent should list skills from `skills/INDEX.md` (21 total, grouped into core / domain / meta).

**Verification B: MCP tools respond.** Ask: *"Call designer_list_personalities."* The server should return 6 personality clusters (premium-precision, technical-developer, warm-editorial, bold-energetic, cinematic-dark, enterprise-trust).

**Verification C: The designer workflow triggers.** Ask: *"Help me design a SaaS dashboard for DevOps engineers."* The agent should invoke `hyperstack:designer` BEFORE writing any code. If it jumps straight to JSX, the SessionStart hook did not fire - restart the client and try again.

If any verification step fails:
- For skill issues: confirm the repo was cloned to the correct skills directory for the environment
- For MCP issues: confirm the config file path, check Docker is running if using Option A, or verify the absolute path in Option B
- For hook issues: confirm the environment supports `.claude-plugin/hooks.json`, otherwise the enforcement is reduced to documentation rather than automatic injection

## Step 5: Inform the User

Tell the user:
1. Which environment you detected
2. Where the repository was cloned
3. Which MCP config file was updated (Docker or local Node)
4. Whether the SessionStart hook is expected to fire on their platform
5. Which verification step they should run first

If installation failed at any step, report the specific error and what would need to be fixed, rather than claiming success.

## Troubleshooting

### MCP server shows as failed / cannot pull the Docker image

Verify the image is accessible: `docker pull superorkait/hyperstack:latest`

If the pull fails, confirm Docker is running and you have an internet connection. The image is public on Docker Hub - no authentication is required to pull it.

### MCP server starts but tools return no results

The MCP config file may point to the wrong binary or the server is not running. Verify:
- Docker: run `docker run -i --rm superorkait/hyperstack:latest` and confirm it starts without error
- Local Bun: confirm the absolute path in `args` exists (`ls /path/to/hyperstack/bin/hyperstack.mjs`)
- Restart the CLI/IDE after any config change - MCP servers are loaded at startup

### SessionStart hook does not fire

On Claude Code, hooks live in `.claude/hooks.json`. Confirm the file exists in the repository root and references `session-start.mjs`. If the hook is missing or malformed, the `using-hyperstack` skill will not be injected automatically. You can still invoke skills manually with `/using-hyperstack`.

### `bun: command not found` when using Option B

Install Bun: `curl -fsSL https://bun.sh/install | bash`, then open a new shell so the path update takes effect.
