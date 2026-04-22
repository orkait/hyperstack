import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";
import { register as registerGenerateFlow } from "../src/plugins/reactflow/tools/generate-flow.ts";
import { register as registerGenerateAnimation } from "../src/plugins/motion/tools/generate-animation.ts";
import { register as registerGenerateSetup } from "../src/plugins/lenis/tools/generate-setup.ts";
import { buildTasks } from "../src/plugins/designer/tools/generate-implementation-plan.ts";
import { captureTool, extractTextContent, extractTsxFence } from "./helpers.ts";

function expectNoSyntaxErrors(code: string): void {
  const output = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    reportDiagnostics: true,
  });

  const diagnostics = output.diagnostics ?? [];
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((item) => item.messageText).join("\n"),
  );
}

test("reactflow_generate_flow returns self-contained controlled-flow code", async () => {
  const tool = captureTool(registerGenerateFlow);
  assert.equal(tool.name, "reactflow_generate_flow");

  const result = await tool.invoke({ description: "simple two-node flow", controlled: true });
  const text = extractTextContent(result);
  const code = extractTsxFence(text);

  assert.doesNotMatch(code, /import \{ useFlowStore, selector \} from '\.\/store';/);
  assert.doesNotMatch(code, /\/\*\s*\n\/\/ --- store\.ts ---/);
  expectNoSyntaxErrors(code);
});

test("motion_generate_animation does not emit placeholder exit keys", async () => {
  const tool = captureTool(registerGenerateAnimation);
  assert.equal(tool.name, "motion_generate_animation");

  const result = await tool.invoke({ description: "page transition with exit" });
  const text = extractTextContent(result);
  const code = extractTsxFence(text);

  assert.doesNotMatch(code, /key=\{\/\*/);
  expectNoSyntaxErrors(code);
});

test("motion_generate_animation declares list inputs for staggered list output", async () => {
  const tool = captureTool(registerGenerateAnimation);
  const result = await tool.invoke({ description: "staggered list entrance" });
  const text = extractTextContent(result);
  const code = extractTsxFence(text);

  assert.match(code, /items/);
  assert.doesNotMatch(code, /function AnimatedComponent\(\{ children \}\)/);
  expectNoSyntaxErrors(code);
});

test("lenis_generate_setup uses a reactive reduced-motion check", async () => {
  const tool = captureTool(registerGenerateSetup);
  assert.equal(tool.name, "lenis_generate_setup");

  const result = await tool.invoke({ description: "next.js with accessibility support" });
  const text = extractTextContent(result);
  const code = extractTsxFence(text);

  assert.match(code, /useEffect/);
  assert.match(code, /useState/);
  assert.doesNotMatch(code, /return window\.matchMedia/);
  expectNoSyntaxErrors(code);
});

test("buildTasks preserves multi-word component names from DESIGN.md", () => {
  const tasks = buildTasks(
    {
      "5": "### Data Table\n\nCopy\n\n### Command Menu\n\nCopy\n",
    },
    "react",
  );

  const componentTasks = tasks
    .map((item) => item.name)
    .filter((name) => name.startsWith("Component: "));

  assert.deepEqual(componentTasks, ["Component: Data Table", "Component: Command Menu"]);
});
