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
}

export const productManagerPlugin: Plugin = {
  name: "product-manager",
  register,
};
