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
  apis?: Record<string, { file?: string }>;
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

type LoadedCorpusApi = {
  api: Parameters<typeof formatApiReference>[0];
  source: string;
};

type ReactFlowExample = Parameters<typeof formatApiReference>[0]["examples"][number];

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "frontend.reactflow";

const cachedCorpusApis = new Map<string, LoadedCorpusApi | null>();

function normalizeApiName(name: string): string {
  return name.toLowerCase().replace(/[<>/()]/g, "").trim();
}

function loadCorpusApi(name: string): LoadedCorpusApi | null {
  const key = normalizeApiName(name);
  if (cachedCorpusApis.has(key)) {
    return cachedCorpusApis.get(key) ?? null;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusApis.set(key, null);
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const apiPath = namespaceIndex?.apis?.[key]?.file;
    if (!apiPath) {
      cachedCorpusApis.set(key, null);
      return null;
    }

    const apiRaw = readFileSync(join(corpusRoot, "frontend/reactflow", apiPath), "utf8");
    const api = YAML.parse(apiRaw) as CorpusApiEntry | null;
    if (
      !api ||
      normalizeApiName(api.name ?? "") !== key ||
      !api.usage ||
      !api.importPath ||
      !api.description ||
      !api.kind
    ) {
      cachedCorpusApis.set(key, null);
      return null;
    }

    const loaded: LoadedCorpusApi = {
      api: {
        name: api.name ?? name,
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
    cachedCorpusApis.set(key, loaded);
    return loaded;
  } catch {
    cachedCorpusApis.set(key, null);
    return null;
  }
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
      const corpusEntry = loadCorpusApi(name);
      const api = corpusEntry?.api ?? getApiByName(name, ALL_APIS);
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
