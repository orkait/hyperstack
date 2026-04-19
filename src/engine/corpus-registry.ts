import type { CorpusIndex } from "./contracts.js";

export function getNamespaceRoot(index: CorpusIndex, namespace: string): string {
  const root = index.namespaces[namespace];
  if (!root) {
    throw new Error(`Unknown corpus namespace: ${namespace}`);
  }
  return root;
}
