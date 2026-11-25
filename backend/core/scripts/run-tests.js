#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);
const isVerbose =
  process.env.VERBOSE === "1" ||
  process.env.VITEST_VERBOSE === "1" ||
  args.includes("--verbose");

const vitestArgs = [
  "run",
  "--config",
  path.join(process.cwd(), "vitest.config.mts"),
];

if (isVerbose) {
  vitestArgs.push("--reporter=verbose");
}

// Pass through remaining args (e.g. file patterns), excluding verbose flags
const passThrough = args.filter((a) => a !== "--verbose");
vitestArgs.push(...passThrough);

const child = spawn("npx", ["vitest", ...vitestArgs], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
});

child.on("error", (err) => {
  console.error(err.message);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
