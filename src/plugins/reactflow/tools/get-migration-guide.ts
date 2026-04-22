import type { ToolServer } from "../../../shared/tool-types.js";
import { V12_MIGRATION } from "../data/index.js";

export function register(server: ToolServer): void {
  server.tool(
    "reactflow_get_migration_guide",
    "Get the React Flow v11 to v12 migration guide with all breaking changes, import changes, and type changes",
    {},
    async () => {
      return { content: [{ type: "text", text: V12_MIGRATION }] };
    },
  );
}
