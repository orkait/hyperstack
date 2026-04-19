import { invokeLocalTool } from "./adapters/local-tools/index.js";

async function main() {
  const [command, toolName, flag, json] = process.argv.slice(2);

  if (command !== "tool" || !toolName || flag !== "--json" || !json) {
    process.stderr.write('Usage: hyperstack tool <tool-name> --json \'{"key":"value"}\'\n');
    process.exit(1);
  }

  const args = JSON.parse(json) as Record<string, unknown>;
  const result = await invokeLocalTool(toolName, args);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
