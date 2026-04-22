import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BEST_PRACTICES } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "rust_get_practice",
    "Get a Rust best practice with code examples",
    {
      name: z.string().describe("Practice name (e.g. 'borrow-over-clone', 'result-not-panic', 'thiserror-vs-anyhow', 'type-state-pattern', 'clippy-command')"),
    },
    async ({ name }) => {
      const practice = BEST_PRACTICES.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (!practice) {
        return {
          content: [{ type: "text", text: `Practice "${name}" not found.\n\nAvailable: ${BEST_PRACTICES.map((p) => p.name).join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${practice.name} [${practice.chapter}]\n\n`;
      text += `**Rule:** ${practice.rule}\n\n`;
      text += `**Why:** ${practice.reason}\n\n`;
      if (practice.good) text += `## ✅ Good\n\`\`\`rust\n${practice.good}\n\`\`\`\n\n`;
      if (practice.bad) text += `## ❌ Bad\n\`\`\`rust\n${practice.bad}\n\`\`\`\n\n`;
      if (practice.tips?.length) {
        text += `## Tips\n`;
        for (const tip of practice.tips) text += `- ${tip}\n`;
      }
      return { content: [{ type: "text", text }] };
    }
  );
}
