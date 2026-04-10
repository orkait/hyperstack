import assert from "node:assert/strict";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown> | unknown;

export function captureTool(register: (server: McpServer) => void) {
  let capturedName = "";
  let capturedHandler: ToolHandler | undefined;

  const server = {
    tool(name: string, _description: string, _schema: unknown, handler: ToolHandler) {
      capturedName = name;
      capturedHandler = handler;
    },
  } as unknown as McpServer;

  register(server);

  assert.ok(capturedName, "tool registration did not provide a name");
  assert.ok(capturedHandler, "tool registration did not provide a handler");

  return {
    name: capturedName,
    async invoke(args: Record<string, unknown>) {
      return capturedHandler!(args);
    },
  };
}

export function extractTextContent(result: unknown): string {
  const payload = result as {
    content?: Array<{ type?: string; text?: string }>;
  };

  const textBlock = payload.content?.find((item) => item.type === "text" && typeof item.text === "string");
  assert.ok(textBlock?.text, "tool response did not include a text content block");
  return textBlock.text;
}

export function extractTsxFence(markdown: string): string {
  const match = markdown.match(/```tsx\n([\s\S]*?)\n```/);
  assert.ok(match?.[1], "tool response did not include a tsx code fence");
  return match[1];
}
