import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { METRICS_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_metrics",
    "Product metrics: North Star metric, One Metric That Matters, OKRs (outcomes not tasks), Google's HEART, AARRR, and input-vs-output / vanity-metric traps. Use to define what success is measured by.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Product metrics\n\n${METRICS_DOC}\n` }] }),
  );
}
