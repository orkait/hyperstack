import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { BEST_PRACTICES } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "golang_get_practice",
    "Get a Go best practice with good/bad code examples",
    {
      name: z.string().describe("Practice name (e.g. 'error-wrapping', 'goroutine-lifecycle', 'crypto-rand', 'table-driven-tests', 'thin-handlers')"),
    },
    async ({ name }: { name: string }) => {
      const practice = BEST_PRACTICES.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (!practice) {
        return {
          content: [{ type: "text", text: `Practice "${name}" not found.\n\nAvailable: ${BEST_PRACTICES.map((p) => p.name).join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${practice.name} [${practice.topic}] - ${practice.priority}\n\n`;
      text += `**Rule:** ${practice.rule}\n\n`;
      text += `**Why:** ${practice.reason}\n\n`;
      if (practice.good) text += `## ✅ Good\n\`\`\`go\n${practice.good}\n\`\`\`\n\n`;
      if (practice.bad) text += `## ❌ Bad\n\`\`\`go\n${practice.bad}\n\`\`\`\n`;
      return { content: [{ type: "text", text }] };
    },
  );
}
