import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CATEGORIES, searchApis, formatExample } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "motion_search_docs",
    "Search Motion for React documentation by keyword. Searches API names, descriptions, and code examples.",
    { query: z.string().describe("Search query (e.g., 'scroll animation', 'drag constraints', 'exit', 'spring')") },
    async ({ query }) => {
      const results = searchApis(query);
      if (results.length === 0) {
        return { content: [{ type: "text", text: `No results for "${query}". Try broader terms. Available categories: ${CATEGORIES.join(", ")}` }] };
      }
      let text = `# Search results for "${query}"\n\nFound ${results.length} API(s):\n\n`;
      for (const { api, matchingExamples } of results) {
        text += `## ${api.name} (${api.kind})\n${api.description}\nImport: \`${api.importPath}\`\n\n`;
        if (matchingExamples.length > 0) {
          text += "**Relevant examples:**\n";
          for (const ex of matchingExamples) text += formatExample(ex);
        }
        text += "---\n\n";
      }
      return { content: [{ type: "text", text }] };
    },
  );
}
