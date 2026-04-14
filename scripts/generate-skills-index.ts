import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function generateIndex() {
  const REPO_ROOT = path.resolve(__dirname, "..");
  const SKILLS_DIR = path.join(REPO_ROOT, "skills");
  const INDEX_FILE = path.join(SKILLS_DIR, "INDEX.md");

  console.log("Generating skills index (cross-platform)...");

  const skills: SkillInfo[] = [];

  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const dir of dirs) {
    const skillPath = path.join(SKILLS_DIR, dir.name, "SKILL.md");
    if (!fs.existsSync(skillPath)) continue;

    const content = fs.readFileSync(skillPath, "utf8");
    
    // Simple frontmatter parser
    const categoryMatch = content.match(/^category:\s*(.*)/m);
    const category = categoryMatch ? categoryMatch[1].trim() : "uncategorized";

    // Extract description (handles multi-line and single-line)
    const descMatch = content.match(/^description:\s*(?:>|-)?\s*(.*)/m);
    let description = descMatch ? descMatch[1].trim() : "";
    
    // If it's multi-line, we might need a more robust parser, 
    // but for the index, the first line is usually enough.
    description = description.replace(/^["'>\-\s]+/, "").substring(0, 120);

    skills.push({ name: dir.name, category, description });
  }

  const core = skills.filter(s => s.category === "core");
  const domain = skills.filter(s => s.category === "domain");
  const meta = skills.filter(s => s.category === "meta");
  const uncategorized = skills.filter(s => !["core", "domain", "meta"].includes(s.category));

  const formatTable = (list: SkillInfo[]) => {
    if (list.length === 0) return "";
    return list.map(s => `| \`${s.name}\` | ${s.description} |`).sort().join("\n") + "\n";
  };

  const output = `# Hyperstack Skills Index

Auto-generated from each skill's frontmatter \`category\` field.
Regenerate with: \`bun scripts/generate-skills-index.ts\` or \`npm run skills:index\`

Categories:
- **core** - workflow, discipline, and gates used on every task
- **domain** - specialized skills for specific contexts (visual, components, security, docs)
- **meta** - skills about skills (bootstrap, testing)

---

## Core (workflow + discipline)

| Skill | Description |
|---|---|
${formatTable(core)}
## Domain (specialized context)

| Skill | Description |
|---|---|
${formatTable(domain)}
## Meta (skills about skills)

| Skill | Description |
|---|---|
${formatTable(meta)}
${uncategorized.length > 0 ? `
## Uncategorized (missing \`category:\` field)

| Skill | Description |
|---|---|
${formatTable(uncategorized)}

These skills need a \`category:\` added to their frontmatter.
` : ""}
`;

  fs.writeFileSync(INDEX_FILE, output);
  console.log(`Wrote ${INDEX_FILE}`);
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIndex();
}
