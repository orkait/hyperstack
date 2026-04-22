import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as listApis } from "./tools/list-apis.js";
import { register as getApi } from "./tools/get-api.js";
import { register as searchDocs } from "./tools/search-docs.js";
import { register as getPattern } from "./tools/get-pattern.js";
import { register as generateSetup } from "./tools/generate-setup.js";
import { register as cheatsheet } from "./tools/cheatsheet.js";

function register(server: McpServer): void {
  listApis(server);
  getApi(server);
  searchDocs(server);
  getPattern(server);
  generateSetup(server);
  cheatsheet(server);
}

export const lenisPlugin: Plugin = {
  name: "lenis",
  register,
};
