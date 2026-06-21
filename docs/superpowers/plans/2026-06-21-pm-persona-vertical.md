# PM Persona Vertical Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `personas/` 4th vertical and a `product-manager` persona that owns the value+viability product risks via a tiered decision gate, grounded in verified PM-craft research.

**Architecture:** Three parts. **A** - a `product-manager` MCP plugin (pure `data.ts` + tools, mirrors the `optimizer` plugin: a framework menu, not implementations). **B** - the `personas/` vertical infrastructure (manifest schema + registry + a `Layer 4: Personas` section compiled into the bootstrap). **C** - the `pm-gate` skill + persona manifest + router wiring that bind plugin+skill+role into the tiered gate. Parts are review checkpoints; A is standalone, B is standalone (fixture-tested), C composes A+B.

**Tech Stack:** TypeScript (ESM, `.js` import specifiers), `@modelcontextprotocol/sdk`, `zod`, `bun:test`. No new dependencies.

**Branch:** `f-PE-pm-persona-vertical` (already created; spec + corpus already committed there).

**Source of truth for corpus content:** `docs/research/2026-06-21-pm-craft-corpus.json` (committed). All framework text below is transcribed from confirmed claims in that file.

---

## File Structure

```
PART A - plugin (testable, standalone)
  Create  src/plugins/product-manager/data.ts          types + framework data + resolver fns
  Create  src/plugins/product-manager/index.ts         Plugin export, registers 9 tools
  Create  src/plugins/product-manager/tools/*.ts        9 tool files (one register() each)
  Modify  src/index.ts                                  import + add to allPlugins
  Modify  tests/plugin-registry-behaviour.test.ts       13 -> 14; assert PM tools present
  Create  tests/product-manager-behaviour.test.ts        tool output assertions

PART B - personas vertical (testable, fixture)
  Create  personas/persona.schema.json                 manifest JSON Schema
  Create  personas/persona-registry.ts                 load + validate manifests
  Create  personas/README.md                           vertical overview
  Modify  skills/hyperstack/SKILL.md                    + '## Layer 4: Personas' + '## Persona Registry'
  Modify  src/internal/context-compiler.ts             extract/emit Personas + markers
  Regen   generated/runtime-context/hyperstack.bootstrap.md   via compile:context
  Create  tests/persona-registry-behaviour.test.ts      registry loads PM manifest

PART C - skill + binding (composes A+B)
  Create  personas/product-manager/persona.json        manifest binding plugin+skill+role
  Create  personas/product-manager/PROFILE.md          identity, owns value+viability, voice
  Create  personas/product-manager/LIFECYCLE.md        engage criteria, gate steps, handback
  Create  personas/product-manager/CHECKS.md           the falsifiable gate checklist
  Create  skills/pm-gate/SKILL.md                       tiered gate workflow
  Modify  harness/router.md, harness/transitions.md    persona-gate routing
```

---

# PART A - `product-manager` MCP plugin

> **Storage (revised during execution):** corpus prose is NOT inlined in `data.ts`.
> It lives in `src/plugins/product-manager/snippets/**.txt` loaded via
> `loader.ts` (`createSnippetLoader`), matching the dominant ecosystem pattern
> (react/golang/designer). `data.ts` keeps typed structure + logic and pulls prose
> via `snippet("...")`. Also required: a `product-manager` entry in
> `scripts/audit/sources.ts` (editorial, `skills: []` until Part C sets `["pm-gate"]`),
> enforced by `tests/audit-harness-behaviour.test.ts`. See the committed plugin
> for the authoritative shape.

### Task A1: Plugin data layer (types + frameworks + resolvers)

**Files:**
- Create: `src/plugins/product-manager/data.ts`
- Test: `tests/product-manager-behaviour.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/product-manager-behaviour.test.ts`:

```ts
import { test, expect } from "bun:test";
import {
  FOUR_RISKS,
  classifyOpportunityVsSolution,
  validateJobStatement,
  scoreRice,
  PM_OWNED_RISKS,
} from "../src/plugins/product-manager/data.ts";

test("four risks are exactly the canonical four", () => {
  expect(FOUR_RISKS.map((r) => r.id).sort()).toEqual(
    ["feasibility", "usability", "value", "viability"],
  );
});

test("PM owns exactly value and viability", () => {
  expect([...PM_OWNED_RISKS].sort()).toEqual(["value", "viability"]);
});

test("single-path statement is classified as a solution, not an opportunity", () => {
  const r = classifyOpportunityVsSolution("add a dark mode toggle");
  expect(r.isOpportunity).toBe(false);
});

test("multi-path statement is classified as an opportunity", () => {
  const r = classifyOpportunityVsSolution("users cannot find their past orders");
  expect(r.isOpportunity).toBe(true);
});

test("job statement missing context fails validation", () => {
  const r = validateJobStatement("I want a faster app");
  expect(r.valid).toBe(false);
  expect(r.failed.length).toBeGreaterThan(0);
});

test("rice score is (reach*impact*confidence)/effort", () => {
  expect(scoreRice({ reach: 100, impact: 2, confidence: 0.8, effort: 4 }).score).toBeCloseTo(40);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/product-manager-behaviour.test.ts`
Expected: FAIL - cannot find module `../src/plugins/product-manager/data.ts`.

- [ ] **Step 3: Write `src/plugins/product-manager/data.ts`**

