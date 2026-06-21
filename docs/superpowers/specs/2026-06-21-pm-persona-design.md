# Design: Product-Manager Persona + `personas/` Vertical

Hyperstack enforces *how to work* (Iron Laws, gates) and *how it looks/builds* (designer, engineering-discipline), but nothing owns *what to build and why*. This spec adds a fourth architectural vertical - `personas/` - and its first inhabitant, a `product-manager` persona that grounds build decisions in validated customer problems, prioritizes ruthlessly, and makes opinionated, evidence-backed calls. It bites as a tiered gate before design/build. The persona's rules are not invented: they are 11 framework rules confirmed by adversarial deep research against primary sources (Cagan/SVPG, Torres/Product Talk, Intercom, Christensen, Doshi), persisted at `docs/research/2026-06-21-pm-craft-corpus.json`.

## Problem statement

| Symptom (user-reported) | Root cause | Evidence |
|---|---|---|
| "Decisions are random gibberish" | No layer owns product VALUE - what to build is assumed, not validated | Four-Risks taxonomy: PM owns value+viability; Hyperstack has neither |
| "Not real PM-level calls" | No customer-behaviour grounding before work starts | Discovery is continuous + story-based; Hyperstack jumps to how-work |
| "Enforcement leaks" (decision quality, not mechanics) | Output hedges / sprawls; no prioritized, defensible call | "Strategy = saying no"; weak PMs ship everything |

The four product risks map onto Hyperstack's roles and expose the exact hole:

```
RISK            OWNER                          STATUS
──────────────────────────────────────────────────────
VALUE       →   Product Manager            →   MISSING  ◄ the leak
VIABILITY   →   Product Manager            →   MISSING  ◄ the leak
USABILITY   →   Designer (designer skill)  →   exists
FEASIBILITY →   Engineer (eng-discipline)  →   exists
```

The PM persona completes the trio. It is not a bolt-on; it fills a structurally missing accountability.

## Goals / Non-goals

| Goals | Non-goals |
|---|---|
| Add `personas/` as a first-class 4th vertical, extensible to future personas | Not a parallel MCP transport - tools register through the existing `loadPlugins` path |
| Ship `product-manager` persona = bound MCP plugin + skill + agent role + manifest | Not project-specific product opinions - corpus is generic, source-cited PM craft (keeps core generic) |
| Tiered enforcement: hard-gate net-new, advisory tweaks, user override always | Not a replacement for designer/engineering-discipline - it precedes them |
| Ground every tool in a verified research claim; stub unproven areas as NEEDS-RESEARCH | Not faking the 4 research-gap areas (MVP-cut, Kano/MoSCoW/ICE, decision-template) |

## Research foundation (corpus → tools)

Every PM tool is backed by a confirmed claim. Full provenance in the persisted corpus.

| Rule | Tool surface | Source (confidence) |
|---|---|---|
| Four Product Risks (value/usability/feasibility/viability); PM owns value+viability | `get_four_risks` | Cagan/SVPG (high) |
| Opportunity-vs-solution test: "more than one way to address this?" | `opportunity_vs_solution` | Torres (high) |
| JTBD job = progress-in-context (functional/emotional/social); Four Forces | `get_jtbd` | Christensen (high) |
| Job-statement validator (7-point falsifiable checklist) | `validate_job_statement` | gopractice/Christensen (high) |
| Story-based discovery; never ask "what do you want"; weekly contact | `get_discovery_rules` | Torres (high) |
| RICE = (Reach x Impact x Confidence) / Effort | `score_rice` | Intercom, RICE originator (high) |
| Strategy = saying no; focus 2-3 levers; long list = non-strategy | `get_strategy_rules` | Cagan/SVPG (high) |
| Anti-patterns: feature-factory, reactivity, viability-avoidance, execution-misdiagnosis (strategy/interpersonal/culture) | `get_anti_patterns` | Cagan + Doshi (high) |
| Orchestrator: description → grounded product decision + verdict | `resolve_product_decision` | composition of above |

Killed claim (do not encode): "context is THE test for a real job" (1-2 refuted). Correction encoded: execution problems trace to strategy OR interpersonal OR culture (three roots, not one).

## Architecture: the `personas/` vertical

