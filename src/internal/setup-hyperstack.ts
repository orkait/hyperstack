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
  // Source: docs.anthropic.com (April 2025)
  "claude-code": {
    env: ["CLAUDE_PLUGIN_ROOT"],
    configFiles: [".claude.json"],
    skillPath: ".claude/skills",
    format: "json-mcpServers",
  },
  // Gemini CLI - global user config
  // Source: geminicli.com (April 2025)
  "gemini-cli": {
    configFiles: [".gemini/settings.json"],
    format: "json-mcpServers",
    notes: "Run '/mcp' inside Gemini CLI to verify connection",
  },
  // OpenAI Codex CLI - global user config (TOML format)
  // Source: openai.com official docs (April 2025)
  "codex": {
    configFiles: [".codex/config.toml"],
    format: "toml-mcp_servers",
    notes: "CLI alternative: codex mcp add hyperstack -- bun ~/.hyperstack/bin/hyperstack.mjs",
  },

  // ─── AI IDEs ────────────────────────────────────────────────

  // Antigravity (Google DeepMind)
  // Source: deepmind.google (April 2025)
  "antigravity": {
    configFiles: [".gemini/antigravity/mcp_config.json"],
    skillPath: ".gemini/antigravity/skills",
    format: "json-mcpServers",
  },
  // Kiro (Amazon AI IDE) - global user config
  // Source: kiro.dev official docs (April 2025)
  "kiro": {
    configFiles: [".kiro/settings/mcp.json"],
    format: "json-mcpServers",
    notes: "Workspace-level: .kiro/settings/mcp.json in project root",
  },
  // Cursor IDE - global user config
  // Source: cursor.com docs (April 2025)
  "cursor": {
    env: ["CURSOR_PLUGIN_ROOT"],
    configFiles: [".cursor/mcp.json"],
    skillPath: ".cursor/rules",
    format: "json-mcpServers",
    notes: "Project-level: .cursor/mcp.json in project root",
  },
  // Windsurf IDE (Codeium) - global user config
  // Source: windsurf.com official docs (April 2025)
  "windsurf": {
    configFiles: [".codeium/windsurf/mcp_config.json"],
    format: "json-mcpServers",
    notes: "Click 'Refresh' in Cascade panel after editing",
  },
  // VS Code + GitHub Copilot - platform-specific global config
  // Source: code.visualstudio.com official docs (April 2025)
  "vscode": {
    env: ["VSCODE_PID"],
    configFiles: [
      ".config/Code/User/mcp.json",                          // Linux
      "Library/Application Support/Code/User/mcp.json",      // macOS
    ],
    format: "json-mcpServers",
    notes: "Project-level: .vscode/mcp.json in project root",
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

/**
 * Registers Hyperstack skills for ANY platform that has a skill/rules directory.
 * Creates a symlink <skillRoot>/hyperstack -> <pluginRoot>/skills so that
 * `hyperstack:hyperstack` and all other skills are discoverable by the agent.
 *
 * For platforms without a skill directory (codex, gemini-cli), injects the
 * bootstrap content into the platform's persistent context file instead.
 */
export function registerSkillsForPlatform(platform: string, pluginRoot: string): void {
  const skillsSource = path.join(pluginRoot, "skills");
  const home = os.homedir();

  // Platforms with a skill/rules directory: create namespace symlink
  const skillRoot = findSkillPath(platform);
  if (skillRoot) {
    const skillTarget = path.join(skillRoot, "hyperstack");
    try {
      fs.mkdirSync(skillRoot, { recursive: true });
      try {
        if (fs.existsSync(skillTarget) || fs.lstatSync(skillTarget).isSymbolicLink()) {
          fs.rmSync(skillTarget, { recursive: true, force: true });
        }
      } catch { /* not found */ }
      fs.symlinkSync(skillsSource, skillTarget, "dir");
      console.log(`   ✓ Skills linked: ${skillTarget} -> ${skillsSource}`);
    } catch (err) {
      console.warn(`   ⚠ Skill link failed for ${platform}: ${err instanceof Error ? err.message : err}`);
    }
    return;
  }

  // Platforms without a skill system: inject compiled bootstrap into persistent context file
  const bootstrapPath = path.join(pluginRoot, "generated", "runtime-context", "hyperstack.bootstrap.md");
  const fallbackPath = path.join(pluginRoot, "skills", "hyperstack", "SKILL.md");
  let bootstrapContent: string;
  try {
    bootstrapContent = fs.readFileSync(bootstrapPath, "utf8");
  } catch {
    try {
      bootstrapContent = fs.readFileSync(fallbackPath, "utf8");
    } catch {
      console.warn(`   ⚠ Could not read bootstrap for ${platform} injection`);
      return;
    }
  }

  const PLATFORM_CONTEXT_FILES: Record<string, string> = {
    "codex":      path.join(home, ".codex", "instructions.md"),
    "gemini-cli": path.join(home, ".gemini", "GEMINI.md"),
  };

  const contextFile = PLATFORM_CONTEXT_FILES[platform];
  if (!contextFile) return;

  const marker = "<!-- hyperstack-bootstrap -->";
  const injection = `\n${marker}\n${bootstrapContent}\n${marker}\n`;

  try {
    fs.mkdirSync(path.dirname(contextFile), { recursive: true });
    const existing = fs.existsSync(contextFile) ? fs.readFileSync(contextFile, "utf8") : "";
    if (existing.includes(marker)) {
      const stripped = existing.replace(new RegExp(`\n?${marker}[\\s\\S]*?${marker}\n?`), "");
      fs.writeFileSync(contextFile, stripped + injection);
      console.log(`   ✓ Updated bootstrap in ${contextFile}`);
    } else {
      fs.appendFileSync(contextFile, injection);
      console.log(`   ✓ Injected bootstrap into ${contextFile}`);
    }
  } catch (err) {
    console.warn(`   ⚠ Context injection failed for ${platform}: ${err instanceof Error ? err.message : err}`);
  }
}

export function getPlatformFormat(platform: string): PlatformFormat {
  return KNOWN_PLATFORMS[platform]?.format ?? "json-mcpServers";
}

export function generateMcpPatch(
  configPath: string,
  pluginRoot: string,
  platform: string,
  method: "docker" | "local" = "docker"
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

/**
 * Registers Hyperstack as a first-class Claude Code plugin so that
 * `hooks/hooks.json` (including the SessionStart bootstrap) is activated
 * by Claude Code's native plugin loader.
 *
 * Steps (idempotent, user-agnostic, uses os.homedir()):
 *   1. Ensure `<pluginRoot>/.claude-plugin/marketplace.json` exists
 *   2. Symlink `<claudeDir>/plugins/marketplaces/hyperstack -> pluginRoot`
 *   3. Symlink `<claudeDir>/plugins/cache/hyperstack/hyperstack -> pluginRoot`
 *   4. Merge entry into `<claudeDir>/plugins/known_marketplaces.json`
 *   5. Merge entry into `<claudeDir>/plugins/installed_plugins.json`
 *   6. Merge `"hyperstack@hyperstack": true` into
 *      `<claudeDir>/settings.json::enabledPlugins`
 *
 * Claude Code only. Silently no-ops on other platforms.
 */
export function registerClaudeCodePlugin(pluginRoot: string): void {
  const home = os.homedir();
  const claudeDir = path.join(home, ".claude");
  const settingsPath = path.join(claudeDir, "settings.json");

  if (!fs.existsSync(settingsPath)) {
    console.log("ℹ️  Claude Code not detected (no ~/.claude/settings.json). Skipping plugin registration.");
    return;
  }

  console.log("\n🔌 Registering Hyperstack as Claude Code plugin...");

  // 1. Ensure marketplace.json in plugin repo
  const marketplaceJsonPath = path.join(pluginRoot, ".claude-plugin", "marketplace.json");
  if (!fs.existsSync(marketplaceJsonPath)) {
    const marketplaceContent = {
      $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
      name: "hyperstack",
      description: "Hyperstack: MCP server + adversarial skill system with SessionStart bootstrap injection",
      owner: {
        name: "Orkait",
        email: "orkaitsolutions@gmail.com",
        url: "https://github.com/orkait",
      },
      metadata: {
        description: "Disciplined MCP server + skill system. Iron Laws, 1% Rule, rationalization tables, SessionStart hook injection.",
        version: "1.0.0",
      },
      plugins: [
        {
          name: "hyperstack",
          source: "./",
          description: "Disciplined MCP server + skill system with adversarial enforcement gates.",
          version: "1.0.0",
          category: "productivity",
          strict: true,
        },
      ],
    };
    fs.mkdirSync(path.dirname(marketplaceJsonPath), { recursive: true });
    fs.writeFileSync(marketplaceJsonPath, JSON.stringify(marketplaceContent, null, 2));
    console.log(`   ✓ Created ${marketplaceJsonPath}`);
  }

  // 2-3. Create symlinks (or directory copies on Windows if symlink fails)
  // installPath must point to the versioned leaf so Claude Code can find skills/ at <installPath>/skills/
  const version = "1.0.0";
  const marketplaceLink = path.join(claudeDir, "plugins", "marketplaces", "hyperstack");
  const cachePackageDir = path.join(claudeDir, "plugins", "cache", "hyperstack", "hyperstack");
  const cacheLink = path.join(cachePackageDir, version);
  fs.mkdirSync(path.dirname(marketplaceLink), { recursive: true });
  fs.mkdirSync(cachePackageDir, { recursive: true });
  for (const link of [marketplaceLink, cacheLink]) {
    try {
      if (fs.existsSync(link) || fs.lstatSync(link).isSymbolicLink()) {
        fs.rmSync(link, { recursive: true, force: true });
      }
    } catch { /* link may not exist */ }
    try {
      fs.symlinkSync(pluginRoot, link, "dir");
      console.log(`   ✓ Symlinked ${link} -> ${pluginRoot}`);
    } catch (err) {
      console.warn(`   ⚠ Symlink failed at ${link}: ${err instanceof Error ? err.message : err}`);
    }
  }

  // 4. known_marketplaces.json
  const knownMarketplacesPath = path.join(claudeDir, "plugins", "known_marketplaces.json");
  const knownMarketplaces = fs.existsSync(knownMarketplacesPath)
    ? JSON.parse(fs.readFileSync(knownMarketplacesPath, "utf8"))
    : {};
  knownMarketplaces["hyperstack"] = {
    source: { source: "github", repo: "orkait/hyperstack" },
    installLocation: pluginRoot,
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(knownMarketplacesPath, JSON.stringify(knownMarketplaces, null, 2));
  console.log(`   ✓ Updated known_marketplaces.json`);

  // 5. installed_plugins.json
  const installedPluginsPath = path.join(claudeDir, "plugins", "installed_plugins.json");
  const installedPlugins = fs.existsSync(installedPluginsPath)
    ? JSON.parse(fs.readFileSync(installedPluginsPath, "utf8"))
    : { version: 2, plugins: {} };
  if (!installedPlugins.plugins) installedPlugins.plugins = {};
  const now = new Date().toISOString();
  installedPlugins.plugins["hyperstack@hyperstack"] = [
    {
      scope: "user",
      installPath: cacheLink,
      version: "1.0.0",
      installedAt: now,
      lastUpdated: now,
    },
  ];
  fs.writeFileSync(installedPluginsPath, JSON.stringify(installedPlugins, null, 2));
  console.log(`   ✓ Updated installed_plugins.json`);

  // 6. enabledPlugins in settings.json (deep-merge, preserve everything else)
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    if (!settings.enabledPlugins) settings.enabledPlugins = {};
    if (settings.enabledPlugins["hyperstack@hyperstack"] !== true) {
      settings.enabledPlugins["hyperstack@hyperstack"] = true;
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      console.log(`   ✓ Enabled hyperstack@hyperstack in settings.json`);
    } else {
      console.log(`   ℹ hyperstack@hyperstack already enabled in settings.json`);
    }
  } catch (err) {
    console.warn(`   ⚠ Could not update settings.json enabledPlugins: ${err instanceof Error ? err.message : err}`);
  }

  console.log("✅ Hyperstack plugin registered. Restart Claude Code to activate hooks.");
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
