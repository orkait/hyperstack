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
import { behaviourAnalysisPlugin } from "./plugins/behaviour-analysis/index.js";
import { designPatternsSkillPlugin } from "./plugins/design-patterns-skill/index.js";
import { engineeringDisciplinePlugin } from "./plugins/engineering-discipline/index.js";
import { excalidrawPlugin } from "./plugins/excalidraw/index.js";
import { frameAnimatorPlugin } from "./plugins/frame-animator/index.js";
import { golangDesignPatternPlugin } from "./plugins/golang-design-pattern/index.js";
import { pinchtabPlugin } from "./plugins/pinchtab/index.js";
import { reactProCoderPlugin } from "./plugins/react-pro-coder/index.js";
import { readmeWriterPlugin } from "./plugins/readme-writer/index.js";
import { securityReviewPlugin } from "./plugins/security-review/index.js";

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
  behaviourAnalysisPlugin,
  designPatternsSkillPlugin,
  engineeringDisciplinePlugin,
  excalidrawPlugin,
  frameAnimatorPlugin,
  golangDesignPatternPlugin,
  pinchtabPlugin,
  reactProCoderPlugin,
  readmeWriterPlugin,
  securityReviewPlugin,
]);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
