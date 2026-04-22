import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TRANSITIONS_REFERENCE } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "motion_get_transitions",
    "Get the complete transition types reference (tween, spring, inertia, orchestration, per-value config)",
    {},
    async () => ({ content: [{ type: "text", text: TRANSITIONS_REFERENCE }] }),
  );
}
