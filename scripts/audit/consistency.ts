import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

export interface SourceFile {
  path: string; // repo-relative, e.g. src/plugins/shadcn/data.ts
  content: string;
}

export interface Finding {
  rule: string;
  location: string;
  detail: string;
}

function normalizePath(p: string): string {
  const stack: string[] = [];
  for (const part of p.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack.join("/");
}

function pluginOf(path: string): string | null {
  const m = path.match(/^src\/plugins\/([^/]+)\//);
  return m ? m[1] : null;
}

const INTERNAL_PREFIXES = [/@repo\//, /@workspace\//];

export function lintInternalImportLeaks(files: SourceFile[]): Finding[] {
  const out: Finding[] = [];
  for (const f of files) {
    f.content.split("\n").forEach((line, i) => {
      for (const re of INTERNAL_PREFIXES) {
        if (re.test(line)) {
          out.push({ rule: "internal-import-leak", location: `${f.path}:${i + 1}`, detail: line.trim() });
        }
      }
    });
  }
  return out;
}

export function lintDuplicateExports(files: SourceFile[]): Finding[] {
  // Scope by plugin: cross-plugin same-named consts are independent islands, not drift.
  // Only a const defined in >1 file within the same plugin (or the shared root) is flagged.
  const groups = new Map<string, Map<string, string[]>>();
  for (const f of files) {
    const group = pluginOf(f.path) ?? "<root>";
    const byName = groups.get(group) ?? new Map<string, string[]>();
    const re = /export\s+const\s+([A-Z][A-Z0-9_]+)\s*=/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(f.content)) !== null) {
      const arr = byName.get(m[1]) ?? [];
      if (!arr.includes(f.path)) arr.push(f.path);
      byName.set(m[1], arr);
    }
    groups.set(group, byName);
  }
  const out: Finding[] = [];
  for (const byName of groups.values()) {
    for (const [name, paths] of byName) {
      if (paths.length > 1) {
        out.push({ rule: "divergent-duplicate", location: paths.join(", "), detail: `const ${name} defined in ${paths.length} files` });
      }
    }
  }
  return out;
}

export function lintOrphanModules(files: SourceFile[], entrypoints: Set<string> = new Set()): Finding[] {
  const imported = new Set<string>();
  for (const f of files) {
    const dir = f.path.replace(/\/[^/]+$/, "");
    const re = /from\s+["'](\.[^"']+)["']/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(f.content)) !== null) {
      const spec = m[1].replace(/\.(js|ts)$/, "");
      imported.add(normalizePath(`${dir}/${spec}`));
    }
  }
  const out: Finding[] = [];
  for (const f of files) {
    const base = f.path.replace(/^.*\//, "");
    if (base === "index.ts" || base === "registry.ts") continue; // entry/aggregator
    if (entrypoints.has(f.path)) continue; // CLI/script entrypoint, not orphan
    const id = f.path.replace(/\.ts$/, "");
    if (!imported.has(id)) {
      out.push({ rule: "orphan-module", location: f.path, detail: "exported module imported by no other file" });
    }
  }
  return out;
}

export function lintSnippetRefs(files: SourceFile[], existingSnippets: Set<string>): Finding[] {
  const out: Finding[] = [];
  for (const f of files) {
    const plugin = pluginOf(f.path);
    if (!plugin) continue;
    const re = /snippet\(\s*["']([^"']+)["']\s*\)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(f.content)) !== null) {
      const full = `src/plugins/${plugin}/snippets/${m[1]}`;
      if (!existingSnippets.has(full)) {
        out.push({ rule: "snippet-ref", location: f.path, detail: `snippet("${m[1]}") -> missing ${full}` });
      }
    }
  }
  return out;
}

function walk(dir: string, pred: (p: string) => boolean, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, pred, acc);
    else if (pred(full)) acc.push(full);
  }
  return acc;
}

function readEntrypoints(root: string): Set<string> {
  const set = new Set<string>();
  try {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
      bin?: string | Record<string, string>;
    };
    const blobs: string[] = [
      ...Object.values(pkg.scripts ?? {}),
      ...(typeof pkg.bin === "string" ? [pkg.bin] : Object.values(pkg.bin ?? {})),
    ];
    for (const blob of blobs) {
      for (const m of blob.matchAll(/(?:^|[\s"'])(src\/[^\s"']+\.ts)/g)) {
        set.add(m[1]);
      }
    }
  } catch { /* no package.json */ }
  return set;
}

export function runConsistency(root: string): Finding[] {
  root = resolve(root);
  const srcDir = join(root, "src");
  const tsFiles = walk(srcDir, (p) => p.endsWith(".ts") && !p.endsWith(".test.ts"));
  const files: SourceFile[] = tsFiles.map((abs) => ({
    path: abs.slice(root.length + 1),
    content: readFileSync(abs, "utf8"),
  }));

  const snippets = new Set<string>();
  const pluginsDir = join(root, "src", "plugins");
  for (const plugin of readdirSync(pluginsDir)) {
    const snipDir = join(pluginsDir, plugin, "snippets");
    try {
      if (statSync(snipDir).isDirectory()) {
        for (const abs of walk(snipDir, (p) => p.endsWith(".txt"))) {
          snippets.add(abs.slice(root.length + 1));
        }
      }
    } catch { /* no snippets dir */ }
  }

  return [
    ...lintInternalImportLeaks(files),
    ...lintDuplicateExports(files),
    ...lintOrphanModules(files, readEntrypoints(root)),
    ...lintSnippetRefs(files, snippets),
  ];
}
