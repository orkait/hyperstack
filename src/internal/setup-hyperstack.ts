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

export function generateMcpPatch(configPath: string, pluginRoot: string) {
  const binaryPath = path.join(pluginRoot, "bin", "hyperstack.mjs");
  const hookPath = path.join(pluginRoot, "hooks", "session-start.mjs");

  const serverConfig = {
    command: "node",
    args: [binaryPath],
    env: {
       HYPERSTACK_ROOT: pluginRoot
    }
  };

  // Determine schema based on filename
  const isClaude = configPath.endsWith(".claude.json");
  const isWindsurf = configPath.includes("windsurf");
  const isGemini = configPath.includes("gemini");

  if (isClaude) {
    return {
      mcpServers: {
        hyperstack: serverConfig
      }
    };
  }

  if (isGemini) {
    return {
      extensions: {
        hyperstack: {
          ...serverConfig,
          type: "stdio"
        }
      }
    };
  }

  // Default MCP schema
  return {
    mcpServers: {
      hyperstack: serverConfig
    }
  };
}
