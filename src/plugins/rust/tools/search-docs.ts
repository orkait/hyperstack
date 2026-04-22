import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { searchPractices } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "rust_search_docs",
    "Search Rust best practices by keyword",
    {
      query: z.string().describe("Search query (e.g. 'ownership', 'error handling', 'performance', 'clippy', 'testing', 'async')"),
    },
    async ({ query }) => {
      const results = searchPractices(query);
      if (!results.length) {
        return { content: [{ type: "text", text: `No results for "${query}". Try: ownership, clone, error, panic, performance, clippy, testing, generic, thread` }] };
      }
      let text = `# Rust Search: "${query}"\n\nFound ${results.length} practice(s):\n\n`;
      for (const p of results) {
        text += `## ${p.name} [${p.chapter}]\n${p.rule}\n\n`;
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
