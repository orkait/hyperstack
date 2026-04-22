import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as listPractices } from "./tools/list-practices.js";
import { register as getPractice } from "./tools/get-practice.js";
import { register as searchDocs } from "./tools/search-docs.js";
import { register as cheatsheet } from "./tools/cheatsheet.js";

function register(server: McpServer): void {
  listPractices(server);
  getPractice(server);
  searchDocs(server);
  cheatsheet(server);
}

export const rustPlugin: Plugin = {
  name: "rust",
  register,
};
