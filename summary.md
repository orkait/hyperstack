# Migration: unified-mcp + unified-skill → unified

## Goal

Merge two tightly-coupled repos into one monorepo called `unified`.

Current repos:
- `github.com/orkait/unified-mcp` - MCP server (TypeScript, Docker)
- `github.com/orkait/unified-skill` - Claude Code skill (SKILL.md only)

Target repo: `github.com/orkait/unified`

---

## Target Structure

```
unified/
├── SKILL.md              ← moved from unified-skill root (must stay at root for ~/.claude/skills/)
├── README.md             ← new combined README
├── mcp/                  ← everything from unified-mcp root
│   ├── src/
│   ├── snippets/
│   ├── scripts/
│   ├── dist/             ← gitignored
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
└── .gitignore
```

**Critical constraint:** `SKILL.md` must stay at the repo root. Claude Code skill loading resolves `SKILL.md` relative to the cloned directory. If the user clones to `~/.claude/skills/unified`, it reads `~/.claude/skills/unified/SKILL.md`.

---

## Migration Steps

### 1. Create new GitHub repo
- Name: `unified` under `orkait` org
- Description: "MCP server + Claude Code skill for AI-assisted development"
- Public, MIT license, no auto-init

### 2. Set up local repo
```bash
mkdir unified && cd unified
git init
git remote add origin git@github.com:orkait/unified.git
```

### 3. Copy files from unified-mcp
```bash
# from unified-mcp root, copy everything into mcp/ subdirectory
cp -r src snippets scripts Dockerfile package.json package-lock.json tsconfig.json .dockerignore mcp/
```

### 4. Copy SKILL.md from unified-skill
```bash
# SKILL.md goes at root, not inside mcp/
cp ../unified-skill/SKILL.md ./SKILL.md
```

### 5. .gitignore
Create `.gitignore` at root:
```
mcp/node_modules/
mcp/dist/
```

### 6. Update scripts/start-mcp.sh
The script references paths relative to itself. Update any absolute or relative path assumptions to account for being inside `mcp/` subdirectory. The script should `cd` to its own directory (`mcp/`) before running node.

### 7. Update Dockerfile
The Dockerfile WORKDIR and COPY paths are relative to build context. Build context will now be `mcp/` so no changes needed IF docker build is run from inside `mcp/`. Document this in README.

### 8. Update MCP config path
Users must update their `~/.claude.json` or equivalent:
```json
{
  "mcpServers": {
    "unified": {
      "command": "/path/to/unified/mcp/scripts/start-mcp.sh"
    }
  }
}
```

### 9. Write combined README.md
- Hero block: `unified` as the name, tagline covers both skill + MCP
- Single install section: clone once, configure MCP path to `mcp/scripts/start-mcp.sh`
- Skill section: `~/.claude/skills/unified` path
- Plugin table from unified-mcp README
- Tools section from unified-mcp README (collapsible)
- Badge style: flat-square, matching current unified-mcp badges

### 10. Commit and push
```bash
git add .
git commit -m "feat: initial unified monorepo - merge unified-mcp and unified-skill"
git push -u origin main
```

### 11. Archive old repos
On GitHub, go to Settings → Archive on both `unified-mcp` and `unified-skill`. Add a notice to their READMEs pointing to the new repo.

---

## Key Constraints

- `SKILL.md` at root is non-negotiable - do not nest it
- `mcp/` contains everything that was previously at unified-mcp root
- Do not rename any tool names in TypeScript - MCP tool names are user-facing
- `npm run build` and `npm start` run from inside `mcp/` not repo root
- Docker build context is `mcp/` directory

---

## Out of Scope

- No changes to plugin code, snippet files, or tool implementations
- No changes to SKILL.md content
- No new plugins
- No TypeScript refactors
