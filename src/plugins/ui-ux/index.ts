import type { ToolServer } from "../../shared/tool-types.js";
import type { Plugin } from "../../registry.js";
import { register as listPrinciples } from "./tools/list-principles.js";
import { register as getPrinciple } from "./tools/get-principle.js";
import { register as getComponentPattern } from "./tools/get-component-pattern.js";
import { register as getChecklist } from "./tools/get-checklist.js";
import { register as search } from "./tools/search.js";
import { register as getGotchas } from "./tools/get-gotchas.js";

function register(server: ToolServer): void {
  listPrinciples(server);
  getPrinciple(server);
  getComponentPattern(server);
  getChecklist(server);
  search(server);
  getGotchas(server);
}

export const uiUxPlugin: Plugin = {
  name: "ui-ux",
  register,
};
