import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { TOKEN_PROCEDURES, getProcedureByStep } from "../data.js";

function renderProcedure(proc: {
  step: number;
  title: string;
  description: string;
  code?: string;
  rules?: string[];
  gotchas?: string[];
}): string {
  let text = `# Step ${proc.step}: ${proc.title}\n\n${proc.description}\n\n`;

  if (proc.code) {
    text += `## Code\n\`\`\`css\n${proc.code}\n\`\`\`\n\n`;
  }

  if (proc.rules && proc.rules.length > 0) {
    text += `## Rules\n`;
    for (const rule of proc.rules) text += `- ${rule}\n`;
  }

  if (proc.gotchas && proc.gotchas.length > 0) {
    text += `\n## Gotchas\n`;
    for (const gotcha of proc.gotchas) text += `- ${gotcha}\n`;
  }

  return text;
}

export function register(server: ToolServer): void {
  server.tool(
    "design_tokens_get_procedure",
    "Get the step-by-step token system build procedure. Steps 1-8 cover the full production workflow.",
    {
      step: z.number().min(1).max(8).optional()
        .describe("Step number (1-8). Omit to get all steps."),
    },
    async ({ step }: { step?: number }) => {
      if (step !== undefined) {
        const proc = getProcedureByStep(step);
        if (!proc) {
          return {
            content: [{ type: "text", text: `Step ${step} not found. Valid steps: 1-${TOKEN_PROCEDURES.length}` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: renderProcedure(proc) }] };
      }

      let text = "# Design Token Build Procedure\n\n";
      text += "A complete token system = 10 categories. Follow in order.\n\n";
      for (const proc of TOKEN_PROCEDURES) {
        text += `## Step ${proc.step}: ${proc.title}\n${proc.description}\n\n`;
      }
      text += "\nCall `design_tokens_get_procedure` with a step number for full code + rules.";
      return { content: [{ type: "text", text }] };
    },
  );
}
