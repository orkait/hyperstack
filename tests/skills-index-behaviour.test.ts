import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import test from "node:test";

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
  assert.equal(
    currentIndex,
    regenerated,
    "skills/INDEX.md is stale. Run `bash scripts/generate-skills-index.sh` to regenerate.",
  );
});

test("every skill directory has a SKILL.md with required frontmatter fields", () => {
  const skillDirs = getSkillDirs();
  assert.ok(skillDirs.length > 0, "No skill directories found");

  for (const skillName of skillDirs) {
    const skillFile = join(SKILLS_DIR, skillName, "SKILL.md");
    const content = readFileSync(skillFile, "utf8");

    assert.match(content, /^---\n/m, `${skillName}/SKILL.md missing frontmatter opening`);
    assert.match(content, /^name:\s*.+$/m, `${skillName}/SKILL.md missing 'name:' field`);
    assert.match(content, /^category:\s*.+$/m, `${skillName}/SKILL.md missing 'category:' field`);
    assert.match(content, /^description:\s*.+/ms, `${skillName}/SKILL.md missing 'description:' field`);
  }
});

test("every skill has a valid category (core | domain | meta)", () => {
  const VALID_CATEGORIES = new Set(["core", "domain", "meta"]);
  const skillDirs = getSkillDirs();

  for (const skillName of skillDirs) {
    const category = getSkillCategory(skillName);
    assert.ok(
      category && VALID_CATEGORIES.has(category),
      `${skillName}/SKILL.md has invalid category: "${category}". Must be core | domain | meta`,
    );
  }
});

test("skills/INDEX.md references every skill directory that has a SKILL.md", () => {
  const indexContent = readFileSync(INDEX_PATH, "utf8");
  const skillDirs = getSkillDirs();

  for (const skillName of skillDirs) {
    assert.match(
      indexContent,
      new RegExp(`\`${skillName}\``),
      `skills/INDEX.md does not reference skill: ${skillName}`,
    );
  }
});
