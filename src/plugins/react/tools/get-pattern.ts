import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import YAML from "yaml";
import { loadCorpusIndex, loadCorpusDocument } from "../../../engine/corpus-loader.js";
import { getNamespaceRoot } from "../../../engine/corpus-registry.js";
import { PATTERNS, getPatternByName } from "../data.js";

type CorpusPattern = {
  name: string;
  category: string;
  description: string;
  when: string;
  tips?: string[];
};

function loadCorpusPattern(repoRoot: string, name: string): CorpusPattern | null {
  const index = loadCorpusIndex(repoRoot);
  const root = getNamespaceRoot(index, "frontend.react");
  const registry = YAML.parse(readFileSync(join(repoRoot, root, "index.yaml"), "utf8")) as {
    patterns: Record<string, string>;
  };

  const path = registry.patterns[name];
  return path ? loadCorpusDocument<CorpusPattern>(repoRoot, path) : null;
}

export function register(server: McpServer): void {
  server.tool(
    "react_get_pattern",
    "Get a React/Next.js pattern with full code example and anti-pattern",
    {
      name: z.string().describe("Pattern name (e.g. 'rsc-default', 'state-hierarchy', 'zustand-store', 'suspense-boundary', 'nextjs-metadata', 'composition-pattern', 'component-template')"),
    },
    async ({ name }) => {
      const corpusPattern = loadCorpusPattern(process.cwd(), name.toLowerCase());
      const pattern = getPatternByName(name);
      if (!corpusPattern && !pattern) {
        const available = PATTERNS.map((p) => p.name).join(", ");
        return {
          content: [{ type: "text", text: `Pattern "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      const source = corpusPattern ?? pattern!;
      let text = `# ${source.name} [${source.category}]\n\n`;
      text += `${source.description}\n\n`;
      text += `**When to use:** ${source.when}\n\n`;
      if (corpusPattern) text += `**Corpus Source:** frontend.react\n\n`;
      if (pattern?.code) text += `## Code\n\`\`\`tsx\n${pattern.code}\n\`\`\`\n\n`;

      if (pattern?.antiPattern) {
        text += `## Anti-pattern (avoid)\n\`\`\`tsx\n${pattern.antiPattern}\n\`\`\`\n\n`;
      }

      if (source.tips?.length) {
        text += `## Tips\n`;
        for (const tip of source.tips) text += `- ${tip}\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
