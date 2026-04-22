#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginRoot = dirname(scriptDir);

function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

try {
  const skillPath = join(pluginRoot, "skills", "using-hyperstack", "SKILL.md");
  const skillContent = readFileSync(skillPath, "utf8");
  const sessionContext = `<EXTREMELY_IMPORTANT>\nYou have Hyperstack.\n\n**Below is the full content of your 'hyperstack:using-hyperstack' skill - your introduction to using Hyperstack. For all other skills, use the 'Skill' tool:**\n\n${skillContent}\n</EXTREMELY_IMPORTANT>`;

  if (process.env.CURSOR_PLUGIN_ROOT) {
    emit({ additional_context: sessionContext });
  } else if (process.env.CLAUDE_PLUGIN_ROOT && !process.env.COPILOT_CLI) {
    emit({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: sessionContext,
      },
    });
  } else {
    emit({ additionalContext: sessionContext });
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${JSON.stringify({ error: `Hyperstack session-start hook failed: ${message}` })}\n`);
  process.exit(1);
}
