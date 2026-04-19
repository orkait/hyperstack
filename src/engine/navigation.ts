import type { BundlePolicy, LoadedTopology } from "./contracts.js";

export function getBundle(topology: LoadedTopology, bundleId: string): BundlePolicy {
  const bundle = topology.bundles.find((entry) => entry.id === bundleId);
  if (!bundle) {
    throw new Error(`Unknown bundle: ${bundleId}`);
  }
  return bundle;
}

export function listAgentRouting(topology: LoadedTopology) {
  return topology.agents.map((agent) => ({
    id: agent.id,
    allowedBundles: agent.allowedBundles,
    forbiddenBundles: agent.forbiddenBundles,
  }));
}
