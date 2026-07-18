import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as listPersonas } from "./tools/list-personas.js";
import { register as getPersona } from "./tools/get-persona.js";
import { register as getVoiceRules } from "./tools/get-voice-rules.js";
import { register as getPanel } from "./tools/get-panel.js";

function register(server: McpServer): void {
  listPersonas(server);
  getPersona(server);
  getVoiceRules(server);
  getPanel(server);
}

export const reflectPlugin: Plugin = {
  name: "reflect",
  register,
};
