import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerDesignerPageTemplate } from "../src/plugins/designer/tools/get-page-template.ts";

const designerGetPageTemplate = captureTool(registerDesignerPageTemplate);

test("designer_get_page_template prefers corpus metadata for dashboard", async () => {
  const result = await designerGetPageTemplate.invoke({ type: "dashboard" });
  const text = extractTextContent(result);

  expect(text).toContain("# Page Template: dashboard");
  expect(text).toContain("**Corpus Source:** frontend.designer");
  expect(text).toContain("## Sections");
  expect(text).toContain("Sidebar Navigation");
});

test("designer_get_page_template falls back to in-file data for non-corpus templates", async () => {
  const result = await designerGetPageTemplate.invoke({ type: "auth" });
  const text = extractTextContent(result);

  expect(text).toContain("# Page Template: auth");
  expect(text).toContain("## Sections");
  expect(text).toContain("Login");
  expect(text).not.toContain("**Corpus Source:** frontend.designer");
});
