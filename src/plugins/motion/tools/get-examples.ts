import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CATEGORIES, getExamplesByCategory, formatExample, capitalize } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "motion_get_examples",
    "Get code examples for a specific animation category",
    { category: z.string().describe(`Category: ${CATEGORIES.join(", ")}`) },
    async ({ category }) => {
      const examples = getExamplesByCategory(category);
      if (examples.length === 0) {
        return { content: [{ type: "text", text: `No examples for category "${category}". Available: ${CATEGORIES.join(", ")}` }] };
      }
      let text = `# ${capitalize(category)} Examples\n\n`;
      for (const ex of examples) text += formatExample(ex, 2);
      return { content: [{ type: "text", text }] };
    },
  );
}
