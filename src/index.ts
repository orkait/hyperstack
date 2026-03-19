#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadPlugins } from "./registry.js";
import { reactflowPlugin } from "./plugins/reactflow/index.js";
import { motionPlugin } from "./plugins/motion/index.js";

const server = new McpServer({
  name: "frontend-mcp",
  version: "1.0.0",
});

loadPlugins(server, [reactflowPlugin, motionPlugin]);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
