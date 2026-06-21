import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BRAND_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_brand_strategy",
    "Evidence-based brand strategy: Byron Sharp's laws (penetration over loyalty, mental & physical availability, distinctive assets, double jeopardy), Binet & Field's 60/40 brand-vs-activation split, and category design (different-not-better). Use for the longer game.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Brand strategy\n\n${BRAND_DOC}\n` }] }),
  );
}
