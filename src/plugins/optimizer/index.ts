import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as matchProblem } from "./tools/match-problem.js";
import { register as getTechnique } from "./tools/get-technique.js";
import { register as listTechniques } from "./tools/list-techniques.js";
import { register as listClasses } from "./tools/list-classes.js";
import { register as search } from "./tools/search.js";

function register(server: McpServer): void {
  matchProblem(server);
  getTechnique(server);
  listTechniques(server);
  listClasses(server);
  search(server);
}

export const optimizerPlugin: Plugin = {
  name: "optimizer",
  register,
};
