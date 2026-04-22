import type { ToolServer } from "./shared/tool-types.js";

export interface Plugin {
  name: string;
  register: (server: ToolServer) => void;
}

export function loadPlugins(server: ToolServer, plugins: Plugin[]): void {
  for (const plugin of plugins) {
    plugin.register(server);
  }
}
