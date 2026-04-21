import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerReactFlowApi } from "../src/plugins/reactflow/tools/get-api.ts";

const reactFlowGetApi = captureTool(registerReactFlowApi);

test("reactflow_get_api prefers corpus metadata for ReactFlow", async () => {
  const result = await reactFlowGetApi.invoke({ name: "ReactFlow" });
  const text = extractTextContent(result);

  expect(text).toContain("# ReactFlow (component)");
  expect(text).toContain("**Corpus Source:** frontend.reactflow");
  expect(text).toContain("import { ReactFlow } from '@xyflow/react'");
});

test("reactflow_get_api falls back to in-file data for non-corpus APIs", async () => {
  const result = await reactFlowGetApi.invoke({ name: "Handle" });
  const text = extractTextContent(result);

  expect(text).toContain("# Handle (component)");
  expect(text).toContain("import { Handle, Position } from '@xyflow/react'");
  expect(text).not.toContain("**Corpus Source:** frontend.reactflow");
});
