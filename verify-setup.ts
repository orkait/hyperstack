import * as setup from "./src/internal/setup-hyperstack.js";

async function verify() {
  console.log("--- Hyperstack Setup Verification ---");
  const platform = setup.detectEnvironment();
  console.log(`Detected Platform: ${platform}`);
  
  const configPath = setup.findConfigFile(platform);
  console.log(`Config Path Found: ${configPath || "None (expected if running in clean environment)"}`);
  
  if (configPath || platform !== "unknown") {
    const patch = setup.generateMcpPatch(configPath || "/tmp/mcp.json", process.cwd());
    console.log("Proposed Patch:");
    console.log(JSON.stringify(patch, null, 2));
  } else {
    console.log("Environment unknown - research fallback would trigger here.");
  }
}

verify().catch(console.error);
