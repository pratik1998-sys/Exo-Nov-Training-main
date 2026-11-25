/**
 * Merges ./core/package.json into ./package.json:
 * - scripts: missing entries copied from core (root scripts preserved)
 * - workspaces: copied from core when defined
 * - devDependencies: root-level tool deps copied from core when missing (see ROOT_DEV_DEPENDENCY_KEYS)
 *
 * Run: node scripts/generate-scripts.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const CORE_PKG_PATH = path.join(ROOT, "core", "package.json");
const ROOT_PKG_PATH = path.join(ROOT, "package.json");

/** Required at repo root — vitest.config.mts and test scripts run from ROOT, not core/. */
const ROOT_DEV_DEPENDENCY_KEYS = ["vitest", "vite-tsconfig-paths"];

const corePkg = JSON.parse(fs.readFileSync(CORE_PKG_PATH, "utf8"));
const rootPkg = JSON.parse(fs.readFileSync(ROOT_PKG_PATH, "utf8"));

const coreScripts = corePkg.scripts || {};
const rootScripts = rootPkg.scripts || {};

const merged = { ...rootScripts };
let addedScripts = 0;
for (const name of Object.keys(coreScripts)) {
  if (!(name in merged)) {
    merged[name] = coreScripts[name];
    addedScripts++;
  }
}

rootPkg.scripts = merged;

if (Array.isArray(corePkg.workspaces)) {
  rootPkg.workspaces = corePkg.workspaces;
}

const coreDev = corePkg.devDependencies || {};
const rootDev = { ...(rootPkg.devDependencies || {}) };
let addedDevDeps = 0;
for (const name of ROOT_DEV_DEPENDENCY_KEYS) {
  if (coreDev[name] && !(name in rootDev)) {
    rootDev[name] = coreDev[name];
    addedDevDeps++;
  }
}
if (Object.keys(rootDev).length > 0) {
  rootPkg.devDependencies = rootDev;
}

fs.writeFileSync(
  ROOT_PKG_PATH,
  JSON.stringify(rootPkg, null, 2) + "\n",
  "utf8",
);
console.log(
  "Merged scripts into package.json (root preserved, added",
  addedScripts,
  "from core).",
);
if (Array.isArray(corePkg.workspaces)) {
  console.log("Copied workspaces from core to root.");
}
if (addedDevDeps > 0) {
  console.log(
    "Merged root devDependencies from core (added",
    addedDevDeps,
    "of",
    ROOT_DEV_DEPENDENCY_KEYS.length,
    "required).",
  );
}
