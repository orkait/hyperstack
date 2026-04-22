import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as setup from "../../../internal/setup-hyperstack.js";
import * as path from "node:path";

export function registerSetupTool(server: McpServer) {
  server.tool(
    "hyperstack_setup",
    "Identify current IDE/CLI environment and generate a tailored MCP configuration patch for Hyperstack.",
    {
      researchResult: z.string().optional().describe("If the environment was unknown, provide the researched config path or schema details here."),
      method: z.enum(["docker", "local"]).default("docker").describe("Preferred installation method. Use 'docker' (default) for stable persistent environments, 'local' for fallback."),
    },
    async ({ researchResult, method }) => {
      const platform = setup.detectEnvironment();
      const configPath = setup.findConfigFile(platform);
      
      const pluginRoot = process.env.HYPERSTACK_ROOT || process.cwd();

      if (!configPath && !researchResult) {
        return {
          content: [{
            type: "text",
            text: `Detection failed for environment: ${platform}.\n\nPlease use 'web_search' to find where ${platform} stores its MCP configuration (e.g. 'Cursor MCP config path' or 'Windsurf MCP config location').\n\nOnce found, provide the path as 'researchResult'.`
          }]
        };
      }

      const activeConfigPath = configPath || (researchResult ? path.resolve(researchResult) : null);

      if (!activeConfigPath) {
        return {
          isError: true,
          content: [{
            type: "text",
            text: "Could not resolve a valid configuration path."
          }]
        };
      }

      const patch = setup.generateMcpPatch(activeConfigPath, pluginRoot, method);

      return {
        content: [{
          type: "text",
          text: `Environment Identified: ${platform}\nTarget Config: ${activeConfigPath}\n\nProposed Patch (JSON):\n${JSON.stringify(patch, null, 2)}\n\nTo apply this, the agent should read the file, merge the 'hyperstack' server entry, and write it back.`
        }]
      };
    }
  );
}
