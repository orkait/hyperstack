import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface Plugin {
  name: string;
  register: (server: McpServer) => void;
}

export function loadPlugins(server: McpServer, plugins: Plugin[]): void {
  for (const plugin of plugins) {
    try {
      plugin.register(server);
    } catch (err) {
      console.error(`Plugin "${plugin.name}" failed to register:`, err);
    }
  }
}
