import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ROADMAP_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_roadmapping",
    "Roadmapping: Now/Next/Later horizons, outcome-based (not feature-based) roadmaps, theme-based organization, and GIST. Use to communicate direction without faking date precision or sliding into a feature factory.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Roadmapping\n\n${ROADMAP_DOC}\n` }] }),
  );
}
