import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

export interface SetupResult {
  detectedPlatform: string;
  configPath: string | null;
  status: "success" | "pending_research" | "error";
  proposedPatch?: any;
  message: string;
}

const KNOWN_PLATFORMS: Record<string, { env?: string[]; configFiles: string[] }> = {
  "claude-code": {
    env: ["CLAUDE_PLUGIN_ROOT"],
    configFiles: [".claude.json"],
  },
  "cursor": {
    env: ["CURSOR_PLUGIN_ROOT"],
    configFiles: [".cursor/mcp.json"],
  },
  "windsurf": {
    configFiles: [".codeium/windsurf/mcp_config.json"],
  },
  "roo-code": {
    configFiles: [".roo/mcp.json", "mcp_settings.json"],
  },
  "gemini-cli": {
    configFiles: [".gemini/settings.json"],
  },
};

export function detectEnvironment(): string {
  // Check environment variables first
  if (process.env.CLAUDE_PLUGIN_ROOT) return "claude-code";
  if (process.env.CURSOR_PLUGIN_ROOT) return "cursor";
  if (process.env.VSCODE_PID) return "vscode-derivative"; // Likely Roo Code or Windsurf or VS Code
  
  return "unknown";
}

export function findConfigFile(platform: string): string | null {
  const home = os.homedir();
  
  if (platform === "unknown") {
    // Probe common locations
    for (const [p, info] of Object.entries(KNOWN_PLATFORMS)) {
      for (const file of info.configFiles) {
        const fullPath = path.join(home, file);
        if (fs.existsSync(fullPath)) return fullPath;
      }
    }
    return null;
  }

  const info = KNOWN_PLATFORMS[platform];
  if (!info) return null;

  for (const file of info.configFiles) {
    const fullPath = path.join(home, file);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  return null;
}


export function generateMcpPatch(
  configPath: string,
  pluginRoot: string,
  method: "docker" | "local" = "docker"
) {
  const isClaude = configPath.endsWith(".claude.json");
  const isGemini = configPath.includes("settings.json") && configPath.includes(".gemini");

  const binaryPath = path.join(pluginRoot, "bin", "hyperstack.mjs");
  const localConfig = {
    command: "node",
    args: [binaryPath],
    env: {
      HYPERSTACK_ROOT: pluginRoot,
    },
  };

  const dockerConfig = {
    command: "docker",
    args: ["exec", "-i", "hyperstack-mcp", "bun", "/app/src/index.ts"],
    env: {
      HYPERSTACK_ROOT: pluginRoot, // Still helpful for skills indexing
    },
  };

  const serverConfig = method === "docker" ? dockerConfig : localConfig;

  if (isGemini) {
    return {
      extensions: {
        hyperstack: {
          ...serverConfig,
          type: "stdio",
        },
      },
    };
  }

  // Default MCP schema (Claude, Cursor, Windsurf, Roo Code)
  return {
    mcpServers: {
      hyperstack: serverConfig,
    },
  };
}
