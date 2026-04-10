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

const server = new McpServer({
  name: "hyperstack",
  version: "1.0.0",
});

loadPlugins(server, [
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
]);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = () => process.exit(0);
  process.stdin.on("close", shutdown);
  process.stdin.on("end", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
