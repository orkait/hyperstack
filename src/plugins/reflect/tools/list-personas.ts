import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ROSTER } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "reflect_list_personas",
    "List the Reflect reviewer archetypes (the target-customer lenses you can review a screen as). Default is Morgan. Switch with reflect_get_persona(id).",
    {},
    async () => {
      let text = `# Reflect roster\n\nReview the screen AS one of these. Default: Morgan. Get a full lens with reflect_get_persona(id).\n\n`;
      for (const r of ROSTER) text += `- **${r.label}** (\`${r.id}\`) - ${r.oneLiner}\n`;
      text += `\n"Get me everyone's read" -> each one's one-line verdict + biggest concern, then where they disagree.\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
