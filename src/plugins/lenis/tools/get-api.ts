import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_APIS, searchApis, getApiByName, formatApiReference } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "lenis_get_api",
    "Get detailed API reference for a specific Lenis API - props, options, usage examples, and tips.",
    {
      name: z.string().describe("API name (e.g., 'ReactLenis', 'useLenis', 'LenisRef', 'LenisOptions')"),
    },
    async ({ name }) => {
      const api = getApiByName(name);
      if (!api) {
        const suggestions = searchApis(name).map((r) => r.api.name);
        return {
          content: [
            {
              type: "text",
              text: `API "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nAvailable APIs: ${ALL_APIS.map((a) => a.name).join(", ")}`,
            },
          ],
          isError: true,
        };
      }
      return { content: [{ type: "text", text: formatApiReference(api) }] };
    },
  );
}
