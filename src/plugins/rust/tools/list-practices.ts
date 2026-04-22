import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BEST_PRACTICES, CHAPTERS, getPracticesByChapter } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "rust_list_practices",
    "List Rust best practices by chapter",
    {
      chapter: z.enum(["all", ...CHAPTERS]).optional(),
    },
    async ({ chapter }) => {
      const list = chapter && chapter !== "all"
        ? getPracticesByChapter(chapter as any)
        : BEST_PRACTICES;

      const grouped: Record<string, typeof list> = {};
      for (const p of list) {
        if (!grouped[p.chapter]) grouped[p.chapter] = [];
        grouped[p.chapter].push(p);
      }

      let text = "# Rust Best Practices (Apollo GraphQL Handbook)\n\n";
      for (const [ch, items] of Object.entries(grouped)) {
        text += `## Chapter: ${ch}\n`;
        for (const p of items) text += `- **${p.name}** - ${p.rule}\n`;
        text += "\n";
      }
      text += `\n**Total:** ${list.length} practices`;
      return { content: [{ type: "text", text }] };
    }
  );
}
