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

test("reactflow_get_api prefers corpus metadata for Handle", async () => {
  const result = await reactFlowGetApi.invoke({ name: "Handle" });
  const text = extractTextContent(result);

  expect(text).toContain("# Handle (component)");
  expect(text).toContain("**Corpus Source:** frontend.reactflow");
  expect(text).toContain("import { Handle, Position } from '@xyflow/react'");
});

test("reactflow_get_api prefers corpus metadata for Background", async () => {
  const result = await reactFlowGetApi.invoke({ name: "Background" });
  const text = extractTextContent(result);

  expect(text).toContain("# Background (component)");
  expect(text).toContain("**Corpus Source:** frontend.reactflow");
  expect(text).toContain("import { Background, BackgroundVariant } from '@xyflow/react'");
});

test("reactflow_get_api prefers corpus metadata for Controls", async () => {
  const result = await reactFlowGetApi.invoke({ name: "Controls" });
  const text = extractTextContent(result);

  expect(text).toContain("# Controls (component)");
  expect(text).toContain("**Corpus Source:** frontend.reactflow");
  expect(text).toContain("import { Controls, ControlButton } from '@xyflow/react'");
});

test("reactflow_get_api prefers corpus metadata for MiniMap", async () => {
  const result = await reactFlowGetApi.invoke({ name: "MiniMap" });
  const text = extractTextContent(result);

  expect(text).toContain("# MiniMap (component)");
  expect(text).toContain("**Corpus Source:** frontend.reactflow");
  expect(text).toContain("import { MiniMap } from '@xyflow/react'");
});

test("reactflow_get_api prefers corpus metadata for useReactFlow", async () => {
  const result = await reactFlowGetApi.invoke({ name: "useReactFlow" });
  const text = extractTextContent(result);

  expect(text).toContain("# useReactFlow (hook)");
  expect(text).toContain("**Corpus Source:** frontend.reactflow");
  expect(text).toContain("fitView, zoomIn, zoomOut");
});

test("reactflow_get_api falls back to in-file data for non-corpus APIs", async () => {
  const result = await reactFlowGetApi.invoke({ name: "NodeResizer" });
  const text = extractTextContent(result);

  expect(text).toContain("# NodeResizer (component)");
  expect(text).not.toContain("**Corpus Source:** frontend.reactflow");
});
