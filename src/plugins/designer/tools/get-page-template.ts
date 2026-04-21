import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { PAGE_TYPES, getPageTemplate } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "frontend.designer"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  pageTemplates?: {
    dashboard?: {
      file?: string;
    };
  };
};

type CorpusPageSection = {
  name?: string;
  required?: boolean;
  components?: string[];
  notes?: string;
};

type CorpusPageTemplate = {
  type?: string;
  description?: string;
  layout?: string;
  sections?: CorpusPageSection[];
  cognitiveApply?: string[];
  compositionApply?: string[];
  interactionApply?: string[];
  writingApply?: string[];
  keyRules?: string[];
};

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.designer";

let cachedCorpusDashboard: { template: CorpusPageTemplate; source: string } | null | undefined;

function loadCorpusDashboardTemplate(): { template: CorpusPageTemplate; source: string } | null {
  if (cachedCorpusDashboard !== undefined) {
    return cachedCorpusDashboard;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusDashboard = null;
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const pageTemplatePath = namespaceIndex?.pageTemplates?.dashboard?.file;
    if (!pageTemplatePath) {
      cachedCorpusDashboard = null;
      return null;
    }

    const templateRaw = readFileSync(join(corpusRoot, "frontend/designer", pageTemplatePath), "utf8");
    const template = YAML.parse(templateRaw) as CorpusPageTemplate | null;
    const sections = template?.sections;
    const cognitiveApply = template?.cognitiveApply;
    const compositionApply = template?.compositionApply;
    const interactionApply = template?.interactionApply;
    const writingApply = template?.writingApply;
    const keyRules = template?.keyRules;
    if (
      !template ||
      template.type?.toLowerCase() !== "dashboard" ||
      !template.description ||
      !template.layout ||
      !Array.isArray(sections) ||
      sections.length === 0 ||
      !Array.isArray(cognitiveApply) ||
      !Array.isArray(compositionApply) ||
      !Array.isArray(interactionApply) ||
      !Array.isArray(writingApply) ||
      !Array.isArray(keyRules)
    ) {
      cachedCorpusDashboard = null;
      return null;
    }

    cachedCorpusDashboard = { template, source: corpusNamespace };
    return cachedCorpusDashboard;
  } catch {
    cachedCorpusDashboard = null;
    return null;
  }
}

function getCorpusAwarePageTemplate(type: (typeof PAGE_TYPES)[number]) {
  if (type === "dashboard") {
    return loadCorpusDashboardTemplate()?.template ?? getPageTemplate(type);
  }

  return getPageTemplate(type);
}

export function register(server: McpServer): void {
  server.tool(
    "designer_get_page_template",
    "Get section anatomy, component inventory, and applicable cognitive laws for a page type. Covers landing, dashboard, auth, settings, checkout, blog, docs, admin, profile, error-page, ai-chat, pricing, and onboarding.",
    {
      type: z.enum(PAGE_TYPES).describe("Page type to get template for"),
    },
    async ({ type }) => {
      const corpusEntry = type === "dashboard" ? loadCorpusDashboardTemplate() : null;
      const template = getCorpusAwarePageTemplate(type);
      if (!template) {
        return {
          content: [{ type: "text" as const, text: `Page type "${type}" not found. Available: ${PAGE_TYPES.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# Page Template: ${template.type}\n\n`;
      text += `${template.description}\n\n`;
      text += `**Layout:** ${template.layout}\n\n`;

      text += `## Sections\n\n`;
      for (const section of template.sections ?? []) {
        text += `### ${section.name ?? "Untitled Section"}${section.required ? "" : " (optional)"}\n\n`;
        text += `**Components:**\n`;
        for (const comp of section.components ?? []) {
          text += `- ${comp}\n`;
        }
        text += `\n**Notes:** ${section.notes ?? ""}\n\n`;
      }

      text += `## Apply These\n\n`;
      text += `**Cognitive Laws:** ${(template.cognitiveApply ?? []).join(", ")}\n`;
      text += `**Composition:** ${(template.compositionApply ?? []).join(", ")}\n`;
      text += `**Interaction Patterns:** ${(template.interactionApply ?? []).join(", ")}\n`;
      text += `**UX Writing:** ${(template.writingApply ?? []).join(", ")}\n\n`;

      text += `## Key Rules\n\n`;
      for (const rule of template.keyRules ?? []) {
        text += `- ${rule}\n`;
      }

      if (corpusEntry) {
        text += `\n**Corpus Source:** ${corpusEntry.source}`;
      }

      return { content: [{ type: "text" as const, text }] };
    },
  );
}
