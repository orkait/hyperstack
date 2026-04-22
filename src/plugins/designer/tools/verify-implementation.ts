import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFileSync, existsSync, statSync } from "fs";
import { isAbsolute } from "path";

/**
 * Programmatically verifies an implementation against its DESIGN.md contract.
 * This runs during ship-gate as the hard compliance gate.
 */
export function register(server: McpServer): void {
  server.tool(
    "designer_verify_implementation",
    "Verify implementation code against its DESIGN.md contract. Runs pattern checks for anti-patterns (AI purple, font-weight 500 everywhere, cold shadows, etc.), verifies OKLCH tokens present, checks for prefers-reduced-motion, and reports per-section compliance. Use this before ship-gate. Returns a pass/fail report with specific violations.",
    {
      design_md_path: z.string().describe("Absolute path to the DESIGN.md file"),
      code_paths: z.array(z.string()).describe("Array of absolute paths to code files to verify (CSS, TSX, JSX, Vue, etc.)"),
    },
    async ({ design_md_path, code_paths }) => {
      if (!isAbsolute(design_md_path)) {
        return { content: [{ type: "text" as const, text: `Error: design_md_path must be absolute` }], isError: true };
      }
      if (!existsSync(design_md_path)) {
        return { content: [{ type: "text" as const, text: `Error: DESIGN.md not found at ${design_md_path}` }], isError: true };
      }

      const designMd = readFileSync(design_md_path, "utf-8");

      // Collect all readable code files
      const validPaths: string[] = [];
      const invalidPaths: string[] = [];
      for (const p of code_paths) {
        if (!isAbsolute(p)) { invalidPaths.push(`${p} (not absolute)`); continue; }
        if (!existsSync(p)) { invalidPaths.push(`${p} (not found)`); continue; }
        const stat = statSync(p);
        if (stat.isDirectory()) { invalidPaths.push(`${p} (is directory)`); continue; }
        if (stat.size > 2 * 1024 * 1024) { invalidPaths.push(`${p} (> 2MB)`); continue; }
        validPaths.push(p);
      }

      if (validPaths.length === 0) {
        return {
          content: [{ type: "text" as const, text: `Error: no valid code files to verify. Invalid paths:\n${invalidPaths.join("\n")}` }],
          isError: true,
        };
      }

      const allCode = validPaths.map((p) => ({ path: p, content: readFileSync(p, "utf-8") }));
      const combinedCode = allCode.map((f) => f.content).join("\n");

      // Run all verification checks
      const results: CheckResult[] = [
        ...checkAntiPatterns(combinedCode, allCode),
        ...checkColorCompliance(designMd, combinedCode, allCode),
        ...checkTypographyCompliance(combinedCode, allCode),
        ...checkSpacingCompliance(combinedCode, allCode),
        ...checkComponentStates(designMd, combinedCode, allCode),
        ...checkMotionCompliance(combinedCode, allCode),
        ...checkAccessibility(combinedCode, allCode),
      ];

      const byStatus = {
        pass: results.filter((r) => r.status === "pass"),
        fail: results.filter((r) => r.status === "fail"),
        warn: results.filter((r) => r.status === "warn"),
      };

      // Build report
      let text = `# DESIGN.md Compliance Report\n\n`;
      text += `**DESIGN.md:** \`${design_md_path}\`\n`;
      text += `**Files checked:** ${validPaths.length}\n`;
      if (invalidPaths.length > 0) {
        text += `**Skipped:** ${invalidPaths.length} (${invalidPaths.join(", ")})\n`;
      }
      text += `\n## Summary\n\n`;
      text += `| Status | Count |\n|---|---|\n`;
      text += `| PASS | ${byStatus.pass.length} |\n`;
      text += `| WARN | ${byStatus.warn.length} |\n`;
      text += `| **FAIL** | **${byStatus.fail.length}** |\n\n`;

      if (byStatus.fail.length === 0 && byStatus.warn.length === 0) {
        text += `**VERDICT: PASS** - ready for ship-gate.\n\n`;
      } else if (byStatus.fail.length === 0) {
        text += `**VERDICT: PASS WITH WARNINGS** - review warnings before shipping.\n\n`;
      } else {
        text += `**VERDICT: FAIL** - ${byStatus.fail.length} critical issue${byStatus.fail.length > 1 ? "s" : ""}. DO NOT ship until resolved.\n\n`;
      }

      text += `---\n\n## Details\n\n`;

      const byCategory = groupByCategory(results);
      for (const [category, items] of Object.entries(byCategory)) {
        text += `### ${category}\n\n`;
        for (const r of items) {
          const icon = r.status === "pass" ? "[PASS]" : r.status === "warn" ? "[WARN]" : "[FAIL]";
          text += `- ${icon} **${r.rule}** - ${r.message}\n`;
          if (r.evidence && r.evidence.length > 0) {
            text += `  - Found in:\n`;
            for (const e of r.evidence.slice(0, 5)) {
              text += `    - \`${e}\`\n`;
            }
            if (r.evidence.length > 5) text += `    - ... and ${r.evidence.length - 5} more\n`;
          }
          if (r.fix) text += `  - Fix: ${r.fix}\n`;
        }
        text += `\n`;
      }

      if (byStatus.fail.length > 0) {
        text += `---\n\n## Next Steps\n\n`;
        text += `1. Fix all FAIL items above\n`;
        text += `2. Re-run \`designer_verify_implementation\` to confirm\n`;
        text += `3. If a FAIL is due to a DESIGN.md constraint that can't be met, escalate back to \`hyperstack:designer\` to revise the contract\n`;
        text += `4. Do NOT invoke \`hyperstack:ship-gate\` until this report shows PASS\n`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );
}

// ---------------------------------------------------------------------------
// Check implementations
// ---------------------------------------------------------------------------

interface CheckResult {
  category: string;
  rule: string;
  status: "pass" | "fail" | "warn";
  message: string;
  evidence?: string[];
  fix?: string;
}

function checkAntiPatterns(code: string, files: Array<{ path: string; content: string }>): CheckResult[] {
  const results: CheckResult[] = [];
  const category = "Anti-Patterns (AI Slop Fingerprint)";

  // 1. AI purple
  const aiPurpleRegex = /#6366[fF]1|from-indigo-500.+to-purple-500|from-purple-500.+to-indigo/g;
  const aiPurpleMatches = findMatches(files, aiPurpleRegex);
  results.push({
    category, rule: "No AI purple (#6366F1)",
    status: aiPurpleMatches.length === 0 ? "pass" : "fail",
    message: aiPurpleMatches.length === 0 ? "no #6366F1 or indigo→purple gradients found" : `found ${aiPurpleMatches.length} instances of AI purple`,
    evidence: aiPurpleMatches.slice(0, 10),
    fix: "Replace with a unique brand hue in OKLCH",
  });

  // 2. Cold Tailwind grey
  const coldGreyRegex = /#[Ff]9[Ff][Aa][Ff][Bb]|bg-gray-50(?![0-9])/g;
  const coldGreyMatches = findMatches(files, coldGreyRegex);
  results.push({
    category, rule: "No cold #F9FAFB background",
    status: coldGreyMatches.length === 0 ? "pass" : "warn",
    message: coldGreyMatches.length === 0 ? "no cold Tailwind grey backgrounds found" : `found ${coldGreyMatches.length} cold grey backgrounds`,
    evidence: coldGreyMatches.slice(0, 10),
    fix: "Use warm near-white: oklch(0.98 0.008-0.015 60-80)",
  });

  // 3. Pure black/white
  const pureBlackRegex = /color:\s*#000000?(?![0-9a-fA-F])|bg-black(?![-/])|text-black(?![-/])/g;
  const pureBlackMatches = findMatches(files, pureBlackRegex);
  if (pureBlackMatches.length > 5) {
    results.push({
      category, rule: "No pure #000 text on #FFF",
      status: "warn",
      message: `found ${pureBlackMatches.length} uses of pure black - consider near-black (oklch 0.12-0.15)`,
      evidence: pureBlackMatches.slice(0, 10),
      fix: "Use oklch(0.12 0.005 60) for warm near-black",
    });
  } else {
    results.push({
      category, rule: "No pure #000 text on #FFF", status: "pass",
      message: "pure black usage is minimal",
    });
  }

  // 4. rgba black shadows
  const rgbaShadowRegex = /box-shadow[^;]*rgba\s*\(\s*0\s*,\s*0\s*,\s*0/g;
  const rgbaShadowMatches = findMatches(files, rgbaShadowRegex);
  results.push({
    category, rule: "Warm-tinted shadows (no rgba black)",
    status: rgbaShadowMatches.length === 0 ? "pass" : "warn",
    message: rgbaShadowMatches.length === 0 ? "no rgba(0,0,0) shadows found" : `found ${rgbaShadowMatches.length} cold black shadows`,
    evidence: rgbaShadowMatches.slice(0, 10),
    fix: "Use oklch(0.22 0.006 56 / 0.06) warm-tinted shadows",
  });

  // 5. animate-bounce/pulse on static
  const decorativeAnimRegex = /animate-(bounce|pulse|ping|spin)(?!\s+(loading|loader|spinner))/g;
  const decorativeAnimMatches = findMatches(files, decorativeAnimRegex);
  if (decorativeAnimMatches.length > 3) {
    results.push({
      category, rule: "No decorative bounce/pulse",
      status: "warn",
      message: `found ${decorativeAnimMatches.length} decorative animations - verify each is on a loading state`,
      evidence: decorativeAnimMatches.slice(0, 10),
      fix: "Animation should only be on loading/state changes, not static decoration",
    });
  } else {
    results.push({
      category, rule: "No decorative bounce/pulse", status: "pass",
      message: "decorative animation usage is minimal",
    });
  }

  // 6. outline: none without replacement
  const outlineNoneRegex = /outline:\s*none/g;
  const focusVisibleRegex = /:focus-visible|focus:ring|focus-visible:ring/g;
  const outlineNoneCount = (code.match(outlineNoneRegex) || []).length;
  const focusVisibleCount = (code.match(focusVisibleRegex) || []).length;
  if (outlineNoneCount > 0 && focusVisibleCount === 0) {
    results.push({
      category, rule: "outline: none has replacement focus style",
      status: "fail",
      message: `found ${outlineNoneCount} 'outline: none' but no focus-visible or focus:ring replacement`,
      fix: "Add :focus-visible with 2px ring, 2px offset",
    });
  } else {
    results.push({
      category, rule: "outline: none has replacement focus style", status: "pass",
      message: outlineNoneCount === 0 ? "no outline: none found" : "focus-visible replacements present",
    });
  }

  return results;
}

function checkColorCompliance(designMd: string, code: string, files: Array<{ path: string; content: string }>): CheckResult[] {
  const results: CheckResult[] = [];
  const category = "Color System";

  // Check for OKLCH usage
  const oklchCount = (code.match(/oklch\s*\(/g) || []).length;
  const hexCount = (code.match(/#[0-9a-fA-F]{3,8}\b/g) || []).length;
  if (oklchCount === 0) {
    results.push({
      category, rule: "OKLCH tokens present", status: "fail",
      message: "no oklch() values found in code - DESIGN.md specifies OKLCH",
      fix: "Use design_tokens_generate to produce OKLCH-based tokens",
    });
  } else {
    results.push({
      category, rule: "OKLCH tokens present", status: "pass",
      message: `${oklchCount} oklch() values found`,
    });
  }

  if (hexCount > oklchCount * 2) {
    results.push({
      category, rule: "OKLCH preferred over hex", status: "warn",
      message: `${hexCount} hex values vs ${oklchCount} oklch - consider migrating more to OKLCH`,
    });
  }

  // Check for semantic tokens
  const semanticTokens = ["--background", "--foreground", "--primary", "--border", "--ring", "--muted"];
  const missing = semanticTokens.filter((t) => !code.includes(t));
  if (missing.length > 0) {
    results.push({
      category, rule: "Semantic color tokens defined",
      status: missing.length >= 4 ? "fail" : "warn",
      message: `missing semantic tokens: ${missing.join(", ")}`,
      fix: "Define semantic tokens in :root and .dark blocks",
    });
  } else {
    results.push({
      category, rule: "Semantic color tokens defined", status: "pass",
      message: "all required semantic tokens present",
    });
  }

  return results;
}

function checkTypographyCompliance(code: string, files: Array<{ path: string; content: string }>): CheckResult[] {
  const results: CheckResult[] = [];
  const category = "Typography";

  // Count weight-500 usages (slop indicator)
  const weight500 = (code.match(/font-weight:\s*500|font-medium/g) || []).length;
  const weight400 = (code.match(/font-weight:\s*400|font-normal/g) || []).length;
  const weight700 = (code.match(/font-weight:\s*[67]00|font-bold|font-semibold/g) || []).length;

  if (weight500 > 0 && weight700 === 0 && weight400 === 0) {
    results.push({
      category, rule: "Weight contrast (not all 500)", status: "fail",
      message: "only font-weight 500 used - no hierarchy",
      fix: "Use 400 for body, 600-800 for headings",
    });
  } else {
    results.push({
      category, rule: "Weight contrast (not all 500)", status: "pass",
      message: `weight contrast present (${weight400} @ 400, ${weight500} @ 500, ${weight700} @ 600+)`,
    });
  }

  // Prose width
  if (code.includes("max-w-prose") || code.includes("max-width: 65ch") || code.includes("max-w-[65ch]")) {
    results.push({
      category, rule: "Prose max-width 65ch applied", status: "pass",
      message: "65ch prose width constraint found",
    });
  } else {
    results.push({
      category, rule: "Prose max-width 65ch applied", status: "warn",
      message: "no 65ch max-width found - verify body text containers have this constraint",
      fix: "Add max-w-prose or max-w-[65ch] to body text containers",
    });
  }

  return results;
}

function checkSpacingCompliance(code: string, files: Array<{ path: string; content: string }>): CheckResult[] {
  const results: CheckResult[] = [];
  const category = "Spacing";

  // Check for non-4px values (common mistakes: 11px, 13px, 17px, 23px)
  const badSpacing = /\b(11|13|17|19|21|23|27|29|31|33|37|41|43|47)px\b/g;
  const badMatches = findMatches(files, badSpacing);
  if (badMatches.length > 0) {
    results.push({
      category, rule: "All spacing on 4px grid",
      status: "warn",
      message: `found ${badMatches.length} non-4px-grid values`,
      evidence: badMatches.slice(0, 10),
      fix: "Use multiples of 4: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96",
    });
  } else {
    results.push({
      category, rule: "All spacing on 4px grid", status: "pass",
      message: "no off-grid spacing values found",
    });
  }

  // z-index scale
  const badZ = /z-index:\s*(999[0-9]|[0-9]{4,})|z-\[9{3,}\]/g;
  const badZMatches = findMatches(files, badZ);
  if (badZMatches.length > 0) {
    results.push({
      category, rule: "Named z-index scale",
      status: "fail",
      message: `found ${badZMatches.length} arbitrary high z-index values`,
      evidence: badZMatches.slice(0, 5),
      fix: "Use named scale: dropdown(1000), modal(1050), tooltip(1070), toast(1080)",
    });
  } else {
    results.push({
      category, rule: "Named z-index scale", status: "pass",
      message: "no arbitrary z-index values",
    });
  }

  return results;
}

function checkComponentStates(designMd: string, code: string, files: Array<{ path: string; content: string }>): CheckResult[] {
  const results: CheckResult[] = [];
  const category = "Component States";

  // Check for hover/focus/disabled states in components
  const buttonFiles = files.filter((f) =>
    f.path.toLowerCase().includes("button") || f.content.includes("<Button")
  );

  if (buttonFiles.length > 0) {
    const buttonCode = buttonFiles.map((f) => f.content).join("\n");
    const hasHover = /hover:|:hover/.test(buttonCode);
    const hasFocus = /focus-visible:|focus:|:focus/.test(buttonCode);
    const hasDisabled = /disabled:|:disabled|aria-disabled/.test(buttonCode);

    const missing: string[] = [];
    if (!hasHover) missing.push("hover");
    if (!hasFocus) missing.push("focus");
    if (!hasDisabled) missing.push("disabled");

    if (missing.length > 0) {
      results.push({
        category, rule: "Button has all states",
        status: "fail",
        message: `button component missing states: ${missing.join(", ")}`,
        fix: "Add hover, focus-visible, and disabled states to all interactive components",
      });
    } else {
      results.push({
        category, rule: "Button has all states", status: "pass",
        message: "button has hover, focus, and disabled states",
      });
    }
  }

  // cursor: pointer on clickable
  const clickableWithoutCursor = /(<div|<span)[^>]*onClick[^>]*(?!cursor-pointer)/g;
  const cursorMatches = findMatches(files, clickableWithoutCursor);
  if (cursorMatches.length > 0) {
    results.push({
      category, rule: "cursor: pointer on clickable divs/spans",
      status: "warn",
      message: `${cursorMatches.length} divs/spans with onClick may be missing cursor-pointer`,
      fix: "Add cursor-pointer OR use <button> element instead",
    });
  }

  // Emoji icons check - covers emoji ranges U+1F300-1F9FF (misc symbols/pictographs),
  // U+2600-27BF (misc symbols, dingbats), U+23F0-23FF (clock/hourglass), U+2B00-2BFF (misc symbols+arrows)
  const emojiIconRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{23F0}-\u{23FF}\u{2B00}-\u{2BFF}\u{1FA70}-\u{1FAFF}]/gu;
  const emojiMatches = findMatches(files, emojiIconRegex);
  if (emojiMatches.length > 2) {
    results.push({
      category, rule: "No emojis as icons (SVG only)",
      status: "warn",
      message: `found ${emojiMatches.length} string literals containing emojis - verify none are used as functional icons`,
      evidence: emojiMatches.slice(0, 10),
      fix: "Replace with SVG icons from Lucide, Heroicons, or Phosphor",
    });
  }

  return results;
}

function checkMotionCompliance(code: string, files: Array<{ path: string; content: string }>): CheckResult[] {
  const results: CheckResult[] = [];
  const category = "Motion";

  // prefers-reduced-motion
  if (code.includes("prefers-reduced-motion")) {
    results.push({
      category, rule: "prefers-reduced-motion implemented", status: "pass",
      message: "prefers-reduced-motion media query found",
    });
  } else {
    results.push({
      category, rule: "prefers-reduced-motion implemented", status: "fail",
      message: "no prefers-reduced-motion found (WCAG 2.3.3 violation)",
      fix: "Add @media (prefers-reduced-motion: reduce) with !important in @layer base",
    });
  }

  // Linear easing
  const linearEasing = /transition[^;]*ease-linear|ease:\s*["']?linear/g;
  const linearMatches = findMatches(files, linearEasing);
  if (linearMatches.length > 0) {
    results.push({
      category, rule: "No linear easing for UI",
      status: "warn",
      message: `found ${linearMatches.length} linear easings (should use ease-out/ease-in/ease-in-out)`,
      evidence: linearMatches.slice(0, 5),
      fix: "Use ease-out for enter, ease-in for exit, ease-in-out for reposition",
    });
  }

  // Long transitions
  const longTransitions = /transition[^;]*(6|7|8|9)\d\dms|transition[^;]*[1-9]\.\ds/g;
  const longMatches = findMatches(files, longTransitions);
  if (longMatches.length > 0) {
    results.push({
      category, rule: "No transitions > 500ms",
      status: "warn",
      message: `${longMatches.length} transitions longer than 500ms found`,
      evidence: longMatches.slice(0, 5),
      fix: "Keep UI transitions under 500ms (150-300ms typical)",
    });
  }

  return results;
}

function checkAccessibility(code: string, files: Array<{ path: string; content: string }>): CheckResult[] {
  const results: CheckResult[] = [];
  const category = "Accessibility";

  // aria-label on icon-only buttons
  const iconButtonRegex = /<button[^>]*>\s*<(svg|Lucide|Heroicon|Icon)[^/]*\/>\s*<\/button>/g;
  const iconButtonMatches = findMatches(files, iconButtonRegex);
  if (iconButtonMatches.length > 0) {
    results.push({
      category, rule: "aria-label on icon-only buttons",
      status: "warn",
      message: `${iconButtonMatches.length} icon-only buttons found - verify aria-label present`,
      fix: "Add aria-label to every icon-only button",
    });
  }

  // Heading hierarchy - check for skipping levels in a single file
  for (const f of files) {
    if (!f.path.match(/\.(tsx?|jsx?|vue|svelte|html)$/)) continue;
    const headings = f.content.match(/<h[1-6]/g) || [];
    if (headings.length === 0) continue;
    const levels = headings.map((h) => parseInt(h.replace("<h", ""), 10));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i]! > levels[i - 1]! + 1) {
        results.push({
          category, rule: "Sequential heading hierarchy",
          status: "warn",
          message: `heading level skip in ${f.path} (h${levels[i - 1]} → h${levels[i]})`,
          fix: "Don't skip heading levels",
        });
        break;
      }
    }
  }

  // Images have alt
  const imgWithoutAlt = /<img\b[^>]*(?!alt=)[^>]*\/?>/g;
  const imgMatches = findMatches(files, imgWithoutAlt);
  if (imgMatches.length > 0) {
    results.push({
      category, rule: "All images have alt text",
      status: "warn",
      message: `${imgMatches.length} img tags may be missing alt - verify`,
      evidence: imgMatches.slice(0, 5),
      fix: 'Add alt="description" for informational, alt="" for decorative',
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findMatches(files: Array<{ path: string; content: string }>, regex: RegExp): string[] {
  const matches: string[] = [];
  for (const f of files) {
    const lines = f.content.split("\n");
    lines.forEach((line, i) => {
      if (regex.test(line)) {
        matches.push(`${f.path}:${i + 1}: ${line.trim().slice(0, 100)}`);
      }
      regex.lastIndex = 0;
    });
  }
  return matches;
}

function groupByCategory(results: CheckResult[]): Record<string, CheckResult[]> {
  const grouped: Record<string, CheckResult[]> = {};
  for (const r of results) {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category]!.push(r);
  }
  return grouped;
}
