import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import YAML from "yaml";
import { loadCorpusIndex, loadCorpusDocument } from "../../../engine/corpus-loader.js";
import { getNamespaceRoot } from "../../../engine/corpus-registry.js";
import { BEST_PRACTICES } from "../data.js";

type CorpusPractice = {
  name: string;
  topic: string;
  priority: string;
  rule: string;
  reason: string;
};

function loadCorpusPractice(repoRoot: string, name: string): CorpusPractice | null {
  const index = loadCorpusIndex(repoRoot);
  const root = getNamespaceRoot(index, "backend.golang");
  const registry = YAML.parse(readFileSync(join(repoRoot, root, "index.yaml"), "utf8")) as {
    practices: Record<string, string>;
  };

  const path = registry.practices[name];
  return path ? loadCorpusDocument<CorpusPractice>(repoRoot, path) : null;
}

export function register(server: McpServer): void {
  server.tool(
    "golang_get_practice",
    "Get a Go best practice with good/bad code examples",
    {
      name: z.string().describe("Practice name (e.g. 'error-wrapping', 'goroutine-lifecycle', 'crypto-rand', 'table-driven-tests', 'thin-handlers')"),
    },
    async ({ name }) => {
      const corpusPractice = loadCorpusPractice(process.cwd(), name.toLowerCase());
      const fallbackPractice = BEST_PRACTICES.find((p) => p.name.toLowerCase() === name.toLowerCase());

      if (!corpusPractice && !fallbackPractice) {
        return {
          content: [{ type: "text", text: `Practice "${name}" not found.\n\nAvailable: ${BEST_PRACTICES.map((p) => p.name).join(", ")}` }],
          isError: true,
        };
      }

      const practice = fallbackPractice ?? {
        name: corpusPractice!.name,
        topic: corpusPractice!.topic as any,
        priority: corpusPractice!.priority as any,
      };

      let text = `# ${corpusPractice?.name ?? practice.name} [${corpusPractice?.topic ?? practice.topic}] - ${corpusPractice?.priority ?? practice.priority}\n\n`;
      text += `**Rule:** ${corpusPractice?.rule ?? fallbackPractice!.rule}\n\n`;
      text += `**Why:** ${corpusPractice?.reason ?? fallbackPractice!.reason}\n\n`;
      if (corpusPractice) text += `**Corpus Source:** backend.golang\n\n`;
      if (fallbackPractice?.good) text += `## ✅ Good\n\`\`\`go\n${fallbackPractice.good}\n\`\`\`\n\n`;
      if (fallbackPractice?.bad) text += `## ❌ Bad\n\`\`\`go\n${fallbackPractice.bad}\n\`\`\`\n`;
      return { content: [{ type: "text", text }] };
    }
  );
}
