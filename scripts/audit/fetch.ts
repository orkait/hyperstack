import type { Registry } from "./sources.js";

export interface VersionResult {
  name: string;
  latest: string | null;
  error?: string;
}

export async function fetchLatest(name: string, registry: Registry): Promise<VersionResult> {
  try {
    if (registry === "npm") {
      const enc = name.startsWith("@")
        ? "@" + encodeURIComponent(name.slice(1))
        : encodeURIComponent(name);
      const res = await fetch(`https://registry.npmjs.org/${enc}/latest`, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) return { name, latest: null, error: `npm ${res.status}` };
      const json = (await res.json()) as { version?: string };
      return { name, latest: json.version ?? null };
    }
    if (registry === "go-proxy") {
      const res = await fetch(`https://proxy.golang.org/${name}/@latest`, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) return { name, latest: null, error: `go-proxy ${res.status}` };
      const json = (await res.json()) as { Version?: string };
      return { name, latest: json.Version ? json.Version.replace(/^v/, "") : null };
    }
    return { name, latest: null, error: `unknown registry ${registry}` };
  } catch (err) {
    return { name, latest: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export function majorOf(version: string): number | null {
  const head = version.replace(/^v/, "").split(".")[0];
  const n = parseInt(head, 10);
  return Number.isFinite(n) ? n : null;
}

export function classifyBump(targetMajor: number, latest: string | null): string {
  if (!latest) return "unknown";
  const lm = majorOf(latest);
  if (lm === null) return "unknown";
  if (lm > targetMajor) return "MAJOR-BEHIND";
  if (lm < targetMajor) return "ahead";
  return "current-major";
}
