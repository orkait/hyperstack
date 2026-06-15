import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ALGO_CLASSES, techniquesByClass } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "optimizer_list_classes",
    "List the algorithmic problem classes in the catalog with how many techniques each holds. The taxonomy to orient on before matching a problem.",
    {},
    async () => {
      let text = `# Algorithmic classes (${ALGO_CLASSES.length})\n\n`;
      text += `| class | techniques |\n|---|---|\n`;
      for (const cls of ALGO_CLASSES) {
        const names = techniquesByClass(cls).map((t) => t.name);
        text += `| ${cls} | ${names.join(", ")} |\n`;
      }
      text += `\nUse \`optimizer_match_problem(description)\` to map a problem to candidates, or \`optimizer_list_techniques(class)\` to drill in.\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
