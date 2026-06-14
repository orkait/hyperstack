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
  const counts = { majorBehind: 0, current: 0, other: 0, editorial: 0, skip: 0 };
  const delta: string[] = [
    "| Plugin | Package | Targets | Latest | Bump | Action |",
    "|---|---|---|---|---|---|",
  ];
  for (const s of SOURCES) {
    if (s.skip) { counts.skip++; delta.push(`| ${cell(s.plugin)} | - | - | - | skip | - |`); continue; }
    if (s.editorial) { counts.editorial++; delta.push(`| ${cell(s.plugin)} | - | - | - | editorial (L2 direct) | L2 direct |`); continue; }
    for (const p of s.packages) {
      const r = await fetchLatest(p.name, p.registry);
      const bump = r.error ? `unknown (${r.error})` : classifyBump(p.targetMajor, r.latest);
      let action: string;
      if (r.error) { action = "manual"; counts.other++; }
      else if (bump === "MAJOR-BEHIND") { action = "L2 review"; counts.majorBehind++; }
      else if (bump === "current-major") { action = "ok"; counts.current++; }
      else if (bump === "ahead") { action = "check manifest"; counts.other++; }
      else { action = "manual"; counts.other++; }
      delta.push(`| ${cell(s.plugin)} | ${cell(p.name)} | ${p.targetMajor} | ${cell(r.latest ?? "?")} | ${cell(bump)} | ${cell(action)} |`);
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
  console.log(`audit summary: ${counts.majorBehind} major-behind, ${counts.current} current, ${counts.other} other, ${counts.editorial} editorial, ${counts.skip} skip | ${findings.length} lint finding(s)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
