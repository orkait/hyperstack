import type { ToolServer } from "../../../shared/tool-types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { BEST_PRACTICES, type BestPractice } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "backend.rust"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  practices?: Record<string, { file?: string }>;
};

type CorpusPracticeEntry = {
  name?: string;
  chapter?: string;
  rule?: string;
  reason?: string;
  good?: string;
  bad?: string;
  tips?: string[];
};

type LoadedCorpusPractice = { practice: BestPractice; source: string };

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "backend.rust";

const cachedCorpusPractices = new Map<string, LoadedCorpusPractice | null>();

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

function loadCorpusPractice(name: string): LoadedCorpusPractice | null {
  const key = normalize(name);
  if (cachedCorpusPractices.has(key)) {
    return cachedCorpusPractices.get(key) ?? null;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusPractices.set(key, null);
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const practicePath = namespaceIndex?.practices?.[key]?.file;
    if (!practicePath) {
      cachedCorpusPractices.set(key, null);
      return null;
    }

    const raw = readFileSync(join(corpusRoot, "backend/rust", practicePath), "utf8");
    const entry = YAML.parse(raw) as CorpusPracticeEntry | null;
    if (
      !entry ||
      normalize(entry.name ?? "") !== key ||
      !entry.chapter ||
      !entry.rule ||
      !entry.reason
    ) {
      cachedCorpusPractices.set(key, null);
      return null;
    }

    const loaded: LoadedCorpusPractice = {
      practice: {
        name: entry.name ?? name,
        chapter: entry.chapter as BestPractice["chapter"],
        rule: entry.rule,
        reason: entry.reason,
        good: entry.good,
        bad: entry.bad,
        tips: entry.tips,
      },
      source: corpusNamespace,
    };
    cachedCorpusPractices.set(key, loaded);
    return loaded;
  } catch {
    cachedCorpusPractices.set(key, null);
    return null;
  }
}

export function register(server: ToolServer): void {
  server.tool(
    "rust_get_practice",
    "Get a Rust best practice with code examples",
    {
      name: z.string().describe("Practice name (e.g. 'borrow-over-clone', 'result-not-panic', 'thiserror-vs-anyhow', 'type-state-pattern', 'clippy-command')"),
    },
    async ({ name }) => {
      const corpusEntry = loadCorpusPractice(name);
      const practice =
        corpusEntry?.practice ??
        BEST_PRACTICES.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (!practice) {
        return {
          content: [{ type: "text", text: `Practice "${name}" not found.\n\nAvailable: ${BEST_PRACTICES.map((p) => p.name).join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${practice.name} [${practice.chapter}]\n\n`;
      text += `**Rule:** ${practice.rule}\n\n`;
      text += `**Why:** ${practice.reason}\n\n`;
      if (practice.good) text += `## ✅ Good\n\`\`\`rust\n${practice.good}\n\`\`\`\n\n`;
      if (practice.bad) text += `## ❌ Bad\n\`\`\`rust\n${practice.bad}\n\`\`\`\n\n`;
      if (practice.tips?.length) {
        text += `## Tips\n`;
        for (const tip of practice.tips) text += `- ${tip}\n`;
      }

      if (corpusEntry) {
        text += `\n**Corpus Source:** ${corpusEntry.source}`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
