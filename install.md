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

If the directory already exists (upgrade scenario), pull the latest instead of cloning:

| Environment | Fresh Install | Upgrade |
|---|---|---|
| **Claude Code** | `git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack` | `git -C ~/.claude/skills/hyperstack pull` |
| **Cursor** | `git clone https://github.com/orkait/hyperstack.git ~/.cursor/skills/hyperstack` | `git -C ~/.cursor/skills/hyperstack pull` |
| **Gemini CLI** | `git clone https://github.com/orkait/hyperstack.git ~/.gemini/skills/hyperstack` | `git -C ~/.gemini/skills/hyperstack pull` |
| **Copilot CLI** | Use plugin marketplace if available, otherwise clone into the user's configured skills path | Pull in the cloned directory |
| **OpenCode / Codex** | Follow the platform's file-based skill installation path | Pull in the cloned directory |
| **Other** | If your environment supports local file-based skills, clone the repo to the standard skills/extensions directory for your platform. | Pull in the cloned directory |

To handle both cases automatically, use this one-liner (clone if missing, pull if present):

```bash
SKILLS_DIR="$HOME/.claude/skills/hyperstack" && \
  ([ -d "$SKILLS_DIR" ] && git -C "$SKILLS_DIR" pull || git clone https://github.com/orkait/hyperstack.git "$SKILLS_DIR")
```

Replace `~/.claude/skills` with the correct path for the current environment.

The repository includes a `hooks/session-start.mjs` entrypoint that injects the `using-hyperstack` skill content into every session automatically. This is how the enforcement (Iron Laws, 1% Rule, rationalization tables) reaches the agent without manual invocation. On platforms that support `.claude-plugin/hooks.json`, this happens automatically. On others, the skill is still readable but the hook will not fire.

## Step 3: Configure the MCP Server

Check if Docker is installed and running on the user's system.

### Option A: Docker (Preferred)

Hyperstack uses a **persistent container + `docker exec`** pattern. One long-lived container serves every CLI invocation and every session, so container startup cost is paid once — not on every `claude` run.

**Step 1 — Pull the image:**

```bash
docker pull ghcr.io/orkait/hyperstack:main
```

Pre-pulling is required. MCP servers have a short initialization timeout — if Docker pulls the image on first use it will time out and report as failed.

**Step 2 — Start the persistent container (one-time setup):**

```bash
docker run -d --name hyperstack-mcp --restart unless-stopped \
  --memory=512m --cpus=1 \
  --entrypoint sleep \
  ghcr.io/orkait/hyperstack:main infinity
```

The container stays alive in the background with `sleep infinity` as PID 1. Each MCP session `exec`s a fresh `bun` process inside this container. `--restart unless-stopped` auto-starts the container after Docker restarts. `512m/1 cpu` covers several concurrent sessions.

Verify it's running:

```bash
docker ps --filter name=hyperstack-mcp
```

**Step 3 — Configure the MCP client:**

Add the following configuration to the appropriate MCP config file for the current environment (e.g., `~/.claude.json`, `~/.gemini/config.json`, or the relevant IDE config for Cursor/Windsurf):

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "docker",
      "args": ["exec", "-i", "hyperstack-mcp", "bun", "/app/src/index.ts"]
    }
  }
}
```

Each CLI invocation spawns a new `bun` process inside the existing `hyperstack-mcp` container — no new container, no startup cost.

**Why not `docker run --rm` per session?** `docker run` creates a brand-new container on every invocation. Over several sessions this piles up container state, spends 100–300ms per session on cold startup, and (without proper stdin lifecycle handling) can leave orphaned containers running after Claude exits. The `exec` pattern has none of these problems.

**Upgrading the image:**

```bash
docker pull ghcr.io/orkait/hyperstack:main
docker rm -f hyperstack-mcp
docker run -d --name hyperstack-mcp --restart unless-stopped \
  --memory=512m --cpus=1 \
  --entrypoint sleep \
  ghcr.io/orkait/hyperstack:main infinity
