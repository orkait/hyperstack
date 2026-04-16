import { expect, test } from "bun:test";
import { invokeRegisteredTool } from "../src/engine/tool-bridge.ts";
import { register as registerResolveIntent } from "../src/plugins/designer/tools/resolve-intent.ts";
import { register as registerGetPractice } from "../src/plugins/golang/tools/get-practice.ts";

test("invokeRegisteredTool runs a designer tool module without MCP server transport", async () => {
  const result = await invokeRegisteredTool(registerResolveIntent, {
    product: "developer analytics dashboard",
  });

  expect(result.isError).toBeUndefined();
  expect(result.content?.[0]?.text).toMatch(/Resolved Design Intent/);
});

test("invokeRegisteredTool runs a golang tool module without MCP server transport", async () => {
  const result = await invokeRegisteredTool(registerGetPractice, {
    name: "error-wrapping",
  });

  expect(result.content?.[0]?.text).toMatch(/error-wrapping/i);
});
