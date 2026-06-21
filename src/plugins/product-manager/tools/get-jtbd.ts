import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { JTBD_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_jtbd",
    "Jobs-To-Be-Done framing (Christensen): a job is progress-in-context across functional/emotional/social dimensions, plus the Four Forces switching rule. Use to reframe a feature request as the underlying job.",
    {},
    async () => {
      const text = `# Jobs To Be Done\n\n${JTBD_DOC}\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
