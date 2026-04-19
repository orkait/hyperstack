import type { LoadedTopology } from "./contracts.js";
import { getAgent, getBundleByCapability, getDomain } from "./policy.js";

export function resolveCapabilityContext(
  topology: LoadedTopology,
  input: { agentId: string; capability: string },
) {
  const agent = getAgent(topology, input.agentId);
  const bundle = getBundleByCapability(topology, input.capability);
  const domain = getDomain(topology, bundle.domain);

  if (!agent.allowedBundles.includes(bundle.id)) {
    throw new Error(`Agent ${agent.id} attempted forbidden bundle ${bundle.id}`);
  }

  if (agent.forbiddenBundles.includes(bundle.id) || domain.forbiddenBundles.includes(bundle.id)) {
    throw new Error(`Agent ${agent.id} attempted forbidden bundle ${bundle.id}`);
  }

  return { agent, bundle, domain };
}
