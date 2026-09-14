import { test, expect } from "bun:test";
import os from "node:os";
import path from "node:path";
import {
  KNOWN_PLATFORMS,
  detectEnvironment,
  findSkillPath,
  generateMcpPatch,
  getPlatformFormat,
} from "../src/internal/setup-hyperstack.ts";

test("superclaw is a known platform with the superclaw config and skill paths", () => {
  const superclaw = KNOWN_PLATFORMS.superclaw;
  expect(superclaw.env).toEqual(["SUPERCLAW_PLUGIN_ROOT"]);
  expect(superclaw.configFiles).toEqual([".config/superclaw/mcp.json"]);
  expect(findSkillPath("superclaw")).toBe(path.join(os.homedir(), ".config/superclaw/skills"));
  expect(getPlatformFormat("superclaw")).toBe("json-mcpServers");
});

test("SUPERCLAW_PLUGIN_ROOT in the environment detects superclaw after the IDE signatures", () => {
  const saved = { ...process.env };
  for (const name of ["ANTIGRAVITY_AGENT", "CLAUDE_PLUGIN_ROOT", "CURSOR_PLUGIN_ROOT", "SUPERCLAW_PLUGIN_ROOT"]) {
    delete process.env[name];
  }
  expect(detectEnvironment()).toBe("unknown");
  process.env.SUPERCLAW_PLUGIN_ROOT = "/tmp/hyperstack";
  expect(detectEnvironment()).toBe("superclaw");
  process.env.CLAUDE_PLUGIN_ROOT = "/tmp/hyperstack";
  expect(detectEnvironment()).toBe("claude-code");
  process.env = saved;
});

test("the superclaw MCP patch is the docker server under mcpServers", () => {
  const patch = generateMcpPatch("/home/x/.config/superclaw/mcp.json", "/home/x/.hyperstack", "superclaw");
  expect(patch.format).toBe("json-mcpServers");
  const content = patch.content as { mcpServers: Record<string, { command: string; args: string[]; env: Record<string, string> }> };
  expect(content.mcpServers.hyperstack.command).toBe("docker");
  expect(content.mcpServers.hyperstack.args).toEqual(["exec", "-i", "hyperstack-mcp", "bun", "/app/src/index.ts"]);
  expect(content.mcpServers.hyperstack.env.HYPERSTACK_ROOT).toBe("/home/x/.hyperstack");
});
