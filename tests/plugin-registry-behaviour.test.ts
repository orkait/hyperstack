import { test, expect } from "bun:test";
import { allPlugins } from "../src/index.ts";

function getRegisteredTools() {
  const tools: Array<{ name: string; description: string }> = [];
  const mockServer = {
    tool: (name: string, description: string) => {
      tools.push({ name, description });
    },
    resource: () => {},
    prompt: () => {},
  } as any;

  for (const plugin of allPlugins) {
    plugin.register(mockServer);
  }
  return tools;
}

test("all 15 plugins register at least one tool", () => {
  const tools = getRegisteredTools();
  const pluginPrefixes = new Set(tools.map((t) => t.name.split("_")[0]));
  expect(pluginPrefixes.size).toBe(15);
});

test("product-manager plugin registers its gate tools", () => {
  const tools = getRegisteredTools();
  const toolNames = new Set(tools.map((t) => t.name));
  expect(toolNames.has("product_manager_get_four_risks")).toBe(true);
  expect(toolNames.has("product_manager_resolve_product_decision")).toBe(true);
});

test("marketing plugin registers its tools", () => {
  const tools = getRegisteredTools();
  const toolNames = new Set(tools.map((t) => t.name));
  expect(toolNames.has("marketing_get_positioning")).toBe(true);
  expect(toolNames.has("marketing_brief")).toBe(true);
});

test("every registered tool has a non-empty name and description", () => {
  const tools = getRegisteredTools();
  for (const tool of tools) {
    expect(tool.name).not.toBe("");
    expect(tool.description).not.toBe("");
  }
});

test("tool names follow namespace convention (plugin_name_action)", () => {
  const tools = getRegisteredTools();
  for (const tool of tools) {
    expect(tool.name).toMatch(/^[a-z]+_[a-z0-9_]+$/);
  }
});

test("designer plugin registers the required MCP tools referenced in skills", () => {
  const tools = getRegisteredTools();
  const toolNames = new Set(tools.map((t) => t.name));
  expect(toolNames.has("designer_resolve_intent")).toBe(true);
  expect(toolNames.has("designer_generate_design_brief")).toBe(true);
});

test("shadcn plugin registers the required MCP tools referenced in skills", () => {
  const tools = getRegisteredTools();
  const toolNames = new Set(tools.map((t) => t.name));
  expect(toolNames.has("shadcn_get_component")).toBe(true);
  expect(toolNames.has("shadcn_get_composition")).toBe(true);
});

test("no two plugins register a tool with the same name", () => {
  const tools = getRegisteredTools();
  const names = tools.map((t) => t.name);
  const uniqueNames = new Set(names);
  expect(names.length).toBe(uniqueNames.size);
});
