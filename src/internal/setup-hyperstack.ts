import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execSync } from "node:child_process";

export interface SetupResult {
  detectedPlatform: string;
  configPath: string | null;
  skillPath: string | null;
  status: "success" | "pending_research" | "error";
  proposedPatch?: any;
  message: string;
}

export type PlatformFormat = "json-mcpServers" | "json-contextServers" | "toml-mcp_servers" | "json-mcpServers-nested";

const KNOWN_PLATFORMS: Record<string, {
  env?: string[];
  configFiles: string[];
  skillPath?: string;
  notes?: string;
  format?: PlatformFormat;
}> = {
  // ─── AI CLIs ────────────────────────────────────────────────

  // Claude Code (CLI) - global user config
  // Source: docs.anthropic.com, inventivehq.com (April 2025, multiple)
  "claude-code": {
    env: ["CLAUDE_PLUGIN_ROOT"],
    configFiles: [".claude.json"],
    skillPath: ".claude/skills",
    format: "json-mcpServers",
  },
  // Gemini CLI - global user config
  // Source: geminicli.com, augmentcode.com (April 2025, multiple)
  "gemini-cli": {
    configFiles: [".gemini/settings.json"],
    format: "json-mcpServers",
    notes: "Run '/mcp' inside Gemini CLI to verify connection",
  },
  // Antigravity (Google DeepMind) - local user config
  "antigravity": {
    configFiles: [".gemini/antigravity/mcp_config.json"],
    skillPath: ".gemini/antigravity/skills",
    format: "json-mcpServers",
  },
  // Qwen Code (Alibaba) - global user config
  // Source: github.io/qwen-code official docs (April 2025)
  "qwen-code": {
    configFiles: [".qwen/settings.json"],
    skillPath: ".qwen/skills",
    format: "json-mcpServers",
    notes: "CLI alternative: qwen mcp add <name> <command>",
  },
  // OpenAI Codex CLI - global user config (TOML format)
  // Source: openai.com official docs (April 2025)
  "codex": {
    configFiles: [".codex/config.toml"],
    format: "toml-mcp_servers",
    notes: "CLI alternative: codex mcp add hyperstack -- bun ~/.hyperstack/bin/hyperstack.mjs",
  },

  // ─── AI IDEs ────────────────────────────────────────────────

  // Cursor IDE - global user config
  // Source: cursor.com docs, confirmed via 10+ tutorials (April 2025)
  "cursor": {
    env: ["CURSOR_PLUGIN_ROOT"],
    configFiles: [".cursor/mcp.json"],
    skillPath: ".cursor/rules",
    format: "json-mcpServers",
    notes: "Project-level: .cursor/mcp.json in project root",
  },
  // Windsurf IDE (Codeium) - global user config
  // Source: windsurf.com official docs, bito.ai, zapier (April 2025)
  "windsurf": {
    configFiles: [".codeium/windsurf/mcp_config.json"],
    format: "json-mcpServers",
    notes: "Click 'Refresh' in Cascade panel after editing",
  },
  // Kiro (Amazon AI IDE) - global user config
  // Source: kiro.dev official docs, aws.com (April 2025)
  "kiro": {
    configFiles: [".kiro/settings/mcp.json"],
    format: "json-mcpServers",
    notes: "Workspace-level: .kiro/settings/mcp.json in project root",
  },
  // Zed editor - global user config (uses 'context_servers' key, not 'mcpServers')
  // Source: zed.dev official docs, skeet.build (April 2025)
  "zed": {
    configFiles: [".config/zed/settings.json"],
    format: "json-contextServers",
    notes: "Uses 'context_servers' key instead of 'mcpServers'",
  },

  // ─── VS Code Extensions ─────────────────────────────────────

  // VS Code + GitHub Copilot - platform-specific global config
  // Source: code.visualstudio.com official docs (April 2025)
  "vscode": {
    env: ["VSCODE_PID"],
    configFiles: [
      ".config/Code/User/mcp.json",                            // Linux
      "Library/Application Support/Code/User/mcp.json",        // macOS
    ],
    format: "json-mcpServers",
    notes: "Project-level: .vscode/mcp.json in project root",
  },
  // Roo Code (VS Code extension)
  // Global config has no fixed home path (stored in VS Code extension storage).
  // Source: roocode.com official docs (April 2025)
  "roo-code": {
    configFiles: [".roo/mcp.json"],
    skillPath: ".roo/rules",
    format: "json-mcpServers",
    notes: "Global config: open via Roo Code UI > Edit Global MCP",
  },
  // Cline (VS Code extension) - Linux global path
  // Source: cline.bot official docs, reddit (April 2025)
  "cline": {
    configFiles: [
      ".config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json", // Linux
      ".cline/data/settings/cline_mcp_settings.json",          // Cline CLI fallback
    ],
    format: "json-mcpServers",
    notes: "Access via Cline panel > MCP Servers > Configure",
  },
  // Continue.dev (VS Code extension) - project-level only
  // Source: continue.dev official docs (April 2025)
  "continue-dev": {
    configFiles: [".continue/mcpServers/mcp.json"],
    format: "json-mcpServers",
    notes: "Requires Agent Mode. Place config in .continue/mcpServers/ directory",
  },
};


