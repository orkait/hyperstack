import * as setup from "../src/internal/setup-hyperstack.js";
import * as path from "node:path";

async function main() {
  console.log("\n🚀 Hyperstack Autonomous Setup (CLI)");
  console.log("=====================================\n");

  const hintedPlatform = setup.detectEnvironment();
  console.log(`📡 Hinted platform: ${hintedPlatform}`);

  const configPath = setup.findConfigFile(hintedPlatform);

  if (!configPath) {
    console.warn("⚠️  Could not find an MCP configuration file in any known location.");
    console.log("Tried: .claude.json, .cursor/mcp.json, .codeium/windsurf/mcp_config.json, .roo/mcp.json, .gemini/settings.json, .kiro/settings/mcp.json, .qwen/settings.json");
    console.log("\n💡 OpenAI Codex CLI? Run: codex mcp add hyperstack -- bun ~/.hyperstack/bin/hyperstack.mjs");
    console.log("   For any unknown IDE, use the Agentic Autopilot instead.");
    process.exit(1);
  }

  // Resolve the actual platform from the found config path
  const platform = setup.detectPlatformFromConfigPath(configPath);
  console.log(`✅ Found config: ${configPath} (${platform})`);

  const pluginRoot = process.cwd();

  console.log("\n📚 Registering skills...");
  setup.registerSkillsForPlatform(platform, pluginRoot);
  
  // Attempt to proactively self-heal/upgrade the docker setup
  setup.selfHealDocker();
  
  const patch = setup.generateMcpPatch(configPath, pluginRoot, platform);
  
  // Proactively apply the patch
  setup.applyMcpPatch(configPath, patch);

  // Register as Claude Code plugin (idempotent; no-op on non-Claude platforms)
  if (platform === "claude-code") {
    setup.registerClaudeCodePlugin(pluginRoot);
  }

  const skillRoot = setup.findSkillPath(platform);
  console.log("\n📋 Configuration Summary:");
  console.log("---------------------------------");
  console.log(`✅ Environment: ${platform}`);
  console.log(`✅ Config Path: ${configPath}`);
  if (skillRoot) {
    console.log(`✅ Skills: ${path.join(skillRoot, "hyperstack")}`);
  }
  console.log("---------------------------------\n");
  
  console.log("🚀 Setup Complete! You must restart your AI client to pick up the new tools.");
}

main().catch(console.error);
