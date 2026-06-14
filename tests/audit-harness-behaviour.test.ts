import { test, expect } from "bun:test";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { SOURCES } from "../scripts/audit/sources.ts";

const REPO_ROOT = resolve(import.meta.dir, "..");
const pluginDirs = readdirSync(resolve(REPO_ROOT, "src/plugins"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const skillDirs = new Set(
  readdirSync(resolve(REPO_ROOT, "skills"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name),
);

test("every plugin directory has a manifest entry", () => {
  const covered = new Set(SOURCES.map((s) => s.plugin));
  for (const d of pluginDirs) expect(covered.has(d)).toBe(true);
});

test("every manifest entry maps to a real plugin directory", () => {
  for (const s of SOURCES) expect(pluginDirs).toContain(s.plugin);
});

test("editorial and skip are mutually exclusive", () => {
  for (const s of SOURCES) expect(s.editorial && s.skip).toBe(false);
});

test("non-editorial non-skip entries declare valid packages", () => {
  for (const s of SOURCES) {
    if (s.editorial || s.skip) continue;
    expect(s.packages.length).toBeGreaterThan(0);
    for (const p of s.packages) {
      expect(p.name).not.toBe("");
      expect(["npm", "go-proxy"]).toContain(p.registry);
      expect(Number.isFinite(p.targetMajor)).toBe(true);
    }
  }
});

test("declared skills exist under skills/", () => {
  for (const s of SOURCES) {
    for (const skill of s.skills) expect(skillDirs.has(skill)).toBe(true);
  }
});

import { mock, afterEach } from "bun:test";
import { fetchLatest, majorOf, classifyBump } from "../scripts/audit/fetch.ts";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("fetchLatest parses the npm latest shape", async () => {
  globalThis.fetch = mock(async () =>
    new Response(JSON.stringify({ version: "12.11.0" }), { status: 200 })) as any;
  const r = await fetchLatest("@xyflow/react", "npm");
  expect(r.latest).toBe("12.11.0");
});

test("fetchLatest parses the go-proxy shape and strips leading v", async () => {
  globalThis.fetch = mock(async () =>
    new Response(JSON.stringify({ Version: "v4.15.3" }), { status: 200 })) as any;
  const r = await fetchLatest("github.com/labstack/echo/v4", "go-proxy");
  expect(r.latest).toBe("4.15.3");
});

test("fetchLatest reports an error instead of throwing on non-200", async () => {
  globalThis.fetch = mock(async () => new Response("nope", { status: 404 })) as any;
  const r = await fetchLatest("does-not-exist", "npm");
  expect(r.latest).toBeNull();
  expect(r.error).toContain("404");
});

test("classifyBump distinguishes major-behind from current", () => {
  expect(classifyBump(11, "12.11.0")).toBe("MAJOR-BEHIND");
  expect(classifyBump(12, "12.11.0")).toBe("current-major");
  expect(majorOf("1.0.0-rc.0")).toBe(1);
});
