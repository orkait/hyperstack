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

1. **Headless Chrome (the `pinchtab` skill)** - primary. Open the upstream changelog, release notes, and the exact docs page for each API the plugin documents.
2. **Context7** - cross-check only. Key from `~/.config/hyperstack-audit/.env` (`CONTEXT7_API_KEY`). Useful because its snapshot can lag npm. Never the sole source.

## Procedure (per flagged plugin)

1. Open `generated/audit/version-delta.md`; take the plugin's targeted major and the fetched latest.
2. Open the plugin's `data.ts` / `snippets/` and list the concrete APIs it documents (hooks, props, imports, component names). For editorial plugins (`golang`/`rust`/`ui-ux`/`designer`) there is no single `data.ts`; see the Editorial plugins section below for source guidance.
3. Headless-open the upstream changelog between targeted major and latest. For each documented API, classify:
   - `BREAKING` - renamed/removed/signature-changed
   - `ADDITIVE` - new API the plugin should mention
   - `NONE` - unchanged
4. Record each non-NONE finding with a source URL and the plugin file to edit.
5. Append a section to `generated/audit/drift-report.md`. This file is produced by this skill, not by `bun run audit` - create it (with a `# Drift Report` heading) if it does not exist yet; on the first flagged plugin of the quarter it will be absent.

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
