import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DISCOVERY_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_discovery_rules",
    "Continuous-discovery rules (Torres): weekly customer contact, never ask 'what do you want', elicit past-behaviour stories. Use before claiming a build is customer-grounded.",
    {},
    async () => {
      const text = `# Discovery Rules\n\n${DISCOVERY_DOC}\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
