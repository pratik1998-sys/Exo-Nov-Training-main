/**
 * Copies ./core/Dockerfile and ./core/.dockerignore to the repo root.
 * If a root file already exists, overwrites only when run with --override-dockerfile.
 *
 * Run: node scripts/generate-dockerfile.js [--override-dockerfile]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const override = process.argv.includes("--override-dockerfile");

const files = [
  { name: "Dockerfile", core: "Dockerfile", root: "Dockerfile" },
  { name: ".dockerignore", core: ".dockerignore", root: ".dockerignore" },
];

for (const file of files) {
  const corePath = path.join(ROOT, "core", file.core);
  const rootPath = path.join(ROOT, file.root);

  if (!fs.existsSync(corePath)) {
    console.warn(`core/${file.core} not found, skipping.`);
    continue;
  }

  if (fs.existsSync(rootPath) && !override) {
    console.log(
      `${file.name} exists at root; skipping (use --override-dockerfile to overwrite).`,
    );
    continue;
  }

  fs.copyFileSync(corePath, rootPath);
  console.log(`Copied core/${file.core} to ${file.root}.`);
}
