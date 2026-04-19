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
    `Cross-domain agent: ${topology.routeDefaults.crossDomainAgent}`,
    `Workspace inventory required: ${topology.routeDefaults.requiresWorkspaceInventory}`,
    "Design contract is conditional",
    "",
    "## Artifacts",
    ...topology.artifacts.map((artifact) => `- ${artifact.id}: ${artifact.proofMode}`),
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
      `- Allowed Skills: ${agent.allowedSkills.join(", ")}`,
      `- Completion Proof: ${agent.completionProof}`,
      "",
    ]),
  ].join("\n"),
);