```ts
// Product-Manager persona - the PM DECISION MENU, not project opinions.
//
// Carries only stable, source-cited PM craft (Cagan/SVPG, Torres, Intercom,
// Christensen, Doshi) transcribed from docs/research/2026-06-21-pm-craft-corpus.json.
// Tools surface these frameworks so the agent makes grounded value+viability
// calls before design/build. No project-specific product opinions live here.

export interface ProductRisk {
  id: "value" | "usability" | "feasibility" | "viability";
  question: string;
  owner: "product-manager" | "designer" | "engineer";
}

export const FOUR_RISKS: ProductRisk[] = [
  { id: "value",       question: "Will customers buy it, or will users choose to use it?", owner: "product-manager" },
  { id: "usability",   question: "Can users figure out how to use it?", owner: "designer" },
  { id: "feasibility", question: "Can engineers build it with available time, skills, and tech?", owner: "engineer" },
  { id: "viability",   question: "Does it work for the business - legal, sales, finance, marketing, support?", owner: "product-manager" },
];

export const PM_OWNED_RISKS: ReadonlySet<string> = new Set(
  FOUR_RISKS.filter((r) => r.owner === "product-manager").map((r) => r.id),
);

export interface AntiPattern {
  id: string;
  smell: string;
  source: string;
}

export const ANTI_PATTERNS: AntiPattern[] = [
  { id: "feature-factory", smell: "Shipping as many stakeholder features as possible. Cagan: that is 'really no product strategy at all.'", source: "Cagan/SVPG" },
  { id: "reactivity", smell: "Driven by reacting to sales, competitors, requests, or price pressure instead of a product vision.", source: "Cagan/SVPG" },
  { id: "viability-avoidance", smell: "Reasoning covers value/desirability but is silent on whether the business can sell, support, fund, or legally ship it.", source: "Cagan/SVPG" },
  { id: "execution-misdiagnosis", smell: "Treating a strategy, interpersonal, OR culture problem as an execution problem and band-aiding it.", source: "Doshi" },
  { id: "opinion-requirement", smell: "A requirement justified by 'a customer said they want X' (opinion/hypothetical) instead of an observed past-behaviour story.", source: "Torres / The Mom Test" },
];

export const DISCOVERY_RULES: string[] = [
  "Engage customers continuously (aspirationally weekly); minimize build decisions made without customer evidence.",
  "Never ask customers what they want or need - cognitive biases make opinion answers unreliable.",
  "Elicit needs, pains, and desires through specific PAST-BEHAVIOUR stories.",
  "Demographics do not predict intent; the JOB the customer hires the product for does.",
];

export const STRATEGY_RULES: string[] = [
  "Strategy decides which problems to solve NOW by focusing on a FEW (2-3) critical business levers.",
  "Prioritization is an act of saying NO: focus means rejecting the hundred other good ideas.",
  "A 'strategy' that is a long list rejecting nothing is not a strategy.",
];

export interface Jtbd {
  definition: string;
  dimensions: string[];
  fourForces: { push: string[]; resist: string[]; rule: string };
}

export const JTBD: Jtbd = {
  definition: "A job is the PROGRESS a person wants to make under specific circumstances - a process, not a single action.",
  dimensions: ["functional", "emotional", "social"],
  fourForces: {
    push: ["frustration with the status quo (F1)", "attraction to the new solution (F2)"],
    resist: ["anxiety of learning the new (F3)", "habit/comfort of the current solution (F4)"],
    rule: "A switch happens only when Push + Pull > Anxiety + Habit.",
  },
};

// JTBD job-statement validator - the regex-checkable SUBSET (context, progress,
// not-a-single-solution). The full 7-point checklist (e.g. "not a trend",
// "appropriate abstraction") is not mechanically testable and is a Phase 2 item.
export interface JobCheck { id: string; test: (s: string) => boolean; failHint: string; }

export const JOB_CHECKS: JobCheck[] = [
  { id: "has-context", test: (s) => /\b(when|while|after|before|during|because)\b/i.test(s), failHint: "missing context (when/while/because ...)" },
  { id: "not-single-solution", test: (s) => !/\b(button|toggle|page|dropdown|API|endpoint|screen)\b/i.test(s), failHint: "names a specific solution, not a job" },
  { id: "expresses-progress", test: (s) => /\b(so that|in order to|to|need|want to)\b/i.test(s), failHint: "does not express the progress sought" },
];

export interface JobValidation { valid: boolean; passed: string[]; failed: { id: string; failHint: string }[]; }

export function validateJobStatement(statement: string): JobValidation {
  const passed: string[] = [];
  const failed: { id: string; failHint: string }[] = [];
  for (const c of JOB_CHECKS) {
    if (c.test(statement)) passed.push(c.id);
    else failed.push({ id: c.id, failHint: c.failHint });
  }
  return { valid: failed.length === 0, passed, failed };
}

export interface OppClassification { isOpportunity: boolean; reason: string; }

// Torres test: "is there more than one way to address this?" If a statement
// names a single concrete mechanism, it is a solution disguised as a problem.
const SOLUTION_MARKERS = /\b(add|build|create|implement|use|toggle|button|dropdown|dark mode|integrate)\b/i;

export function classifyOpportunityVsSolution(statement: string): OppClassification {
  if (SOLUTION_MARKERS.test(statement)) {
    return { isOpportunity: false, reason: "Names a single concrete mechanism. Restate as the underlying need it serves (there should be more than one way to address it)." };
  }
  return { isOpportunity: true, reason: "Stated as a need/pain with more than one possible solution." };
}

export interface RiceInput { reach: number; impact: number; confidence: number; effort: number; }
export interface RiceResult { score: number; formula: string; }

export function scoreRice(i: RiceInput): RiceResult {
  const score = (i.reach * i.impact * i.confidence) / i.effort;
  return { score, formula: "(Reach x Impact x Confidence) / Effort" };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/product-manager-behaviour.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/plugins/product-manager/data.ts tests/product-manager-behaviour.test.ts
git commit -m "feat(product-manager): plugin data layer - four risks, JTBD, RICE, validators"
```

