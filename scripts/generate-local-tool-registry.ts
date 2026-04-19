import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(".");
const pluginsRoot = join(repoRoot, "src", "plugins");
const outputDir = join(repoRoot, "generated", "tool-index");
const outputJson = join(outputDir, "local-tool-registry.json");
const outputTs = join(outputDir, "local-tool-registry.ts");

const entries: Array<{ name: string; importPath: string }> = [];

for (const plugin of readdirSync(pluginsRoot)) {
  const toolsDir = join(pluginsRoot, plugin, "tools");

  try {
    for (const file of readdirSync(toolsDir)) {
      if (!file.endsWith(".ts")) {
        continue;
      }

      const source = readFileSync(join(toolsDir, file), "utf8");
      const match = source.match(/server\.tool\(\s*"([^"]+)"/);
      if (!match?.[1]) {
        continue;
      }

      entries.push({
        name: match[1],
        importPath: `src/plugins/${plugin}/tools/${file.replace(/\.ts$/, ".js")}`,
      });
    }
  } catch {}
}

entries.sort((left, right) => left.name.localeCompare(right.name));

mkdirSync(outputDir, { recursive: true });

writeFileSync(
  outputJson,
  JSON.stringify(Object.fromEntries(entries.map((entry) => [entry.name, entry.importPath])), null, 2) + "\n",
);

writeFileSync(
  outputTs,
  [
    "export const LOCAL_TOOL_REGISTRY = {",
    ...entries.map((entry) => `  "${entry.name}": () => import("${entry.importPath}"),`),
    "} as const;",
    "",
  ].join("\n"),
);
