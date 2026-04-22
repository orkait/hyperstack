import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { RECIPES, getRecipeByName, searchRecipes, formatRecipe } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "echo_get_recipe",
    "Get a specific Echo framework recipe with full working Go code, gotchas, and related recipes.",
    {
      name: z.string().describe("Recipe name (e.g., 'crud-api', 'websocket', 'sse', 'jwt-auth', 'graceful-shutdown')"),
    },
    async ({ name }: { name: string }) => {
      const recipe = getRecipeByName(name);
      if (!recipe) {
        const suggestions = searchRecipes(name).map((r) => r.name);
        const allNames = RECIPES.map((r) => r.name).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Recipe "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.slice(0, 3).join(", ")}?` : ""}\n\nAll recipes: ${allNames}`,
            },
          ],
          isError: true,
        };
      }
      return { content: [{ type: "text", text: formatRecipe(recipe) }] };
    },
  );
}
