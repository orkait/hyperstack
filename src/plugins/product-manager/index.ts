import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as getFourRisks } from "./tools/get-four-risks.js";
import { register as getJtbd } from "./tools/get-jtbd.js";
import { register as getDiscoveryRules } from "./tools/get-discovery-rules.js";
import { register as getAntiPatterns } from "./tools/get-anti-patterns.js";
import { register as getStrategyRules } from "./tools/get-strategy-rules.js";
import { register as opportunityVsSolution } from "./tools/opportunity-vs-solution.js";
import { register as validateJobStatement } from "./tools/validate-job-statement.js";
import { register as scoreRice } from "./tools/score-rice.js";
import { register as resolveProductDecision } from "./tools/resolve-product-decision.js";
import { register as getPrioritization } from "./tools/get-prioritization.js";
import { register as getDecisionTools } from "./tools/get-decision-tools.js";
import { register as getMvpScoping } from "./tools/get-mvp-scoping.js";
import { register as getRoadmapping } from "./tools/get-roadmapping.js";
import { register as getMetrics } from "./tools/get-metrics.js";
import { register as getProductSense } from "./tools/get-product-sense.js";

function register(server: McpServer): void {
  getFourRisks(server);
  getJtbd(server);
  getDiscoveryRules(server);
  getAntiPatterns(server);
  getStrategyRules(server);
  opportunityVsSolution(server);
  validateJobStatement(server);
  scoreRice(server);
  resolveProductDecision(server);
  getPrioritization(server);
  getDecisionTools(server);
  getMvpScoping(server);
  getRoadmapping(server);
  getMetrics(server);
  getProductSense(server);
}

export const productManagerPlugin: Plugin = {
  name: "product-manager",
  register,
};
