import * as setup from "../src/internal/setup-hyperstack.js";
import * as fs from "node:fs";
import * as path from "node:path";

async function main() {
  console.log("\n🚀 Hyperstack Autonomous Setup (CLI)");
  console.log("=====================================\n");

  const platform = setup.detectEnvironment();
  console.log(`📡 Detected platform: ${platform}`);

  const configPath = setup.findConfigFile(platform);
  
  if (!configPath) {
    console.warn("⚠️  Could not automatically find an MCP configuration file.");
    console.log(`Check ${platform} documentation for the correct 'mcp.json' or settings path.`);
    process.exit(1);
  }

  console.log(`✅ Found config: ${configPath}`);

  const pluginRoot = process.cwd();
  const patch = setup.generateMcpPatch(configPath, pluginRoot);

  console.log("\nProposed MCP Configuration Patch:");
  console.log("---------------------------------");
  console.log(JSON.stringify(patch, null, 2));
  console.log("---------------------------------\n");

  console.log("To apply this patch:");
  console.log(`1. Open ${configPath}`);
  console.log("2. Merged the 'hyperstack' entry into your 'mcpServers' or 'extensions' block.");
  console.log("3. Restart your AI client.");
  
  console.log("\nFor an automated autopilot installation, call the 'hyperstack_setup' tool from within your AI assistant.\n");
}

main().catch(console.error);
