import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as listRecipes } from "./tools/list-recipes.js";
import { register as getRecipe } from "./tools/get-recipe.js";
import { register as listMiddleware } from "./tools/list-middleware.js";
import { register as getMiddleware } from "./tools/get-middleware.js";
import { register as searchDocs } from "./tools/search-docs.js";
import { register as decisionMatrix } from "./tools/decision-matrix.js";

function register(server: McpServer): void {
  listRecipes(server);
  getRecipe(server);
  listMiddleware(server);
  getMiddleware(server);
  searchDocs(server);
  decisionMatrix(server);
}

export const echoPlugin: Plugin = { name: "echo", register };
