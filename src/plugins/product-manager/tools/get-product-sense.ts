import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PRODUCT_SENSE_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_product_sense",
    "How to develop product sense (Jules Walter, Julie Zhuo): customer immersion, product teardowns/critiques, principles-first learning, and closing the predict/outcome loop. The deliberate practice for building product judgment.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Developing product sense\n\n${PRODUCT_SENSE_DOC}\n` }] }),
  );
}
