import { validateArtifactPayload } from "./engine/artifact-validator.js";
import { routeRequest } from "./engine/router.js";
import { loadTopology } from "./engine/topology-loader.js";
import { invokeLocalTool } from "./adapters/local-tools/index.js";

async function main() {
  const [command, toolName, flag, json] = process.argv.slice(2);
  const topology = loadTopology(process.cwd());

  if (command === "tool") {
    if (!toolName || flag !== "--json" || !json) {
      process.stderr.write('Usage: hyperstack tool <tool-name> --json \'{"key":"value"}\'\n');
      process.exit(1);
    }

    const args = JSON.parse(json) as Record<string, unknown>;
    const result = await invokeLocalTool(toolName, args);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exit(0);
  }

  if (command === "route") {
    if (toolName !== "--json" || !flag) {
      process.stderr.write("Usage: hyperstack route --json '{...}'\n");
      process.exit(1);
    }

    const input = JSON.parse(flag) as {
      requestId: string;
      domainTargets: string[];
      capabilityTargets: string[];
      workspaceInventory: { projectMode: "greenfield" | "existing"; existingPatterns: string[] };
      changeClassification: string;
    };

    process.stdout.write(`${JSON.stringify(routeRequest(topology, input), null, 2)}\n`);
    process.exit(0);
  }

  if (command === "artifact" && toolName === "validate") {
    const artifactId = flag;
    const jsonFlag = process.argv[5];
    const jsonPayload = process.argv[6];

    if (!artifactId || jsonFlag !== "--json" || !jsonPayload) {
      process.stderr.write("Usage: hyperstack artifact validate <artifact-id> --json '{...}'\n");
      process.exit(1);
    }

    const payload = JSON.parse(jsonPayload) as Record<string, unknown>;
    process.stdout.write(`${JSON.stringify(validateArtifactPayload(topology, artifactId, payload), null, 2)}\n`);
    process.exit(0);
  }

  process.stderr.write(
    "Usage: hyperstack tool <tool-name> --json '{...}'\n" +
      "   or: hyperstack route --json '{...}'\n" +
      "   or: hyperstack artifact validate <artifact-id> --json '{...}'\n",
  );
  process.exit(1);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
