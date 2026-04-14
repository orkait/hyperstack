import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Plugin } from "../../registry.js";
import { registerSetupTool } from "./tools/setup.js";

export const hyperstackPlugin: Plugin = {
  name: "hyperstack",
  register: (server: McpServer) => {
    registerSetupTool(server);
  },
};
