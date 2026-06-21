import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ICP_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_icp",
    "Define the Ideal Customer Profile: firmographics/psychographics, buying triggers, the 'who cares most' test, the early-vangelist profile, and the anti-ICP. Use during positioning to decide who EXACTLY it is for - not 'everyone'.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Ideal Customer Profile\n\n${ICP_DOC}\n` }] }),
  );
}
