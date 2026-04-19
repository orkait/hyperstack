import type { AgentPolicy, BundlePolicy, DomainPolicy, LoadedTopology } from "./contracts.js";

export function getAgent(topology: LoadedTopology, agentId: string): AgentPolicy {
  const agent = topology.agents.find((entry) => entry.id === agentId);
  if (!agent) {
    throw new Error(`Unknown agent: ${agentId}`);
  }
  return agent;
}

export function getBundleByCapability(topology: LoadedTopology, capability: string): BundlePolicy {
  const bundle = topology.bundles.find((entry) => entry.capabilities.includes(capability));
  if (!bundle) {
    throw new Error(`No bundle found for capability: ${capability}`);
  }
  return bundle;
}

export function getDomain(topology: LoadedTopology, domainId: string): DomainPolicy {
  const domain = topology.domains.find((entry) => entry.id === domainId);
  if (!domain) {
    throw new Error(`Unknown domain: ${domainId}`);
  }
  return domain;
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
