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
