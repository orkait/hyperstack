import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { DESIGN_PATTERNS, getPatternsByCategory } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "golang_list_patterns",
    "List Go design patterns by category (creational, structural, behavioral, concurrency)",
    {
      category: z.enum(["all", "creational", "structural", "behavioral", "concurrency"]).optional(),
    },
    async ({ category }) => {
      const list = category && category !== "all"
        ? getPatternsByCategory(category)
        : DESIGN_PATTERNS;

      const grouped: Record<string, typeof list> = {};
      for (const p of list) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      }

      let text = "# Go Design Patterns\n\nGo uses composition + interfaces, not inheritance.\n\n";
      for (const [cat, items] of Object.entries(grouped)) {
        text += `## ${cat}\n`;
        for (const p of items) {
          text += `- **${p.name}** - ${p.goApproach.split(".")[0]}`;
          if (p.oopEquivalent) text += ` *(OOP: ${p.oopEquivalent})*`;
          text += "\n";
        }
        text += "\n";
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
