import { validateArtifactPayload } from "./engine/artifact-validator.js";
import { routeRequest } from "./engine/router.js";
import { loadTopology } from "./engine/topology-loader.js";
import { assertToolAllowedForAgent, getAgent } from "./engine/policy.js";
import { invokeLocalTool } from "./adapters/local-tools/index.js";

type ParsedArgs = {
  positional: string[];
  flags: Record<string, string>;
};

function parseArgs(argv: string[]): ParsedArgs {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const name = token.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        flags[name] = "true";
      } else {
        flags[name] = next;
        i += 1;
      }
    } else {
      positional.push(token);
    }
  }
  return { positional, flags };
}

function usage(): never {
  process.stderr.write(
    "Usage:\n" +
      "  hyperstack tool <tool-name> --json '{...}' [--agent <agent-id>]\n" +
      "  hyperstack route --json '{...}'\n" +
      "  hyperstack artifact validate <artifact-id> --json '{...}'\n" +
      "\n" +
      "Topology enforcement:\n" +
      "  Pass --agent <id> or set HYPERSTACK_AGENT to enforce bundle allow/deny\n" +
      "  on `tool` calls. When unset, tools run without topology check.\n",
  );
  process.exit(1);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [command, ...rest] = positional;
  const topology = loadTopology(process.cwd());

  if (command === "tool") {
    const toolName = rest[0];
    const json = flags.json;
    if (!toolName || !json) usage();

    const agentId = flags.agent ?? process.env.HYPERSTACK_AGENT;
    if (agentId) {
      const agent = getAgent(topology, agentId);
      const bundle = assertToolAllowedForAgent(topology, agent, toolName);
      process.stderr.write(`[topology] agent=${agent.id} bundle=${bundle.id} tool=${toolName}\n`);
    }

    const args = JSON.parse(json) as Record<string, unknown>;
    const result = await invokeLocalTool(toolName, args);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exit(0);
  }

  if (command === "route") {
    const json = flags.json;
    if (!json) usage();
    const input = JSON.parse(json) as {
      requestId: string;
      domainTargets: string[];
      capabilityTargets: string[];
      workspaceInventory: { projectMode: "greenfield" | "existing"; existingPatterns: string[] };
      changeClassification: string;
    };
    process.stdout.write(`${JSON.stringify(routeRequest(topology, input), null, 2)}\n`);
    process.exit(0);
  }

  if (command === "artifact" && rest[0] === "validate") {
    const artifactId = rest[1];
    const json = flags.json;
    if (!artifactId || !json) usage();
    const payload = JSON.parse(json) as Record<string, unknown>;
    process.stdout.write(`${JSON.stringify(validateArtifactPayload(topology, artifactId, payload), null, 2)}\n`);
    process.exit(0);
  }

  usage();
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
