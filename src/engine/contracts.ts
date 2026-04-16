export interface TopologyRoot {
  version: 1;
  defaultTransport: "local-tools";
  entryAgent: string;
  domains: string[];
  agents: string[];
  bundles: string[];
}

export interface DomainPolicy {
  id: string;
  writePolicy: "constrained" | "direct" | "policy_only";
  completionProof: string;
  truthBundles: string[];
  requiredGates: string[];
  optionalGates: string[];
  forbiddenBundles: string[];
}

export interface AgentPolicy {
  id: string;
  kind: "orchestrator" | "specialist" | "cross-domain";
  domains: string[];
  allowedSkills: string[];
  allowedBundles: string[];
  forbiddenBundles: string[];
  handoffIn: string;
  handoffOut: string;
  completionProof: string;
}

export interface BundlePolicy {
  id: string;
  domain: string;
  capabilities: string[];
  sources: string[];
  toolPrefixes: string[];
  outputContracts: string[];
}

export interface LoadedTopology {
  version: 1;
  defaultTransport: "local-tools";
  entryAgent: string;
  domains: DomainPolicy[];
  agents: AgentPolicy[];
  bundles: BundlePolicy[];
}
