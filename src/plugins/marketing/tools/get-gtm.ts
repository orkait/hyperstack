import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GTM_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_gtm",
    "Go-to-market motions (PLG vs sales-led vs marketing-led vs community-led, and when each fits) + the product-launch playbook (launch tiers and pre/launch/post phases). Use to decide how it reaches the market.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Go-to-market\n\n${GTM_DOC}\n` }] }),
  );
}
