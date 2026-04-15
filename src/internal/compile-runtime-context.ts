#!/usr/bin/env node

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compileContextArtifacts, compileUsingHyperstackBootstrap } from "./context-compiler.js";
import { readFileSync } from "node:fs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginRoot = join(scriptDir, "../..");

try {
  const artifacts = compileContextArtifacts(pluginRoot);
  const source = readFileSync(join(pluginRoot, "skills", "hyperstack", "SKILL.md"), "utf8");
  const { stats } = compileUsingHyperstackBootstrap(source);

  process.stdout.write(
    [
      "Compiled runtime context artifacts:",
      ...artifacts.map((artifact) => `- ${artifact.outputPath}`),
      `Bootstrap char savings: ${(stats.savingsRatio * 100).toFixed(1)}% (${stats.sourceChars} -> ${stats.artifactChars})`,
      "",
    ].join("\n"),
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to compile runtime context: ${message}\n`);
  process.exit(1);
}
