import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerUiUxGetPrinciple } from "../src/plugins/ui-ux/tools/get-principle.ts";

const uiUxGetPrinciple = captureTool(registerUiUxGetPrinciple);

test("ui_ux_get_principle prefers corpus metadata for type-scale", async () => {
  const result = await uiUxGetPrinciple.invoke({ name: "type-scale" });
  const text = extractTextContent(result);

  expect(text).toContain("# type-scale [typography]");
  expect(text).toContain("**Corpus Source:** frontend.ui-ux");
  expect(text).toContain("clamp(2.5rem, 4vw, 3.5rem)");
});

test("ui_ux_get_principle prefers corpus metadata for wcag-contrast", async () => {
  const result = await uiUxGetPrinciple.invoke({ name: "wcag-contrast" });
  const text = extractTextContent(result);

  expect(text).toContain("# wcag-contrast [color]");
  expect(text).toContain("**Corpus Source:** frontend.ui-ux");
  expect(text).toContain("4.5:1 (AA)");
});

test("ui_ux_get_principle falls back to in-file data for non-corpus principles", async () => {
  const result = await uiUxGetPrinciple.invoke({ name: "dark-mode-principles" });
  const text = extractTextContent(result);

  expect(text).toContain("# dark-mode-principles [color]");
  expect(text).not.toContain("**Corpus Source:** frontend.ui-ux");
});
