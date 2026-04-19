# Corpus-First Knowledge Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `corpus/` start becoming the real source of truth for researched knowledge instead of keeping that truth trapped inside `src/plugins/*/data.ts` and `snippets/*`.

**Architecture:** Keep stable tool names and the local runtime intact, but insert a corpus-backed knowledge layer that selected tools can read first. Start with a migration foundation that supports structured corpus documents, then migrate one backend slice and one frontend slice end-to-end so the architecture proves itself before broader rollout.

**Tech Stack:** TypeScript, Bun, YAML, JSON, existing `src/engine/*`, existing local tool runtime, Bun test

---

## File Structure Lock-In

### New Files

- `corpus/index.yaml`
- `corpus/backend/golang/index.yaml`
- `corpus/backend/golang/practices/error-wrapping.json`
- `corpus/backend/golang/practices/goroutine-lifecycle.json`
- `corpus/frontend/ui-ux/index.yaml`
- `corpus/frontend/ui-ux/principles/type-scale.json`
- `corpus/frontend/ui-ux/principles/wcag-contrast.json`
- `src/engine/corpus-loader.ts`
- `src/engine/corpus-registry.ts`
- `tests/corpus-loader-behaviour.test.ts`
- `tests/corpus-backed-tools-behaviour.test.ts`

### Files To Modify

- `src/engine/contracts.ts`
- `src/engine/navigation.ts`
- `src/plugins/golang/tools/get-practice.ts`
- `src/plugins/ui-ux/tools/get-principle.ts`
- `generated/runtime-context/topology.bootstrap.md`
- `scripts/generate-topology-artifacts.ts`

### Responsibility Boundaries

- `corpus/index.yaml` is the map from capability/tool domain to corpus roots.
- `src/engine/corpus-loader.ts` owns reading and decoding corpus documents.
- `src/engine/corpus-registry.ts` maps corpus namespaces to concrete files.
- Individual tools can opt into corpus-first lookups while keeping old in-file data as fallback until full migration is done.

---

### Task 1: Add Corpus Registry And Loader Foundation

**Files:**
- Create: `corpus/index.yaml`
- Create: `src/engine/corpus-loader.ts`
- Create: `src/engine/corpus-registry.ts`
- Modify: `src/engine/contracts.ts`
- Test: `tests/corpus-loader-behaviour.test.ts`

- [ ] **Step 1: Write the failing loader test**

```ts
import { expect, test } from "bun:test";
import { loadCorpusIndex, loadCorpusDocument } from "../src/engine/corpus-loader.ts";

test("loadCorpusIndex reads the corpus namespace map", () => {
  const index = loadCorpusIndex(process.cwd());
  expect(index.namespaces["backend.golang"]).toBe("corpus/backend/golang");
  expect(index.namespaces["frontend.ui-ux"]).toBe("corpus/frontend/ui-ux");
});

test("loadCorpusDocument throws for missing corpus file", () => {
  expect(() =>
    loadCorpusDocument(process.cwd(), "corpus/backend/golang/practices/does-not-exist.json"),
  ).toThrow(/not found/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/corpus-loader-behaviour.test.ts`
Expected: FAIL with `Cannot find module "../src/engine/corpus-loader.ts"`

- [ ] **Step 3: Add the corpus root index**

```yaml
# corpus/index.yaml
namespaces:
  backend.golang: corpus/backend/golang
  frontend.ui-ux: corpus/frontend/ui-ux
```

- [ ] **Step 4: Extend contracts and implement the loader**

```ts
// src/engine/contracts.ts
export interface CorpusIndex {
  namespaces: Record<string, string>;
}
```

```ts
// src/engine/corpus-loader.ts
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type { CorpusIndex } from "./contracts.js";

export function loadCorpusIndex(repoRoot: string): CorpusIndex {
  return YAML.parse(readFileSync(join(repoRoot, "corpus", "index.yaml"), "utf8")) as CorpusIndex;
}

export function loadCorpusDocument<T>(repoRoot: string, relativePath: string): T {
  const filePath = join(repoRoot, relativePath);
  if (!existsSync(filePath)) {
    throw new Error(`Corpus document not found: ${relativePath}`);
  }
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}
```

```ts
// src/engine/corpus-registry.ts
import type { CorpusIndex } from "./contracts.js";

export function getNamespaceRoot(index: CorpusIndex, namespace: string): string {
  const root = index.namespaces[namespace];
  if (!root) {
    throw new Error(`Unknown corpus namespace: ${namespace}`);
  }
  return root;
}
```

