import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadTopology } from "../src/engine/topology-loader.js";

const repoRoot = resolve(".");
const topology = loadTopology(repoRoot);

mkdirSync(resolve("generated/runtime-context"), { recursive: true });
mkdirSync(resolve("generated/routing"), { recursive: true });

writeFileSync(
  resolve("generated/runtime-context/topology.bootstrap.md"),
  [
    "# Topology Runtime Bootstrap",
    "",
    `Entry agent: ${topology.entryAgent}`,
    "",
    "## Agents",
    ...topology.agents.map((agent) => `- ${agent.id}: ${agent.kind} -> ${agent.domains.join(", ")}`),
    "",
    "## Bundles",
    ...topology.bundles.map((bundle) => `- ${bundle.id}: ${bundle.capabilities.join(", ")}`),
    "",
  ].join("\n"),
);

writeFileSync(
  resolve("generated/routing/allow-deny.md"),
  [
    "# Allow / Deny Matrix",
    "",
    ...topology.agents.flatMap((agent) => [
      `## ${agent.id}`,
      `- Allowed: ${agent.allowedBundles.join(", ")}`,
      `- Forbidden: ${agent.forbiddenBundles.join(", ")}`,
      "",
    ]),
  ].join("\n"),
);