---

### Task A2: Lookup tools (`get_four_risks`, `get_jtbd`, `get_discovery_rules`, `get_anti_patterns`, `get_strategy_rules`)

These five tools share one shape: format a `data.ts` export into markdown. Each is its own file and `register()`.

**Files:**
- Create: `src/plugins/product-manager/tools/get-four-risks.ts`
- Create: `src/plugins/product-manager/tools/get-jtbd.ts`
- Create: `src/plugins/product-manager/tools/get-discovery-rules.ts`
- Create: `src/plugins/product-manager/tools/get-anti-patterns.ts`
- Create: `src/plugins/product-manager/tools/get-strategy-rules.ts`
- Test: `tests/product-manager-behaviour.test.ts` (append)

- [ ] **Step 1: Append failing tests**

```ts
import { captureTool, extractTextContent } from "./helpers.ts";
import { register as getFourRisks } from "../src/plugins/product-manager/tools/get-four-risks.ts";
import { register as getAntiPatterns } from "../src/plugins/product-manager/tools/get-anti-patterns.ts";

test("get_four_risks names value and viability as PM-owned", async () => {
  const tool = captureTool(getFourRisks);
  expect(tool.name).toBe("product_manager_get_four_risks");
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/value/i);
  expect(text).toMatch(/viability/i);
  expect(text).toMatch(/product-manager/);
});

test("get_anti_patterns includes the feature-factory smell", async () => {
  const tool = captureTool(getAntiPatterns);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/feature-factory/);
});
```

- [ ] **Step 2: Run to verify fail**

Run: `bun test tests/product-manager-behaviour.test.ts`
Expected: FAIL - cannot find the tool modules.

- [ ] **Step 3: Implement the five tools**

`src/plugins/product-manager/tools/get-four-risks.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FOUR_RISKS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_four_risks",
    "The four product risks every build must address before shipping (Cagan/SVPG): value, usability, feasibility, viability - with which role owns each. The PM owns value and viability.",
    {},
    async () => {
      let text = `# The Four Product Risks\n\nAddress all four before building. The PM is accountable for **value** and **viability**.\n\n| risk | question | owner |\n|---|---|---|\n`;
      for (const r of FOUR_RISKS) text += `| ${r.id} | ${r.question} | ${r.owner} |\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
```

`src/plugins/product-manager/tools/get-anti-patterns.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ANTI_PATTERNS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_anti_patterns",
    "Codifiable PM red flags (Cagan, Doshi): feature-factory, reactivity, viability-avoidance, execution-misdiagnosis, opinion-requirement. Use to flag weak product reasoning.",
    {},
    async () => {
      let text = `# PM Anti-Patterns (red flags)\n\n`;
      for (const a of ANTI_PATTERNS) text += `## ${a.id}\n${a.smell}  \n_source: ${a.source}_\n\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
```

`src/plugins/product-manager/tools/get-jtbd.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { JTBD } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_jtbd",
    "Jobs-To-Be-Done framing (Christensen): a job is progress-in-context across functional/emotional/social dimensions, plus the Four Forces switching rule. Use to reframe a feature request as the underlying job.",
    {},
    async () => {
      const f = JTBD.fourForces;
      const text =
        `# Jobs To Be Done\n\n${JTBD.definition}\n\n` +
        `**Dimensions:** ${JTBD.dimensions.join(", ")}\n\n` +
        `## Four Forces of Progress\n- Push: ${f.push.join("; ")}\n- Resist: ${f.resist.join("; ")}\n\n**${f.rule}**\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
```

`src/plugins/product-manager/tools/get-discovery-rules.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DISCOVERY_RULES } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_discovery_rules",
    "Continuous-discovery rules (Torres): weekly customer contact, never ask 'what do you want', elicit past-behaviour stories. Use before claiming a build is customer-grounded.",
    {},
    async () => {
      const text = `# Discovery Rules\n\n${DISCOVERY_RULES.map((r) => `- ${r}`).join("\n")}\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
