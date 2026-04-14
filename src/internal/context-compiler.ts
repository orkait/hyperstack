import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface ContextArtifact {
  outputPath: string;
  sourcePath: string;
  content: string;
}

export interface BootstrapCompilationStats {
  sourceChars: number;
  artifactChars: number;
  savingsRatio: number;
}

const REQUIRED_BOOTSTRAP_MARKERS = [
  "The 1% Rule",
  "NO CODE WITHOUT MCP GROUND-TRUTH DATA",
  "NO VISUAL CODE WITHOUT AN APPROVED DESIGN.md",
  "NO COMPLETION CLAIMS WITHOUT SHIP-GATE EVIDENCE",
  "NO SKIPPING SKILLS BECAUSE \"THIS IS SIMPLE\"",
  "designer_*",
  "design_tokens_*",
  "ui_ux_*",
  "reactflow_*",
  "motion_*",
  "lenis_*",
  "react_*",
  "echo_*",
  "golang_*",
  "rust_*",
  "blueprint",
  "designer",
  "forge-plan",
  "ship-gate",
  "deliver",
  "run-plan",
  "autonomous-mode",
  "subagent-ops",
  "engineering-discipline",
  "worktree-isolation",
  "debug-discipline",
  "parallel-dispatch",
  "MCP unavailable",
  "announce it",
  "main",
  "website-builder",
  "auto-called",
  "main -> website-builder",
];

function stripFrontmatter(source: string): string {
  return source.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function extractTaggedBlock(source: string, tag: string): string {
  const pattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const match = source.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Could not extract <${tag}> block from source`);
  }
  return match[1].trim();
}

function extractSection(source: string, heading: string): string {
  const lines = source.split("\n");
  const targetHeading = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === targetHeading);
  if (startIndex === -1) {
    throw new Error(`Could not extract section "${heading}" from source`);
  }
  const contentLines: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (line.startsWith("## ")) {
      break;
    }
    contentLines.push(line);
  }
  return contentLines.join("\n").trim();
}

function extractCodeBlock(section: string): string {
  const match = section.match(/```([\s\S]*?)```/);
  if (!match?.[1]) {
    throw new Error("Could not extract code block from section");
  }
  return match[1].trim();
}

interface TableRow {
  cells: string[];
}

function parseMarkdownTable(section: string): TableRow[] {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .filter((line) => !/^(\|\s*-+\s*)+\|?$/.test(line.replace(/:[-\s]+/g, "---")))
    .slice(1)
    .map((line) => ({
      cells: line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0),
    }))
    .filter((row) => row.cells.length > 0);
}

function compactNamespaceTable(section: string): string[] {
  return parseMarkdownTable(section)
    .filter((row) => row.cells.length >= 3)
    .map((row) => `- ${row.cells[0]} -> ${row.cells[2]}`);
}

function compactWorkflowTables(source: string): string[] {
  const workflowSection = extractSection(source, "Layer 2: Skills (Engineering Process)");
  const rows = parseMarkdownTable(workflowSection).filter((row) => row.cells.length >= 2);

  return rows
    .filter((row) => row.cells[0] !== "Skill")
    .map((row) => `- ${row.cells[0]}: ${row.cells[1]}`);
}

function extractFinalCheck(source: string): string[] {
  const finalSection = extractSection(source, "Final Check Before Any Response");
  return finalSection
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.") || line.startsWith("5."))
    .map((line) => `- ${line.replace(/^\d+\.\s*/, "")}`);
}

function extractRedFlags(source: string): string[] {
  const redFlagsSection = extractSection(source, "Red Flags — STOP");
  const rows = parseMarkdownTable(redFlagsSection).filter((row) => row.cells.length >= 2);
  return rows.slice(0, 6).map((row) => `- ${row.cells[0]} -> ${row.cells[1]}`);
}

function extractInstructionPriority(source: string): string[] {
  const section = extractSection(source, "Instruction Priority");
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+\./.test(line))
    .map((line) => `- ${line.replace(/^\d+\.\s*/, "")}`);
}

function extractSimpleBullets(section: string): string[] {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line);
}

export function compileUsingHyperstackBootstrap(source: string): { content: string; stats: BootstrapCompilationStats } {
  const body = stripFrontmatter(source);
  const criticalBlock = extractTaggedBlock(body, "EXTREMELY-IMPORTANT");
  const ironLaws = extractCodeBlock(extractSection(body, "The Iron Laws"));
  const namespaces = compactNamespaceTable(extractSection(body, "Layer 1: MCP Tools (Ground-Truth Data)"));
  const workflowSkills = compactWorkflowTables(body);
  const instructionPriority = extractInstructionPriority(body);
  const roleRegistry = extractSimpleBullets(extractSection(body, "Role Registry"));
  const routingSummary = extractSimpleBullets(extractSection(body, "Routing Summary"));
  const allowedTransitions = extractSimpleBullets(extractSection(body, "Allowed Transitions"));
  const disallowedTransitions = extractSimpleBullets(extractSection(body, "Disallowed Transitions"));
  const finalCheck = extractFinalCheck(body);
  const redFlags = extractRedFlags(body);

  const content = [
    "<!-- GENERATED FILE. Edit skills/using-hyperstack/SKILL.md and re-run `bun run compile:context`. -->",
    "# Hyperstack Runtime Bootstrap",
    "",
    "## Critical",
    criticalBlock,
    "",
    "## Iron Laws",
    "```",
    ironLaws,
    "```",
    "",
    "## Instruction Priority",
    ...instructionPriority,
    "",
    "## MCP Must-Call-First",
    ...namespaces,
    "",
    "## Workflow Skills",
    ...workflowSkills,
    "",
    "## Internal Roles",
    "- Roles are internal and auto-called. Users do not invoke them directly.",
    ...roleRegistry,
    "",
    "## Routing Summary",
    ...routingSummary,
    "",
    "## Allowed Transitions",
    ...allowedTransitions,
    "",
    "## Disallowed Transitions",
    ...disallowedTransitions,
    "",
    "## High-Signal Red Flags",
    ...redFlags,
    "",
    "## Degraded Mode",
    "- If MCP unavailable, tell the user explicitly: \"MCP unavailable\" and flag answers as uncertain.",
    "",
    "## Announcement Rule",
    "- Before invoking any Hyperstack skill, announce it with the exact format and purpose so the user can audit it.",
    "",
    "## Final Check",
    ...finalCheck,
    "",
  ].join("\n");

  const stats: BootstrapCompilationStats = {
    sourceChars: source.length,
    artifactChars: content.length,
    savingsRatio: source.length === 0 ? 0 : 1 - content.length / source.length,
  };

  return { content, stats };
}

export function validateUsingHyperstackBootstrap(content: string): string[] {
  return REQUIRED_BOOTSTRAP_MARKERS.filter((marker) => !content.includes(marker));
}

export function compileContextArtifacts(pluginRoot: string): ContextArtifact[] {
  const sourcePath = join(pluginRoot, "skills", "using-hyperstack", "SKILL.md");
  const outputPath = join(pluginRoot, "generated", "runtime-context", "using-hyperstack.bootstrap.md");

  const source = readFileSync(sourcePath, "utf8");
  const { content } = compileUsingHyperstackBootstrap(source);
  const missing = validateUsingHyperstackBootstrap(content);
  if (missing.length > 0) {
    throw new Error(`Generated bootstrap artifact is missing required markers: ${missing.join(", ")}`);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, content, "utf8");

  return [{ sourcePath, outputPath, content }];
}
