import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { matchProblem, getTechnique } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "optimizer_match_problem",
    "Match a problem description (or what the code does) to likely algorithmic classes and the candidate techniques to consider. Returns the menu to scan; the implementation is not shipped on purpose - web search the technique you pick.",
    {
      description: z
        .string()
        .describe("The problem statement or what the code does, in terms of data shape + operation. e.g. 'find a pair in an unsorted array summing to target', 'shortest path in a weighted graph', 'longest substring without repeating chars'."),
    },
    async ({ description }) => {
      const matches = matchProblem(description);
      if (matches.length === 0) {
        return {
          content: [{ type: "text" as const, text: "No strong class match. Re-describe by data shape + operation (search / sort / path / count / range / subsequence), or call `optimizer_list_classes` to scan the full menu." }],
        };
      }
      let text = `# Candidate techniques\n\nMatched ${matches.length} class(es). Scan the menu, then apply restraint: only swap in a faster technique if scale and a hot path actually warrant it (YAGNI - a naive loop over 10 items is fine). For the one you choose, **web search its implementation** - do not write a non-trivial algorithm from memory.\n\n`;
      for (const m of matches) {
        text += `## ${m.class}  (matched: ${m.matchedSignals.join(", ")})\n\n`;
        text += `| technique | time | space | replaces |\n|---|---|---|---|\n`;
        for (const name of m.candidates) {
          const t = getTechnique(name);
          if (t) text += `| \`${t.name}\` | ${t.time} | ${t.space} | ${t.replaces} |\n`;
        }
        text += `\n`;
      }
      text += `Next: \`optimizer_get_technique(name)\` for the one you pick - it gives the web-search query for the authoritative impl.\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
