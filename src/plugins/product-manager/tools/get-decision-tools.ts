import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DECISION_TOOLKIT_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_decision_tools",
    "Decision-making toolkit: Type-1/Type-2 (reversible vs one-way-door) decisions, the 70% rule, pre-mortems, disagree-and-commit, decision records, and decision-vs-outcome quality. Use to make and document calls under uncertainty.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Decision toolkit\n\n${DECISION_TOOLKIT_DOC}\n` }] }),
  );
}