```
hyperstack/
├── src/plugins/      Layer 1  MCP ground-truth (data)
├── skills/           Layer 2  process / discipline
├── agents/           Layer 3  routing roles (who executes)
└── personas/         Layer 4  ◄ NEW: judgment lenses that OWN decisions
    ├── README.md                     vertical overview
    ├── persona-registry.ts           loads persona.json manifests; exposes to compiler + router
    ├── persona.schema.json           manifest schema
    └── product-manager/
        ├── persona.json              manifest (see below)
        ├── PROFILE.md                identity, mission, owns value+viability, voice
        ├── LIFECYCLE.md              engage criteria, gate steps, handback to hyper
        ├── CHECKS.md                 the falsifiable gate checklist
        ├── CONTEXT.md                context slice it loads
        └── corpus/                   framework snippets (distilled from research JSON)
```

### Persona manifest (`persona.json`)

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

### Bound components

| Part | Location | Contract |
|---|---|---|
| MCP plugin `product-manager` | `src/plugins/product-manager/` (existing plugin pattern: `index.ts`/`loader.ts`/`data.ts`/`tools/*`/`snippets/*`) | 9 tools above; stateless; logically persona-owned via manifest |
| Skill `pm-gate` | `skills/pm-gate/SKILL.md` | the product-decision workflow + tiered gate; Iron Law: "NO NET-NEW BUILD WITHOUT A PASSED PRODUCT DECISION" |
| Agent role `product-manager` | bound via manifest; contracts under `personas/product-manager/` | owns value+viability; engaged by hyper; hands back to hyper |
| Binding | `personas/product-manager/persona.json` | ties plugin + skill + agent + corpus + voice |

Pragmatic concession to the 4th-vertical choice: tool *code* lives in `src/plugins/` so it registers through the only verified MCP path (`src/index.ts` → `loadPlugins`). The persona *owns* it via manifest. Physical relocation under `personas/` is possible but requires a new loader wired into `src/index.ts`; deferred unless required.

Unverified mechanism (resolve in the plan, do not assume here): how the `product-manager` agent becomes a discoverable agent-type - declared in the plugin manifest, auto-discovered from an `agents/` dir, or realized purely through the persona contracts + `pm-gate` skill - was not confirmed during codebase analysis. The plan must verify Claude Code's agent-registration path before committing to one.

## Lifecycle - where the gate bites

```
user request
    │
    ▼
hyper ── classify ──► build / feature / product call?
    │                      │
    │                 YES  │ engage product-manager persona  [GATE]
    │                      ▼
    │           ┌─────────────────────────────────────┐
    │           │ 1 GROUND     opportunity_vs_solution │  reject solutions-as-problems
    │           │              discovery evidence?     │  flag "customer said they want X"
    │           │ 2 ASSESS     get_four_risks          │  esp VALUE + VIABILITY
    │           │ 3 PRIORITIZE score_rice / saying-no  │  what is the ONE call
    │           │ 4 EMIT       resolve_product_decision│  PASS | BLOCK | NEEDS-INPUT + rationale
    │           └─────────────────────────────────────┘
    │                      │ PASS
    └── NO (tweak/bug/refactor) ──► advisory brief (no block)
                           ▼
            hyper routes → designer → builder → ship-gate
```

### Tiered enforcement policy

| Request class | Gate | Behaviour |
|---|---|---|
| Net-new feature / product / scope decision | HARD | must emit PASS before designer/build; BLOCK halts with reason |
| Tweak / bugfix / refactor / non-product | ADVISORY | brief emitted, no block |
| User explicit "skip PM" | OVERRIDE | always honoured, logged in the decision trail |

## Build integration

| File | Change | Risk |
|---|---|---|
| `skills/hyperstack/SKILL.md` | add `## Personas` section (bootstrap source of truth) | LOW |
| `src/internal/context-compiler.ts` | extract + emit Personas layer; extend `REQUIRED_BOOTSTRAP_MARKERS` | MED - marker-validated, covered by `context-compiler-behaviour.test.ts` |
| `generated/runtime-context/hyperstack.bootstrap.md` | regenerated via `bun run compile:context` | auto |
| `harness/router.md`, `harness/transitions.md` | add persona-gate step `hyper → persona-gate → specialist`; allowed/disallowed transitions | LOW (prose) |
| `personas/persona-registry.ts`, `persona.schema.json` | new, small | LOW |
| `personas/product-manager/**` | manifest + contracts + corpus | LOW |
| `src/plugins/product-manager/**` | new plugin, mirrors `designer` exactly | LOW |
| `src/index.ts` | import + register `productManagerPlugin` | LOW |
| `tests/` | persona-registry, pm-gate verdict, bootstrap-marker tests | LOW (pattern exists) |

