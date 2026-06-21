import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LIFECYCLE_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_lifecycle",
    "Lifecycle / email marketing flows: welcome, onboarding, nurture, engagement/retention, win-back, and behavioral/transactional - triggered on behavior, not a blast calendar. Use to design the retention and monetization engine after acquisition.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Lifecycle marketing\n\n${LIFECYCLE_DOC}\n` }] }),
  );
}
