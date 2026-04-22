import type { ToolServer } from "../../../shared/tool-types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { PATTERNS } from "../data.js";

const PATTERN_NAMES = Object.keys(PATTERNS) as [string, ...string[]];

type CorpusIndex = {
  namespaces?: {
    "frontend.lenis"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  patterns?: {
    [name: string]: {
      file?: string;
    };
  };
};

type CorpusPatternEntry = {
  name?: string;
  description?: string;
  code?: string;
  tips?: string[];
};

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.lenis";

let cachedCorpusPattern: { name: string; pattern: CorpusPatternEntry; source: string } | undefined;

function loadCorpusPattern(name: string): { name: string; pattern: CorpusPatternEntry; source: string } | null {
  if (cachedCorpusPattern?.name === name) {
    return cachedCorpusPattern;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const patternPath = namespaceIndex?.patterns?.[name]?.file;
    if (!patternPath) {
      return null;
    }

    const patternRaw = readFileSync(join(corpusRoot, "frontend/lenis", patternPath), "utf8");
    const pattern = YAML.parse(patternRaw) as CorpusPatternEntry | null;
    if (!pattern || pattern.name?.toLowerCase() !== name.toLowerCase() || !pattern.description || !pattern.code) {
      return null;
    }

    cachedCorpusPattern = { name, pattern, source: corpusNamespace };
    return cachedCorpusPattern;
  } catch {
    return null;
  }
}

export function register(server: ToolServer): void {
  server.tool(
    "lenis_get_pattern",
    "Get a complete Lenis integration pattern with full production-ready code. Covers Next.js setup, GSAP integration, Framer Motion sync, custom containers, accessibility, and navigation.",
    {
      name: z
        .enum(PATTERN_NAMES)
        .describe(
          "Pattern name: full-page | next-js | gsap-integration | framer-motion-integration | custom-container | accessibility | scroll-to-nav",
        ),
    },
    async ({ name }) => {
      const corpusEntry = loadCorpusPattern(name);
      const pattern = corpusEntry?.pattern ?? PATTERNS[name];
      if (!pattern) {
        return {
          content: [
            {
              type: "text",
              text: `Pattern "${name}" not found.\n\nAvailable patterns:\n${Object.entries(PATTERNS)
                .map(([k, p]) => `- ${k}: ${p.description}`)
                .join("\n")}`,
            },
          ],
          isError: true,
        };
      }

      let text = `# Lenis Pattern: ${pattern.name}\n\n`;
      text += `${pattern.description}\n\n`;
      text += `## Code\n\n\`\`\`tsx\n${pattern.code}\n\`\`\`\n\n`;

      if (pattern.tips && pattern.tips.length > 0) {
        text += `## Key Notes\n\n`;
        for (const tip of pattern.tips) text += `- ${tip}\n`;
      }

      if (corpusEntry) {
        text += `\n**Corpus Source:** ${corpusEntry.source}`;
      }

      return { content: [{ type: "text", text }] };
    },
  );
}