## Data flow

```
research JSON ──(distill, build-time/manual)──► src/plugins/product-manager/snippets/*.txt
                                                         │ createSnippetLoader("product-manager")
tool call ──► handler ──► data.ts (typed) + snippet(txt) ──► markdown decision/checklist
pm-gate skill ──► calls product_manager_* tools ──► applies gate_policy ──► PASS|BLOCK|NEEDS-INPUT
persona-registry ──► reads persona.json ──► feeds compiler (bootstrap) + router (engage_when)
```

## Error handling / degraded mode

| Failure | Behaviour |
|---|---|
| MCP unavailable | pm-gate states "MCP unavailable", falls back to corpus text, flags decision as ungrounded (consistent with existing degraded-mode rule) |
| Persona manifest malformed | persona-registry skips it with a surfaced warning (not silent), like plugin-registry resilience |
| Tool references missing snippet | build-time corpus-integrity check (added) fails loud, not at runtime |
| Gate verdict ambiguous | default to NEEDS-INPUT (ask user), never silent PASS |

## Testing

Mirror existing `*-behaviour.test.ts`:
- persona-registry loads `product-manager` manifest; malformed manifest is skipped with warning.
- bootstrap compiles with Personas markers present (extends marker test).
- `pm-gate` returns BLOCK when four-risks viability is unaddressed; PASS when all four covered + prioritized call present; NEEDS-INPUT on ambiguity.
- `opportunity_vs_solution` returns is_solution for a single-path statement.
- `validate_job_statement` fails a statement missing context.
- override path bypasses gate and logs.

## Phasing

| Phase | Scope |
|---|---|
| **1 (this plan)** | `personas/` scaffold + registry + schema; `product-manager` plugin (9 verified tools); `pm-gate` skill (tiered); bootstrap + router wiring; tests. Gap areas ship as explicit NEEDS-RESEARCH stubs. |
| **2 (later)** | targeted second research pass for the 4 gaps (MVP-cut mechanics, Kano/MoSCoW/ICE, product-sense practices, decision-writeup template); add decision-log template tool. |

## Open items (research-flagged gaps, not faked)

1. MVP / minimum-scope cut rule - no codifiable line yet.
2. Kano / MoSCoW / ICE / opportunity-sizing mechanics - only RICE survived verification.
3. Repeatable product-sense-building practices.
4. Defensible decision-writeup template (pre-mortem / decision-log format).

## Future personas (why the vertical, not a one-off)

The vertical is justified only if more personas follow. Candidates that fit the same "judgment lens that owns a risk" shape: a security persona (owns risk/threat), a data/analytics persona (owns measurement), an SRE persona (owns reliability). Each = manifest + bound plugin/skill. The registry, schema, and bootstrap layer built here are shared infrastructure.

## Validation pass (post-implementation correction)

A secondary validation (1 empirical accuracy battery + 2 independent adversarial red-team agents) found that 3 of the 9 tools as first built were theater, and corrected them. This supersedes the earlier descriptions of those tools above:

| Tool | As-built flaw | Corrected to |
|---|---|---|
| `resolve_product_decision` | hardcoded `NEEDS-INPUT`, never PASS/BLOCK - the "gate engine" could not gate | takes value+viability assessments as input; deterministic verdict PASS (both addressed) / BLOCK (net-new, missing) / ADVISORY (tweak). PASS earned, not automatic. |
| `opportunity_vs_solution` | ~80% regex classifier emitting an exclusive verdict (the LLM does this better) | returns the Torres rubric + reframe examples for the agent to apply (ground-truth, no verdict) |
| `validate_job_statement` | 3-regex pseudo-validator | returns the 7-point JTBD criteria for the agent to judge against |

Also corrected: `persona.json` dropped the dangling `agent: product-manager` claim (no such agent exists; the persona is `engaged_by` hyper and realized via the `pm-gate` skill), and LIFECYCLE dropped an unimplemented "decision trail" claim. The 6 framework tools (`get_*` + `score_rice`) were sound and unchanged. Verdict labels are now PASS/BLOCK/ADVISORY (not NEEDS-INPUT). A runtime write-blocking hook was deliberately declined: all Hyperstack skills are prose-enforced via the bootstrap, and the diagnosed problem was decision quality, not enforcement mechanics.
