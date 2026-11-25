/**
 * Merges ./core/nest-cli.json into ./nest-cli.json at repo root so Nest CLI
 * uses the core config when run from the project root. Core is the base;
 * any values that exist in root but not in core (including entries in
 * compilerOptions.assets) are preserved.
 *
 * Run: node scripts/generate-nest-cli.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const corePath = path.join(ROOT, "core", "nest-cli.json");
const rootPath = path.join(ROOT, "nest-cli.json");

if (!fs.existsSync(corePath)) {
  console.warn("core/nest-cli.json not found, skipping.");
  process.exit(0);
}

const core = JSON.parse(fs.readFileSync(corePath, "utf8"));

if (!fs.existsSync(rootPath)) {
  fs.writeFileSync(rootPath, JSON.stringify(core, null, 2) + "\n", "utf8");
  console.log("Created nest-cli.json from core/nest-cli.json.");
  process.exit(0);
}

const root = JSON.parse(fs.readFileSync(rootPath, "utf8"));

/**
 * Deep merge: core as base; root-only keys and array entries are preserved.
 * - Objects: merged recursively; root adds keys and nested values not in core.
 * - Arrays: core's items first, then root items not already in core (by JSON equality).
 * - Primitives: core wins when both present.
 */
function mergeCoreWithRoot(coreVal, rootVal) {
  if (rootVal === undefined) {
    return coreVal;
  }
  if (coreVal === undefined) {
    return rootVal;
  }

  const coreIsArray = Array.isArray(coreVal);
  const rootIsArray = Array.isArray(rootVal);

  if (coreIsArray && rootIsArray) {
    const seen = new Set(coreVal.map((item) => JSON.stringify(item)));
    const out = [...coreVal];
    for (const item of rootVal) {
      const key = JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    }
    return out;
  }

  if (coreIsArray || rootIsArray) {
    return coreVal;
  }

  if (
    coreVal !== null &&
    typeof coreVal === "object" &&
    rootVal !== null &&
    typeof rootVal === "object"
  ) {
    const out = {};
    const allKeys = new Set([...Object.keys(coreVal), ...Object.keys(rootVal)]);
    for (const k of allKeys) {
      if (!(k in coreVal)) {
        out[k] = rootVal[k];
      } else if (!(k in rootVal)) {
        out[k] = coreVal[k];
      } else {
        out[k] = mergeCoreWithRoot(coreVal[k], rootVal[k]);
      }
    }
    return out;
  }

  return coreVal;
}

const merged = mergeCoreWithRoot(core, root);
fs.writeFileSync(rootPath, JSON.stringify(merged, null, 2) + "\n", "utf8");
console.log(
  "Merged core/nest-cli.json into nest-cli.json (root-only values preserved).",
);