```

`src/plugins/product-manager/tools/get-strategy-rules.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { STRATEGY_RULES } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_strategy_rules",
    "Product-strategy rules (Cagan): focus on 2-3 levers, saying no is the act of prioritization, a long list is a non-strategy. Use to cut scope.",
    {},
    async () => {
      const text = `# Strategy Rules\n\n${STRATEGY_RULES.map((r) => `- ${r}`).join("\n")}\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `bun test tests/product-manager-behaviour.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/plugins/product-manager/tools/get-four-risks.ts src/plugins/product-manager/tools/get-jtbd.ts src/plugins/product-manager/tools/get-discovery-rules.ts src/plugins/product-manager/tools/get-anti-patterns.ts src/plugins/product-manager/tools/get-strategy-rules.ts tests/product-manager-behaviour.test.ts
git commit -m "feat(product-manager): five framework-lookup tools"
```

---

### Task A3: Logic tools (`opportunity_vs_solution`, `validate_job_statement`, `score_rice`)

**Files:**
- Create: `src/plugins/product-manager/tools/opportunity-vs-solution.ts`
- Create: `src/plugins/product-manager/tools/validate-job-statement.ts`
- Create: `src/plugins/product-manager/tools/score-rice.ts`
- Test: `tests/product-manager-behaviour.test.ts` (append)

- [ ] **Step 1: Append failing tests**

```ts
import { register as oppVsSol } from "../src/plugins/product-manager/tools/opportunity-vs-solution.ts";
import { register as scoreRiceTool } from "../src/plugins/product-manager/tools/score-rice.ts";

test("opportunity_vs_solution flags a solution-shaped statement", async () => {
  const tool = captureTool(oppVsSol);
  expect(tool.name).toBe("product_manager_opportunity_vs_solution");
  const text = extractTextContent(await tool.invoke({ statement: "add a dark mode toggle" }));
  expect(text).toMatch(/solution/i);
});

test("score_rice renders the computed score", async () => {
  const tool = captureTool(scoreRiceTool);
  const text = extractTextContent(await tool.invoke({ reach: 100, impact: 2, confidence: 0.8, effort: 4 }));
  expect(text).toMatch(/40/);
});
```

- [ ] **Step 2: Run to verify fail**

Run: `bun test tests/product-manager-behaviour.test.ts`
Expected: FAIL - modules not found.

- [ ] **Step 3: Implement the three tools**

`src/plugins/product-manager/tools/opportunity-vs-solution.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { classifyOpportunityVsSolution } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_opportunity_vs_solution",
    "Torres test: is a statement a real opportunity (a need with more than one way to address it) or a solution in disguise? Rejects premature solution-jumping.",
    { statement: z.string().describe("The problem/feature statement to classify.") },
    async ({ statement }) => {
      const r = classifyOpportunityVsSolution(statement);
      const verdict = r.isOpportunity ? "OPPORTUNITY" : "SOLUTION (reframe needed)";
      return { content: [{ type: "text" as const, text: `# ${verdict}\n\n**Statement:** ${statement}\n\n${r.reason}\n` }] };
    },
  );
}
```

`src/plugins/product-manager/tools/validate-job-statement.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { validateJobStatement } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_validate_job_statement",
    "Validate a JTBD job statement against the falsifiable checklist (has context, expresses progress, not a single solution). Returns pass/fail per check.",
    { statement: z.string().describe("The job statement to validate.") },
    async ({ statement }) => {
      const r = validateJobStatement(statement);
      let text = `# Job statement: ${r.valid ? "VALID" : "INVALID"}\n\n**Statement:** ${statement}\n\n`;
      text += `Passed: ${r.passed.join(", ") || "none"}\n\n`;
      if (r.failed.length) text += `Failed:\n${r.failed.map((f) => `- ${f.id}: ${f.failHint}`).join("\n")}\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
```

`src/plugins/product-manager/tools/score-rice.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { scoreRice } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_score_rice",
    "Compute a RICE prioritization score = (Reach x Impact x Confidence) / Effort (Intercom). Confidence is 0-1. Use to rank competing initiatives.",
    {
      reach: z.number().describe("People affected per time period."),
      impact: z.number().describe("Per-person impact (e.g. 3=massive,2=high,1=medium,0.5=low,0.25=minimal)."),
      confidence: z.number().describe("Confidence 0-1 (1.0=high, 0.8=medium, 0.5=low)."),
      effort: z.number().describe("Person-months (or any consistent effort unit)."),
    },
    async ({ reach, impact, confidence, effort }) => {
      const r = scoreRice({ reach, impact, confidence, effort });
      return { content: [{ type: "text" as const, text: `# RICE score: ${r.score.toFixed(2)}\n\n\`${r.formula}\` = (${reach} x ${impact} x ${confidence}) / ${effort}\n` }] };
    },
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `bun test tests/product-manager-behaviour.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/plugins/product-manager/tools/opportunity-vs-solution.ts src/plugins/product-manager/tools/validate-job-statement.ts src/plugins/product-manager/tools/score-rice.ts tests/product-manager-behaviour.test.ts
git commit -m "feat(product-manager): logic tools - opportunity test, job validator, RICE"
```

---

### Task A4: Orchestrator tool (`resolve_product_decision`) + plugin index + wiring

**Files:**
- Create: `src/plugins/product-manager/tools/resolve-product-decision.ts`
- Create: `src/plugins/product-manager/index.ts`
- Modify: `src/index.ts` (import + `allPlugins`)
- Modify: `tests/plugin-registry-behaviour.test.ts:23` (13 -> 14) and add PM presence test
- Test: `tests/product-manager-behaviour.test.ts` (append)

- [ ] **Step 1: Append failing tests**

In `tests/product-manager-behaviour.test.ts`:

```ts
import { register as resolveDecision } from "../src/plugins/product-manager/tools/resolve-product-decision.ts";

test("resolve_product_decision emits a verdict and the four risks", async () => {
  const tool = captureTool(resolveDecision);
  expect(tool.name).toBe("product_manager_resolve_product_decision");
  const text = extractTextContent(await tool.invoke({ description: "add a dark mode toggle" }));
  expect(text).toMatch(/VERDICT|NEEDS-INPUT|BLOCK|PASS/);
  expect(text).toMatch(/viability/i);
});
```

In `tests/plugin-registry-behaviour.test.ts`, change the count assertion and add a presence test:

```ts
test("all 14 plugins register at least one tool", () => {
  const tools = getRegisteredTools();
  const pluginPrefixes = new Set(tools.map((t) => t.name.split("_")[0]));
  expect(pluginPrefixes.size).toBe(14);
});

test("product-manager plugin registers its gate tools", () => {
  const tools = getRegisteredTools();
  const toolNames = new Set(tools.map((t) => t.name));
  expect(toolNames.has("product_manager_get_four_risks")).toBe(true);
  expect(toolNames.has("product_manager_resolve_product_decision")).toBe(true);
});
```

(Delete the old `"all 13 plugins..."` test block - it is replaced by the 14 version above.)

