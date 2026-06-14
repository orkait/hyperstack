# Hyperstack Quarterly Audit Harness - Design

Sub-project 0 of the quarterly community-contract update. Builds a repeatable, mostly-deterministic harness that detects drift between what Hyperstack's 12 MCP plugins + 21 skills encode and current upstream reality, so the per-plugin updates that follow are targeted instead of guessed. Run by hand once a quarter. No automation, no scheduling, no CI.

## Goals / Non-goals

| Goals | Non-goals |
|---|---|
| Detect version drift deterministically across registry-pinned plugins | Auto-running on a schedule (cron/CI) - this is manual quarterly |
| Focus expensive research only where the cheap layer flags it | Editing plugin/skill content (that is downstream sub-projects 1..N) |
| Catch internal-consistency rot a version check misses | Tracking drift history over time in a DB |
| Cover both MCP plugin data and the 21 skill docs | Auditing the enforcement/process skills for "correctness" (no upstream to drift against) |
| Produce a reusable, community-visible artifact (script + skill) | A general-purpose linter; scope is the audit classes below |

## Decisions (locked during brainstorm)

| # | Decision | Choice |
|---|---|---|
| 1 | Start point | Build the harness first, then update plugins in drift order |
| 2 | Automation level | Two deterministic script layers + one manual research layer |
| 3 | Layer-2 research tool | Headless Chrome (pinchtab) primary; Context7 cross-check only |
| 4 | Audit surface | All 12 plugin data layers + all 21 skill docs |
| 5 | Cadence | Manual, once per quarter. No cron/CI/monitoring |

## Architecture

Three layers. Two deterministic (free, re-runnable), one judgment-based (headless research).

```
scripts/audit/
  sources.ts       manifest: plugin -> upstream pkg + targeted major + editorial flag + skills-that-ride-it
  fetch.ts         registry fetchers: npm | go-proxy (add gh-releases/crates only if a future plugin needs them)
  consistency.ts   L3 lint passes over src/plugins + skills
  run.ts           entry (`bun run audit`): drives L1 + L3, writes reports

generated/audit/
  version-delta.md   L1 output  (plugin | pkg | targets | latest | bump | action)
  consistency.md     L3 output  (rule | location | finding)
  drift-report.md    L2 output  (manual, per flagged plugin: breaking/additive/cosmetic + sources)

skills/audit-drift/
  SKILL.md         L2 protocol: headless-Chrome research steps + report format

tests/
  audit-harness-behaviour.test.ts   manifest coverage + fetcher shape + lint fixture
```

### Layer 1 - version delta (deterministic)

```
sources.ts ──► for each non-editorial plugin ──► fetch.ts(pkg, registry) ──► latest exact version
                          │                                                        │
            targeted major (manifest) ◄──────────────────────────────► compare ──► bump = major|minor|patch|none
                                                                                     │
                                                       write generated/audit/version-delta.md
```

Plugins encode a major ("@xyflow v12", "Tailwind v4", "React 19"), not an exact `x.y.z`. The manifest records the targeted major by hand; the script fetches latest exact and classifies the gap. Whether a minor "matters" is L2's call, not the script's.

Registries by plugin:

| Plugin | Upstream | Registry |
|---|---|---|
| shadcn | @base-ui/react, tailwindcss | npm |
| reactflow | @xyflow/react | npm |
| motion | motion | npm |
| lenis | lenis | npm |
| react | react, react-dom, next | npm |
| design-tokens | tailwindcss | npm |
| echo | github.com/labstack/echo/v4 | go-proxy |
| hyperstack | @modelcontextprotocol/sdk | npm |
| golang | go toolchain | editorial |
| rust | rustc / clippy | editorial |
| ui-ux | WCAG 2.2 | editorial |
| designer | curated knowledge | editorial |

Editorial plugins skip the fetch, appear as `editorial - L2 direct` rows. No fake version numbers.

Confirmed correct in the pilot audit (do not re-flag): `@base-ui/react` is the current canonical Base UI package (v1.5.0, published 2026-05-19), subpath imports `@base-ui/react/<part>` valid. `@base-ui-components/react` is the superseded pre-1.0 name.