export function detectEnvironment(): string {
  // Env-var hints (fast path, but unreliable in nested terminals)
  if (process.env.ANTIGRAVITY_AGENT) return "antigravity";
  if (process.env.CLAUDE_PLUGIN_ROOT) return "claude-code";
  if (process.env.CURSOR_PLUGIN_ROOT) return "cursor";
  // VSCODE_PID fires inside any VS Code-hosted terminal (Gemini, Roo Code, etc.)
  // Do NOT short-circuit here - fall through to config-file probing below.
  return "unknown";
}

export function findConfigFile(platform: string): string | null {
  const home = os.homedir();

  // Always probe all known config files - this is the authoritative source of truth.
  // Even if `platform` was resolved from env vars, the config file must exist.
  const candidates: Array<{ platform: string; file: string }> = [];

  if (platform !== "unknown" && KNOWN_PLATFORMS[platform]) {
    // Try hinted platform first
    for (const file of KNOWN_PLATFORMS[platform].configFiles) {
      candidates.push({ platform, file });
    }
  }

  // Always append all other platforms as fallback probes
  for (const [p, info] of Object.entries(KNOWN_PLATFORMS)) {
    if (p !== platform) {
      for (const file of info.configFiles) {
        candidates.push({ platform: p, file });
      }
    }
  }

  for (const { file } of candidates) {
    const fullPath = path.join(home, file);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  return null;
}

export function detectPlatformFromConfigPath(configPath: string): string {
  for (const [p, info] of Object.entries(KNOWN_PLATFORMS)) {
    for (const file of info.configFiles) {
      if (configPath.endsWith(file)) return p;
    }
  }
  return "unknown";
}

export function findSkillPath(platform: string): string | null {
  const info = KNOWN_PLATFORMS[platform];
  if (!info || !info.skillPath) return null;
  
  return path.join(os.homedir(), info.skillPath);
}


export function getPlatformFormat(platform: string): PlatformFormat {
  return KNOWN_PLATFORMS[platform]?.format ?? "json-mcpServers";
}

export function generateMcpPatch(
  configPath: string,
  pluginRoot: string,
  platform: string,
  method: "docker" | "local" = "local"
): { format: PlatformFormat; content: string | object } {
  const binaryPath = path.join(pluginRoot, "bin", "hyperstack.mjs");
  const localServerConfig = {
    command: "node",
    args: [binaryPath],
    env: { HYPERSTACK_ROOT: pluginRoot },
  };
  const dockerServerConfig = {
    command: "docker",
    args: ["exec", "-i", "hyperstack-mcp", "bun", "/app/src/index.ts"],
    env: { HYPERSTACK_ROOT: pluginRoot },
  };
  const serverConfig = method === "docker" ? dockerServerConfig : localServerConfig;
  const format = getPlatformFormat(platform);

  // Zed uses 'context_servers' key instead of 'mcpServers'
  // Source: zed.dev official docs (April 2025)
  if (format === "json-contextServers") {
    return {
      format,
      content: {
        context_servers: {
          hyperstack: serverConfig,
        },
      },
    };
  }

  // Codex CLI uses TOML format: [mcp_servers.<name>]
  // Source: openai.com official docs (April 2025)
  if (format === "toml-mcp_servers") {
    const tomlBlock = method === "docker"
      ? `[mcp_servers.hyperstack]\ncommand = "docker"\nargs = ["exec", "-i", "hyperstack-mcp", "bun", "/app/src/index.ts"]\n[mcp_servers.hyperstack.env]\nHYPERSTACK_ROOT = "${pluginRoot}"`
      : `[mcp_servers.hyperstack]\ncommand = "node"\nargs = ["${binaryPath}"]\n[mcp_servers.hyperstack.env]\nHYPERSTACK_ROOT = "${pluginRoot}"`;
    return { format, content: tomlBlock };
  }

  // Default: standard mcpServers JSON schema
  // Covers: Claude Code, Cursor, Windsurf, Roo Code, VS Code, Kiro, Qwen, Gemini, Cline, Continue.dev
  return {
    format,
    content: {
      mcpServers: {
        hyperstack: serverConfig,
      },
    },
  };
}

/**
 * Persistently applies the generated patch to the user's config file
 * without destroying existing settings.
 */
export function applyMcpPatch(configPath: string, patch: { format: PlatformFormat; content: any }) {
  if (!fs.existsSync(configPath)) {
    // If it doesn't exist, create it with the patch
    if (typeof patch.content === "string") {
      fs.writeFileSync(configPath, patch.content);
    } else {
      fs.writeFileSync(configPath, JSON.stringify(patch.content, null, 2));
    }
    return;
  }

  if (patch.format === "toml-mcp_servers") {
    let content = fs.readFileSync(configPath, "utf8");
    if (!content.includes("[mcp_servers.hyperstack]")) {
      fs.appendFileSync(configPath, "\n" + patch.content);
      console.log(`✅ Appended Hyperstack block to ${configPath}`);
    } else {
      console.log(`ℹ️  Hyperstack block already exists in ${configPath}`);
    }
    return;
  }

  // JSON deep-merge
  try {
    const existing = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const patchObj = patch.content as any;

    if (patch.format === "json-contextServers") {
      existing.context_servers = {
        ...(existing.context_servers || {}),
        ...patchObj.context_servers,
      };
    } else {
      existing.mcpServers = {
        ...(existing.mcpServers || {}),
        ...patchObj.mcpServers,
      };
    }

    fs.writeFileSync(configPath, JSON.stringify(existing, null, 2));
    console.log(`✅ Deep-merged Hyperstack config into ${configPath}`);
  } catch (err) {
    console.error(`❌ Failed to merge config: ${err}`);
  }
}

export function selfHealDocker() {
  try {
    // Check if Docker is available
    execSync("docker --version", { stdio: "ignore" });
    
    console.log("\n🛡️  Running Docker Self-Healing Protocol...");
    
    // Check for existing containers
    try {
      // Find containers with our image or the exact name
      const cmd = 'docker ps -aq --filter "ancestor=ghcr.io/orkait/hyperstack:main"';
      const existing = execSync(cmd).toString().trim().split(/\r?\n/).filter(Boolean);
      
      const namedCmd = 'docker ps -aq --filter "name=hyperstack-mcp"';
      const named = execSync(namedCmd).toString().trim().split(/\r?\n/).filter(Boolean);
      
      const allToPurge = [...new Set([...existing, ...named])];
      
      if (allToPurge.length > 0) {
        console.log(`🧹 Found ${allToPurge.length} old container(s) and fragments. Purging immediately...`);
        execSync(`docker rm -f ${allToPurge.join(' ')}`, { stdio: "ignore" });
      }
    } catch(e) {}
    
    console.log("📥 Pulling the absolute latest ghcr.io/orkait/hyperstack:main...");
    execSync("docker pull ghcr.io/orkait/hyperstack:main", { stdio: "inherit" });

    console.log("🏥 Booting clean persistent container (hyperstack-mcp)...");
    execSync("docker run -d --name hyperstack-mcp --restart unless-stopped --memory=512m --cpus=1 --entrypoint sleep ghcr.io/orkait/hyperstack:main infinity", { stdio: "ignore" });
    
    console.log("✅ Registry & Engine synchronized successfully.");
  } catch (err) {
    console.log("\\n⚠️  Docker skipped: Docker engine not responsive or not installed on this host.");
  }
}