- [ ] **Step 2: Run to verify fail**

Run: `bun test tests/product-manager-behaviour.test.ts tests/plugin-registry-behaviour.test.ts`
Expected: FAIL - orchestrator module missing; registry still sees 13.

- [ ] **Step 3a: Implement the orchestrator**

`src/plugins/product-manager/tools/resolve-product-decision.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FOUR_RISKS, classifyOpportunityVsSolution } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_resolve_product_decision",
    "The PM gate engine. Takes a build/feature description and returns a structured product decision: opportunity framing, four-risks assessment (esp value+viability), and a PASS/BLOCK/NEEDS-INPUT verdict the gate enforces.",
    {
      description: z.string().describe("What is being proposed to build."),
      isNetNew: z.boolean().optional().describe("True for a net-new feature/product (hard gate); false for a tweak (advisory)."),
    },
    async ({ description, isNetNew }) => {
      const opp = classifyOpportunityVsSolution(description);
      let text = `# Product Decision\n\n**Proposal:** ${description}\n\n`;
      text += `## 1. Opportunity framing\n${opp.isOpportunity ? "Framed as an opportunity." : "SOLUTION in disguise - reframe to the underlying need."} ${opp.reason}\n\n`;
      text += `## 2. Four-risks assessment (fill before proceeding)\n`;
      for (const r of FOUR_RISKS) text += `- **${r.id}** (${r.owner}): ${r.question}  -> _unassessed_\n`;
      text += `\n## 3. Verdict\n`;
      const gate = isNetNew === false ? "ADVISORY" : "HARD";
      if (!opp.isOpportunity) {
        text += `NEEDS-INPUT (${gate}): restate as an opportunity, then assess value + viability before build.\n`;
      } else {
        text += `NEEDS-INPUT (${gate}): assess all four risks - especially value and viability - and state the prioritized call with a rationale. PASS only when value+viability are addressed.\n`;
      }
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
```

- [ ] **Step 3b: Implement the plugin index**

`src/plugins/product-manager/index.ts`:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as getFourRisks } from "./tools/get-four-risks.js";
import { register as getJtbd } from "./tools/get-jtbd.js";
import { register as getDiscoveryRules } from "./tools/get-discovery-rules.js";
import { register as getAntiPatterns } from "./tools/get-anti-patterns.js";
import { register as getStrategyRules } from "./tools/get-strategy-rules.js";
import { register as opportunityVsSolution } from "./tools/opportunity-vs-solution.js";
import { register as validateJobStatement } from "./tools/validate-job-statement.js";
import { register as scoreRice } from "./tools/score-rice.js";
import { register as resolveProductDecision } from "./tools/resolve-product-decision.js";

function register(server: McpServer): void {
  getFourRisks(server);
  getJtbd(server);
  getDiscoveryRules(server);
  getAntiPatterns(server);
  getStrategyRules(server);
  opportunityVsSolution(server);
  validateJobStatement(server);
  scoreRice(server);
  resolveProductDecision(server);
}

export const productManagerPlugin: Plugin = {
  name: "product-manager",
  register,
};
```

- [ ] **Step 3c: Wire into `src/index.ts`**

Add the import beside the other plugin imports:

```ts
import { productManagerPlugin } from "./plugins/product-manager/index.js";
```

Add to the `allPlugins` array (after `optimizerPlugin`):

```ts
  optimizerPlugin,
  productManagerPlugin,
];
```

- [ ] **Step 4: Run the full suite**

Run: `bun test`
Expected: PASS, including the updated `all 14 plugins` and PM presence tests.

- [ ] **Step 5: Commit**

```bash
git add src/plugins/product-manager/tools/resolve-product-decision.ts src/plugins/product-manager/index.ts src/index.ts tests/plugin-registry-behaviour.test.ts tests/product-manager-behaviour.test.ts
git commit -m "feat(product-manager): orchestrator gate tool + register plugin (14th)"
```

**Part A checkpoint:** the `product-manager` plugin ships 9 callable tools. Reviewable independently.

---

# PART B - `personas/` vertical infrastructure

### Task B1: Manifest schema + registry

**Files:**
- Create: `personas/persona.schema.json`
- Create: `personas/persona-registry.ts`
- Test: `tests/persona-registry-behaviour.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/persona-registry-behaviour.test.ts`:

```ts
import { test, expect } from "bun:test";
import { loadPersonas } from "../personas/persona-registry.ts";

test("registry loads the product-manager persona manifest", () => {
  const personas = loadPersonas();
  const pm = personas.find((p) => p.id === "product-manager");
  expect(pm).toBeDefined();
  expect(pm!.owns.risks.sort()).toEqual(["value", "viability"]);
  expect(pm!.gate_policy.net_new).toBe("hard");
});

test("a malformed manifest is skipped, not thrown", () => {
  expect(() => loadPersonas()).not.toThrow();
});
```

- [ ] **Step 2: Run to verify fail**

Run: `bun test tests/persona-registry-behaviour.test.ts`
Expected: FAIL - `personas/persona-registry.ts` missing (and the manifest, created in Part C, also missing - this test fully passes after Task C1; it asserts the registry mechanism here).

- [ ] **Step 3a: Write the schema**

