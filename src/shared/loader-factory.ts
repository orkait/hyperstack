import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const sharedDir = dirname(fileURLToPath(import.meta.url));

export function createSnippetLoader(pluginName: string): (rel: string) => string {
  // Traverse up from src/shared to src/plugins/<plugin>/snippets
  const snippetsDir = join(sharedDir, "../plugins", pluginName, "snippets");

  return function snippet(rel: string): string {
    try {
      return readFileSync(join(snippetsDir, rel), "utf-8").trim();
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        throw new Error(`Snippet not found: src/plugins/${pluginName}/snippets/${rel}`);
      }
      throw err;
    }
  };
}
