# Agent-First Installation Instructions for Hyperstack

If you are an AI assistant reading this file, please perform the following steps to install Hyperstack on the user's system. You must adapt these steps based on the environment/CLI you are currently running in (e.g., Claude Code, Cursor, Gemini CLI, Copilot CLI, OpenCode, Codex, Windsurf, etc.).

## Read This First

If you only remember four things, remember these:

1. Hyperstack is a harness, not just an MCP server.
2. Both the MCP server and the skills must be installed.
3. The preferred Docker setup is a persistent `hyperstack-mcp` container plus
   `docker exec`, not `docker run --rm` per session.
4. Installation is not complete until the MCP server responds and the skills are
   visible on disk.

## What Hyperstack Gives the User

Three tightly-coupled pieces, installed together:

1. **An internal harness** - bootstrap, internal role routing, and workflow control. Current internal roles include `main` and `website-builder`.
2. **An MCP server** with 11 plugins and 79 tools - deterministic knowledge for React Flow v12, Motion v12, Lenis, React 19 / Next.js, Echo, Go, Rust, design tokens, UI/UX principles, shadcn/ui (Base UI edition), and the `designer` DESIGN.md pipeline.
3. **A skill system** with 21 skills including adversarial enforcement gates (`blueprint`, `designer`, `forge-plan`, `ship-gate`, `engineering-discipline`) and a SessionStart hook that force-injects the `using-hyperstack` skill at every session start.

The install steps below wire the public pieces the user actually needs: the MCP
server and the skills. The internal harness is shipped inside the repository and
becomes active through the bootstrap hook and runtime context artifacts.

If you install only one public piece:

- MCP only -> the user gets tools without discipline
- skills only -> the user gets prose rules without tools

## Step 1: Detect Environment

Determine which CLI or IDE you are currently operating within. This dictates where the skills are cloned and which configuration file holds the MCP server definition.

## Step 2: Install the Skills

If the directory already exists (upgrade scenario), pull the latest instead of cloning:

| Environment | Fresh Install | Upgrade |
|---|---|---|
| **Claude Code** | `git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack` | `git -C ~/.claude/skills/hyperstack pull` |
| **Cursor** | `git clone https://github.com/orkait/hyperstack.git ~/.cursor/skills/hyperstack` | `git -C ~/.cursor/skills/hyperstack pull` |
| **Gemini CLI** | `git clone https://github.com/orkait/hyperstack.git ~/.gemini/skills/hyperstack` | `git -C ~/.gemini/skills/hyperstack pull` |
| **Qwen Code** | `git clone https://github.com/orkait/hyperstack.git ~/.qwen/skills/hyperstack` | `git -C ~/.qwen/skills/hyperstack pull` |
| **Copilot CLI** | Use plugin marketplace if available, otherwise clone into the user's configured skills path | Pull in the cloned directory |
| **OpenCode / Codex** | Follow the platform's file-based skill installation path | Pull in the cloned directory |
| **Other** | If your environment supports local file-based skills, clone the repo to the standard skills/extensions directory for your platform. | Pull in the cloned directory |