`personas/persona.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Hyperstack Persona Manifest",
  "type": "object",
  "required": ["id", "name", "version", "owns", "engages_when", "gate_policy"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z][a-z0-9-]*$" },
    "name": { "type": "string" },
    "version": { "type": "string" },
    "owns": {
      "type": "object",
      "required": ["risks", "plugin", "skills", "agent"],
      "properties": {
        "risks": { "type": "array", "items": { "type": "string" } },
        "plugin": { "type": "string" },
        "skills": { "type": "array", "items": { "type": "string" } },
        "agent": { "type": "string" }
      }
    },
    "engages_when": { "type": "array", "items": { "type": "string" } },
    "gate_policy": {
      "type": "object",
      "required": ["net_new", "tweak", "override"],
      "properties": {
        "net_new": { "enum": ["hard", "advisory"] },
        "tweak": { "enum": ["hard", "advisory"] },
        "override": { "type": "string" }
      }
    }
  }
}
```

- [ ] **Step 3b: Write the registry**

`personas/persona-registry.ts`:

```ts
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const personasDir = dirname(fileURLToPath(import.meta.url));

export interface PersonaManifest {
  id: string;
  name: string;
  version: string;
  owns: { risks: string[]; plugin: string; skills: string[]; agent: string };
  engages_when: string[];
  gate_policy: { net_new: "hard" | "advisory"; tweak: "hard" | "advisory"; override: string };
}

function isValid(m: unknown): m is PersonaManifest {
  const p = m as Partial<PersonaManifest>;
  return !!p && typeof p.id === "string" && !!p.owns && Array.isArray(p.owns.risks) && !!p.gate_policy;
}

export function loadPersonas(): PersonaManifest[] {
  const out: PersonaManifest[] = [];
  for (const entry of readdirSync(personasDir)) {
    const manifestPath = join(personasDir, entry, "persona.json");
    if (!existsSync(manifestPath) || !statSync(join(personasDir, entry)).isDirectory()) continue;
    try {
      const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
      if (isValid(parsed)) out.push(parsed);
      else console.error(`Persona manifest invalid, skipped: ${manifestPath}`);
    } catch (err) {
      console.error(`Persona manifest unreadable, skipped: ${manifestPath}:`, err);
    }
  }
  return out;
}
```

- [ ] **Step 4: Run**

Run: `bun test tests/persona-registry-behaviour.test.ts`
Expected: the "malformed skipped / not throw" test PASSES; the "loads product-manager" test FAILS until Task C1 creates the manifest. That is expected sequencing - leave it failing, it goes green in Part C.

- [ ] **Step 5: Commit**

```bash
git add personas/persona.schema.json personas/persona-registry.ts tests/persona-registry-behaviour.test.ts
git commit -m "feat(personas): manifest schema + resilient persona registry"
```

---

### Task B2: Bootstrap `Layer 4: Personas` (SKILL.md + compiler + regen)

**Files:**
- Modify: `skills/hyperstack/SKILL.md` (add two sections)
- Modify: `src/internal/context-compiler.ts` (extract + emit + markers)
- Modify: `generated/runtime-context/hyperstack.bootstrap.md` (regenerated, do not hand-edit)
- Test: `tests/context-compiler-behaviour.test.ts` (append)

- [ ] **Step 1: Append the failing test**

In `tests/context-compiler-behaviour.test.ts`, extend the inline `source` fixture (add before the closing backtick of the template) with:

```
## Layer 4: Personas

- product-manager - owns value+viability; hard-gates net-new builds

## Persona Registry

- product-manager - PM decision gate (plugin product-manager + skill pm-gate)
```

Then add an assertion in the first test after the existing `expect(content.length)...` line:

```ts
  expect(content).toMatch(/Personas/);
  expect(content).toMatch(/product-manager/);
```

- [ ] **Step 2: Run to verify fail**

Run: `bun test tests/context-compiler-behaviour.test.ts`
Expected: FAIL - compiler does not yet extract a Personas section, and the live SKILL.md/bootstrap sync test fails once you edit SKILL.md (Step 3b/3c order matters; do all edits then regen).

- [ ] **Step 3a: Add sections to `skills/hyperstack/SKILL.md`**

Insert after the `## Disallowed Transitions` section (before `## The Rationalization Catalog`):

```markdown
## Layer 4: Personas

Personas are judgment lenses that OWN a class of decision and gate it before
execution. They are internal and auto-engaged by `hyper`.

| Persona | Owns | Gate |
|---|---|---|
| `product-manager` | value + viability product risk | hard for net-new builds, advisory for tweaks, user override always |

## Persona Registry

- `product-manager` - grounds build decisions in validated customer problems
  (opportunity-vs-solution, four risks, RICE), owns value+viability, hands back
  to `hyper`. Engaged before design/build on net-new feature/product/scope work.
```

- [ ] **Step 3b: Extend the compiler** (`src/internal/context-compiler.ts`)

Add two markers to `REQUIRED_BOOTSTRAP_MARKERS` (after the `"website-builder"` entry):

```ts
  "Layer 4: Personas",
  "product-manager",
```

In `compileUsingHyperstackBootstrap`, after the `roleRegistry` line, add:

```ts
  const personas = extractSimpleBullets(extractSection(body, "Persona Registry"));
```

In the `content` array, insert a Personas block after the Internal Roles block (after the `...roleRegistry,` group and its trailing `"",`):

```ts
    "## Personas",
    "- Personas are internal judgment lenses that own and gate a decision class.",
    ...personas,
    "",
```

- [ ] **Step 3c: Regenerate the bootstrap artifact**

Run: `bun run compile:context`
Expected stdout: "Compiled runtime context artifacts: - .../hyperstack.bootstrap.md" and a char-savings line. This rewrites `generated/runtime-context/hyperstack.bootstrap.md` so the sync test matches.

- [ ] **Step 4: Run the full suite**

Run: `bun test`
Expected: PASS, including `generated bootstrap artifact stays in sync` and the new Personas assertions.

