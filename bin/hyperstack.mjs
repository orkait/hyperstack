#!/usr/bin/env node

import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const binDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(binDir, "..");
const entrypoint = resolve(rootDir, "src/index.ts");
const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
const tsxLoaderArgs = nodeMajor >= 20 ? ["--import", "tsx"] : ["--loader", "tsx"];

const child = spawn(process.execPath, [...tsxLoaderArgs, entrypoint, ...process.argv.slice(2)], {
  cwd: rootDir,
  env: process.env,
  stdio: "inherit",
});

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("error", (error) => {
  console.error("Failed to start hyperstack:", error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal === "SIGINT") {
    process.exit(130);
  }

  if (signal === "SIGTERM") {
    process.exit(143);
  }

  process.exit(code ?? 1);
});
