# Hyperstack Benchmark Harness - Design Spec

Hyperstack asks for faith. Its peers earn it: `ponytail` ships `npx promptfoo eval` (80-94% less code), `caveman` ships `python run.py` (65% fewer tokens, raw API counts). Hyperstack asserts that MCP grounding and gates produce better code and proves nothing. This spec defines the missing proof: a reproducible benchmark of one falsifiable, on-brand claim.

## The claim (one, falsifiable)

> With Hyperstack's MCP ground-truth available, an agent writes code against the **current** API of the stacks Hyperstack covers. Without it, the agent drifts to **stale or hallucinated** APIs from training memory.

This is the exact thing the quarterly audit proved by hand (Next 15->16 async params, `@xyflow/react` not `reactflow`, Base UI parts not Radix, `motion/react` imports, `syncTouch` not `smoothTouch`). The benchmark makes it a number.

## Goals / Non-goals

| Goals | Non-goals (v1) |
|---|---|
| One claim, deterministic metric, multi-model | Measuring "code quality" broadly (fuzzy, needs a judge) |
| Reproducible single command, raw results stamped | Benchmarking all 12 plugins (start with high-drift ones) |
| A README number that replaces faith | A judge-model rubric (avoid fuzzy scoring in v1) |
| Re-runnable each quarter alongside the audit | Proving the agent *will* call the tools (that is v2) |

## The metric - deterministic API-currency oracle

The elegant part: **Hyperstack's own plugin data is the ground truth**, so scoring needs no judge. Each task has a known current-API signature and a known stale signature (the audit's drift cases). Score each model output by regex/string match against a per-task rubric -> `current` | `stale` | `absent`.

| Stack | Current (score: current) | Stale (score: stale) |
|---|---|---|
| React Flow | `@xyflow/react`, `useNodeConnections` | `reactflow`, `useHandleConnections`, v11 imports |
| Next.js | `await params`, `Promise<{` on params | sync `{ params }: { params: {` destructure |
| Base UI / shadcn | `Dialog.Viewport`, `Select.Positioner`, `data-open` | `DialogContent`, `SelectContent`, `data-state` |
| motion | `from "motion/react"` for domAnimation/domMax | bare `from "motion"` for those |
| lenis | `syncTouch` | `smoothTouch` |
| design-tokens | utilities from `@theme` | "`:root` auto-generates utilities" |

Deterministic, no judge. A correctness judge ("does the current-API code also run") is a later layer, not v1.

## Arms

| Arm | Setup | Isolates |
|---|---|---|
| **A - baseline** | plain system prompt, model answers from memory | the drift |
| **B - grounded** | the relevant plugin's tool output injected into context, as a grounded agent would have fetched | the effect of grounding |

**B1 vs B2 (decision):** v1 uses **B2** - inject the plugin's ground-truth data into the prompt. This isolates the clean causal claim ("does having current data change the output?") and stays deterministic + cheap. v2 uses **B1** - a real agent loop with the MCP server connected, measuring whether the agent *fetches and uses* the data end to end. Report which arm any published number comes from.

## Models

Haiku 4.5, Sonnet 4.6, Opus 4.8 - same multi-model proof shape as ponytail/caveman; drift severity varies by model and the spread is part of the story.

## Tasks

8-10 stack-specific prompts targeting the high-drift surfaces (the audit's drift cases). Each asks for code in a covered stack where memory-drift is known and measurable. Vendored in the harness with its currency rubric. Example: *"Add a React Flow node that reads data from connected nodes"* (currency hinge: `useNodeConnections` vs deprecated `useHandleConnections`).

## Harness

Use **promptfoo** (ponytail's choice) as the eval shell, with a custom assertion:

```
benchmarks/
  promptfooconfig.yaml      providers (3 models) x prompts x arms
  arms/baseline.js          plain system prompt
  arms/grounded.js          baseline + injected plugin ground-truth
  currency.js               the deterministic oracle (custom assertion, like ponytail's loc.js)
  rubrics.json              per-task current/stale signatures
  results/                  raw JSON, gitignored API key, committed result snapshots
```

promptfoo gives the model x arm matrix, cost telemetry, and a shareable hosted report for free. Reproducibility hygiene (from caveman): stamp model + date + **plugin-data SHA256** + trial count into each result; median-of-N; one command. Auto-update a README table between `<!-- BENCHMARK-START -->` markers (caveman's pattern).

## Output

```
| Task              | Model  | A current% | B current% | lift |
| reactflow-conn    | sonnet |    20%     |    100%    | +80  |
...
Headline: "Hyperstack raises current-API rate from X% to Y% (median, 3 models)."
```

## Verification

- `npx promptfoo eval -c benchmarks/promptfooconfig.yaml` runs clean, emits the matrix.
- `currency.js` is unit-tested against known current/stale fixtures (so the oracle itself is trusted).
- `bun test` stays green; the harness adds no runtime dependency to the MCP server.

## Phasing

| Phase | Scope | Proves |
|---|---|---|
| v1 | B2 (injected) + currency oracle + 8 tasks + 3 models | grounding changes the output - the causal claim, cheap |
| v2 | B1 (real MCP tool-call loop) | the agent fetches and uses the data end to end |
| v3 | + correctness judge layer | the current-API code also works |

## Risks / honest caveats

- **B2 proves "grounding helps if used," not "the agent will fetch it."** That is exactly what v2 measures. The README must label which arm a number is from.
- **The currency rubric drifts as APIs move.** It is maintained on the same quarterly cadence as the audit - the benchmark tasks *are* the audit's drift cases, so they co-evolve.
- **Temperature:** use `0` (the model's best shot at the API) with median-of-N for stability; ponytail used `1` for realistic variance, caveman used `0`. For a currency claim, `0` is the honest setting.
- **Cost:** 8 tasks x 3 models x 2 arms x N trials. At N=5 that is 240 calls per run - bounded, manual, quarterly. Not CI.
