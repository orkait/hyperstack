import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Persona manifests live in the top-level personas/ vertical (content), loaded
// from src/ here the same way the context-compiler reads top-level skills/.
const personasDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "personas");

export interface PersonaManifest {
  id: string;
  name: string;
  version: string;
  owns: { risks: string[]; plugin: string; skills: string[] };
  engaged_by?: string;
  engages_when: string[];
  gate_policy: { net_new: "hard" | "advisory"; tweak: "hard" | "advisory"; override: string };
}

function isValid(m: unknown): m is PersonaManifest {
  const p = m as Partial<PersonaManifest>;
  return (
    !!p &&
    typeof p.id === "string" &&
    !!p.owns &&
    Array.isArray(p.owns.risks) &&
    !!p.gate_policy
  );
}

export function loadPersonas(): PersonaManifest[] {
  const out: PersonaManifest[] = [];
  for (const entry of readdirSync(personasDir)) {
    const dir = join(personasDir, entry);
    const manifestPath = join(dir, "persona.json");
    if (!existsSync(manifestPath) || !statSync(dir).isDirectory()) continue;
    try {
      const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
      if (isValid(parsed)) out.push(parsed);
      else console.error(`Persona manifest invalid, skipped: ${manifestPath}`);
    } catch (err) {
      console.error(`Persona manifest unreadable, skipped: ${manifestPath}:`, err);
    }
  }
  return out;
}