```

Then restart the CLI/IDE so open sessions reconnect to the new container.

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

**Pre-check: confirm the MCP server starts before opening the IDE.**

For Docker (Option A), first confirm the persistent container is running:
```bash
docker ps --filter name=hyperstack-mcp
```

Then test the exec path directly:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | docker exec -i hyperstack-mcp bun /app/src/index.ts
```

Expected output (server is working):
```json
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{"listChanged":true},"resources":{"listChanged":true}},"serverInfo":{"name":"hyperstack","version":"1.0.0"}},"jsonrpc":"2.0","id":1}
```

If this command hangs or errors, the MCP server is not working. Fix it before proceeding - the IDE will show the same failure.

For Local Bun (Option B):
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | bun /path/to/hyperstack/bin/hyperstack.mjs
```

---

Once the pre-check passes, start a fresh session in the target environment (or restart so the SessionStart hook fires).

**Verification A: Skills are loaded.** The agent should receive the `using-hyperstack` skill content at session start. Ask: *"What Hyperstack skills are available?"* The agent should list skills from `skills/INDEX.md` (21 total, grouped into core / domain / meta).

**Verification B: MCP tools respond.** Ask: *"Call designer_list_personalities."* The server should return 6 personality clusters (premium-precision, technical-developer, warm-editorial, bold-energetic, cinematic-dark, enterprise-trust).

**Verification C: The designer workflow triggers.** Ask: *"Help me design a SaaS dashboard for DevOps engineers."* The agent should invoke `hyperstack:designer` BEFORE writing any code. If it jumps straight to JSX, the SessionStart hook did not fire - restart the client and try again.

If any verification step fails:
- For skill issues: confirm the repo was cloned to the correct skills directory for the environment
- For MCP issues: run the pre-check command above to confirm the server starts independently of the IDE
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

### MCP server shows as failed on first use

Most common causes:

1. **Persistent container not running.** Check: `docker ps --filter name=hyperstack-mcp`. If empty, run Step 2 from Option A to start it.
2. **Image not pulled.** Run `docker pull ghcr.io/orkait/hyperstack:main` and retry.
3. **Wrong container name in config.** The config must use `hyperstack-mcp` as the exec target — must match the `--name` used in Step 2.

### MCP server shows as failed / cannot pull the Docker image

Verify the image is accessible: `docker pull ghcr.io/orkait/hyperstack:main`

If the pull fails, confirm Docker is running and you have an internet connection. The image is public on ghcr.io - no authentication is required to pull it.

### MCP server starts but tools return no results

The MCP config file may point to the wrong binary or the server is not running. Verify:
- Docker: run `docker exec -i hyperstack-mcp bun /app/src/index.ts` manually — it should accept JSON-RPC on stdin and respond. If the container isn't running, start it per Step 2 of Option A.
- Local Bun: confirm the absolute path in `args` exists (`ls /path/to/hyperstack/bin/hyperstack.mjs`)
- Restart the CLI/IDE after any config change - MCP servers are loaded at startup

### Too many hyperstack containers piling up

If you see multiple `ghcr.io/orkait/hyperstack` containers running:

```bash
docker ps -a --filter "ancestor=ghcr.io/orkait/hyperstack:main"
```

Your MCP config is using the legacy `docker run --rm` pattern instead of `docker exec`. Clean up and switch to the new config:

```bash
docker ps -aq --filter "ancestor=ghcr.io/orkait/hyperstack:main" | xargs -r docker rm -f
```

Then follow Step 2 of Option A to start the single persistent `hyperstack-mcp` container, and update your MCP config to the `docker exec` form shown in Step 3.

### SessionStart hook does not fire

On Claude Code, hooks live in `.claude/hooks.json`. Confirm the file exists in the repository root and references `session-start.mjs`. If the hook is missing or malformed, the `using-hyperstack` skill will not be injected automatically. You can still invoke skills manually with `/using-hyperstack`.

### `bun: command not found` when using Option B

Install Bun: `curl -fsSL https://bun.sh/install | bash`, then open a new shell so the path update takes effect.
