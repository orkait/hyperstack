# Hyperstack Quarterly Audit Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a manual, once-a-quarter audit harness that deterministically detects version + internal-consistency drift across Hyperstack's plugins and skills, plus a standalone pre-audit PR fixing two shadcn defects found during design.

**Architecture:** Two deterministic TypeScript layers (L1 version-delta via registry fetch, L3 consistency lint) run by `bun run audit` and write Markdown reports to `generated/audit/`. A third layer (L2 semantic drift) is a manual headless-Chrome protocol documented as the `audit-drift` skill. Layer rules and fetchers are pure functions so they unit-test against inline fixtures.

**Tech Stack:** Bun, TypeScript, `bun:test`, npm registry API, Go module proxy, MCP SDK (existing).

**Spec:** `docs/superpowers/specs/2026-06-14-hyperstack-quarterly-audit-harness-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `scripts/audit/sources.ts` | Manifest: plugin -> packages + target major + editorial/skip flags + skills |
| `scripts/audit/fetch.ts` | Registry fetchers (npm, go-proxy) + version classification. Pure, mockable |
| `scripts/audit/consistency.ts` | L3 lint: 4 pure rule functions + `runConsistency(root)` fs driver |
| `scripts/audit/run.ts` | Entry (`bun run audit`): drives L1 + L3, writes reports |
| `skills/audit-drift/SKILL.md` | L2 manual headless-Chrome research protocol + report format |
| `tests/audit-harness-behaviour.test.ts` | Manifest coverage, fetcher parsing, lint rules vs fixtures |
| `generated/audit/version-delta.md` | L1 output (committed artifact) |
| `generated/audit/consistency.md` | L3 output (committed artifact) |
| `src/plugins/shadcn/data.ts` | MODIFY (F2): `@repo/ui-utils` -> `@/lib/utils` |
| `src/plugins/shadcn/shared/rules.ts` | DELETE (F1): orphan, divergent duplicate |
| `package.json` | MODIFY: add `audit` script |

---

## Phase 0: Pre-audit shadcn fix (standalone PR, off `main`)

Ships before the harness. F1 (orphan module) + F2 (wrong `cn` path). Both are shipped to users today via `shadcn_get_rules`.

### Task 1: Fix cn import path and remove orphan rules module

**Files:**
- Modify: `src/plugins/shadcn/data.ts:92`
- Delete: `src/plugins/shadcn/shared/rules.ts`
- Test: `tests/shadcn-rules-surface.test.ts`

- [ ] **Step 1: Branch from main**

```bash
git checkout main
git checkout -b b-BE-hyperstack-shadcn-cn-path
```

- [ ] **Step 2: Write the failing test**

Create `tests/shadcn-rules-surface.test.ts`:

```ts
import { test, expect } from "bun:test";
import { existsSync } from "node:fs";
import { register as getRules } from "../src/plugins/shadcn/tools/get-rules.ts";

function invokeGetRules(): Promise<string> {
  let handler: ((args: any) => any) | undefined;
  const server = { tool: (_n: string, _d: string, _s: unknown, h: any) => { handler = h; } } as any;
  getRules(server);
  return Promise.resolve(handler!({})).then((r: any) => r.content[0].text as string);
}

test("shadcn rules surface uses the canonical cn import path", async () => {
  const text = await invokeGetRules();
  expect(text).toContain("@/lib/utils");
  expect(text).not.toContain("@repo/ui-utils");
});

test("orphan shared/rules.ts is removed (single source of truth)", () => {
  expect(existsSync("src/plugins/shadcn/shared/rules.ts")).toBe(false);
});
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `bun test tests/shadcn-rules-surface.test.ts`
Expected: FAIL - first test fails (`@repo/ui-utils` still present), second fails (file still exists).

- [ ] **Step 4: Fix the cn path in data.ts**

In `src/plugins/shadcn/data.ts` line 92, change:

```ts
  utilities: ["cn from @repo/ui-utils", "cva from class-variance-authority"],
```

to:

```ts
  utilities: ["cn from @/lib/utils", "cva from class-variance-authority"],
```

