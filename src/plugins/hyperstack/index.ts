import type { Plugin, ToolServer } from "../../shared/tool-types.js";
import { registerSetupTool } from "./tools/setup.js";

export const hyperstackPlugin: Plugin = {
  name: "hyperstack",
  register: (server: ToolServer) => {
    registerSetupTool(server);
  },
};
