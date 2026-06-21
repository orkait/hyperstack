import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GROWTH_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_growth_model",
    "Growth model: AARRR pirate metrics (acquisition/activation/retention/referral/revenue) + growth loops vs funnels (Reforge) + the North Star metric. Use to design how growth compounds.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Growth model\n\n${GROWTH_DOC}\n` }] }),
  );
}
