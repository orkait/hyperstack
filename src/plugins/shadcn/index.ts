import type { ToolServer } from "../../shared/tool-types.js";
import type { Plugin } from "../../registry.js";
import { register as listComponents } from "./tools/list-components.js";
import { register as getComponent } from "./tools/get-component.js";
import { register as getRules } from "./tools/get-rules.js";
import { register as getSnippet } from "./tools/get-snippet.js";
import { register as getComposition } from "./tools/get-composition.js";

function register(server: ToolServer): void {
  listComponents(server);
  getComponent(server);
  getRules(server);
  getSnippet(server);
  getComposition(server);
}

export const shadcnPlugin: Plugin = {
  name: "shadcn",
  register,
};