**Qwen Code note:** Qwen Code does not have a skill plugin system or SessionStart hook. Skills are cloned to `~/.qwen/skills/hyperstack/` and available on disk for the agent to reference manually (via `read_file` or the agent's own knowledge of the repo structure). The 21 skills are not auto-loaded at session start.

To handle both cases automatically, use this one-liner (clone if missing, pull if present):

```bash
SKILLS_DIR="$HOME/.claude/skills/hyperstack" && \
  ([ -d "$SKILLS_DIR" ] && git -C "$SKILLS_DIR" pull || git clone https://github.com/orkait/hyperstack.git "$SKILLS_DIR")
```

Replace `~/.claude/skills` with the correct path for the current environment (see table above). For example, on Qwen Code use `~/.qwen/skills/hyperstack`.

The repository includes a `hooks/session-start.mjs` entrypoint that injects the
generated Hyperstack bootstrap into every session automatically. This is how the
enforcement and internal harness model reach the agent without manual
invocation. On platforms that support `.claude-plugin/hooks.json`, this happens
automatically. On others, the skills are still readable but the hook will not
fire.

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

If a `hyperstack-mcp` container already exists from a previous install, delete it first to ensure a clean state with the latest image:

```bash
docker rm -f hyperstack-mcp 2>/dev/null  # safe: no-op if container doesn't exist
```

Then create the fresh container:

```bash
docker run -d --name hyperstack-mcp --restart unless-stopped \
  --memory=512m --cpus=1 \
  --entrypoint sleep \
  ghcr.io/orkait/hyperstack:main infinity
```

The container stays alive in the background with `sleep infinity` as PID 1. Each MCP session `exec`s a fresh `bun` process inside this container. `--restart unless-stopped` auto-starts the container after Docker restarts. `512m/1 cpu` covers several concurrent sessions.

**Why delete the old container?** An existing `hyperstack-mcp` container may be running a stale image version, have leftover state from a prior install, or use incorrect resource limits. `docker rm -f` ensures every install starts from a known-good baseline. The `2>/dev/null` suppresses the "no such container" error on first-time installs.

Verify it's running:

```bash
docker ps --filter name=hyperstack-mcp
```

**Step 3 — Configure the MCP client:**

Add the following configuration to the appropriate MCP config file for the current environment:

| Environment | Config File |
|---|---|
| **Claude Code** | `~/.claude.json` |
| **Gemini CLI** | `~/.gemini/config.json` |
| **Qwen Code** | `~/.qwen/settings.json` (global) or `.qwen/settings.json` (project-level) |
| **Cursor / Windsurf / Others** | IDE-specific MCP settings panel or `.mcp.json` in project root |

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

**Important:** Some environments (like Qwen Code) use `settings.json` at the root level rather than a dedicated `.mcp.json` file. The `mcpServers` object goes at the top level of the settings file. Do not nest it inside another key.

**Name mismatch repair:** If the MCP config references `hyperstack-mcp` but the container has a different name (e.g., a random Docker name like `kind_bouman` from a previous `docker run`), fix it before proceeding:

```bash
# Find the actual running hyperstack container
ACTUAL_NAME=$(docker ps --filter "ancestor=ghcr.io/orkait/hyperstack:main" --format "{{.Names}}" | head -1)
if [ -n "$ACTUAL_NAME" ] && [ "$ACTUAL_NAME" != "hyperstack-mcp" ]; then
  docker rename "$ACTUAL_NAME" hyperstack-mcp
  echo "Renamed container '$ACTUAL_NAME' → 'hyperstack-mcp'"
fi
```

This is a common issue when the user ran `docker run` directly (without `--name`) before following these instructions, or when the image was pulled under a different container name. The `docker exec` MCP config requires the name to match exactly.

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

Always delete the old container before creating a new one — the `sleep infinity` pattern means the container never exits, so `docker run` with the same name will fail if the old one still exists.

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

For Docker (Option A), first confirm the persistent container is running AND the name matches the config:

```bash
# Step 1 — Check container is running
docker ps --filter name=hyperstack-mcp

# Step 2 — If empty, check if a differently-named hyperstack container exists
ACTUAL_NAME=$(docker ps --filter "ancestor=ghcr.io/orkait/hyperstack:main" --format "{{.Names}}" | head -1)
if [ -n "$ACTUAL_NAME" ] && [ "$ACTUAL_NAME" != "hyperstack-mcp" ]; then
  docker rename "$ACTUAL_NAME" hyperstack-mcp
  echo "Renamed '$ACTUAL_NAME' → 'hyperstack-mcp' — config will now work"
fi
```

If no hyperstack container is running at all, go back to Step 2 of Option A.

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

**Verification 0: Installation sanity check.** Before trusting the install, run these checks:

1. **MCP server responds:** Ask the agent to call `designer_list_personalities`. If it returns 6 clusters (premium-precision, technical-developer, warm-editorial, bold-energetic, cinematic-dark, enterprise-trust), the MCP server is connected and working. If the tool is unknown or fails, the MCP config is wrong or the session wasn't restarted.

2. **Skills are on disk:** Confirm the skills directory exists and has content:
   ```bash
   ls ~/.claude/skills/hyperstack/skills/   # or ~/.qwen/skills/hyperstack/skills/ for Qwen Code
   ```
   Should show 21 directories plus `INDEX.md`. If missing or empty, the clone failed.

3. **Skills are auto-loaded (platforms with hooks only):** Ask: *"What Hyperstack skills are available?"* The agent should list skills from `skills/INDEX.md` (21 total, grouped into core / domain / meta). On platforms without hook support (e.g., Qwen Code), skip this — skills are on disk but not auto-injected.

If any of these three checks fail, do not proceed. Fix the issue first:
- MCP tool unknown → verify config file location and JSON syntax, then restart the session
- Skills missing → re-run the clone command and confirm the path
- Skills not auto-loaded → check that the platform supports `.claude-plugin/hooks.json`; if not, this is expected behavior

---

**Verification A: SessionStart hook fires (platforms with hooks only).** On Claude Code and platforms with hook support, the agent should receive the Hyperstack bootstrap at session start. Ask: *"What Hyperstack skills are available?"* The agent should list skills from `skills/INDEX.md` (21 total, grouped into core / domain / meta). On platforms without hook support (e.g., Qwen Code), this step does not apply - skills are on disk but not auto-injected.

**Verification B: Designer workflow triggers.** Ask: *"Help me design a SaaS dashboard for DevOps engineers."* On platforms with the SessionStart hook, the agent should invoke `hyperstack:designer` BEFORE writing any code. If it jumps straight to JSX, the hook did not fire — restart the client and try again. On platforms without hook support, this step is manual (the agent won't auto-invoke designer).

If any verification step fails:
- For skill issues: confirm the repo was cloned to the correct skills directory for the environment
- For MCP issues: run the pre-check command above to confirm the server starts independently of the IDE
- For hook issues: confirm the environment supports `.claude-plugin/hooks.json`, otherwise the enforcement is reduced to documentation rather than automatic injection. Platforms without hook support: Qwen Code.

## Step 5: Inform the User

Tell the user:
1. Which environment you detected
2. Where the repository was cloned
3. Which MCP config file was updated (Docker or Bun fallback)
4. Whether the SessionStart hook is expected to fire on their platform (yes for Claude Code / platforms with hooks, no for Qwen Code / others)
5. Which verification step they should run first

If installation failed at any step, report the specific error and what would need to be fixed, rather than claiming success.

## Troubleshooting

### MCP server shows as failed on first use

Most common causes:

1. **Container name mismatch.** The MCP config says `hyperstack-mcp` but the container has a random Docker name (e.g., `kind_bouman`). Fix:
   ```bash
   ACTUAL=$(docker ps --filter "ancestor=ghcr.io/orkait/hyperstack:main" --format "{{.Names}}" | head -1)
   [ -n "$ACTUAL" ] && [ "$ACTUAL" != "hyperstack-mcp" ] && docker rename "$ACTUAL" hyperstack-mcp
   ```
   This is the #1 cause of "tool not found" errors on fresh installs where the user ran `docker run` without `--name` at some point.

2. **Persistent container not running.** Check: `docker ps --filter name=hyperstack-mcp`. If empty, run Step 2 from Option A to start it.
3. **Image not pulled.** Run `docker pull ghcr.io/orkait/hyperstack:main` and retry.
4. **Wrong container name in config.** The config must use `hyperstack-mcp` as the exec target — must match the `--name` used in Step 2.

### MCP server shows as failed / cannot pull the Docker image

Verify the image is accessible: `docker pull ghcr.io/orkait/hyperstack:main`

If the pull fails, confirm Docker is running and you have an internet connection. The image is public on ghcr.io - no authentication is required to pull it.

### MCP server starts but tools return no results

The MCP config file may point to the wrong binary or the server is not running. Verify:
- Docker: run `docker exec -i hyperstack-mcp bun /app/src/index.ts` manually — it should accept JSON-RPC on stdin and respond. If the container isn't running, start it per Step 2 of Option A.
- Local Bun: confirm the absolute path in `args` exists (`ls /path/to/hyperstack/bin/hyperstack.mjs`)
- Restart the CLI/IDE after any config change - MCP servers are loaded at startup
- **Qwen Code:** Uses `~/.qwen/settings.json` (global) or `.qwen/settings.json` (project-level), NOT `.mcp.json`. The `mcpServers` key goes at the root of the settings file.

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

On Qwen Code, there is no plugin system or hook mechanism. Skills are available on disk at `~/.qwen/skills/hyperstack/skills/INDEX.md` but must be referenced manually by the agent — no auto-injection occurs.

### `bun: command not found` when using Option B

Install Bun: `curl -fsSL https://bun.sh/install | bash`, then open a new shell so the path update takes effect.