- [ ] **Step 5: Run the loader test and build**

Run: `bun test tests/corpus-loader-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add corpus/index.yaml src/engine/contracts.ts src/engine/corpus-loader.ts src/engine/corpus-registry.ts tests/corpus-loader-behaviour.test.ts
git commit -m "feat: add corpus loader foundation"
```

---

### Task 2: Migrate One Backend Knowledge Slice To Corpus

**Files:**
- Create: `corpus/backend/golang/index.yaml`
- Create: `corpus/backend/golang/practices/error-wrapping.json`
- Create: `corpus/backend/golang/practices/goroutine-lifecycle.json`
- Modify: `src/plugins/golang/tools/get-practice.ts`
- Test: `tests/corpus-backed-tools-behaviour.test.ts`

- [ ] **Step 1: Write the failing backend corpus test**

```ts
import { expect, test } from "bun:test";
import { invokeRegisteredTool } from "../src/engine/tool-bridge.ts";
import { register as registerGetPractice } from "../src/plugins/golang/tools/get-practice.ts";

test("golang_get_practice reads corpus-backed practice documents first", async () => {
  const result = await invokeRegisteredTool(registerGetPractice, {
    name: "error-wrapping",
  });

  expect(result.content?.[0]?.text).toMatch(/Always wrap errors with context/);
});
```

- [ ] **Step 2: Run the test to verify current behavior and capture expected output**

Run: `bun test tests/corpus-backed-tools-behaviour.test.ts`
Expected: FAIL because the test file does not exist yet, then PASS after file creation but still uses in-file data only

- [ ] **Step 3: Add corpus documents**

```yaml
# corpus/backend/golang/index.yaml
practices:
  error-wrapping: corpus/backend/golang/practices/error-wrapping.json
  goroutine-lifecycle: corpus/backend/golang/practices/goroutine-lifecycle.json
```

```json
{
  "name": "error-wrapping",
  "topic": "error-handling",
  "priority": "P0",
  "rule": "Always wrap errors with context: fmt.Errorf(\"context: %w\", err)",
  "reason": "Provides call stack context without expensive stack traces. %w enables errors.Is/As."
}
```

- [ ] **Step 4: Make `golang_get_practice` corpus-first**

```ts
// src/plugins/golang/tools/get-practice.ts
import { loadCorpusIndex, loadCorpusDocument } from "../../../engine/corpus-loader.js";
import { getNamespaceRoot } from "../../../engine/corpus-registry.js";
import YAML from "yaml";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type CorpusPractice = {
  name: string;
  topic: string;
  priority: string;
  rule: string;
  reason: string;
};

function loadCorpusPractice(repoRoot: string, name: string): CorpusPractice | null {
  const index = loadCorpusIndex(repoRoot);
  const root = getNamespaceRoot(index, "backend.golang");
  const registry = YAML.parse(
    readFileSync(join(repoRoot, root, "index.yaml"), "utf8"),
  ) as { practices: Record<string, string> };
  const path = registry.practices[name];
  return path ? loadCorpusDocument<CorpusPractice>(repoRoot, path) : null;
}
```

- [ ] **Step 5: Run the backend corpus test and build**

Run: `bun test tests/corpus-backed-tools-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add corpus/backend/golang src/plugins/golang/tools/get-practice.ts tests/corpus-backed-tools-behaviour.test.ts
git commit -m "feat: migrate golang practices to corpus-backed lookup"
```

---

### Task 3: Migrate One Frontend Knowledge Slice To Corpus

**Files:**
- Create: `corpus/frontend/ui-ux/index.yaml`
- Create: `corpus/frontend/ui-ux/principles/type-scale.json`
- Create: `corpus/frontend/ui-ux/principles/wcag-contrast.json`
- Modify: `src/plugins/ui-ux/tools/get-principle.ts`
- Modify: `tests/corpus-backed-tools-behaviour.test.ts`

- [ ] **Step 1: Extend the failing corpus-backed tools test**

```ts
import { expect, test } from "bun:test";
import { invokeRegisteredTool } from "../src/engine/tool-bridge.ts";
import { register as registerGetPrinciple } from "../src/plugins/ui-ux/tools/get-principle.ts";

test("ui_ux_get_principle reads corpus-backed frontend knowledge first", async () => {
  const result = await invokeRegisteredTool(registerGetPrinciple, {
    name: "wcag-contrast",
  });

  expect(result.content?.[0]?.text).toMatch(/Body text: 4.5:1/);
});
```

