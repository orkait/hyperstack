import type { LoadedTopology } from "./contracts.js";
import { getArtifactContract } from "./artifact-loader.js";

export function validateArtifactPayload(
  topology: LoadedTopology,
  artifactId: string,
  payload: Record<string, unknown>,
) {
  const contract = getArtifactContract(topology, artifactId);
  const missingFields = contract.requiredFields.filter((field) => !(field in payload));

  return {
    ok: missingFields.length === 0,
    artifactId,
    proofMode: contract.proofMode,
    missingFields,
  };
}
