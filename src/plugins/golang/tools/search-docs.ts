import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { searchAll } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "golang_search_docs",
    "Search Go best practices and design patterns by keyword",
    {
      query: z.string().describe("Search query (e.g. 'error', 'goroutine', 'interface', 'testing', 'context', 'security')"),
    },
    async ({ query }) => {
      const { practices, patterns } = searchAll(query);
      if (!practices.length && !patterns.length) {
        return { content: [{ type: "text", text: `No results for "${query}". Try: error, goroutine, interface, context, security, testing, concurrency` }] };
      }

      let text = `# Go Search: "${query}"\n\n`;
      if (practices.length) {
        text += `## Best Practices (${practices.length})\n`;
        for (const p of practices) text += `- [${p.priority}] **${p.name}** [${p.topic}] - ${p.rule}\n`;
        text += "\n";
      }
      if (patterns.length) {
        text += `## Design Patterns (${patterns.length})\n`;
        for (const p of patterns) text += `- **${p.name}** [${p.category}] - ${p.goApproach.split(".")[0]}\n`;
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
