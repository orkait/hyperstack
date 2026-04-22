import type { ToolServer } from "../../../shared/tool-types.js";
import { TRANSITIONS_REFERENCE } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "motion_get_transitions",
    "Get the complete transition types reference (tween, spring, inertia, orchestration, per-value config)",
    {},
    async () => ({ content: [{ type: "text", text: TRANSITIONS_REFERENCE }] }),
  );
}
