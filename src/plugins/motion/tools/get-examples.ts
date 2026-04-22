import type { ToolServer } from "../../../shared/tool-types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { CATEGORIES, getExamplesByCategory, formatExample, capitalize } from "../data.js";
import type { Example } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "frontend.motion"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  examples?: Record<string, { file?: string }>;
};

type CorpusExampleFile = {
  category?: string;
  examples?: Array<{
    title?: string;
    description?: string;
    code?: string;
    category?: string;
  }>;
};

type ParsedCorpusExample = {
  title: string;
  description?: string;
  code: string;
  category?: string;
};

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.motion";

let cachedCorpusExamples: Map<string, { examples: Example[]; source: string } | null> | undefined;

function loadCorpusExamples(category: string): { examples: Example[]; source: string } | null {
  const key = category.toLowerCase().trim();
  cachedCorpusExamples ??= new Map();
  const cached = cachedCorpusExamples.get(key);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusExamples.set(key, null);
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const examplePath = namespaceIndex?.examples?.[key]?.file;
    if (!examplePath) {
      cachedCorpusExamples.set(key, null);
      return null;
    }

    const fileRaw = readFileSync(join(corpusRoot, "frontend/motion", examplePath), "utf8");
    const file = YAML.parse(fileRaw) as CorpusExampleFile | null;
    const examples = (file?.examples ?? [])
      .filter((ex): ex is ParsedCorpusExample => Boolean(ex?.title && ex?.code))
      .map((ex) => ({
        title: ex.title,
        code: ex.code,
        description: ex.description,
        category: (ex.category ?? key) as Example["category"],
      }));

    if (examples.length === 0) {
      cachedCorpusExamples.set(key, null);
      return null;
    }

    const result = { examples, source: corpusNamespace };
    cachedCorpusExamples.set(key, result);
    return result;
  } catch {
    cachedCorpusExamples.set(key, null);
    return null;
  }
}

export function register(server: ToolServer): void {
  server.tool(
    "motion_get_examples",
    "Get code examples for a specific animation category",
    { category: z.string().describe(`Category: ${CATEGORIES.join(", ")}`) },
    async ({ category }) => {
      const corpusEntry = loadCorpusExamples(category);
      const examples = corpusEntry?.examples ?? getExamplesByCategory(category);
      if (examples.length === 0) {
        return { content: [{ type: "text", text: `No examples for category "${category}". Available: ${CATEGORIES.join(", ")}` }] };
      }
      let text = `# ${capitalize(category)} Examples\n\n`;
      for (const ex of examples) text += formatExample(ex, 2);
      if (corpusEntry) {
        text += `**Corpus Source:** ${corpusEntry.source}\n`;
      }
      return { content: [{ type: "text", text }] };
    },
  );
}
