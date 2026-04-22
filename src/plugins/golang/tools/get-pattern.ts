import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { DESIGN_PATTERNS } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "golang_get_pattern",
    "Get a Go design pattern with idiomatic code",
    {
      name: z.string().describe("Pattern name (e.g. 'functional-options', 'worker-pool', 'pipeline', 'middleware-decorator', 'consumer-side-interface', 'strategy', 'adapter')"),
    },
    async ({ name }) => {
      const pattern = DESIGN_PATTERNS.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (!pattern) {
        return {
          content: [{ type: "text", text: `Pattern "${name}" not found.\n\nAvailable: ${DESIGN_PATTERNS.map((p) => p.name).join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${pattern.name} [${pattern.category}]\n\n`;
      if (pattern.oopEquivalent) text += `*OOP equivalent: ${pattern.oopEquivalent}*\n\n`;
      text += `**Go approach:** ${pattern.goApproach}\n\n`;
      text += `**When to use:** ${pattern.when}\n\n`;
      text += `## Code\n\`\`\`go\n${pattern.code}\n\`\`\`\n`;
      if (pattern.antiPattern) text += `\n## Anti-pattern\n\`\`\`go\n${pattern.antiPattern}\n\`\`\`\n`;
      return { content: [{ type: "text", text }] };
    }
  );
}
