import type { AgentPolicy, BundlePolicy, DomainPolicy, LoadedTopology } from "./contracts.js";

export function getAgent(topology: LoadedTopology, agentId: string): AgentPolicy {
  const agent = topology.agents.find((entry) => entry.id === agentId);
  if (!agent) {
    throw new Error(`Unknown agent: ${agentId}`);
  }
  return agent;
}

export function getDomain(topology: LoadedTopology, domainId: string): DomainPolicy {
  const domain = topology.domains.find((entry) => entry.id === domainId);
  if (!domain) {
    throw new Error(`Unknown domain: ${domainId}`);
  }
  return domain;
}

export function getBundleForTool(topology: LoadedTopology, toolName: string): BundlePolicy | null {
  const matches = topology.bundles
    .filter((bundle) => bundle.toolPrefixes.some((prefix) => toolName.startsWith(prefix)))
    .sort((left, right) => {
      const leftLen = Math.max(...left.toolPrefixes.filter((p) => toolName.startsWith(p)).map((p) => p.length));
      const rightLen = Math.max(...right.toolPrefixes.filter((p) => toolName.startsWith(p)).map((p) => p.length));
      return rightLen - leftLen;
    });
  return matches[0] ?? null;
}

export function assertToolAllowedForAgent(
  topology: LoadedTopology,
  agent: AgentPolicy,
  toolName: string,
): BundlePolicy {
  const bundle = getBundleForTool(topology, toolName);
  if (!bundle) {
    throw new Error(
      `Tool ${toolName} is not mapped to any bundle (no matching tool_prefixes in topology/bundles/*).`,
    );
  }
  if (agent.forbiddenBundles.includes(bundle.id)) {
    throw new Error(
      `Agent ${agent.id} is forbidden from bundle ${bundle.id} (tool ${toolName}).`,
    );
  }
  if (!agent.allowedBundles.includes(bundle.id)) {
    throw new Error(
      `Agent ${agent.id} is not allowed to call tools in bundle ${bundle.id} (tool ${toolName}). Allowed bundles: ${agent.allowedBundles.join(", ") || "(none)"}.`,
    );
  }
  return bundle;
}

export function getStrictestProofMode(order: string[], proofModes: string[]): string {
  const ranked = proofModes
    .map((mode) => ({ mode, index: order.indexOf(mode) }))
    .filter((entry) => entry.index >= 0)
    .sort((left, right) => right.index - left.index);

  if (ranked.length === 0) {
    throw new Error(`No proof mode could be ranked from: ${proofModes.join(", ")}`);
  }

  return ranked[0].mode;
}
