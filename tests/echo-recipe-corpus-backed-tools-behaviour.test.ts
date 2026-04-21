import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerEchoGetRecipe } from "../src/plugins/echo/tools/get-recipe.ts";

const echoGetRecipe = captureTool(registerEchoGetRecipe);

test("echo_get_recipe prefers corpus metadata for hello-world", async () => {
  const result = await echoGetRecipe.invoke({ name: "hello-world" });
  const text = extractTextContent(result);

  expect(text).toContain("# hello-world");
  expect(text).toContain("**Corpus Source:** backend.echo");
  expect(text).toContain('e.Start(":8080")');
});

test("echo_get_recipe falls back to in-file data for non-corpus recipes", async () => {
  const result = await echoGetRecipe.invoke({ name: "crud-api" });
  const text = extractTextContent(result);

  expect(text).toContain("# crud-api");
  expect(text).not.toContain("**Corpus Source:** backend.echo");
});
