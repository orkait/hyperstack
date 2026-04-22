import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { TEMPLATES, capitalize } from "../data/index.js";

export function register(server: ToolServer): void {
  server.tool(
    "reactflow_get_template",
    "Get a production-ready code template: custom-node (Tailwind + toolbar + handles + status), custom-edge (delete button + BaseEdge), or zustand-store (full store with selectors)",
    {
      template: z
        .enum(["custom-node", "custom-edge", "zustand-store"] as const)
        .describe("Template name"),
    },
    async ({ template }: { template: "custom-node" | "custom-edge" | "zustand-store" }) => {
      const code = TEMPLATES[template];
      return {
        content: [
          {
            type: "text",
            text: `# ${capitalize(template.replace(/-/g, " "))} Template\n\n\`\`\`tsx\n${code}\n\`\`\``,
          },
        ],
      };
    },
  );
}
