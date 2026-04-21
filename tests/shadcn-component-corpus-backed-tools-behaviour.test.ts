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

test("shadcn_get_component prefers corpus metadata for Field", async () => {
  const result = await shadcnGetComponent.invoke({ name: "Field" });
  const text = extractTextContent(result);

  expect(text).toContain("# Field");
  expect(text).toContain("**Corpus Source:** frontend.shadcn");
  expect(text).toContain("<FieldLabel>Username</FieldLabel>");
});

test("shadcn_get_component prefers corpus metadata for Select", async () => {
  const result = await shadcnGetComponent.invoke({ name: "Select" });
  const text = extractTextContent(result);

  expect(text).toContain("# Select");
  expect(text).toContain("**Corpus Source:** frontend.shadcn");
  expect(text).toContain('<Select defaultValue="apple">');
});
