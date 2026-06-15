import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALGO_CLASSES, TECHNIQUES, techniquesByClass, type AlgoClass } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "optimizer_list_techniques",
    "List the technique menu, optionally filtered by class. Each row is name + complexity + when to reach for it. No implementations - this is the recall aid.",
    {
      class: z.enum(ALGO_CLASSES).optional().describe("Optional class filter, e.g. 'graphs', 'dp', 'binary-search'. Omit for the full menu."),
    },
    async ({ class: cls }) => {
      const list = cls ? techniquesByClass(cls as AlgoClass) : TECHNIQUES;
      let text = cls ? `# Techniques: ${cls}\n\n` : `# All techniques (${TECHNIQUES.length})\n\n`;
      text += `| technique | class | time | space | when |\n|---|---|---|---|---|\n`;
      for (const t of list) {
        text += `| \`${t.name}\` | ${t.class} | ${t.time} | ${t.space} | ${t.when} |\n`;
      }
      text += `\nUse \`optimizer_get_technique(name)\` for the web-search query to fetch an implementation.\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
