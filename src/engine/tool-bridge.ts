import assert from "node:assert/strict";
import type { ToolServer } from "../shared/tool-types.js";

type ToolResult = {
  content?: Array<{ type?: string; text?: string }>;
  isError?: boolean;
};

type ToolHandler = (args: Record<string, unknown>) => Promise<ToolResult> | ToolResult;

export async function invokeRegisteredTool(
  register: (server: ToolServer) => void,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  let capturedHandler: ToolHandler | undefined;

  const server = {
    tool(_name: string, _description: string, _schema: unknown, handler: ToolHandler) {
      capturedHandler = handler;
    },
  } as unknown as ToolServer;

  register(server);

  assert.ok(capturedHandler, "tool registration did not capture a handler");
  return await capturedHandler(args);
}
