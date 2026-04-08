import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllGotchas } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "design_tokens_get_gotchas",
    "List all common design token mistakes and fixes across all categories",
    {},
    async () => {
      const gotchas = getAllGotchas();

      let text = "# Design Token Gotchas\n\nCommon mistakes that break token systems:\n\n";

      const bySource: Record<string, string[]> = {};
      for (const { source, gotcha } of gotchas) {
        if (!bySource[source]) bySource[source] = [];
        bySource[source].push(gotcha);
      }

      for (const [source, items] of Object.entries(bySource)) {
        text += `## ${source}\n`;
        for (const item of items) text += `- ${item}\n`;
        text += "\n";
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