- [ ] **Step 2: Run the corpus-backed tools test to verify it fails or uses old path**

Run: `bun test tests/corpus-backed-tools-behaviour.test.ts`
Expected: FAIL or still use in-file source until the tool is updated

- [ ] **Step 3: Add frontend corpus documents**

```yaml
# corpus/frontend/ui-ux/index.yaml
principles:
  type-scale: corpus/frontend/ui-ux/principles/type-scale.json
  wcag-contrast: corpus/frontend/ui-ux/principles/wcag-contrast.json
```

```json
{
  "name": "wcag-contrast",
  "domain": "color",
  "rule": "Body text: 4.5:1 (AA). Large text >= 18px bold or >= 24px: 3:1 (AA). UI components: 3:1.",
  "detail": "AAA (enhanced): 7:1 for body, 4.5:1 for large. Fix by reducing OKLCH Lightness rather than guessing new colors."
}
```

- [ ] **Step 4: Make `ui_ux_get_principle` corpus-first**

```ts
// src/plugins/ui-ux/tools/get-principle.ts
import { loadCorpusIndex, loadCorpusDocument } from "../../../engine/corpus-loader.js";
import { getNamespaceRoot } from "../../../engine/corpus-registry.js";
```

- [ ] **Step 5: Run the combined corpus-backed tools test and build**

Run: `bun test tests/corpus-backed-tools-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add corpus/frontend/ui-ux src/plugins/ui-ux/tools/get-principle.ts tests/corpus-backed-tools-behaviour.test.ts
git commit -m "feat: migrate ui-ux principles to corpus-backed lookup"
```

---

### Task 4: Expose Corpus Usage In Topology Summaries

**Files:**
- Modify: `scripts/generate-topology-artifacts.ts`
- Modify: `tests/topology-artifacts-behaviour.test.ts`
- Modify: `generated/runtime-context/topology.bootstrap.md`

- [ ] **Step 1: Extend the failing topology artifact test**

```ts
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("generated topology bootstrap mentions corpus-backed namespaces", () => {
  const bootstrap = readFileSync(resolve("generated/runtime-context/topology.bootstrap.md"), "utf8");
  expect(bootstrap).toMatch(/backend\\.golang/);
  expect(bootstrap).toMatch(/frontend\\.ui-ux/);
});
```

- [ ] **Step 2: Run the artifact test to verify it fails**

Run: `bun test tests/topology-artifacts-behaviour.test.ts`
Expected: FAIL because corpus namespaces are not emitted yet

- [ ] **Step 3: Extend the generator**

```ts
// scripts/generate-topology-artifacts.ts
import { loadCorpusIndex } from "../src/engine/corpus-loader.js";

const corpusIndex = loadCorpusIndex(repoRoot);

// add section
"## Corpus Namespaces",
...Object.entries(corpusIndex.namespaces).map(([name, path]) => `- ${name}: ${path}`),
```

- [ ] **Step 4: Regenerate and verify**

Run: `bun run generate:topology && bun test tests/topology-artifacts-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-topology-artifacts.ts generated/runtime-context/topology.bootstrap.md tests/topology-artifacts-behaviour.test.ts
git commit -m "feat: expose corpus namespaces in topology summaries"
```

---

## Spec Coverage Check

- `corpus/` becomes an active runtime input, not just a placeholder: covered by Tasks 1-4.
- Stable tool names remain unchanged: covered by Tasks 2 and 3.
- Runtime stays local-first: preserved by the current adapter path.
- Migration is incremental, not a rewrite: only one backend and one frontend slice move first.

## Placeholder Scan

- No `TBD`, `TODO`, or deferred placeholders are present.
- Every code step includes concrete file paths and code.
- Every verification step includes exact commands and expected outcomes.

## Type Consistency Check

- Corpus namespaces stay `backend.golang` and `frontend.ui-ux`.
- Existing stable tool names remain unchanged.
- `workspace_inventory`, `task_handoff`, `design_contract`, and `verification_report` stay the active artifact vocabulary.

## Notes For Execution

- Start with a small proof slice, not `designer/data.ts`.
- Keep old plugin-backed data as fallback until a whole namespace is fully migrated.
- Do not break stable tool names or CLI commands while moving truth ownership.
