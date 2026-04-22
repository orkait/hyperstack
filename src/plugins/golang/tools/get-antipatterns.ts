import type { ToolServer } from "../../../shared/tool-types.js";
import { ANTI_PATTERNS } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "golang_get_antipatterns",
    "List all Go anti-patterns to avoid",
    {},
    async () => {
      let text = "# Go Anti-patterns\n\nThings that look fine but cause bugs, leaks, or security issues:\n\n";
      for (const ap of ANTI_PATTERNS) {
        text += `## ❌ ${ap.name}\n**Problem:** ${ap.description}\n**Fix:** ${ap.fix}\n\n`;
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
