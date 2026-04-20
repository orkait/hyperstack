import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import YAML from "yaml";
import { loadCorpusIndex, loadCorpusDocument } from "../../../engine/corpus-loader.js";
import { getNamespaceRoot } from "../../../engine/corpus-registry.js";
import { TOKEN_CATEGORIES, getCategoryByName } from "../data.js";

type CorpusTokenCategory = {
  name: string;
  description: string;
  layer: "primitive" | "semantic" | "domain";
  cssExample: string;
  tailwindExample?: string;
  rules: string[];
  gotchas: string[];
};

function loadCorpusCategory(repoRoot: string, name: string): CorpusTokenCategory | null {
  const index = loadCorpusIndex(repoRoot);
  const root = getNamespaceRoot(index, "frontend.design-tokens");
  const registry = YAML.parse(readFileSync(join(repoRoot, root, "index.yaml"), "utf8")) as {
    categories: Record<string, string>;
  };

  const path = registry.categories[name];
  return path ? loadCorpusDocument<CorpusTokenCategory>(repoRoot, path) : null;
}

export function register(server: McpServer): void {
  server.tool(
    "design_tokens_get_category",
    "Get full details for a design token category including CSS examples, rules, and gotchas",
    {
      name: z.string().describe(
        "Category name: colors, spacing, typography, component-sizing, border-radius, shadows-elevation, motion, z-index, opacity, density"
      ),
    },
    async ({ name }) => {
      const corpusCategory = loadCorpusCategory(process.cwd(), name.toLowerCase());
      const cat = getCategoryByName(name);
      if (!corpusCategory && !cat) {
        const available = TOKEN_CATEGORIES.map((c) => c.name).join(", ");
        return {
          content: [{ type: "text", text: `Category "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      const source = corpusCategory ?? cat!;

      let text = `# ${source.name} tokens\n\n`;
      text += `**Layer:** ${source.layer}\n\n`;
      text += `${source.description}\n\n`;
      if (corpusCategory) text += `**Corpus Source:** frontend.design-tokens\n\n`;

      text += `## CSS Example\n\`\`\`css\n${source.cssExample}\n\`\`\`\n\n`;

      if (source.tailwindExample) {
        text += `## Tailwind v4 Usage\n\`\`\`css\n${source.tailwindExample}\n\`\`\`\n\n`;
      }

      text += `## Rules\n`;
      for (const rule of source.rules) text += `- ${rule}\n`;

      text += `\n## Gotchas\n`;
      for (const gotcha of source.gotchas) text += `- ${gotcha}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
