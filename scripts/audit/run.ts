import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES } from "./sources.js";
import { classifyBump, fetchLatest } from "./fetch.js";
import { runConsistency } from "./consistency.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

async function main() {
  const cell = (v: unknown): string => String(v).replace(/\|/g, "\\|");

  const delta: string[] = ["| Plugin | Package | Targets | Latest | Bump |", "|---|---|---|---|---|"];
  for (const s of SOURCES) {
    if (s.skip) { delta.push(`| ${cell(s.plugin)} | - | - | - | skip |`); continue; }
    if (s.editorial) { delta.push(`| ${cell(s.plugin)} | - | - | - | editorial (L2 direct) |`); continue; }
    for (const p of s.packages) {
      const r = await fetchLatest(p.name, p.registry);
      const bump = r.error ? `unknown (${r.error})` : classifyBump(p.targetMajor, r.latest);
      delta.push(`| ${cell(s.plugin)} | ${cell(p.name)} | ${p.targetMajor} | ${cell(r.latest ?? "?")} | ${cell(bump)} |`);
    }
  }

  const findings = runConsistency(root);
  const cons = ["| Rule | Location | Detail |", "|---|---|---|",
    ...findings.map((f) => `| ${cell(f.rule)} | ${cell(f.location)} | ${cell(f.detail)} |`)];

  const outDir = join(root, "generated", "audit");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "version-delta.md"), `# Version Delta\n\n${delta.join("\n")}\n`);
  writeFileSync(join(outDir, "consistency.md"), `# Internal Consistency\n\n${findings.length} finding(s)\n\n${cons.join("\n")}\n`);

  console.log(`audit: wrote generated/audit/version-delta.md`);
  console.log(`audit: wrote generated/audit/consistency.md (${findings.length} findings)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
