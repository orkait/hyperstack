import type { ToolServer } from "../../shared/tool-types.js";
import type { Plugin } from "../../registry.js";
import { register as listApis } from "./tools/list-apis.js";
import { register as getApi } from "./tools/get-api.js";
import { register as searchDocs } from "./tools/search-docs.js";
import { register as getExamples } from "./tools/get-examples.js";
import { register as getPattern } from "./tools/get-pattern.js";
import { register as getTemplate } from "./tools/get-template.js";
import { register as getMigrationGuide } from "./tools/get-migration-guide.js";
import { register as generateFlow } from "./tools/generate-flow.js";
import { register as cheatsheet } from "./tools/cheatsheet.js";

function register(server: ToolServer): void {
  listApis(server);
  getApi(server);
  searchDocs(server);
  getExamples(server);
  getPattern(server);
  getTemplate(server);
  getMigrationGuide(server);
  generateFlow(server);
  cheatsheet(server);
}

export const reactflowPlugin: Plugin = {
  name: "reactflow",
  register,
};
