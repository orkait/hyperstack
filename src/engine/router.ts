import type { LoadedTopology } from "./contracts.js";
import { getAgent, getDomain, getStrictestProofMode } from "./policy.js";

function shouldRequireDesignContract(input: {
  changeClassification: string;
  workspaceInventory: { projectMode: "greenfield" | "existing"; existingPatterns: string[] };
}): boolean {
  if (input.changeClassification !== "frontend_visual") {
    return false;
  }

  return (
    input.workspaceInventory.projectMode === "greenfield" ||
    input.workspaceInventory.existingPatterns.length === 0
  );
}

export function routeRequest(
  topology: LoadedTopology,
  input: {
    requestId: string;
    domainTargets: string[];
    capabilityTargets: string[];
    workspaceInventory: {
      projectMode: "greenfield" | "existing";
      existingPatterns: string[];
    };
    changeClassification: string;
  },
) {
  const uniqueDomains = [...new Set(input.domainTargets)];
  const routeAgentId =
    uniqueDomains.length > 1
      ? topology.routeDefaults.crossDomainAgent
      : topology.routeDefaults.domainPreference[uniqueDomains[0] ?? "shared"] ?? topology.routeDefaults.defaultAgent;

  const agent = getAgent(topology, routeAgentId);
  const proofMode = getStrictestProofMode(
    topology.routeDefaults.strictestProofOrder,
    uniqueDomains.map((domainId) => getDomain(topology, domainId).completionProof),
  );

  const requiredArtifacts = ["workspace_inventory", "task_handoff"];
  const requiresDesignContract = shouldRequireDesignContract(input);

  if (requiresDesignContract) {
    requiredArtifacts.push("design_contract");
  }

  return {
    requestId: input.requestId,
    agent,
    proofMode,
    domains: uniqueDomains,
    capabilityTargets: input.capabilityTargets,
    requiredArtifacts,
    requiresDesignContract,
  };
}