- [ ] **Step 5: Commit**

```bash
git add skills/hyperstack/SKILL.md src/internal/context-compiler.ts generated/runtime-context/hyperstack.bootstrap.md tests/context-compiler-behaviour.test.ts
git commit -m "feat(personas): compile Layer 4 Personas into the runtime bootstrap"
```

**Part B checkpoint:** the bootstrap now carries a Personas layer; the registry loads manifests. Reviewable independently (PM-manifest test still pending Part C).

---

# PART C - `pm-gate` skill + persona binding + router

### Task C1: Persona manifest + role contracts

**Files:**
- Create: `personas/product-manager/persona.json`
- Create: `personas/product-manager/PROFILE.md`
- Create: `personas/product-manager/LIFECYCLE.md`
- Create: `personas/product-manager/CHECKS.md`
- Create: `personas/README.md`

- [ ] **Step 1: Create the manifest** `personas/product-manager/persona.json`

```json
{
  "id": "product-manager",
  "name": "Product Manager",
  "version": "0.1.0",
  "owns": {
    "risks": ["value", "viability"],
    "plugin": "product-manager",
    "skills": ["pm-gate"],
    "agent": "product-manager"
  },
  "engages_when": ["net-new feature", "new product", "build request", "scope decision"],
  "gate_policy": { "net_new": "hard", "tweak": "advisory", "override": "user-explicit" }
}
```

- [ ] **Step 2: Create `personas/product-manager/PROFILE.md`**

```markdown
---
id: product-manager
kind: persona
owns:
  - value risk (will users choose it)
  - viability risk (does it work for the business)
delegates_to:
  - hyper
must_not_do:
  - approve a net-new build without value + viability addressed
  - ask customers what they want instead of eliciting past-behaviour stories
  - let a solution masquerade as a validated problem
---

# Product Manager Persona

## Mission

Ground every build decision in a validated customer problem, make the prioritized
call, and own value + viability before design or engineering begins.

## Voice

Opinionated and evidence-backed. States a recommendation with a rationale, never
hedges with "here are five options". Cites the customer problem and the business
case. Says no to good ideas that are not the lever.

## Authority

- Owns the value and viability product risks (Cagan four-risks split).
- Engaged by `hyper` before specialists on net-new build/scope work.
- Hands back to `hyper` for routing, verification, and ship-gate. Never self-ships.
```

- [ ] **Step 3: Create `personas/product-manager/LIFECYCLE.md`**

```markdown
# Product Manager Persona Lifecycle

## Engage when
- net-new feature, new product, build request, or scope decision (hard gate)
- tweak/bugfix/refactor (advisory only)

## Gate steps
1. Frame: `product_manager_opportunity_vs_solution` - reject solutions-in-disguise.
2. Ground: confirm customer evidence; flag opinion-requirements (`get_discovery_rules`).
3. Assess: `product_manager_get_four_risks` - especially value + viability.
4. Prioritize: `product_manager_score_rice` / strategy rules - state the one call.
5. Emit: `product_manager_resolve_product_decision` -> PASS | BLOCK | NEEDS-INPUT + rationale.

## Verdicts
- PASS: value + viability addressed, prioritized call has a rationale -> hand to `hyper`.
- BLOCK: hard gate, a required risk unaddressed -> stop, report what is missing.
- NEEDS-INPUT: ambiguity -> ask the user; never silently pass.

## Override
- User may explicitly say "skip PM" -> honour, log the override in the decision trail.

## Handback
- Always return to `hyper` for routing and ship-gate. The persona never delivers.
```

- [ ] **Step 4: Create `personas/product-manager/CHECKS.md`**

```markdown
# Product Manager Gate Checks (falsifiable)

- [ ] Statement is an OPPORTUNITY, not a solution in disguise (more than one way to address it).
- [ ] Customer evidence exists; no requirement rests on "they said they want X".
- [ ] VALUE risk addressed: will users choose it?
- [ ] VIABILITY risk addressed: can the business sell/support/fund/legally ship it?
- [ ] A single prioritized call is stated, with a rationale (not a feature list).
- [ ] Scope cut: what is explicitly NOT being built and why.
```

- [ ] **Step 5: Create `personas/README.md`**

```markdown
# Personas (Layer 4)

Personas are judgment lenses that own and gate a class of decision before
execution. Each persona binds an MCP plugin (ground-truth), one or more skills
(process + gate), and a role identity via `persona.json`. The persona registry
(`persona-registry.ts`) loads manifests; the bootstrap compiles a Personas layer
so `hyper` knows which personas exist and when they engage.

| Persona | Owns | First |
|---|---|---|
| `product-manager` | value + viability product risk | yes |
```

- [ ] **Step 6: Run the registry test (now goes green)**

Run: `bun test tests/persona-registry-behaviour.test.ts`
Expected: PASS - both tests, including "loads the product-manager persona manifest".

- [ ] **Step 7: Commit**

```bash
git add personas/product-manager/ personas/README.md
git commit -m "feat(personas): product-manager manifest + role contracts"
```

---

### Task C2: `pm-gate` skill

**Files:**
- Create: `skills/pm-gate/SKILL.md`
- Test: `tests/skills-index-behaviour.test.ts` (verify it still passes / regenerate index if needed)

- [ ] **Step 1: Create `skills/pm-gate/SKILL.md`**

