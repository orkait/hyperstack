import { expect, test } from "bun:test";
import { loadCorpusIndex, loadCorpusDocument } from "../src/engine/corpus-loader.ts";

test("loadCorpusIndex reads the corpus namespace map", () => {
  const index = loadCorpusIndex(process.cwd());
  expect(index.namespaces["backend.golang"]).toBe("corpus/backend/golang");
  expect(index.namespaces["frontend.ui-ux"]).toBe("corpus/frontend/ui-ux");
});

test("loadCorpusDocument throws for missing corpus file", () => {
  expect(() =>
    loadCorpusDocument(process.cwd(), "corpus/backend/golang/practices/does-not-exist.json"),
  ).toThrow(/not found/i);
});
