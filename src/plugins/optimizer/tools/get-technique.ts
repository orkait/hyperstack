import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getTechnique, TECHNIQUES } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "optimizer_get_technique",
    "Get a technique's complexity, when it fits, the naive smell it replaces, and the web-search query to fetch its authoritative implementation. The catalog ships no code by design - algorithms are stable; verify the impl and exact complexity against a real source, not memory.",
    {
      name: z.string().describe("Technique name from the catalog, e.g. 'union-find', 'sliding-window-variable', 'dijkstra', 'lru-cache'."),
    },
    async ({ name }) => {
      const t = getTechnique(name);
      if (!t) {
        return {
          content: [{ type: "text" as const, text: `Technique "${name}" not found.\n\nAvailable: ${TECHNIQUES.map((x) => x.name).join(", ")}` }],
          isError: true,
        };
      }
      let text = `# ${t.name}  [${t.class}]\n\n`;
      text += `- **Time:** ${t.time}\n`;
      text += `- **Space:** ${t.space}\n`;
      text += `- **When it fits:** ${t.when}\n`;
      text += `- **Replaces (the naive smell):** ${t.replaces}\n\n`;
      text += `## Get the implementation\n\n`;
      text += `Web search: \`${t.websearch}\`\n\n`;
      text += `Confirm the exact complexity and edge cases against an authoritative source - do not trust memory for the specifics. Then hand to the language plugin (\`golang_*\`, \`rust_*\`, \`react_*\`, ...) for idiomatic code in the target stack.\n\n`;
      text += `## Suggest with evidence\n\n`;
      text += `Frame the improvement as Big-O before -> after, e.g. "this is O(n^2); '${t.name}' makes it ${t.time}". If the current code is already correct and the input is small, say so and leave it - efficiency is gated by evidence, not reflex.\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
