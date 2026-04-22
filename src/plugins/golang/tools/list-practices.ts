import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { BEST_PRACTICES, TOPICS, getPracticesByTopic } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "golang_list_practices",
    "List Go best practices by topic and priority (P0=critical, P1=standard)",
    {
      topic: z.enum(["all", ...TOPICS]).optional(),
      priority: z.enum(["P0", "P1"]).optional(),
    },
    async ({ topic, priority }) => {
      let list = topic && topic !== "all" ? getPracticesByTopic(topic as any) : BEST_PRACTICES;
      if (priority) list = list.filter((p) => p.priority === priority);

      const grouped: Record<string, typeof list> = {};
      for (const p of list) {
        if (!grouped[p.topic]) grouped[p.topic] = [];
        grouped[p.topic].push(p);
      }

      let text = "# Go Best Practices\n\n**P0** = critical (bugs/security if violated). **P1** = standard (maintainability).\n\n";
      for (const [t, items] of Object.entries(grouped)) {
        text += `## ${t}\n`;
        for (const p of items) text += `- [${p.priority}] **${p.name}** - ${p.rule}\n`;
        text += "\n";
      }
      text += `\n**Total:** ${list.length} practices`;
      return { content: [{ type: "text", text }] };
    }
  );
}
