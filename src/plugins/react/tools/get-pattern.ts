import type { ToolServer } from "../../../shared/tool-types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { PATTERNS, getPatternByName, type Pattern } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "frontend.react"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  patterns?: Record<string, { file?: string }>;
};

type CorpusPatternEntry = {
  name?: string;
  category?: string;
  description?: string;
  when?: string;
  code?: string;
  antiPattern?: string;
  tips?: string[];
};

type LoadedCorpusPattern = { pattern: Pattern; source: string };

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.react";

const cachedCorpusPatterns = new Map<string, LoadedCorpusPattern | null>();

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

function loadCorpusPattern(name: string): LoadedCorpusPattern | null {
  const key = normalize(name);
  if (cachedCorpusPatterns.has(key)) {
    return cachedCorpusPatterns.get(key) ?? null;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusPatterns.set(key, null);
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const patternPath = namespaceIndex?.patterns?.[key]?.file;
    if (!patternPath) {
      cachedCorpusPatterns.set(key, null);
      return null;
    }

    const raw = readFileSync(join(corpusRoot, "frontend/react", patternPath), "utf8");
    const entry = YAML.parse(raw) as CorpusPatternEntry | null;
    if (
      !entry ||
      normalize(entry.name ?? "") !== key ||
      !entry.category ||
      !entry.description ||
      !entry.when ||
      !entry.code
    ) {
      cachedCorpusPatterns.set(key, null);
      return null;
    }

    const loaded: LoadedCorpusPattern = {
      pattern: {
        name: entry.name ?? name,
        category: entry.category as Pattern["category"],
        description: entry.description,
        when: entry.when,
        code: entry.code,
        antiPattern: entry.antiPattern,
        tips: entry.tips,
      },
      source: corpusNamespace,
    };
    cachedCorpusPatterns.set(key, loaded);
    return loaded;
  } catch {
    cachedCorpusPatterns.set(key, null);
    return null;
  }
}

export function register(server: ToolServer): void {
  server.tool(
    "react_get_pattern",
    "Get a React/Next.js pattern with full code example and anti-pattern",
    {
      name: z.string().describe("Pattern name (e.g. 'rsc-default', 'state-hierarchy', 'zustand-store', 'suspense-boundary', 'nextjs-metadata', 'composition-pattern', 'component-template')"),
    },
    async ({ name }) => {
      const corpusEntry = loadCorpusPattern(name);
      const pattern = corpusEntry?.pattern ?? getPatternByName(name);
      if (!pattern) {
        const available = PATTERNS.map((p) => p.name).join(", ");
        return {
          content: [{ type: "text", text: `Pattern "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${pattern.name} [${pattern.category}]\n\n`;
      text += `${pattern.description}\n\n`;
      text += `**When to use:** ${pattern.when}\n\n`;
      text += `## Code\n\`\`\`tsx\n${pattern.code}\n\`\`\`\n\n`;

      if (pattern.antiPattern) {
        text += `## Anti-pattern (avoid)\n\`\`\`tsx\n${pattern.antiPattern}\n\`\`\`\n\n`;
      }

      if (pattern.tips?.length) {
        text += `## Tips\n`;
        for (const tip of pattern.tips) text += `- ${tip}\n`;
      }

      if (corpusEntry) {
        text += `\n**Corpus Source:** ${corpusEntry.source}`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
