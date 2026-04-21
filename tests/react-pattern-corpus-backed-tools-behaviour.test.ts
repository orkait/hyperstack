import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerReactGetPattern } from "../src/plugins/react/tools/get-pattern.ts";

const reactGetPattern = captureTool(registerReactGetPattern);

test("react_get_pattern prefers corpus metadata for rsc-default", async () => {
  const result = await reactGetPattern.invoke({ name: "rsc-default" });
  const text = extractTextContent(result);

  expect(text).toContain("# rsc-default [rendering]");
  expect(text).toContain("**Corpus Source:** frontend.react");
  expect(text).toContain("export default async function ProductList()");
});

test("react_get_pattern prefers corpus metadata for zustand-store", async () => {
  const result = await reactGetPattern.invoke({ name: "zustand-store" });
  const text = extractTextContent(result);

  expect(text).toContain("# zustand-store [state]");
  expect(text).toContain("**Corpus Source:** frontend.react");
  expect(text).toContain("create<");
});

test("react_get_pattern prefers corpus metadata for state-hierarchy", async () => {
  const result = await reactGetPattern.invoke({ name: "state-hierarchy" });
  const text = extractTextContent(result);

  expect(text).toContain("# state-hierarchy [state]");
  expect(text).toContain("**Corpus Source:** frontend.react");
  expect(text).toContain("useSearchParams()");
});

test("react_get_pattern prefers corpus metadata for suspense-boundary", async () => {
  const result = await reactGetPattern.invoke({ name: "suspense-boundary" });
  const text = extractTextContent(result);

  expect(text).toContain("# suspense-boundary [rendering]");
  expect(text).toContain("**Corpus Source:** frontend.react");
  expect(text).toContain("<ErrorBoundary fallback={<ErrorFallback />}>");
});

test("react_get_pattern falls back to in-file data for non-corpus patterns", async () => {
  const result = await reactGetPattern.invoke({ name: "composition-pattern" });
  const text = extractTextContent(result);

  expect(text).toContain("# composition-pattern [architecture]");
  expect(text).not.toContain("**Corpus Source:** frontend.react");
});