### Layer 2 - semantic API drift (manual, headless Chrome)

For each plugin L1 flags (or each editorial plugin), drive pinchtab headless Chrome to read changelog / release notes / official docs between the targeted major and latest. Judge real drift the plugin's documented surface cares about. Context7 (key from `~/.config/hyperstack-audit/.env`) is a cross-check only, useful because its snapshot can lag npm (it showed Base UI v1.3.0 while npm had v1.5.0).

`drift-report.md` per plugin:
```
## reactflow  (targets v12, latest 12.x.y)
- [ADDITIVE] <api> added in vX.Y - plugin data/hooks.ts omits it
  source: <url>  -> action: add to data + snippet
- [BREAKING] <api> renamed - plugin snippet uses old name
  source: <url>  -> action: update snippet + cheatsheet
verdict: <n> edits, severity <...>
```

Codified as `skills/audit-drift/SKILL.md` so the headless protocol is repeatable next quarter and visible to the community.

### Layer 3 - internal-consistency lint (deterministic)

Catches the class of defect a version check cannot see. Added after the pilot shadcn audit surfaced exactly these.

| Rule | Detects | Pilot finding |
|---|---|---|
| orphan-module | a module exported but imported nowhere | `shadcn/shared/rules.ts` (dead, divergent from live `data.ts`) |
| divergent-duplicate | same constant defined twice with different values | two `SHADCN_RULES` (uppercase vs camelCase keys) |
| internal-import-leak | monorepo-internal paths (`@repo/*`, `@workspace/*`) in generic user-facing guidance | `cn from @repo/ui-utils` (should be `@/lib/utils`) |
| coverage-gap | catalog advertises N items, snippets/data cover M < N | shadcn lists more components than the 4 snippet files cover |

Output: `generated/audit/consistency.md`. These are bugs to fix regardless of upstream state.

## Data flow (one `bun run audit`)

```
run.ts
 ├─ read sources.ts
 ├─ L1: fetch latest per non-editorial pkg ─► classify bump ─► version-delta.md
 ├─ L3: lint src/plugins + skills          ─► consistency.md
 └─ print summary: counts of major/minor/editorial + lint findings
L2 is run separately, by hand, against the flagged set (headless).
```

## Error handling

- A registry fetch fails -> that row = `unknown / manual check`, run continues. Never crash the whole audit.
- GitHub API unauthenticated (60 req/hr) is ample for ~12 calls.
- Context7 quota / network failure in L2 -> fall back to headless (already primary); note it in the report.
- Lint never throws on a plugin; a parse failure is reported as a finding, not a crash.

## Testing

`tests/audit-harness-behaviour.test.ts`, in the repo's existing behaviour-test style:

- Manifest has an entry for every directory under `src/plugins/` (no plugin silently unaudited).
- Every non-editorial entry resolves to a registry + package string.
- Each fetcher returns a parseable semver shape (mock the HTTP layer).
- L3 lint flags a known fixture (orphan export + `@repo/*` path) and passes a clean fixture.

## Verification bar (sub-project 0 done)

1. `bun run audit` runs clean and writes `version-delta.md` + `consistency.md` with live-fetched numbers (output shown, per ship-gate).
2. `skills/audit-drift/SKILL.md` exists with the headless protocol + report format.
3. `bun test` passes including the new behaviour test.

## Downstream (out of scope here, queued)

Per-plugin updates are separate sub-projects, one PR each, ordered by the drift report. First queued PR is independent of any version bump:

- F1: remove orphan `shadcn/shared/rules.ts` (live source is `data.ts`); single source of truth.
- F2: replace `cn from @repo/ui-utils` with `@/lib/utils` in `data.ts` (and anywhere the rules surface emits it).

Both ship via `shadcn_get_rules` / the component checklist today, on the path the user uses daily, so they go first.

## Security

- Context7 key lives only in `~/.config/hyperstack-audit/.env` (gitignored dir, perms 600), never in the repo. The harness reads `process.env.CONTEXT7_API_KEY`; no literal in code.
