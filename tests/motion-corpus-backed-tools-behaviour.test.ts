import { test, expect } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerMotionApi } from "../src/plugins/motion/tools/get-api.ts";

const motionGetApi = captureTool(registerMotionApi);

test("motion_get_api prefers corpus metadata for motion", async () => {
  const result = await motionGetApi.invoke({ name: "motion" });
  const text = extractTextContent(result);

  expect(text).toContain("# motion");
  expect(text).toContain("**Corpus Source:** frontend.motion");
  expect(text).toContain('import { motion } from "motion/react"');
});

test("motion_get_api prefers corpus metadata for AnimatePresence", async () => {
  const result = await motionGetApi.invoke({ name: "AnimatePresence" });
  const text = extractTextContent(result);

  expect(text).toContain("# AnimatePresence");
  expect(text).toContain("**Kind:** component");
  expect(text).toContain("**Corpus Source:** frontend.motion");
  expect(text).toContain('import { AnimatePresence } from "motion/react"');
});

test("motion_get_api prefers corpus metadata for useScroll", async () => {
  const result = await motionGetApi.invoke({ name: "useScroll" });
  const text = extractTextContent(result);

  expect(text).toContain("# useScroll");
  expect(text).toContain("**Kind:** hook");
  expect(text).toContain("**Corpus Source:** frontend.motion");
  expect(text).toContain('import { useScroll } from "motion/react"');
});

test("motion_get_api falls back to in-file data for non-corpus motion APIs", async () => {
  const result = await motionGetApi.invoke({ name: "useSpring" });
  const text = extractTextContent(result);

  expect(text).toContain("# useSpring");
  expect(text).toContain("**Kind:** hook");
  expect(text).not.toContain("**Corpus Source:** frontend.motion");
});