```markdown
---
name: pm-gate
description: Use BEFORE any net-new feature, product, or scope decision - the product-manager persona gate. Grounds the build in a validated customer problem (opportunity-vs-solution, four risks, prioritized call) and emits PASS/BLOCK/NEEDS-INPUT before design or engineering. Advisory for tweaks; user can override.
category: core
---

# PM Gate

The product-manager persona's gate. It owns the value and viability product risks
that nothing else in Hyperstack owns. It runs BEFORE designer/blueprint on net-new
work.

## Iron Law

```
NO NET-NEW BUILD WITHOUT A PASSED PRODUCT DECISION
(value + viability addressed, prioritized call stated with a rationale)
```

## When

| Request | Gate |
|---|---|
| net-new feature / product / scope decision | HARD - must PASS before design/build |
| tweak / bugfix / refactor | ADVISORY - emit brief, do not block |
| user says "skip PM" | OVERRIDE - honour, log it |

## Steps (MCP-grounded - call the tools, do not reason from memory)

1. `product_manager_opportunity_vs_solution(statement)` - reject a solution-in-disguise.
2. `product_manager_get_discovery_rules()` - confirm customer evidence; flag opinion-requirements.
3. `product_manager_get_four_risks()` - assess all four, especially VALUE and VIABILITY.
4. `product_manager_score_rice(...)` and `product_manager_get_strategy_rules()` - state the one call, cut scope.
5. `product_manager_resolve_product_decision(description, isNetNew)` - emit the verdict.

## Verdict handling

- PASS -> hand to `hyper`; proceed to designer/blueprint.
- BLOCK -> stop; report the unaddressed risk; do not route to build.
- NEEDS-INPUT -> ask the user the specific missing question.

## Red flags (from the corpus)

- "A customer said they want X" used as a requirement -> opinion, not evidence.
- Reasoning covers value but is silent on viability -> the named weak-PM failure.
- "Strategy" that is a long feature list rejecting nothing -> not a strategy.
- Treating a strategy/interpersonal/culture problem as an execution problem.
```

- [ ] **Step 2: Regenerate the skills index (if the repo tracks it)**

Run: `bun scripts/generate-skills-index.ts` (or `npm run skills:index`)
Expected: `skills/INDEX.md` regenerated to include `pm-gate` under Core.

- [ ] **Step 3: Run the suite**

Run: `bun test`
Expected: PASS - `skills-index-behaviour.test.ts` consistent with the regenerated index.

- [ ] **Step 4: Commit**

```bash
git add skills/pm-gate/SKILL.md skills/INDEX.md
git commit -m "feat(pm-gate): product-manager persona gate skill"
```

---

### Task C3: Router + transitions wiring

**Files:**
- Modify: `harness/router.md`
- Modify: `harness/transitions.md`
- Test: `tests/role-harness-behaviour.test.ts` (run; update if it asserts an exact transition set)

- [ ] **Step 1: Run the existing role-harness test to see current assertions**

Run: `bun test tests/role-harness-behaviour.test.ts`
Expected: PASS (baseline before edits). Read it to learn whether it asserts an exact transition list - if it does, update the expected set in Step 3 to include the persona-gate line.

- [ ] **Step 2: Add the persona-gate to `harness/router.md`**

After the "## Default Rule" section, add:

```markdown
## Persona Gate

Before routing a net-new feature, product, or scope decision to any specialist,
`hyper` engages the `product-manager` persona gate (`pm-gate` skill). The gate must
return PASS before design/build. Tweaks/bugfixes get an advisory brief, not a block.
The user may explicitly override ("skip PM"), which is honoured and logged.
```

- [ ] **Step 3: Add transitions to `harness/transitions.md`**

Under "## Allowed", add:

```markdown
- `hyper -> product-manager persona gate (net-new build/scope)`
- `product-manager persona gate -> hyper`
```

Under "## Disallowed", add:

```markdown
- `product-manager persona gate -> ship` (must hand back to hyper)
- `product-manager persona gate -> deliver`
```

- [ ] **Step 4: Run the full suite**

Run: `bun test`
Expected: PASS. If `role-harness-behaviour.test.ts` pins an exact transition set, update its expected array to include the two new allowed lines.

- [ ] **Step 5: Commit**

```bash
git add harness/router.md harness/transitions.md tests/role-harness-behaviour.test.ts
git commit -m "feat(personas): wire product-manager gate into router + transitions"
```

**Part C checkpoint:** plugin + vertical + skill + role are bound; the PM gate is live in the routing contract.

---

## Final verification

- [ ] `bun test` - all suites green (registry 14, PM tools, bootstrap sync + Personas, persona registry, skills index).
- [ ] `bun run build` - `tsc --noEmit` clean.
- [ ] `bun run compile:context` - bootstrap regenerates with no diff (already committed).
- [ ] Manual: call `product_manager_resolve_product_decision({description:"add CSV export"})` and confirm a NEEDS-INPUT verdict naming value+viability.

## Self-review notes (plan author)

- **Spec coverage:** vertical (B) + plugin 9 tools (A) + skill + manifest + router (C) + tiered gate (C2/C3) + tests - all spec sections mapped. Four research-gap items remain Phase 2 (out of scope, per spec).
- **Type consistency:** tool names use `product_manager_*`; `data.ts` exports (`FOUR_RISKS`, `PM_OWNED_RISKS`, `classifyOpportunityVsSolution`, `validateJobStatement`, `scoreRice`) referenced identically across tasks.
- **Known coupling:** Task A4 bumps the plugin count test 13->14; Task B2 requires `compile:context` regen or the sync test fails. Both called out in-task.
- **Deferred/unverified (from spec):** the `product-manager` *agent* is realized here via persona contracts + `pm-gate` skill (prose), not a registered Claude Code subagent-type; if a discoverable agent-type is later required, that is a separate task pending verification of CC's agent-registration path.
```