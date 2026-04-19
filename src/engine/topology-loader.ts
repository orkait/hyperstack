import { readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type {
  AgentPolicy,
  ArtifactContract,
  BundlePolicy,
  DomainPolicy,
  LoadedTopology,
  RouteDefaults,
  TopologyRoot,
} from "./contracts.js";

interface RootDocument {
  version: 1;
  default_transport: "local-tools";
  entry_agent: string;
  domains: string[];
  agents: string[];
  bundles: string[];
  artifacts: string[];
}

interface DomainDocument {
  id: string;
  write_policy: DomainPolicy["writePolicy"];
  completion_proof: string;
  truth_bundles: string[];
  required_gates: string[];
  optional_gates: string[];
  forbidden_bundles: string[];
}

interface AgentDocument {
  id: string;
  kind: AgentPolicy["kind"];
  domains: string[];
  allowed_skills: string[];
  allowed_bundles: string[];
  forbidden_bundles: string[];
  handoff_in: string;
  handoff_out: string;
  completion_proof: string;
}

interface BundleDocument {
  id: string;
  domain: string;
  capabilities: string[];
  sources: string[];
  tool_prefixes: string[];
  output_contracts: string[];
}

interface ArtifactDocument {
  id: string;
  required_fields: string[];
  proof_mode: string;
}

interface RouteDefaultsDocument {
  default_agent: string;
  requires_workspace_inventory: boolean;
  domain_preference: Record<string, string>;
  cross_domain_agent: string;
  design_contract_required_when: string[];
  strictest_proof_order: string[];
}

function readYaml<T>(filePath: string): T {
  return YAML.parse(readFileSync(filePath, "utf8")) as T;
}

function mapRootDocument(root: RootDocument): TopologyRoot {
  return {
    version: root.version,
    defaultTransport: root.default_transport,
    entryAgent: root.entry_agent,
    domains: root.domains,
    agents: root.agents,
    bundles: root.bundles,
    artifacts: root.artifacts,
  };
}

function mapDomainDocument(domain: DomainDocument): DomainPolicy {
  return {
    id: domain.id,
    writePolicy: domain.write_policy,
    completionProof: domain.completion_proof,
    truthBundles: domain.truth_bundles,
    requiredGates: domain.required_gates,
    optionalGates: domain.optional_gates,
    forbiddenBundles: domain.forbidden_bundles,
  };
}

function mapAgentDocument(agent: AgentDocument): AgentPolicy {
  return {
    id: agent.id,
    kind: agent.kind,
    domains: agent.domains,
    allowedSkills: agent.allowed_skills,
    allowedBundles: agent.allowed_bundles,
    forbiddenBundles: agent.forbidden_bundles,
    handoffIn: agent.handoff_in,
    handoffOut: agent.handoff_out,
    completionProof: agent.completion_proof,
  };
}

function mapBundleDocument(bundle: BundleDocument): BundlePolicy {
  return {
    id: bundle.id,
    domain: bundle.domain,
    capabilities: bundle.capabilities,
    sources: bundle.sources,
    toolPrefixes: bundle.tool_prefixes,
    outputContracts: bundle.output_contracts,
  };
}

function mapArtifactDocument(doc: ArtifactDocument): ArtifactContract {
  return {
    id: doc.id,
    requiredFields: doc.required_fields,
    proofMode: doc.proof_mode,
  };
}

function mapRouteDefaultsDocument(doc: RouteDefaultsDocument): RouteDefaults {
  return {
    defaultAgent: doc.default_agent,
    requiresWorkspaceInventory: doc.requires_workspace_inventory,
    domainPreference: doc.domain_preference,
    crossDomainAgent: doc.cross_domain_agent,
    designContractRequiredWhen: doc.design_contract_required_when,
    strictestProofOrder: doc.strictest_proof_order,
  };
}

export function loadTopology(repoRoot: string): LoadedTopology {
  const root = mapRootDocument(readYaml<RootDocument>(join(repoRoot, "topology", "manifest.yaml")));
  const domains = root.domains.map((id) =>
    mapDomainDocument(readYaml<DomainDocument>(join(repoRoot, "topology", "domains", `${id}.yaml`))),
  );
  const agents = root.agents.map((id) =>
    mapAgentDocument(readYaml<AgentDocument>(join(repoRoot, "topology", "agents", `${id}.yaml`))),
  );
  const bundles = root.bundles.map((id) =>
    mapBundleDocument(readYaml<BundleDocument>(join(repoRoot, "topology", "bundles", `${id}.yaml`))),
  );
  const artifacts = root.artifacts.map((id) =>
    mapArtifactDocument(readYaml<ArtifactDocument>(join(repoRoot, "topology", "artifacts", `${id}.yaml`))),
  );
  const routeDefaults = mapRouteDefaultsDocument(
    readYaml<RouteDefaultsDocument>(join(repoRoot, "topology", "routes", "defaults.yaml")),
  );

  return {
    version: root.version,
    defaultTransport: root.defaultTransport,
    entryAgent: root.entryAgent,
    domains,
    agents,
    bundles,
    artifacts,
    routeDefaults,
  };
}
