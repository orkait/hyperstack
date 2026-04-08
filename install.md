# Agent-First Installation Instructions for Hyperstack

If you are an AI assistant reading this file, please perform the following steps to install Hyperstack on the user's system. You must adapt these steps based on the environment/CLI you are currently running in (e.g., Claude Code, Gemini CLI, Cursor, Windsurf, etc.).

## Step 1: Detect Environment
Determine which CLI or IDE you are currently operating within. This will dictate where the AI Skill is cloned and which configuration file needs to be updated for the MCP server.

## Step 2: Install the AI Skill
Hyperstack includes an AI Skill (`SKILL.md`) that teaches you how to use its tools. Clone this repository into the appropriate skills directory for your environment:

- **Claude Code:** `git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack`
- **Gemini CLI:** `git clone https://github.com/orkait/hyperstack.git ~/.gemini/skills/hyperstack`
- **Other Environments:** If your environment supports local file-based skills, clone the repo to the standard skills/extensions directory for your platform. If not supported, you may skip this step and proceed to installing the MCP server.

## Step 3: Configure the MCP Server
Check if Docker is installed and running on the user's system.

### Option A: Docker (Preferred)
If Docker is available, add the following configuration to the appropriate MCP config file for your environment (e.g., `~/.claude.json`, `~/.gemini/config.json`, or the relevant IDE config for Cursor/Windsurf):

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
        "ghcr.io/orkait/hyperstack:main"
      ]
    }
  }
}
```

### Option B: Local Node (Fallback)
If Docker is NOT available, you must run the server locally using Node and `tsx`.
1. Navigate to the directory where you cloned the repository (e.g., `~/.claude/skills/hyperstack`).
2. Run `npm install` in that directory.
3. Add the following configuration to the user's MCP config file, replacing `/absolute/path/to/...` with the actual path where you cloned the repository:

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/hyperstack/src/index.ts"]
    }
  }
}
```

## Step 4: Inform the User
Inform the user that the installation is complete, specifying whether you used the Docker or Local Node method, exactly where the repository was cloned, and which configuration file was updated.
