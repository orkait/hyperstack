import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { ALL_APIS, searchApis, getApiByName, formatApiReference } from "../data/index.js";

type CorpusIndex = {
  namespaces?: {
    "frontend.reactflow"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  apis?: {
    reactflow?: {
      file?: string;
    };
  };
};

type CorpusApiEntry = {
  name?: string;
  kind?: string;
  description?: string;
  importPath?: string;
  props?: Array<{ name: string; type: string; description: string; default?: string }>;
  returns?: string;
  usage?: string;
  examples?: Array<{ title?: string; code?: string; description?: string; category?: string }>;
  tips?: string[];
  relatedApis?: string[];
};

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.reactflow";
const corpusApiName = "ReactFlow";
type ReactFlowExample = Parameters<typeof formatApiReference>[0]["examples"][number];

let cachedCorpusReactFlowApi: { api: Parameters<typeof formatApiReference>[0]; source: string } | null | undefined;

function normalizeApiName(name: string): string {
  return name.toLowerCase().replace(/[<>/()]/g, "").trim();
}

function loadCorpusReactFlowApi(): { api: Parameters<typeof formatApiReference>[0]; source: string } | null {
  if (cachedCorpusReactFlowApi !== undefined) {
    return cachedCorpusReactFlowApi;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusReactFlowApi = null;
      return cachedCorpusReactFlowApi;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const apiPath = namespaceIndex?.apis?.reactflow?.file;
    if (!apiPath) {
      cachedCorpusReactFlowApi = null;
      return cachedCorpusReactFlowApi;
    }

    const apiRaw = readFileSync(join(corpusRoot, "frontend/reactflow", apiPath), "utf8");
    const api = YAML.parse(apiRaw) as CorpusApiEntry | null;
    if (
      !api ||
      normalizeApiName(api.name ?? "") !== normalizeApiName(corpusApiName) ||
      !api.usage ||
      !api.importPath ||
      !api.description ||
      !api.kind
    ) {
      cachedCorpusReactFlowApi = null;
      return cachedCorpusReactFlowApi;
    }

    cachedCorpusReactFlowApi = {
      api: {
        name: api.name ?? corpusApiName,
        kind: api.kind as Parameters<typeof formatApiReference>[0]["kind"],
        description: api.description,
        importPath: api.importPath,
        props: api.props,
        returns: api.returns,
        usage: api.usage,
        examples: (api.examples ?? [])
          .filter((ex): ex is { title: string; code: string; description?: string; category?: ReactFlowExample["category"] } =>
            Boolean(ex?.title && ex?.code),
          )
          .map((ex) => ({
            title: ex.title,
            code: ex.code,
            description: ex.description,
            category: ex.category ?? "quickstart",
          })),
        tips: api.tips ?? [],
        relatedApis: api.relatedApis ?? [],
      },
      source: corpusNamespace,
    };
    return cachedCorpusReactFlowApi ?? null;
  } catch {
    cachedCorpusReactFlowApi = null;
    return null;
  }
}

function getReactFlowApi(name: string) {
  if (normalizeApiName(name) !== normalizeApiName(corpusApiName)) {
    return getApiByName(name, ALL_APIS);
  }

  const corpusEntry = loadCorpusReactFlowApi();
  if (corpusEntry) {
    return corpusEntry.api;
  }

  return getApiByName(name, ALL_APIS);
}

export function register(server: McpServer): void {
  server.tool(
    "reactflow_get_api",
    "Get detailed API reference for a specific React Flow component, hook, utility, or type. Includes props, usage, examples, and tips.",
    {
      name: z
        .string()
        .describe(
          "API name (e.g., 'ReactFlow', 'useReactFlow', 'Handle', 'addEdge', 'Node', 'Edge', 'NodeProps')",
        ),
    },
    async ({ name }) => {
      const corpusEntry = normalizeApiName(name) === normalizeApiName(corpusApiName) ? loadCorpusReactFlowApi() : null;
      const api = getReactFlowApi(name);
      if (!api) {
        const suggestions = searchApis(name, ALL_APIS)
          .slice(0, 5)
          .map((r) => r.api.name);
        return {
          content: [
            {
              type: "text",
              text: `API "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nAvailable APIs: ${ALL_APIS.map((a) => a.name).join(", ")}`,
            },
          ],
          isError: true,
        };
      }
      const rendered = formatApiReference(api);
      return {
        content: [
          {
            type: "text",
            text: corpusEntry ? `${rendered}\n**Corpus Source:** ${corpusEntry.source}` : rendered,
          },
        ],
      };
    },
  );
}
