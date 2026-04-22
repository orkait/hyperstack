import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { searchApis, PATTERNS } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "lenis_search_docs",
    "Search Lenis documentation by keyword. Searches API names, descriptions, code examples, and integration patterns.",
    {
      query: z.string().describe("Search query (e.g., 'gsap', 'smooth scroll', 'scrollTo', 'next.js', 'options', 'ref')"),
    },
    async ({ query }) => {
      const q = query.toLowerCase();
      const apiResults = searchApis(query);

      const matchingPatterns = Object.entries(PATTERNS).filter(
        ([key, pattern]) =>
          key.includes(q) ||
          pattern.name.toLowerCase().includes(q) ||
          pattern.description.toLowerCase().includes(q) ||
          pattern.code.toLowerCase().includes(q),
      );

      if (apiResults.length === 0 && matchingPatterns.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No results for "${query}".\n\nAvailable APIs: ReactLenis, useLenis, LenisRef, LenisOptions\nAvailable patterns: ${Object.keys(PATTERNS).join(", ")}`,
            },
          ],
        };
      }

      let text = `# Lenis search: "${query}"\n\n`;

      if (apiResults.length > 0) {
        text += `## APIs (${apiResults.length})\n\n`;
        for (const { api, matchingExamples } of apiResults) {
          text += `### ${api.name} (${api.kind})\n${api.description}\n**Import:** \`${api.importPath}\`\n\n`;
          if (matchingExamples.length > 0) {
            text += "**Relevant examples:**\n";
            for (const ex of matchingExamples) {
              text += `#### ${ex.title}\n\`\`\`tsx\n${ex.code}\n\`\`\`\n\n`;
            }
          }
          text += "---\n\n";
        }
      }

      if (matchingPatterns.length > 0) {
        text += `## Patterns (${matchingPatterns.length})\n\n`;
        for (const [key, pattern] of matchingPatterns) {
          text += `### ${pattern.name}\n${pattern.description}\n\nUse \`lenis_get_pattern\` with name="${key}" for full code.\n\n`;
        }
      }

      return { content: [{ type: "text", text }] };
    },
  );
}
