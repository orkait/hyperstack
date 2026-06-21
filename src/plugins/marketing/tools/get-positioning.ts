import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { POSITIONING_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_positioning",
    "Positioning framework (April Dunford): the 5 components in order (competitive alternatives -> unique attributes -> value -> target -> category) + the 3 positioning styles + a positioning-statement template. Use FIRST, before any messaging or copy.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Positioning\n\n${POSITIONING_DOC}\n` }] }),
  );
}
