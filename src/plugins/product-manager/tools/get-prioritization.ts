import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PRIORITIZATION_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_prioritization",
    "Prioritization frameworks beyond RICE: MoSCoW (release scoping), Kano (basic/performance/excitement), ICE, WSJF / cost-of-delay, and opportunity scoring (importance vs satisfaction gap). Use to decide what to build and in what order.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Prioritization\n\n${PRIORITIZATION_DOC}\n` }] }),
  );
}
