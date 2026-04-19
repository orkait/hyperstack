import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type { CorpusIndex } from "./contracts.js";

export function loadCorpusIndex(repoRoot: string): CorpusIndex {
  return YAML.parse(readFileSync(join(repoRoot, "corpus", "index.yaml"), "utf8")) as CorpusIndex;
}

export function loadCorpusDocument<T>(repoRoot: string, relativePath: string): T {
  const filePath = join(repoRoot, relativePath);
  if (!existsSync(filePath)) {
    throw new Error(`Corpus document not found: ${relativePath}`);
  }

  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}
