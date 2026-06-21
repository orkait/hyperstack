import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MESSAGING_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_messaging",
    "Messaging frameworks: value-proposition canvas (jobs/pains/gains), StoryBrand SB7 (customer is the hero), strategic narrative (Raskin - story = strategy), and the message hierarchy. Use after positioning is set.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Messaging\n\n${MESSAGING_DOC}\n` }] }),
  );
}
