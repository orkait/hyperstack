import type { ToolServer } from "../../../shared/tool-types.js";
import { MIDDLEWARE } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "echo_list_middleware",
    "List all available Echo framework middleware with their purpose and recommended chain order.",
    {},
    async () => {
      let text = "# Echo Framework - Middleware Catalog\n\n";
      text += `Total: ${MIDDLEWARE.length} middleware\n\n`;

      text += "## Recommended Middleware Order\n\n";
      text += "1. Logger - log all requests (must be FIRST)\n";
      text += "2. Recover - catch panics\n";
      text += "3. RequestID - attach trace ID\n";
      text += "4. CORS - before auth (preflight must pass)\n";
      text += "5. RateLimiter - early rejection\n";
      text += "6. Auth (JWT / BasicAuth / KeyAuth)\n";
      text += "7. Custom business middleware\n\n";

      text += "## Available Middleware\n\n";
      for (const m of MIDDLEWARE) {
        text += `### ${m.name}\n`;
        text += `**Purpose:** ${m.purpose}\n`;
        text += `**Usage:** \`${m.usage}\`\n`;
        if (m.order) text += `**Order note:** ${m.order}\n`;
        text += "\n";
      }

      text += "Use echo_get_middleware to get full config examples.";
      return { content: [{ type: "text", text }] };
    }
  );
}
