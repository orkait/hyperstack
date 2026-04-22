import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchTokens } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "design_tokens_search",
    "Search design token documentation by keyword across categories, ramps, and procedures",
    {
      query: z.string().describe("Search query (e.g. 'dark mode', 'spacing', 'oklch', 'contrast', 'motion')"),
    },
    async ({ query }) => {
      const results = searchTokens(query);
      if (results.length === 0) {
        return {
          content: [{ type: "text", text: `No results for "${query}". Try: colors, spacing, typography, motion, elevation, z-index, opacity, density, contrast, oklch, tailwind` }],
        };
      }

      let text = `# Search results for "${query}"\n\nFound ${results.length} result(s):\n\n`;
      for (const result of results) {
        if (result.category) {
          text += `## Category: ${result.category.name}\n${result.category.description}\n`;
          text += `Layer: ${result.category.layer}\n\n`;
        }
        if (result.ramp) {
          text += `## Color Ramp: ${result.ramp.name}\n${result.ramp.description}\n\n`;
        }
        if (result.procedure) {
          text += `## Procedure Step ${result.procedure.step}: ${result.procedure.title}\n${result.procedure.description}\n\n`;
        }
        text += "---\n\n";
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
