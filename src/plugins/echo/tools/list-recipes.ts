import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { RECIPES, RECIPE_CATEGORIES } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "echo_list_recipes",
    "List all Go Echo framework recipes. Optionally filter by category.",
    {
      category: z.enum(RECIPE_CATEGORIES).optional().describe("Filter by recipe category"),
    },
    async ({ category }) => {
      const list = category ? RECIPES.filter((r) => r.category === category) : RECIPES;

      const grouped: Record<string, string[]> = {};
      for (const r of list) {
        if (!grouped[r.category]) grouped[r.category] = [];
        grouped[r.category].push(`${r.name} - ${r.description}`);
      }

      let text = "# Echo Framework - Recipes\n\n";
      text += `Total: ${list.length} recipes\n\n`;
      for (const [cat, items] of Object.entries(grouped)) {
        text += `## ${cat}\n`;
        for (const item of items) text += `- ${item}\n`;
        text += "\n";
      }
      text += `\nCategories: ${RECIPE_CATEGORIES.join(", ")}\n`;
      text += `\nUse echo_get_recipe to fetch a recipe with full working Go code.`;

      return { content: [{ type: "text", text }] };
    }
  );
}
