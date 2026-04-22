import type { ToolServer } from "../../../shared/tool-types.js";
import { CONSTRAINTS } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "react_get_constraints",
    "List all forbidden React/Next.js patterns and their reasons",
    {},
    async () => {
      let text = "# React/Next.js Constraints (Hard Rules)\n\n";
      text += "Violating these causes bugs, performance issues, or maintenance problems.\n\n";
      for (const c of CONSTRAINTS) {
        text += `## ${c.name}\n`;
        text += `**Rule:** ${c.rule}\n`;
        text += `**Why:** ${c.reason}\n`;
        if (c.example) text += `**Instead:** ${c.example}\n`;
        text += "\n";
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
