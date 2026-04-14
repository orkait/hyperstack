import { test, expect } from "bun:test";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const SKILLS_DIR = resolve("skills");
const INDEX_PATH = resolve("skills/INDEX.md");

function getSkillDirs(): string[] {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(join(SKILLS_DIR, name, "SKILL.md")));
}

function getSkillCategory(skillName: string): string | null {
  const skillFile = join(SKILLS_DIR, skillName, "SKILL.md");
  const content = readFileSync(skillFile, "utf8");
  const match = content.match(/^category:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

test("skills/INDEX.md stays in sync with actual skill directories", () => {
  const currentIndex = readFileSync(INDEX_PATH, "utf8");

  execSync("bash scripts/generate-skills-index.sh", { stdio: "pipe" });

  const regenerated = readFileSync(INDEX_PATH, "utf8");
  expect(currentIndex).toBe(regenerated);
});

test("every skill directory has a SKILL.md with required frontmatter fields", () => {
  const skillDirs = getSkillDirs();
  expect(skillDirs.length).toBeGreaterThan(0);

  for (const skillName of skillDirs) {
    const skillFile = join(SKILLS_DIR, skillName, "SKILL.md");
    const content = readFileSync(skillFile, "utf8");

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
  const indexContent = readFileSync(INDEX_PATH, "utf8");
  const skillDirs = getSkillDirs();

  for (const skillName of skillDirs) {
    expect(indexContent).toMatch(new RegExp(`\`${skillName}\``));
  }
});
