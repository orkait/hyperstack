# Changelog

All notable changes to Hyperstack are documented here. Format follows Keep a Changelog; versioning is SemVer.

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
