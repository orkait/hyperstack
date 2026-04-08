import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchRecipes, searchMiddleware, RECIPE_CATEGORIES } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "echo_search_docs",
    "Search Echo framework recipes and middleware by keyword.",
    {
      query: z.string().describe("Search query (e.g., 'websocket', 'auth', 'file upload', 'graceful', 'flush')"),
    },
    async ({ query }) => {
      const recipes = searchRecipes(query);
      const middleware = searchMiddleware(query);

      if (recipes.length === 0 && middleware.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No results for "${query}".\n\nTry broader terms. Available categories: ${RECIPE_CATEGORIES.join(", ")}`,
            },
          ],
        };
      }

      let text = `# Echo Search: "${query}"\n\n`;

      if (recipes.length > 0) {
        text += `## Recipes (${recipes.length})\n\n`;
        for (const r of recipes) {
          text += `### ${r.name} [${r.category}]\n`;
          text += `${r.description}\n`;
          text += `**Use when:** ${r.when}\n`;
          if (r.gotchas && r.gotchas.length > 0) {
            text += `**Key gotcha:** ${r.gotchas[0]}\n`;
          }
          text += "\n";
        }
      }

      if (middleware.length > 0) {
        text += `## Middleware (${middleware.length})\n\n`;
        for (const m of middleware) {
          text += `### ${m.name}\n`;
          text += `${m.purpose}\n`;
          text += `Usage: \`${m.usage}\`\n\n`;
        }
      }

      text += "Use echo_get_recipe or echo_get_middleware for full details with code.";
      return { content: [{ type: "text", text }] };
    }
  );
}
