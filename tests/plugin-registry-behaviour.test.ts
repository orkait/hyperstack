import assert from "node:assert/strict";
import test from "node:test";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { reactflowPlugin } from "../src/plugins/reactflow/index.ts";
import { motionPlugin } from "../src/plugins/motion/index.ts";
import { lenisPlugin } from "../src/plugins/lenis/index.ts";
import { reactPlugin } from "../src/plugins/react/index.ts";
import { echoPlugin } from "../src/plugins/echo/index.ts";
import { golangPlugin } from "../src/plugins/golang/index.ts";
import { rustPlugin } from "../src/plugins/rust/index.ts";
import { designTokensPlugin } from "../src/plugins/design-tokens/index.ts";
import { uiUxPlugin } from "../src/plugins/ui-ux/index.ts";
import { designerPlugin } from "../src/plugins/designer/index.ts";
import { shadcnPlugin } from "../src/plugins/shadcn/index.ts";

interface RegisteredTool {
  name: string;
  description: string;
}

function captureRegisteredTools(plugin: { name: string; register: (s: McpServer) => void }): RegisteredTool[] {
  const tools: RegisteredTool[] = [];

  const server = {
    tool(name: string, description: string, _schema: unknown, _handler: unknown) {
      tools.push({ name, description });
    },
    resource(_name: string, _uri: unknown, _meta: unknown, _handler: unknown) {
      // MCP resources - not tools, skip
    },
  } as unknown as McpServer;

  plugin.register(server);
  return tools;
}

const ALL_PLUGINS = [
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
];

test("all 11 plugins register at least one tool", () => {
  assert.equal(ALL_PLUGINS.length, 11, "Expected 11 plugins");

  for (const plugin of ALL_PLUGINS) {
    const tools = captureRegisteredTools(plugin);
    assert.ok(tools.length > 0, `Plugin "${plugin.name}" registered zero tools`);
  }
});

test("every registered tool has a non-empty name and description", () => {
  for (const plugin of ALL_PLUGINS) {
    const tools = captureRegisteredTools(plugin);

    for (const tool of tools) {
      assert.ok(tool.name.length > 0, `Plugin "${plugin.name}" registered a tool with empty name`);
      assert.ok(
        tool.description.length > 0,
        `Plugin "${plugin.name}" tool "${tool.name}" has empty description`,
      );
    }
  }
});

test("tool names follow namespace convention (plugin_name_action)", () => {
  const NAMESPACE_MAP: Record<string, string> = {
    reactflow: "reactflow_",
    motion: "motion_",
    lenis: "lenis_",
    react: "react_",
    echo: "echo_",
    golang: "golang_",
    rust: "rust_",
    "design-tokens": "design_tokens_",
    "ui-ux": "ui_ux_",
    designer: "designer_",
    shadcn: "shadcn_",
  };

  for (const plugin of ALL_PLUGINS) {
    const expectedPrefix = NAMESPACE_MAP[plugin.name];
    assert.ok(expectedPrefix, `No namespace mapping for plugin: ${plugin.name}`);

    const tools = captureRegisteredTools(plugin);
    for (const tool of tools) {
      assert.ok(
        tool.name.startsWith(expectedPrefix),
        `Plugin "${plugin.name}" tool "${tool.name}" does not start with expected prefix "${expectedPrefix}"`,
      );
    }
  }
});

test("designer plugin registers the required MCP tools referenced in skills", () => {
  const REQUIRED_DESIGNER_TOOLS = [
    "designer_resolve_intent",
    "designer_get_personality",
    "designer_get_page_template",
    "designer_get_anti_patterns",
    "designer_get_preset",
    "designer_list_presets",
    "designer_get_font_pairing",
  ];

  const tools = captureRegisteredTools(designerPlugin);
  const toolNames = new Set(tools.map((t) => t.name));

  for (const required of REQUIRED_DESIGNER_TOOLS) {
    assert.ok(toolNames.has(required), `designer plugin missing required tool: ${required}`);
  }
});

test("shadcn plugin registers the required MCP tools referenced in skills", () => {
  const REQUIRED_SHADCN_TOOLS = [
    "shadcn_get_rules",
    "shadcn_get_component",
    "shadcn_get_snippet",
    "shadcn_get_composition",
    "shadcn_list_components",
  ];

  const tools = captureRegisteredTools(shadcnPlugin);
  const toolNames = new Set(tools.map((t) => t.name));

  for (const required of REQUIRED_SHADCN_TOOLS) {
    assert.ok(toolNames.has(required), `shadcn plugin missing required tool: ${required}`);
  }
});

test("no two plugins register a tool with the same name", () => {
  const seen = new Map<string, string>();

  for (const plugin of ALL_PLUGINS) {
    const tools = captureRegisteredTools(plugin);
    for (const tool of tools) {
      const existing = seen.get(tool.name);
      assert.ok(
        !existing,
        `Duplicate tool name "${tool.name}" registered by both "${existing}" and "${plugin.name}"`,
      );
      seen.set(tool.name, plugin.name);
    }
  }
});
