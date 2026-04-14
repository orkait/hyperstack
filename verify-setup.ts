import * as setup from "./src/internal/setup-hyperstack.js";

async function verify() {
  console.log("--- Hyperstack Setup Verification ---");
  const platform = setup.detectEnvironment();
  console.log(`Detected Platform: ${platform}`);
  
  const configPath = setup.findConfigFile(platform);
  console.log(`Config Path Found: ${configPath || "None (expected if running in clean environment)"}`);
  
  if (configPath || platform !== "unknown") {
    const finalPath = configPath || "/tmp/mcp.json";
    
    console.log("\nProposed Patch (Method: DOCKER - Default):");
    const dockerPatch = setup.generateMcpPatch(finalPath, process.cwd(), "docker");
    console.log(JSON.stringify(dockerPatch, null, 2));

    console.log("\nProposed Patch (Method: LOCAL):");
    const localPatch = setup.generateMcpPatch(finalPath, process.cwd(), "local");
    console.log(JSON.stringify(localPatch, null, 2));
  } else {
    console.log("Environment unknown - research fallback would trigger here.");
  }
}

verify().catch(console.error);
