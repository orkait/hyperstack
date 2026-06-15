import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchTechniques } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "optimizer_search",
    "Free-text search across the technique catalog (name, class, when-to-use, and the naive smell it replaces).",
    {
      query: z.string().describe("e.g. 'shortest path', 'dedup', 'range query', 'kth largest', 'overlapping intervals'."),
    },
    async ({ query }) => {
      const hits = searchTechniques(query);
      if (hits.length === 0) {
        return { content: [{ type: "text" as const, text: `No technique matched "${query}". Try \`optimizer_list_classes\` or \`optimizer_match_problem\`.` }] };
      }
      let text = `# Search: "${query}" (${hits.length})\n\n`;
      text += `| technique | class | time | when | replaces |\n|---|---|---|---|---|\n`;
      for (const t of hits) {
        text += `| \`${t.name}\` | ${t.class} | ${t.time} | ${t.when} | ${t.replaces} |\n`;
      }
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
