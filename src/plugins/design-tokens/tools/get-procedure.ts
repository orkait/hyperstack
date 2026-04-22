import type { ToolServer } from "../../../shared/tool-types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { TOKEN_PROCEDURES, getProcedureByStep } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "frontend.design-tokens"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  procedures?: Record<string, { file?: string }>;
};

type CorpusProcedureEntry = {
  step?: number;
  title?: string;
  description?: string;
  code?: string;
  rules?: string[];
  gotchas?: string[];
};

type LoadedCorpusProcedure = {
  step: number;
  title: string;
  description: string;
  code: string;
  rules: string[];
  gotchas: string[];
  source: string;
};

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.design-tokens";

let cachedCorpusProcedures: Map<number, LoadedCorpusProcedure> | null | undefined;

function loadCorpusProcedures(): Map<number, LoadedCorpusProcedure> | null {
  if (cachedCorpusProcedures !== undefined) {
    return cachedCorpusProcedures;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusProcedures = null;
      return cachedCorpusProcedures;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const procedureEntries = namespaceIndex?.procedures ?? {};
    const loaded = new Map<number, LoadedCorpusProcedure>();

    for (const [key, meta] of Object.entries(procedureEntries)) {
      const match = key.match(/^step-(\d+)$/i);
      const step = match ? Number(match[1]) : Number.NaN;
      const file = meta?.file;
      if (!Number.isInteger(step) || !file) {
        continue;
      }

      const raw = readFileSync(join(corpusRoot, "frontend/design-tokens", file), "utf8");
      const entry = YAML.parse(raw) as CorpusProcedureEntry | null;
      if (
        !entry ||
        entry.step !== step ||
        !entry.title ||
        !entry.description ||
        !entry.code ||
        !Array.isArray(entry.rules) ||
        !Array.isArray(entry.gotchas)
      ) {
        continue;
      }

      loaded.set(step, {
        step,
        title: entry.title,
        description: entry.description,
        code: entry.code,
        rules: entry.rules,
        gotchas: entry.gotchas,
        source: corpusNamespace,
      });
    }

    cachedCorpusProcedures = loaded.size > 0 ? loaded : null;
    return cachedCorpusProcedures;
  } catch {
    cachedCorpusProcedures = null;
    return cachedCorpusProcedures;
  }
}

function getProcedure(step: number) {
  const corpusEntry = loadCorpusProcedures()?.get(step);
  if (corpusEntry) {
    return corpusEntry;
  }

  return getProcedureByStep(step);
}

function renderProcedure(proc: {
  step: number;
  title: string;
  description: string;
  code?: string;
  rules?: string[];
  gotchas?: string[];
  source?: string;
}): string {
  let text = `# Step ${proc.step}: ${proc.title}\n\n${proc.description}\n\n`;

  if (proc.code) {
    text += `## Code\n\`\`\`css\n${proc.code}\n\`\`\`\n\n`;
  }

  if (proc.rules && proc.rules.length > 0) {
    text += `## Rules\n`;
    for (const rule of proc.rules) text += `- ${rule}\n`;
  }

  if (proc.gotchas && proc.gotchas.length > 0) {
    text += `\n## Gotchas\n`;
    for (const gotcha of proc.gotchas) text += `- ${gotcha}\n`;
  }

  if (proc.source) {
    text += `\n**Corpus Source:** ${proc.source}`;
  }

  return text;
}

export function register(server: ToolServer): void {
  server.tool(
    "design_tokens_get_procedure",
    "Get the step-by-step token system build procedure. Steps 1-8 cover the full production workflow.",
    {
      step: z.number().min(1).max(8).optional()
        .describe("Step number (1-8). Omit to get all steps."),
    },
    async ({ step }) => {
      if (step !== undefined) {
        const proc = getProcedure(step);
        if (!proc) {
          return {
            content: [{ type: "text", text: `Step ${step} not found. Valid steps: 1-${TOKEN_PROCEDURES.length}` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: renderProcedure(proc) }] };
      }

      let text = "# Design Token Build Procedure\n\n";
      text += "A complete token system = 10 categories. Follow in order.\n\n";
      for (const proc of TOKEN_PROCEDURES) {
        const corpusProc = loadCorpusProcedures()?.get(proc.step);
        text += `## Step ${proc.step}: ${corpusProc?.title ?? proc.title}\n${corpusProc?.description ?? proc.description}\n\n`;
      }
      if (loadCorpusProcedures()) {
        text += `**Corpus Source:** ${corpusNamespace}`;
      }
      text += "\nCall `design_tokens_get_procedure` with a step number for full code + rules.";
      return { content: [{ type: "text", text }] };
    }
  );
}
