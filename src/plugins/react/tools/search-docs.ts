import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchPatterns, CONSTRAINTS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "react_search_docs",
    "Search React/Next.js patterns and constraints by keyword",
    {
      query: z.string().describe("Search query (e.g. 'server component', 'state', 'fetch', 'zustand', 'SEO')"),
    },
    async ({ query }) => {
      const patterns = searchPatterns(query);
      const q = query.toLowerCase();
      const constraints = CONSTRAINTS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.rule.toLowerCase().includes(q) ||
          c.reason.toLowerCase().includes(q)
      );

      if (!patterns.length && !constraints.length) {
        return {
          content: [{ type: "text", text: `No results for "${query}". Try: server component, state, fetch, zustand, SEO, metadata, suspense` }],
        };
      }

      let text = `# Search: "${query}"\n\n`;
      if (patterns.length) {
        text += `## Patterns (${patterns.length})\n`;
        for (const p of patterns) {
          text += `- **${p.name}** [${p.category}] - ${p.description}\n`;
        }
        text += "\n";
      }
      if (constraints.length) {
        text += `## Constraints (${constraints.length})\n`;
        for (const c of constraints) {
          text += `- **${c.name}** - ${c.rule}\n`;
        }
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
