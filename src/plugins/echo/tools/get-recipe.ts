import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { z } from "zod";
import { RECIPES, getRecipeByName, searchRecipes, formatRecipe, type Recipe } from "../data.js";

type CorpusIndex = {
  namespaces?: {
    "backend.echo"?: {
      index?: string;
    };
  };
};

type CorpusNamespaceIndex = {
  namespace?: string;
  recipes?: Record<string, { file?: string }>;
};

type CorpusRecipeEntry = {
  name?: string;
  category?: string;
  description?: string;
  when?: string;
  code?: string;
  gotchas?: string[];
  relatedRecipes?: string[];
};

type LoadedCorpusRecipe = { recipe: Recipe; source: string };

const moduleDir = dirname(fileURLToPath(import.meta.url));
const corpusRoot = join(moduleDir, "../../../../corpus");
const corpusNamespace = "backend.echo";

const cachedCorpusRecipes = new Map<string, LoadedCorpusRecipe | null>();

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

function loadCorpusRecipe(name: string): LoadedCorpusRecipe | null {
  const key = normalize(name);
  if (cachedCorpusRecipes.has(key)) {
    return cachedCorpusRecipes.get(key) ?? null;
  }

  try {
    const indexRaw = readFileSync(join(corpusRoot, "index.yaml"), "utf8");
    const index = YAML.parse(indexRaw) as CorpusIndex | null;
    const namespaceIndexPath = index?.namespaces?.[corpusNamespace]?.index;
    if (!namespaceIndexPath) {
      cachedCorpusRecipes.set(key, null);
      return null;
    }

    const namespaceRaw = readFileSync(join(corpusRoot, namespaceIndexPath), "utf8");
    const namespaceIndex = YAML.parse(namespaceRaw) as CorpusNamespaceIndex | null;
    const recipePath = namespaceIndex?.recipes?.[key]?.file;
    if (!recipePath) {
      cachedCorpusRecipes.set(key, null);
      return null;
    }

    const raw = readFileSync(join(corpusRoot, "backend/echo", recipePath), "utf8");
    const entry = YAML.parse(raw) as CorpusRecipeEntry | null;
    if (
      !entry ||
      normalize(entry.name ?? "") !== key ||
      !entry.category ||
      !entry.description ||
      !entry.when ||
      !entry.code
    ) {
      cachedCorpusRecipes.set(key, null);
      return null;
    }

    const loaded: LoadedCorpusRecipe = {
      recipe: {
        name: entry.name ?? name,
        category: entry.category as Recipe["category"],
        description: entry.description,
        when: entry.when,
        code: entry.code,
        gotchas: entry.gotchas,
        relatedRecipes: entry.relatedRecipes,
      },
      source: corpusNamespace,
    };
    cachedCorpusRecipes.set(key, loaded);
    return loaded;
  } catch {
    cachedCorpusRecipes.set(key, null);
    return null;
  }
}

export function register(server: McpServer): void {
  server.tool(
    "echo_get_recipe",
    "Get a specific Echo framework recipe with full working Go code, gotchas, and related recipes.",
    {
      name: z.string().describe("Recipe name (e.g., 'crud-api', 'websocket', 'sse', 'jwt-auth', 'graceful-shutdown')"),
    },
    async ({ name }) => {
      const corpusEntry = loadCorpusRecipe(name);
      const recipe = corpusEntry?.recipe ?? getRecipeByName(name);
      if (!recipe) {
        const suggestions = searchRecipes(name).map((r) => r.name);
        const allNames = RECIPES.map((r) => r.name).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Recipe "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.slice(0, 3).join(", ")}?` : ""}\n\nAll recipes: ${allNames}`,
            },
          ],
          isError: true,
        };
      }
      const formatted = formatRecipe(recipe);
      return {
        content: [
          {
            type: "text",
            text: corpusEntry ? `${formatted}\n**Corpus Source:** ${corpusEntry.source}` : formatted,
          },
        ],
      };
    }
  );
}
