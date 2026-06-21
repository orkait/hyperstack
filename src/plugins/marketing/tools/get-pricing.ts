import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PRICING_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_pricing",
    "Pricing & packaging as a marketing lever: value-based pricing, good-better-best tiering, anchoring, fences between tiers, the value metric, and willingness-to-pay testing. Use to package and price the offer.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Pricing & packaging\n\n${PRICING_DOC}\n` }] }),
  );
}
