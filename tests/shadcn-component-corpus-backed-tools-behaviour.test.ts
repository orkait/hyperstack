import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerShadcnGetComponent } from "../src/plugins/shadcn/tools/get-component.ts";

const shadcnGetComponent = captureTool(registerShadcnGetComponent);

test("shadcn_get_component prefers corpus metadata for Button", async () => {
  const result = await shadcnGetComponent.invoke({ name: "Button" });
  const text = extractTextContent(result);

  expect(text).toContain("# Button");
  expect(text).toContain("**Corpus Source:** frontend.shadcn");
  expect(text).toContain('<Button variant="outline"');
});

test("shadcn_get_component prefers corpus metadata for Dialog", async () => {
  const result = await shadcnGetComponent.invoke({ name: "Dialog" });
  const text = extractTextContent(result);

  expect(text).toContain("# Dialog");
  expect(text).toContain("**Corpus Source:** frontend.shadcn");
  expect(text).toContain("<DialogTrigger render={<Button />}>");
});

test("shadcn_get_component falls back to in-file data for non-corpus components", async () => {
  const result = await shadcnGetComponent.invoke({ name: "Field" });
  const text = extractTextContent(result);

  expect(text).toContain("# Field");
  expect(text).not.toContain("**Corpus Source:** frontend.shadcn");
});
