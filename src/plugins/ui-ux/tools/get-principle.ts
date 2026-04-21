import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { PRINCIPLES, type Principle } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "frontend.ui-ux"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  principles?: Record<string, { file?: string }>;
};

type CorpusPrincipleEntry = {
  name?: string;
  domain?: string;
  rule?: string;
  detail?: string;
  examples?: string[];
  antiPatterns?: string[];
  cssExample?: string;
};

type LoadedCorpusPrinciple = { principle: Principle; source: string };

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.ui-ux";

const cachedCorpusPrinciples = new Map<string, LoadedCorpusPrinciple | null>();

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

function loadCorpusPrinciple(name: string): LoadedCorpusPrinciple | null {
  const key = normalize(name);
  if (cachedCorpusPrinciples.has(key)) {
    return cachedCorpusPrinciples.get(key) ?? null;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusPrinciples.set(key, null);
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const principlePath = namespaceIndex?.principles?.[key]?.file;
    if (!principlePath) {
      cachedCorpusPrinciples.set(key, null);
      return null;
    }

    const raw = readFileSync(join(corpusRoot, "frontend/ui-ux", principlePath), "utf8");
    const entry = YAML.parse(raw) as CorpusPrincipleEntry | null;
    if (
      !entry ||
      normalize(entry.name ?? "") !== key ||
      !entry.domain ||
      !entry.rule ||
      !entry.detail
    ) {
      cachedCorpusPrinciples.set(key, null);
      return null;
    }

    const loaded: LoadedCorpusPrinciple = {
      principle: {
        name: entry.name ?? name,
        domain: entry.domain as Principle["domain"],
        rule: entry.rule,
        detail: entry.detail,
        examples: entry.examples,
        antiPatterns: entry.antiPatterns,
        cssExample: entry.cssExample,
      },
      source: corpusNamespace,
    };
    cachedCorpusPrinciples.set(key, loaded);
    return loaded;
  } catch {
    cachedCorpusPrinciples.set(key, null);
    return null;
  }
}

export function register(server: McpServer): void {
  server.tool(
    "ui_ux_get_principle",
    "Get full details for a UI/UX principle including examples, anti-patterns, and CSS examples",
    {
      name: z.string().describe("Principle name (e.g. 'type-scale', 'wcag-contrast', 'dark-mode-principles', 'touch-targets', 'easing-rules')"),
    },
    async ({ name }) => {
      const corpusEntry = loadCorpusPrinciple(name);
      const principle =
        corpusEntry?.principle ??
        PRINCIPLES.find((p) => p.name.toLowerCase() === name.toLowerCase());

      if (!principle) {
        const available = PRINCIPLES.map((p) => p.name).join(", ");
        return {
          content: [{ type: "text", text: `Principle "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${principle.name} [${principle.domain}]\n\n`;
      text += `**Rule:** ${principle.rule}\n\n`;
      text += `${principle.detail}\n\n`;

      if (principle.cssExample) {
        text += `## CSS Example\n\`\`\`css\n${principle.cssExample}\n\`\`\`\n\n`;
      }

      if (principle.examples?.length) {
        text += `## Examples\n`;
        for (const ex of principle.examples) text += `- ${ex}\n`;
        text += "\n";
      }

      if (principle.antiPatterns?.length) {
        text += `## Anti-patterns (avoid)\n`;
        for (const ap of principle.antiPatterns) text += `- ❌ ${ap}\n`;
      }

      if (corpusEntry) {
        text += `\n**Corpus Source:** ${corpusEntry.source}`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
