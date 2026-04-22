import type { ToolServer } from "../../../shared/tool-types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { getComponentByName, SHADCN_COMPONENTS, type ShadcnComponent } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "frontend.shadcn"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  components?: Record<string, { file?: string }>;
};

type CorpusComponentEntry = {
  name?: string;
  category?: string;
  description?: string;
  basePrimitive?: string;
  dataSlots?: string[];
  variants?: string[];
  sizes?: string[];
  requiresUseClient?: boolean;
  usageSnippet?: string;
  pairsWith?: string[];
};

type LoadedCorpusComponent = { component: ShadcnComponent; source: string };

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.shadcn";

const cachedCorpusComponents = new Map<string, LoadedCorpusComponent | null>();

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

function loadCorpusComponent(name: string): LoadedCorpusComponent | null {
  const key = normalize(name);
  if (cachedCorpusComponents.has(key)) {
    return cachedCorpusComponents.get(key) ?? null;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusComponents.set(key, null);
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const componentPath = namespaceIndex?.components?.[key]?.file;
    if (!componentPath) {
      cachedCorpusComponents.set(key, null);
      return null;
    }

    const raw = readFileSync(join(corpusRoot, "frontend/shadcn", componentPath), "utf8");
    const entry = YAML.parse(raw) as CorpusComponentEntry | null;
    if (
      !entry ||
      normalize(entry.name ?? "") !== key ||
      !entry.category ||
      !entry.description ||
      !entry.basePrimitive ||
      !Array.isArray(entry.dataSlots) ||
      !entry.usageSnippet ||
      typeof entry.requiresUseClient !== "boolean" ||
      !Array.isArray(entry.pairsWith)
    ) {
      cachedCorpusComponents.set(key, null);
      return null;
    }

    const loaded: LoadedCorpusComponent = {
      component: {
        name: entry.name ?? name,
        category: entry.category as ShadcnComponent["category"],
        description: entry.description,
        basePrimitive: entry.basePrimitive,
        dataSlots: entry.dataSlots,
        variants: entry.variants,
        sizes: entry.sizes,
        requiresUseClient: entry.requiresUseClient,
        usageSnippet: entry.usageSnippet,
        pairsWith: entry.pairsWith,
      },
      source: corpusNamespace,
    };
    cachedCorpusComponents.set(key, loaded);
    return loaded;
  } catch {
    cachedCorpusComponents.set(key, null);
    return null;
  }
}

export function register(server: ToolServer): void {
  server.tool(
    "shadcn_get_component",
    "Get full details for a shadcn/ui component: base primitive, data-slots, variants, sizes, usage example, and which other components it pairs with. Uses curated reference data.",
    {
      name: z.string().describe("Component name (e.g., 'Button', 'Dialog', 'Field', 'Select'). Case-insensitive."),
    },
    async ({ name }) => {
      const corpusEntry = loadCorpusComponent(name);
      const component = corpusEntry?.component ?? getComponentByName(name);
      if (!component) {
        const available = SHADCN_COMPONENTS.map((c) => c.name).join(", ");
        return {
          content: [{ type: "text" as const, text: `Component "${name}" not found. Available: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${component.name}\n\n`;
      text += `**Category:** ${component.category}\n`;
      text += `**Base primitive:** ${component.basePrimitive}\n`;
      text += `**Requires 'use client':** ${component.requiresUseClient ? "yes" : "no"}\n\n`;
      text += `${component.description}\n\n`;

      text += `## Data Slots\n\n`;
      text += `Every rendered element must have a \`data-slot\` attribute for external styling.\n\n`;
      for (const slot of component.dataSlots) {
        text += `- \`data-slot="${slot}"\`\n`;
      }
      text += `\n`;

      if (component.variants && component.variants.length > 0) {
        text += `## Variants (via cva)\n\n`;
        text += component.variants.map((v) => `\`${v}\``).join(" · ") + `\n\n`;
      }

      if (component.sizes && component.sizes.length > 0) {
        text += `## Sizes (via cva)\n\n`;
        text += component.sizes.map((s) => `\`${s}\``).join(" · ") + `\n\n`;
      }

      text += `## Usage Example\n\n\`\`\`tsx\n${component.usageSnippet}\n\`\`\`\n\n`;

      if (component.pairsWith.length > 0) {
        text += `## Pairs With\n\n`;
        text += `${component.pairsWith.map((p) => `\`${p}\``).join(", ")}\n\n`;
      }

      text += `## Required Checklist\n\n`;
      text += `- [ ] Uses @base-ui/react primitive (not @radix-ui/react-*)\n`;
      text += `- [ ] All sub-components have data-slot attributes\n`;
      text += `- [ ] cva for variants (if applicable)\n`;
      text += `- [ ] cn for className merging\n`;
      if (component.requiresUseClient) text += `- [ ] 'use client' directive at top of file\n`;
      text += `- [ ] Props spread (...props) to underlying primitive\n`;
      text += `- [ ] OKLCH color tokens from design system (not hardcoded hex)\n`;

      if (corpusEntry) {
        text += `\n**Corpus Source:** ${corpusEntry.source}`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
