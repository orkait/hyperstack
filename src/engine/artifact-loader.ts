import type { ArtifactContract, LoadedTopology } from "./contracts.js";

export function getArtifactContract(topology: LoadedTopology, artifactId: string): ArtifactContract {
  const artifact = topology.artifacts.find((entry) => entry.id === artifactId);
  if (!artifact) {
    throw new Error(`Unknown artifact contract: ${artifactId}`);
  }
  return artifact;
}
