import type { ToolServer } from "../../shared/tool-types.js";
import type { Plugin } from "../../registry.js";
import { register as listPractices } from "./tools/list-practices.js";
import { register as getPractice } from "./tools/get-practice.js";
import { register as listPatterns } from "./tools/list-patterns.js";
import { register as getPattern } from "./tools/get-pattern.js";
import { register as getAntipatterns } from "./tools/get-antipatterns.js";
import { register as searchDocs } from "./tools/search-docs.js";

function register(server: ToolServer): void {
  listPractices(server);
  getPractice(server);
  listPatterns(server);
  getPattern(server);
  getAntipatterns(server);
  searchDocs(server);
}

export const golangPlugin: Plugin = {
  name: "golang",
  register,
};
