import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MVP_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_mvp_scoping",
    "MVP & scope-cutting: what an MVP really is, the Riskiest Assumption Test, vertical slicing / walking skeleton, story slicing, the cut test, and de-risk order (value->usability->feasibility). Use to cut a build to its thinnest valuable slice.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# MVP & scope-cutting\n\n${MVP_DOC}\n` }] }),
  );
}
