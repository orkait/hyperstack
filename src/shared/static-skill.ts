import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, readdirSync, statSync } from "fs";
import type { Plugin } from "../registry.js";

const sharedDir = dirname(fileURLToPath(import.meta.url));

export function createStaticSkillPlugin(skillName: string, description: string): Plugin {
  const snippetsDir = join(sharedDir, "../plugins", skillName, "snippets");

  // recursively get all .txt files
  function getAllFiles(dir: string, base = ""): string[] {
    let results: string[] = [];
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const relPath = base ? join(base, entry) : entry;
        if (statSync(fullPath).isDirectory()) {
          results = results.concat(getAllFiles(fullPath, relPath));
        } else if (entry.endsWith(".txt")) {
          results.push(relPath.replace(/\\/g, "/"));
        }
      }
    } catch (e) {
      // ignore
    }
    return results;
  }

  return {
    name: skillName,
    register: (server: McpServer) => {
      const files = getAllFiles(snippetsDir);
      const prefix = skillName.replace(/-/g, "_");
      
      server.tool(
        `${prefix}_list_docs`,
        `List all available documents/references for the ${skillName} skill.`,
        {},
        async () => {
          if (files.length === 0) return { content: [{ type: "text", text: "No documents found." }] };
          return { content: [{ type: "text", text: `Available documents for ${skillName}:\n\n` + files.map(f => `- ${f}`).join("\n") }] };
        }
      );

      server.tool(
        `${prefix}_get_doc`,
        `Get the content of a specific document for the ${skillName} skill. Always start by reading SKILL.txt if you haven't yet.`,
        { path: z.string().describe("The document path from the list_docs tool (e.g. 'SKILL.txt' or 'references/auth.txt')") },
        async ({ path }) => {
          if (!files.includes(path)) {
            return { content: [{ type: "text", text: `Document not found: ${path}\n\nAvailable documents:\n${files.join("\n")}` }], isError: true };
          }
          const content = readFileSync(join(snippetsDir, path), "utf-8");
          return { content: [{ type: "text", text: content }] };
        }
      );
    }
  };
}
