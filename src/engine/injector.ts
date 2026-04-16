import type { BundlePolicy } from "./contracts.js";

export function buildInjectionSlice(bundle: BundlePolicy, capability: string) {
  return {
    bundle: bundle.id,
    capability,
    sources: bundle.sources,
    toolPrefixes: bundle.toolPrefixes,
  };
}
