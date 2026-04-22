import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { MIDDLEWARE, getMiddlewareByName, searchMiddleware, formatMiddleware } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "echo_get_middleware",
    "Get detailed config and usage for a specific Echo middleware.",
    {
      name: z.string().describe("Middleware name (e.g., 'Logger', 'JWT', 'CORS', 'RateLimiter', 'Gzip', 'CSRF')"),
    },
    async ({ name }) => {
      const mw = getMiddlewareByName(name);
      if (!mw) {
        const suggestions = searchMiddleware(name).map((m) => m.name);
        const allNames = MIDDLEWARE.map((m) => m.name).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Middleware "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.slice(0, 3).join(", ")}?` : ""}\n\nAll middleware: ${allNames}`,
            },
          ],
          isError: true,
        };
      }
      return { content: [{ type: "text", text: formatMiddleware(mw) }] };
    }
  );
}
