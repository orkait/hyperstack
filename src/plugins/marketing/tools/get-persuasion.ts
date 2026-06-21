import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PERSUASION_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_persuasion",
    "Persuasion + headlines + landing-page anatomy: Ogilvy/Caples headline rules and swipe templates, Cialdini's 7 principles of influence, and the conversion-ordered landing page structure. Use while writing.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Persuasion, headlines & landing pages\n\n${PERSUASION_DOC}\n` }] }),
  );
}