- [ ] **Step 5: Delete the orphan module**

```bash
git rm src/plugins/shadcn/shared/rules.ts
```

(Confirmed earlier: zero importers. `get-rules.ts` imports `SHADCN_RULES` from `../data.js`, not from `shared/rules.ts`.)

- [ ] **Step 6: Run the test + full suite + typecheck**

Run: `bun test tests/shadcn-rules-surface.test.ts && bun test && bun run build`
Expected: PASS on both new tests, full suite green, `tsc --noEmit` clean.

- [ ] **Step 7: Commit and open PR**

```bash
git add tests/shadcn-rules-surface.test.ts src/plugins/shadcn/data.ts
git commit -m "fix(shadcn): use canonical cn path and drop orphan rules module"
git push -u origin b-BE-hyperstack-shadcn-cn-path
gh pr create --title "BE shadcn: fix cn import path and remove orphan rules module" --body-file - <<'EOF'
Fixes two defects found during the quarterly-audit design pilot.

| # | Defect | Fix |
|---|---|---|
| F1 | `shadcn/shared/rules.ts` orphan, divergent from live `data.ts` rules | Delete it; `data.ts` is the single source of truth |
| F2 | `cn from @repo/ui-utils` (monorepo-internal path) shipped via `shadcn_get_rules` | Replace with canonical `@/lib/utils` |

Verification: `bun test` green, `tsc --noEmit` clean.
EOF
```

- [ ] **Step 8: Merge PR, return to harness branch**

```bash
gh pr merge --squash --delete-branch
git checkout f-BE-hyperstack-quarterly-audit-harness
git rebase main
```

---

## Phase 1: Audit harness (branch `f-BE-hyperstack-quarterly-audit-harness`)

### Task 2: Manifest (`sources.ts`) + coverage test

**Files:**
- Create: `scripts/audit/sources.ts`
- Test: `tests/audit-harness-behaviour.test.ts`

- [ ] **Step 1: Write the manifest**

Create `scripts/audit/sources.ts`:

```ts
export type Registry = "npm" | "go-proxy";

export interface PackageRef {
  name: string;
  registry: Registry;
  targetMajor: number;
}

export interface PluginSource {
  plugin: string;        // directory name under src/plugins
  packages: PackageRef[]; // empty when editorial or skip
  editorial: boolean;    // no registry; judged via L2 research
  skip: boolean;         // not audited (no upstream surface)
  skills: string[];      // skill dirs under skills/ that ride this plugin
}

export const SOURCES: PluginSource[] = [
  { plugin: "shadcn", editorial: false, skip: false, skills: ["shadcn-expert"],
    packages: [
      { name: "@base-ui/react", registry: "npm", targetMajor: 1 },
      { name: "tailwindcss", registry: "npm", targetMajor: 4 },
    ] },
  { plugin: "reactflow", editorial: false, skip: false, skills: [],
    packages: [{ name: "@xyflow/react", registry: "npm", targetMajor: 12 }] },
  { plugin: "motion", editorial: false, skip: false, skills: [],
    packages: [{ name: "motion", registry: "npm", targetMajor: 12 }] },
  { plugin: "lenis", editorial: false, skip: false, skills: [],
    packages: [{ name: "lenis", registry: "npm", targetMajor: 1 }] },
  { plugin: "react", editorial: false, skip: false, skills: [],
    packages: [
      { name: "react", registry: "npm", targetMajor: 19 },
      { name: "react-dom", registry: "npm", targetMajor: 19 },
      { name: "next", registry: "npm", targetMajor: 15 },
    ] },
  { plugin: "design-tokens", editorial: false, skip: false, skills: [],
    packages: [{ name: "tailwindcss", registry: "npm", targetMajor: 4 }] },
  { plugin: "echo", editorial: false, skip: false, skills: [],
    packages: [{ name: "github.com/labstack/echo/v4", registry: "go-proxy", targetMajor: 4 }] },
  { plugin: "golang", editorial: true, skip: false, skills: [], packages: [] },
  { plugin: "rust", editorial: true, skip: false, skills: [], packages: [] },
  { plugin: "ui-ux", editorial: true, skip: false, skills: [], packages: [] },
  { plugin: "designer", editorial: true, skip: false, skills: ["designer"], packages: [] },
  { plugin: "hyperstack", editorial: false, skip: true, skills: [], packages: [] },
];
```

