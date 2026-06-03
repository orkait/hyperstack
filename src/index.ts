#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadPlugins } from "./registry.js";
import { reactflowPlugin } from "./plugins/reactflow/index.js";
import { motionPlugin } from "./plugins/motion/index.js";
import { lenisPlugin } from "./plugins/lenis/index.js";
import { reactPlugin } from "./plugins/react/index.js";
import { echoPlugin } from "./plugins/echo/index.js";
import { golangPlugin } from "./plugins/golang/index.js";
import { rustPlugin } from "./plugins/rust/index.js";
import { designTokensPlugin } from "./plugins/design-tokens/index.js";
import { uiUxPlugin } from "./plugins/ui-ux/index.js";
import { designerPlugin } from "./plugins/designer/index.js";
import { shadcnPlugin } from "./plugins/shadcn/index.js";
import { hyperstackPlugin } from "./plugins/hyperstack/index.js";

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

const server = new McpServer({
  name: "hyperstack",
  version: pkg.version,
});

export const allPlugins = [
  reactflowPlugin,
  motionPlugin,
  lenisPlugin,
  reactPlugin,
  echoPlugin,
  golangPlugin,
  rustPlugin,
  designTokensPlugin,
  uiUxPlugin,
  designerPlugin,
  shadcnPlugin,
  hyperstackPlugin,
];

loadPlugins(server, allPlugins);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = () => process.exit(0);
  process.stdin.on("close", shutdown);
  process.stdin.on("end", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

// Only boot the server when this file is the entry point. Importing it (e.g. from
// tests) must not start the transport or register the stdin-close exit handlers,
// which would call process.exit(0) mid-import and kill the test runner. Uses a
// portable argv check (works on Node + Bun) rather than the Bun-only import.meta.main.
const isEntrypoint = process.argv[1] === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  main().catch((err) => {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
  });
}
