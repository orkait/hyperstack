import { expect, test } from "bun:test";
import { invokeRegisteredTool } from "../src/engine/tool-bridge.ts";
import { register as registerGetPractice } from "../src/plugins/golang/tools/get-practice.ts";

test("golang_get_practice reads corpus-backed practice documents first", async () => {
  const result = await invokeRegisteredTool(registerGetPractice, {
    name: "error-wrapping",
  });

  expect(result.content?.[0]?.text).toMatch(/Always wrap errors with context/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Corpus Source:\*\* backend\.golang/);
});
