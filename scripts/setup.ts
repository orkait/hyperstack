import * as setup from "../src/internal/setup-hyperstack.js";
import * as fs from "node:fs";
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

  const skillPath = setup.findSkillPath(platform);
  if (skillPath) {
    const hyperstackSkills = path.join(process.cwd(), "skills");
    const skillTarget = path.join(skillPath, "hyperstack");
    console.log(`\n📚 Skill target: ${skillTarget}`);
    console.log(`Run this to activate adversarial gates:`);
    console.log(`  ln -s "${hyperstackSkills}" "${skillTarget}"`);
  }

  const pluginRoot = process.cwd();
  
  // Attempt to proactively self-heal/upgrade the docker setup
  setup.selfHealDocker();
  
  const patch = setup.generateMcpPatch(configPath, pluginRoot, platform);
  
  // Proactively apply the patch
  setup.applyMcpPatch(configPath, patch);

  console.log("\n📋 Configuration Summary:");
  console.log("---------------------------------");
  console.log(`✅ Environment: ${platform}`);
  console.log(`✅ Config Path: ${configPath}`);
  if (skillPath) {
    console.log(`✅ Skill Target: ${path.join(skillPath, "hyperstack")}`);
  }
  console.log("---------------------------------\n");
  
  console.log("🚀 Setup Complete! You must restart your AI client to pick up the new tools.");
}

main().catch(console.error);
