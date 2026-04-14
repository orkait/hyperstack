import { test, expect } from "bun:test";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { generateIndex } from "../scripts/generate-skills-index.ts";

const SKILLS_DIR = resolve("skills");
const INDEX_PATH = resolve("skills/INDEX.md");

function normalize(str: string): string {
  return str.replace(/\r\n/g, "\n");
}

function getSkillDirs(): string[] {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(join(SKILLS_DIR, name, "SKILL.md")));
}

function getSkillCategory(skillName: string): string | null {
  const skillFile = join(SKILLS_DIR, skillName, "SKILL.md");
  const content = normalize(readFileSync(skillFile, "utf8"));
  const match = content.match(/^category:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

test("skills/INDEX.md stays in sync with actual skill directories", () => {
  const currentIndex = normalize(readFileSync(INDEX_PATH, "utf8"));

  generateIndex();

  const regenerated = normalize(readFileSync(INDEX_PATH, "utf8"));
  expect(currentIndex).toBe(regenerated);
});

test("every skill directory has a SKILL.md with required frontmatter fields", () => {
  const skillDirs = getSkillDirs();
  expect(skillDirs.length).toBeGreaterThan(0);

  for (const skillName of skillDirs) {
    const skillFile = join(SKILLS_DIR, skillName, "SKILL.md");
    const content = normalize(readFileSync(skillFile, "utf8"));

    expect(content).toMatch(/^---\n/m);
    expect(content).toMatch(/^name:\s*.+$/m);
    expect(content).toMatch(/^category:\s*.+$/m);
    expect(content).toMatch(/^description:\s*.+/ms);
  }
});

test("every skill has a valid category (core | domain | meta)", () => {
  const VALID_CATEGORIES = new Set(["core", "domain", "meta"]);
  const skillDirs = getSkillDirs();

  for (const skillName of skillDirs) {
    const category = getSkillCategory(skillName);
    expect(category).toBeDefined();
    expect(VALID_CATEGORIES.has(category!)).toBe(true);
  }
});

test("skills/INDEX.md references every skill directory that has a SKILL.md", () => {
  const indexContent = normalize(readFileSync(INDEX_PATH, "utf8"));
  const skillDirs = getSkillDirs();

  for (const skillName of skillDirs) {
    expect(indexContent).toMatch(new RegExp(`\`${skillName}\``));
  }
});
