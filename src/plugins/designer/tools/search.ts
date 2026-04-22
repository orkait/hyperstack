import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { searchDesigner } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_search",
    "Search across all designer knowledge: personalities, styles, industries, cognitive laws, design systems, composition, interactions, writing, landing, anti-patterns, and master principles",
    {
      query: z.string().describe("Search query (e.g. 'dark mode', 'typography', 'fintech', 'fitts', 'contrast')"),
    },
    async ({ query }) => {
      const results = searchDesigner(query);

      if (!results.length) {
        return {
          content: [{ type: "text", text: `No results for "${query}". Try: typography, contrast, dark mode, fintech, animation, spacing, accessibility` }],
        };
      }

      let text = `# Search results for "${query}"\n\n`;

      const grouped: Record<string, typeof results> = {};
      for (const r of results) {
        if (!grouped[r.kind]) grouped[r.kind] = [];
        grouped[r.kind].push(r);
      }

      for (const [kind, items] of Object.entries(grouped)) {
        text += `## ${kind} (${items.length})\n`;
        for (const item of items) {
          text += `- **${item.name}** - ${item.summary}\n`;
        }
        text += "\n";
      }

      text += `**Total:** ${results.length} results`;
      return { content: [{ type: "text", text }] };
    }
  );
}
