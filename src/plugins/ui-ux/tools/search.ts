import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchPrinciples, COMPONENT_PATTERNS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "ui_ux_search",
    "Search UI/UX principles and component patterns by keyword",
    {
      query: z.string().describe("Search query (e.g. 'contrast', 'dark mode', 'spacing', 'focus', 'button')"),
    },
    async ({ query }) => {
      const principles = searchPrinciples(query);
      const q = query.toLowerCase();
      const components = COMPONENT_PATTERNS.filter(
        (c) =>
          c.name.includes(q) ||
          c.rules.some((r) => r.toLowerCase().includes(q)) ||
          c.states.some((s) => s.toLowerCase().includes(q))
      );

      if (!principles.length && !components.length) {
        return {
          content: [{ type: "text", text: `No results for "${query}". Try: contrast, dark mode, spacing, focus, motion, typography, button, card` }],
        };
      }

      let text = `# Search results for "${query}"\n\n`;

      if (principles.length) {
        text += `## Principles (${principles.length})\n`;
        for (const p of principles) {
          text += `### ${p.name} [${p.domain}]\n${p.rule}\n\n`;
        }
      }

      if (components.length) {
        text += `## Component Patterns (${components.length})\n`;
        for (const c of components) {
          text += `### ${c.name}\nVariants: ${c.variants?.join(", ") ?? "-"} | States: ${c.states.join(", ")}\n\n`;
        }
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
