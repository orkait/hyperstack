import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { STRATEGY_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_strategy_rules",
    "Product-strategy rules (Cagan): focus on 2-3 levers, saying no is the act of prioritization, a long list is a non-strategy. Use to cut scope.",
    {},
    async () => {
      const text = `# Strategy Rules\n\n${STRATEGY_DOC}\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
