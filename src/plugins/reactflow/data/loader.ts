import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const snippetsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../snippets/reactflow"
);

export function snippet(rel: string): string {
  return readFileSync(join(snippetsDir, rel), "utf-8").trim();
}
