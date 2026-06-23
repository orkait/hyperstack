# Changelog

All notable changes to Hyperstack are documented here. Format follows Keep a Changelog; versioning is SemVer.

## [1.3.1] - 2026-06-24

### Fixed
- **`codemode`**: now runs as a single inline agent - never dispatches parallel subagents. The Iron Law gains "RUN INLINE - NEVER DISPATCH PARALLEL SUBAGENTS"; the loading discipline reads load-bearing files inline and uses `rg`/`fd`/git for breadth; the Phase 2 fan-out-agents instruction is removed.

## [1.3.0] - 2026-06-22

### Added
- **`reflect` persona** (capability, 3rd persona): reviews a product screen AS a real target-customer archetype - short, blunt, moody, market-smart, human, not a UX bot. Roster: Morgan (brand-side approver, default), Max (performance), Diane (brand custodian), Riley (operator). Ships the `reflect` skill (the voice engine - ONE RULE, sounds-human-vs-AI, 5 moods, 6 in-head checks) + the `reflect` MCP plugin (`list_personas`, `get_persona`, `get_voice_rules`) serving the roster + voice contract.

### Changed
- Plugin set 15 -> 16 (`reflect`); tools 114 -> 117; skills 26 -> 27; personas 2 -> 3. All manifests reconciled to 1.3.0.

## [1.2.0] - 2026-06-22

### Added
- **Personas (Layer 4)**: a new `personas/` vertical of domain-expert lenses that `hyper` auto-engages, in two modes - **gate** (owns a risk and blocks) and **capability** (produces domain output). Manifest schema + registry (`src/personas/`), compiled into the runtime bootstrap.
- **`product-manager` persona** (gate): owns the value+viability product risks Hyperstack left unowned. 15 ground-truth MCP tools (four-risks, JTBD, discovery, opportunity-vs-solution + job rubrics, RICE + prioritization MoSCoW/Kano/ICE/WSJF, MVP/scope-cutting, decision toolkit type-1/2 + pre-mortem, roadmapping, metrics, product-sense) + the `pm-gate` skill (tiered: hard for net-new, advisory for tweaks, user override).
- **`marketing` persona** (capability): does product marketing for any brand. 17 ground-truth MCP tools over a 25-snippet corpus (VoC, positioning Dunford+ICP+differentiation, messaging StoryBrand+value-prop, copy formulas+hooks+Schwartz-awareness+Cialdini+landing, brand archetypes+Byron-Sharp+category, GTM motions+Traction-channels+AARRR/loops+lifecycle+pricing+launch, anti-patterns) + a brief assembler + the `marketing` skill.

### Changed
- Plugin set 13 -> 15 (`product-manager`, `marketing`); tools ~82 -> 114; skills 24 -> 26. Bootstrap Layer 4 (Personas) compiled in.
- All manifest versions reconciled to 1.2.0 (package.json, marketplace, plugin, cursor, gemini-extension).

## [1.1.0] - 2026-06-15

### Added
- **Quarterly audit harness** (`scripts/audit/`, `bun run audit`): deterministic L1 version-delta (npm + go-proxy) and L3 internal-consistency lint across all 12 plugins, with committed report output.
- **`codemode` skill**: 7-phase deep context-loading protocol, wired into the workflow chain and the `hyper` / `website-builder` roles.
- **Coding Laws** in `engineering-discipline`: config-out-of-code, build-for-reuse, no-hacks, lean comments, docs-as-source-of-truth, crisp communication - plus a YAGNI "Law 0" and `// upgrade:` shortcut markers.
- **Benchmark design spec** (`docs/benchmarks-spec.md`): a reproducible MCP-grounding currency benchmark with a deterministic current-vs-stale API oracle.

### Changed
- **Plugin data synced to current upstream** (6 plugins, ~45 cited corrections):
  - `react`: Next.js 15+ async `params`, Node 20.9 floor, fetch caching default, React 19 Actions / `use()` / `ref`-as-prop.
  - `shadcn`: Dialog/Field/Select rewritten to real Base UI v1 parts; `data-state` -> `data-open/closed`.
  - `lenis`: `smoothTouch` -> `syncTouch`, current v1.3 CSS and option defaults.
  - `reactflow`: `useHandleConnections` deprecated -> `useNodeConnections`; v12 hook/type/prop coverage.
  - `motion`: correct `motion/react` import paths; `react-m` namespace.
  - `design-tokens`: Tailwind v4 utility-generation truths; `:where` dark variant.
- **`designer` skill**: codebase grounding is now a binding gate (Phase 0) - inspects existing tokens/components/structure and EXTENDS them instead of resolving a fresh greenfield system; wired to `codemode`.
- **superpowers 5.1.0 sync** into forks: `worktree-isolation` (detect-existing-isolation, native-tool-first), `deliver` (environment detection, detached-HEAD menu, provenance cleanup), `code-review`, `subagent-ops`.

### Fixed
- `shadcn`: canonical `cn` import path (`@repo/ui-utils` -> `@/lib/utils`); removed orphan `shared/rules.ts`.
- Manifest counts reconciled to 12 plugins / 80 tools / 22 skills across all platform manifests.

## [1.0.0] - 2026-04-22

- Initial release: 12 MCP plugins, 80 tools, 21 skills, multi-platform packaging (Claude Code, Codex, Cursor, Windsurf, Gemini, Kiro), SessionStart bootstrap injection.
