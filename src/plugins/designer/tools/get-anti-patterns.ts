import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ANTI_PATTERN_CATEGORIES, INDUSTRY_CATEGORIES, getAntiPatterns } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "designer_get_anti_patterns",
    "Get design anti-patterns filtered by category and/or industry",
    {
      category: z.enum(ANTI_PATTERN_CATEGORIES).optional().describe("Anti-pattern category filter"),
      industry: z.enum(INDUSTRY_CATEGORIES).optional().describe("Industry filter"),
    },
    async ({ category, industry }) => {
      const patterns = getAntiPatterns(category, industry);

      if (!patterns.length) {
        return {
          content: [{ type: "text", text: `No anti-patterns found.\n\nCategories: ${ANTI_PATTERN_CATEGORIES.join(", ")}\nIndustries: ${INDUSTRY_CATEGORIES.join(", ")}` }],
          isError: true,
        };
      }

      const heading = [category, industry].filter(Boolean).join(" + ") || "all";
      let text = `# Anti-Patterns (${heading})\n\n`;

      for (const ap of patterns) {
        text += `## ${ap.pattern}\n`;
        text += `**Category:** ${ap.category}`;
        if (ap.industry) text += ` | **Industry:** ${ap.industry}`;
        text += `\n\n`;
        text += `**Why it fails:** ${ap.whyItFails}\n\n`;
        text += `**Fix:** ${ap.fix}\n\n`;
      }

      text += `**Total:** ${patterns.length} anti-patterns`;
      return { content: [{ type: "text", text }] };
    }
  );
}