- [ ] **Step 2: Write the failing coverage test**

Create `tests/audit-harness-behaviour.test.ts`:

```ts
import { test, expect } from "bun:test";
import { readdirSync } from "node:fs";
import { SOURCES } from "../scripts/audit/sources.ts";

test("every plugin directory has a manifest entry", () => {
  const dirs = readdirSync("src/plugins", { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const covered = new Set(SOURCES.map((s) => s.plugin));
  for (const d of dirs) expect(covered.has(d)).toBe(true);
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
```

- [ ] **Step 3: Run the test, verify it passes**

Run: `bun test tests/audit-harness-behaviour.test.ts`
Expected: PASS (both tests). If "every plugin directory" fails, a `src/plugins/*` dir is missing from `SOURCES` - add it.

- [ ] **Step 4: Commit**

```bash
git add scripts/audit/sources.ts tests/audit-harness-behaviour.test.ts
git commit -m "feat(audit): add plugin->upstream manifest with coverage test"
```

### Task 3: Registry fetchers (`fetch.ts`)

**Files:**
- Create: `scripts/audit/fetch.ts`
- Test: `tests/audit-harness-behaviour.test.ts` (append)

- [ ] **Step 1: Write failing fetcher tests**

Append to `tests/audit-harness-behaviour.test.ts`:

```ts
import { mock } from "bun:test";
import { fetchLatest, majorOf, classifyBump } from "../scripts/audit/fetch.ts";

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
```

- [ ] **Step 2: Run, verify it fails**

Run: `bun test tests/audit-harness-behaviour.test.ts`
Expected: FAIL - `Cannot find module '../scripts/audit/fetch.ts'`.

- [ ] **Step 3: Implement the fetchers**

Create `scripts/audit/fetch.ts`:

