import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { ALL_APIS, searchApis, getApiByName, formatApiReference } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "motion_get_api",
    "Get detailed API reference for a specific Motion for React component, hook, or utility. Includes props, usage, examples, and tips.",
    {
      name: z.string().describe("API name (e.g., 'motion', 'AnimatePresence', 'useAnimate', 'useScroll', 'stagger', 'Reorder.Group')"),
    },
    async ({ name }: { name: string }) => {
      const api = getApiByName(name);
      if (!api) {
        const suggestions = searchApis(name).map((r) => r.api.name);
        return {
          content: [{ type: "text", text: `API "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nAvailable APIs: ${ALL_APIS.map((a) => a.name).join(", ")}` }],
          isError: true,
        };
      }
      return { content: [{ type: "text", text: formatApiReference(api) }] };
    },
  );
}
