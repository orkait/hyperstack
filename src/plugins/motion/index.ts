import type { ToolServer } from "../../shared/tool-types.js";
import type { Plugin } from "../../registry.js";
import { register as listApis } from "./tools/list-apis.js";
import { register as getApi } from "./tools/get-api.js";
import { register as searchDocs } from "./tools/search-docs.js";
import { register as getExamples } from "./tools/get-examples.js";
import { register as getTransitions } from "./tools/get-transitions.js";
import { register as generateAnimation } from "./tools/generate-animation.js";
import { register as cheatsheet } from "./tools/cheatsheet.js";

function register(server: ToolServer): void {
  listApis(server);
  getApi(server);
  searchDocs(server);
  getExamples(server);
  getTransitions(server);
  generateAnimation(server);
  cheatsheet(server);
}

export const motionPlugin: Plugin = {
  name: "motion",
  register,
};
