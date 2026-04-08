import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as listCategories } from "./tools/list-categories.js";
import { register as getCategory } from "./tools/get-category.js";
import { register as getColorRamp } from "./tools/get-color-ramp.js";
import { register as getProcedure } from "./tools/get-procedure.js";
import { register as search } from "./tools/search.js";
import { register as getGotchas } from "./tools/get-gotchas.js";
import { register as generate } from "./tools/generate.js";

function register(server: McpServer): void {
  listCategories(server);
  getCategory(server);
  getColorRamp(server);
  getProcedure(server);
  search(server);
  getGotchas(server);
  generate(server);
}

export const designTokensPlugin: Plugin = {
  name: "design-tokens",
  register,
};
