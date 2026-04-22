import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PATTERNS, PATTERN_CATEGORIES, getPatternsByCategory } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "react_list_patterns",
    "List all React/Next.js patterns by category",
    {
      category: z.enum(["all", ...PATTERN_CATEGORIES]).optional(),
    },
    async ({ category }) => {
      const list = category && category !== "all"
        ? getPatternsByCategory(category as any)
        : PATTERNS;

      const grouped: Record<string, typeof PATTERNS> = {};
      for (const p of list) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      }

      let text = "# React/Next.js Patterns (SDE-3 level)\n\n";
      for (const [cat, items] of Object.entries(grouped)) {
        text += `## ${cat}\n`;
        for (const p of items) {
          text += `- **${p.name}** - ${p.description}\n`;
        }
        text += "\n";
      }
      text += `\n**Total:** ${list.length} patterns`;
      return { content: [{ type: "text", text }] };
    }
  );
}
