import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { invokeRegisteredTool } from "../../engine/tool-bridge.js";

const adapterDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(adapterDir, "../../..");
const registryPath = resolve(repoRoot, "generated", "tool-index", "local-tool-registry.json");

function readRegistry(): Record<string, string> {
  return JSON.parse(readFileSync(registryPath, "utf8")) as Record<string, string>;
}

export async function invokeLocalTool(name: string, args: Record<string, unknown>) {
  const registry = readRegistry();
  const importPath = registry[name];
  if (!importPath) {
    throw new Error(`Unknown local tool: ${name}`);
  }

  const resolvedImportPath = resolve(repoRoot, importPath);
  const module = await import(pathToFileURL(resolvedImportPath).href);
  return invokeRegisteredTool(module.register, args);
}