```ts
import type { Registry } from "./sources.js";

export interface VersionResult {
  name: string;
  latest: string | null;
  error?: string;
}

export async function fetchLatest(name: string, registry: Registry): Promise<VersionResult> {
  try {
    if (registry === "npm") {
      const enc = name.startsWith("@")
        ? "@" + encodeURIComponent(name.slice(1))
        : encodeURIComponent(name);
      const res = await fetch(`https://registry.npmjs.org/${enc}/latest`);
      if (!res.ok) return { name, latest: null, error: `npm ${res.status}` };
      const json = (await res.json()) as { version?: string };
      return { name, latest: json.version ?? null };
    }
    if (registry === "go-proxy") {
      const res = await fetch(`https://proxy.golang.org/${name}/@latest`);
      if (!res.ok) return { name, latest: null, error: `go-proxy ${res.status}` };
      const json = (await res.json()) as { Version?: string };
      return { name, latest: json.Version ? json.Version.replace(/^v/, "") : null };
    }
    return { name, latest: null, error: `unknown registry ${registry}` };
  } catch (err) {
    return { name, latest: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export function majorOf(version: string): number | null {
  const head = version.replace(/^v/, "").split(".")[0];
  const n = parseInt(head, 10);
  return Number.isFinite(n) ? n : null;
}

export function classifyBump(targetMajor: number, latest: string | null): string {
  if (!latest) return "unknown";
  const lm = majorOf(latest);
  if (lm === null) return "unknown";
  if (lm > targetMajor) return "MAJOR-BEHIND";
  if (lm < targetMajor) return "ahead";
  return "current-major";
}
```

- [ ] **Step 4: Run, verify pass**

Run: `bun test tests/audit-harness-behaviour.test.ts`
Expected: PASS (all fetcher tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/audit/fetch.ts tests/audit-harness-behaviour.test.ts
git commit -m "feat(audit): add npm + go-proxy version fetchers"
```

### Task 4: L3 consistency lint (`consistency.ts`)

**Files:**
- Create: `scripts/audit/consistency.ts`
- Test: `tests/audit-harness-behaviour.test.ts` (append)

- [ ] **Step 1: Write failing lint tests**

Append to `tests/audit-harness-behaviour.test.ts`:

```ts
import {
  lintInternalImportLeaks,
  lintDuplicateExports,
  lintOrphanModules,
  lintSnippetRefs,
} from "../scripts/audit/consistency.ts";

test("lintInternalImportLeaks flags @repo/ and @workspace/ paths", () => {
  const f = [{ path: "src/plugins/x/data.ts", content: 'cn from "@repo/ui-utils"' }];
  const out = lintInternalImportLeaks(f);
  expect(out.length).toBe(1);
  expect(out[0].rule).toBe("internal-import-leak");
});

test("lintDuplicateExports flags a const defined in two files", () => {
  const f = [
    { path: "a/data.ts", content: "export const SHADCN_RULES = {}" },
    { path: "a/shared/rules.ts", content: "export const SHADCN_RULES = {}" },
  ];
  const out = lintDuplicateExports(f);
  expect(out.some((x) => x.detail.includes("SHADCN_RULES"))).toBe(true);
});

test("lintOrphanModules flags a module nobody imports", () => {
  const f = [
    { path: "src/plugins/x/index.ts", content: 'import { a } from "./data.js"' },
    { path: "src/plugins/x/data.ts", content: "export const a = 1" },
    { path: "src/plugins/x/shared/rules.ts", content: "export const ORPHAN = 1" },
  ];
  const out = lintOrphanModules(f);
  expect(out.length).toBe(1);
  expect(out[0].location).toBe("src/plugins/x/shared/rules.ts");
});

test("lintSnippetRefs flags a snippet() call with no backing file", () => {
  const f = [{ path: "src/plugins/x/data.ts", content: 'snippet("missing.txt")' }];
  const existing = new Set<string>(["src/plugins/x/snippets/present.txt"]);
  const out = lintSnippetRefs(f, existing);
  expect(out.length).toBe(1);
  expect(out[0].detail).toContain("missing.txt");
});
```

- [ ] **Step 2: Run, verify it fails**

Run: `bun test tests/audit-harness-behaviour.test.ts`
Expected: FAIL - `Cannot find module '../scripts/audit/consistency.ts'`.

- [ ] **Step 3: Implement the lint module**

Create `scripts/audit/consistency.ts`:

```ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export interface SourceFile {
  path: string; // repo-relative, e.g. src/plugins/shadcn/data.ts
  content: string;
}

export interface Finding {
  rule: string;
  location: string;
  detail: string;
}

function normalizePath(p: string): string {
  const stack: string[] = [];
  for (const part of p.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack.join("/");
}

function pluginOf(path: string): string | null {
  const m = path.match(/^src\/plugins\/([^/]+)\//);
  return m ? m[1] : null;
}

const INTERNAL_PREFIXES = [/@repo\//, /@workspace\//];

export function lintInternalImportLeaks(files: SourceFile[]): Finding[] {
  const out: Finding[] = [];
  for (const f of files) {
    f.content.split("\n").forEach((line, i) => {
      for (const re of INTERNAL_PREFIXES) {
        if (re.test(line)) {
          out.push({ rule: "internal-import-leak", location: `${f.path}:${i + 1}`, detail: line.trim() });
        }
      }
    });
  }
  return out;
}

export function lintDuplicateExports(files: SourceFile[]): Finding[] {
  const map = new Map<string, string[]>();
  for (const f of files) {
    const re = /export\s+const\s+([A-Z][A-Z0-9_]+)\s*=/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(f.content)) !== null) {
      const arr = map.get(m[1]) ?? [];
      if (!arr.includes(f.path)) arr.push(f.path);
      map.set(m[1], arr);
    }
  }
  const out: Finding[] = [];
  for (const [name, paths] of map) {
    if (paths.length > 1) {
      out.push({ rule: "divergent-duplicate", location: paths.join(", "), detail: `const ${name} defined in ${paths.length} files` });
    }
  }
  return out;
}

export function lintOrphanModules(files: SourceFile[]): Finding[] {
  const imported = new Set<string>();
  for (const f of files) {
    const dir = f.path.replace(/\/[^/]+$/, "");
    const re = /from\s+["'](\.[^"']+)["']/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(f.content)) !== null) {
      const spec = m[1].replace(/\.(js|ts)$/, "");
      imported.add(normalizePath(`${dir}/${spec}`));
    }
  }
  const out: Finding[] = [];
  for (const f of files) {
    const base = f.path.replace(/^.*\//, "");
    if (base === "index.ts" || base === "registry.ts") continue; // entry/aggregator
    const id = f.path.replace(/\.ts$/, "");
    if (!imported.has(id)) {
      out.push({ rule: "orphan-module", location: f.path, detail: "exported module imported by no other file" });
    }
  }
  return out;
}

export function lintSnippetRefs(files: SourceFile[], existingSnippets: Set<string>): Finding[] {
  const out: Finding[] = [];
  for (const f of files) {
    const plugin = pluginOf(f.path);
    if (!plugin) continue;
    const re = /snippet\(\s*["']([^"']+)["']\s*\)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(f.content)) !== null) {
      const full = `src/plugins/${plugin}/snippets/${m[1]}`;
      if (!existingSnippets.has(full)) {
        out.push({ rule: "snippet-ref", location: f.path, detail: `snippet("${m[1]}") -> missing ${full}` });
      }
    }
  }
  return out;
}

function walk(dir: string, pred: (p: string) => boolean, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, pred, acc);
    else if (pred(full)) acc.push(full);
  }
  return acc;
}

export function runConsistency(root: string): Finding[] {
  const srcDir = join(root, "src");
  const tsFiles = walk(srcDir, (p) => p.endsWith(".ts") && !p.endsWith(".test.ts"));
  const files: SourceFile[] = tsFiles.map((abs) => ({
    path: abs.slice(root.length + 1),
    content: readFileSync(abs, "utf8"),
  }));

  const snippets = new Set<string>();
  const pluginsDir = join(root, "src", "plugins");
  for (const plugin of readdirSync(pluginsDir)) {
    const snipDir = join(pluginsDir, plugin, "snippets");
    try {
      if (statSync(snipDir).isDirectory()) {
        for (const abs of walk(snipDir, (p) => p.endsWith(".txt"))) {
          snippets.add(abs.slice(root.length + 1));
        }
      }
    } catch { /* no snippets dir */ }
  }

  return [
    ...lintInternalImportLeaks(files),
    ...lintDuplicateExports(files),
    ...lintOrphanModules(files),
    ...lintSnippetRefs(files, snippets),
  ];
}
```

- [ ] **Step 4: Run, verify pass**

Run: `bun test tests/audit-harness-behaviour.test.ts`
Expected: PASS (all four lint tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/audit/consistency.ts tests/audit-harness-behaviour.test.ts
git commit -m "feat(audit): add L3 internal-consistency lint with rule fixtures"
```

### Task 5: Runner + `audit` script + report outputs

**Files:**
- Create: `scripts/audit/run.ts`
- Modify: `package.json` (scripts block)

- [ ] **Step 1: Implement the runner**

Create `scripts/audit/run.ts`:

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES } from "./sources.js";
import { classifyBump, fetchLatest } from "./fetch.js";
import { runConsistency } from "./consistency.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

async function main() {
  const delta: string[] = ["| Plugin | Package | Targets | Latest | Bump |", "|---|---|---|---|---|"];
  for (const s of SOURCES) {
    if (s.skip) { delta.push(`| ${s.plugin} | - | - | - | skip |`); continue; }
    if (s.editorial) { delta.push(`| ${s.plugin} | - | - | - | editorial (L2 direct) |`); continue; }
    for (const p of s.packages) {
      const r = await fetchLatest(p.name, p.registry);
      const bump = r.error ? `unknown (${r.error})` : classifyBump(p.targetMajor, r.latest);
      delta.push(`| ${s.plugin} | ${p.name} | ${p.targetMajor} | ${r.latest ?? "?"} | ${bump} |`);
    }
  }

  const findings = runConsistency(root);
  const cons = ["| Rule | Location | Detail |", "|---|---|---|",
    ...findings.map((f) => `| ${f.rule} | ${f.location} | ${f.detail} |`)];

  const outDir = join(root, "generated", "audit");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "version-delta.md"), `# Version Delta\n\n${delta.join("\n")}\n`);
  writeFileSync(join(outDir, "consistency.md"), `# Internal Consistency\n\n${findings.length} finding(s)\n\n${cons.join("\n")}\n`);

  console.log(`audit: wrote generated/audit/version-delta.md`);
  console.log(`audit: wrote generated/audit/consistency.md (${findings.length} findings)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Add the npm script**

In `package.json`, inside `"scripts"`, add:

```json
    "audit": "bun scripts/audit/run.ts",
```

- [ ] **Step 3: Run the audit for real**

Run: `bun run audit`
Expected output (numbers vary):
```
audit: wrote generated/audit/version-delta.md
audit: wrote generated/audit/consistency.md (N findings)
```
Then inspect: `version-delta.md` lists every non-skip plugin with a fetched `Latest`; `reactflow @xyflow/react` should show `current-major`. `consistency.md` should NOT list shadcn `@repo/` leak or the duplicate `SHADCN_RULES` (Phase 0 fixed both).

- [ ] **Step 4: Typecheck**

Run: `bun run build`
Expected: PASS (`tsc --noEmit` clean).

- [ ] **Step 5: Commit**

```bash
git add scripts/audit/run.ts package.json generated/audit/version-delta.md generated/audit/consistency.md
git commit -m "feat(audit): add runner, audit script, and quarterly report outputs"
```

### Task 6: L2 research skill (`audit-drift`)

**Files:**
- Create: `skills/audit-drift/SKILL.md`
- Modify: `skills/INDEX.md` (regenerated)

- [ ] **Step 1: Write the skill**

Create `skills/audit-drift/SKILL.md`:

```markdown
---
name: audit-drift
category: meta
description: Layer-2 semantic drift research for the quarterly audit. Use after `bun run audit` flags a plugin, to research real upstream API drift via headless Chrome and produce generated/audit/drift-report.md. Manual, once-a-quarter.
---

# Audit Drift (Layer 2)

Run after `bun run audit`. The version-delta report tells you a major/minor gap exists; this skill decides whether the APIs a plugin actually documents have drifted, using primary sources.

## The Iron Law

```
NO DRIFT VERDICT WITHOUT A CITED PRIMARY SOURCE
```

A version number is not drift. Drift is a documented API the plugin teaches that upstream changed. Cite the changelog or docs URL for every finding.

## Tooling priority

1. **Headless Chrome (pinchtab)** - primary. Open the upstream changelog, release notes, and the exact docs page for each API the plugin documents.
2. **Context7** - cross-check only. Key from `~/.config/hyperstack-audit/.env` (`CONTEXT7_API_KEY`). Useful because its snapshot can lag npm. Never the sole source.

## Procedure (per flagged plugin)

1. Open `version-delta.md`; take the plugin's targeted major and the fetched latest.
2. Open the plugin's `data.ts` / `snippets/` and list the concrete APIs it documents (hooks, props, imports, component names).
3. Headless-open the upstream changelog between targeted major and latest. For each documented API, classify:
   - `BREAKING` - renamed/removed/signature-changed
   - `ADDITIVE` - new API the plugin should mention
   - `NONE` - unchanged
4. Record each non-NONE finding with a source URL and the plugin file to edit.
5. Append a section to `generated/audit/drift-report.md`.

## Report format

```
## <plugin>  (targets v<major>, latest <x.y.z>)
- [BREAKING] <api> <what changed> - plugin <file> uses the old form
  source: <url>  -> action: <edit>
- [ADDITIVE] <api> added in v<x.y> - plugin omits it
  source: <url>  -> action: <edit>
verdict: <n> edits, severity <low|med|high>
```

## Editorial plugins

`golang`, `rust`, `ui-ux`, `designer` have no registry version. Research them directly: Go/Rust release notes, WCAG status, and current best-practice sources. Same report format, `targets` = the standard the plugin encodes (e.g. WCAG 2.2).

## Known-good (do not re-flag)

- `shadcn` -> `@base-ui/react` is the current canonical Base UI package (v1.x), subpath imports `@base-ui/react/<part>` valid. Verified npm + Context7 + official docs, 2026-06-14.
```

- [ ] **Step 2: Regenerate the skills index**

Run: `bun scripts/generate-skills-index.ts`
Expected: `skills/INDEX.md` now lists `audit-drift` under Meta.

- [ ] **Step 3: Run the skills-index + full suite**

Run: `bun test tests/skills-index-behaviour.test.ts && bun test`
Expected: PASS - skill has valid frontmatter, valid category (`meta`), and INDEX references it.

- [ ] **Step 4: Commit**

```bash
git add skills/audit-drift/SKILL.md skills/INDEX.md
git commit -m "feat(audit): add audit-drift L2 research skill"
```

### Task 7: Final verification + PR

- [ ] **Step 1: Full verification**

Run: `bun test && bun run build && bun run audit`
Expected: all tests pass, typecheck clean, audit writes both reports. Capture the output (ship-gate evidence).

- [ ] **Step 2: Push and open PR**

```bash
git push -u origin f-BE-hyperstack-quarterly-audit-harness
gh pr create --title "BE hyperstack: quarterly audit harness (version-delta + consistency lint + drift skill)" --body-file - <<'EOF'
Builds sub-project 0 of the quarterly community update: a manual, mostly-deterministic audit harness.

| Layer | Output | How |
|---|---|---|
| L1 version-delta | `generated/audit/version-delta.md` | `bun run audit` hits npm + go-proxy |
| L3 consistency lint | `generated/audit/consistency.md` | 4 deterministic rules over `src/plugins` |
| L2 semantic drift | `skills/audit-drift/SKILL.md` | manual headless-Chrome protocol |

Manifest covers all 12 plugins (7 registry-pinned, 4 editorial, hyperstack skipped). Tests: manifest coverage, fetcher parsing, lint rules vs fixtures.

Verification: `bun test` green, `tsc --noEmit` clean, `bun run audit` produces both reports.

Spec: `docs/superpowers/specs/2026-06-14-hyperstack-quarterly-audit-harness-design.md`
EOF
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Manifest (plugin -> upstream + targeted major + editorial/skip + skills) | Task 2 |
| L1 version-delta (npm + go-proxy, editorial skip, no fake versions) | Tasks 3, 5 |
| L3 consistency lint (orphan, divergent-dup, internal-leak, coverage/snippet-ref) | Task 4 |
| L2 headless protocol as a skill | Task 6 |
| Reports in `generated/audit/` | Task 5 |
| Test: manifest covers every plugin + fetcher shape + lint fixtures | Tasks 2-4 |
| `hyperstack` skip entry keeps coverage test passing | Task 2 (skip:true) |
| F1 orphan `rules.ts` + F2 `cn` path as pre-audit PR | Task 1 |
| Security: key env-only, never in repo | No repo file references the key; harness does not read it (L2 skill does, from env) |
| Verification: `bun test` + `bun run audit` | Task 7 |

**Type consistency:** `Registry`, `PackageRef`, `PluginSource`, `SOURCES`, `VersionResult`, `fetchLatest`, `majorOf`, `classifyBump`, `SourceFile`, `Finding`, `runConsistency`, and the four `lint*` names are consistent across Tasks 2-5 and the tests.

**Placeholder scan:** Report-format `<api>`/`<url>`/`<n>` tokens appear only inside the L2 skill's example output blocks (intentional templates), not as implementation gaps. No TODO/TBD in code steps.
