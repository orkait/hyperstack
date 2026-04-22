import type { ToolServer } from "../../shared/tool-types.js";
import type { Plugin } from "../../registry.js";
import { register as listPatterns } from "./tools/list-patterns.js";
import { register as getPattern } from "./tools/get-pattern.js";
import { register as getConstraints } from "./tools/get-constraints.js";
import { register as searchDocs } from "./tools/search-docs.js";

function register(server: ToolServer): void {
  listPatterns(server);
  getPattern(server);
  getConstraints(server);
  searchDocs(server);
}

export const reactPlugin: Plugin = {
  name: "react",
  register,
};
