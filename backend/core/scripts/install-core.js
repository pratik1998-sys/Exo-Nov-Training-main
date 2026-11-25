/**
 * Runs core install steps: generate-tsconfig, generate-nest-cli, generate-scripts, generate-dockerfile, generate-docs, install-agent-dirs, then yarn install.
 * Use after cloning or when updating core so root tsconfig, nest-cli, scripts, root devDependencies (vitest), Dockerfile, .dockerignore, docs, and agent dirs (.cursor, .github) stay in sync.
 *
 * install-agent-dirs copies .cursor and .github to the project root with symlinks referencing core/agent so Cursor and GitHub Copilot use the latest skills and rules from core.
 *
 * Run: npm run install-core [--override-dockerfile]
 */

const { execSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const SCRIPTS = [
  "generate-tsconfig.js",
  "generate-nest-cli.js",
  "generate-scripts.js",
  "generate-dockerfile.js",
  "generate-docs.js",
  "install-agent-dirs.js",
];

const runOptions = { cwd: ROOT, stdio: "inherit" };
const args = process.argv.slice(2);

for (const script of SCRIPTS) {
  const passArgs = script === "generate-dockerfile.js" ? args : [];
  const cmd = ["node", "core/scripts/" + script, ...passArgs]
    .map((a) => (a.includes(" ") ? `"${a}"` : a))
    .join(" ");
  execSync(cmd, runOptions);
}

execSync("yarn install", runOptions);
execSync("node scripts/dedupe-typeorm.js", runOptions);
