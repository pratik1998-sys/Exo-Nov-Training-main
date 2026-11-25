/**
 * Merges path definitions from tsconfig files under:
 *   ./core, ./core-modules, ./core-staging, ./src/core-staging, ./src/apps
 * and from tsconfig.paths.root.json (optional).
 *
 * Discovers every tsconfig.json and tsconfig.paths.json in those trees.
 * Writes ./tsconfig.json at repo root, extending ./core/tsconfig.json
 * and adding merged paths (base compilerOptions live in core).
 *
 * Run: npm run generate-tsconfig
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const SEARCH_ROOTS = [
  "core",
  "core-modules",
  "core-modules-tutorial",
  "core-staging",
  "src/core-staging",
  "src/apps",
];
const CONFIG_NAMES = ["tsconfig.json", "tsconfig.paths.json"];
const ROOT_PATHS_FILE = "tsconfig.paths.root.json";
const SKIP_DIRS = new Set(["node_modules", "dist", ".git"]);
/** Excluded from Nest/TS build — resolved via root devDependencies after install:core. */
const VITEST_CONFIG_EXCLUDES = ["vitest.config.mts", "core/vitest.config.ts"];

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

function* walkDir(dir, predicate) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory() && SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walkDir(full, predicate);
    } else if (e.isFile() && predicate(e.name)) {
      yield full;
    }
  }
}

function findConfigFiles() {
  const files = [];
  for (const searchRoot of SEARCH_ROOTS) {
    const dir = path.join(ROOT, searchRoot);
    files.push(...walkDir(dir, (name) => CONFIG_NAMES.includes(name)));
  }
  return files;
}

function resolvePathsToRepoRelative(paths, baseDir, baseUrl = ".") {
  const base = path.resolve(baseDir, baseUrl);
  return Object.fromEntries(
    Object.entries(paths)
      .filter(([, value]) => Array.isArray(value))
      .map(([key, value]) => [
        key,
        value.map((v) =>
          path.relative(ROOT, path.resolve(base, v)).replace(/\\/g, "/"),
        ),
      ]),
  );
}

function extractPathsFromConfig(configPath, config) {
  const paths = config?.compilerOptions?.paths ?? config?.paths;
  if (!paths || typeof paths !== "object") return {};

  const isPathOnlyFile = path.basename(configPath) === "tsconfig.paths.json";
  if (isPathOnlyFile) {
    return paths;
  }

  const baseDir = path.dirname(configPath);
  const baseUrl = config?.compilerOptions?.baseUrl ?? ".";
  return resolvePathsToRepoRelative(paths, baseDir, baseUrl);
}

function mergePaths(into, from) {
  if (!from || typeof from !== "object") return;
  Object.assign(
    into,
    Object.fromEntries(
      Object.entries(from).filter(([, value]) => Array.isArray(value)),
    ),
  );
}

function collectPathsFromFiles(configFiles) {
  const merged = {};
  for (const configPath of configFiles) {
    console.log("Loading config file: ", configPath);
    const config = loadJson(configPath);
    if (!config) continue;
    const resolved = extractPathsFromConfig(configPath, config);
    mergePaths(merged, resolved);
  }
  return merged;
}

function collectRootPaths() {
  const rootPathsPath = path.join(ROOT, ROOT_PATHS_FILE);
  const rootPaths = loadJson(rootPathsPath);
  return rootPaths?.paths || {};
}

function collectAllPaths() {
  const merged = collectPathsFromFiles(findConfigFiles());
  mergePaths(merged, collectRootPaths());
  return merged;
}

function addPathsFromDirectory(pluginDir) {
  const pathsFilePath = path.join(pluginDir, "tsconfig.paths.json");
  if (!fs.existsSync(pathsFilePath)) return {};

  const config = loadJson(pathsFilePath);
  return config?.paths || {};
}

// --- Vitest alias generation (for vitest.config.mts) ---

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Escape forward slashes so the source is valid inside a JS regex literal /.../ */
function escapeRegexLiteralDelimiter(s) {
  return s.replace(/\//g, "\\/");
}

/** Returns the regex source for the Vitest alias "find" from a tsconfig path key. */
function pathKeyToFindSource(key) {
  if (key.endsWith("/*")) {
    const base = key.slice(0, -2);
    return "^" + escapeRegexLiteralDelimiter(escapeRegex(base)) + "\\/(.*)$";
  }
  return "^" + escapeRegexLiteralDelimiter(escapeRegex(key)) + "$";
}

/** Extract existing find regex pattern sources from a config file (alias array). */
function getExistingFindSourcesFromFile(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return new Set();
  const content = fs.readFileSync(fullPath, "utf8");
  const set = new Set();
  // Match find: /.../ (regex literal); pattern may contain \/
  const regex = /find:\s*\/((?:[^/\\]|\\.)*)\//g;
  let m;
  while ((m = regex.exec(content)) !== null) set.add(m[1]);
  return set;
}

/** Build one Vitest alias entry: { findSource, replacementCode } for a path key/value. */
function pathToVitestAliasEntry(key, value, projectRootVar) {
  const findSource = pathKeyToFindSource(key);
  const isWildcard = key.endsWith("/*");
  const resolvedPath = Array.isArray(value) ? value[0] : value;
  const basePath =
    typeof resolvedPath === "string" ? resolvedPath.replace(/\/\*$/, "") : "";
  const replacementCode = isWildcard
    ? `path.join(${projectRootVar}, "${basePath.replace(/\\/g, "/")}") + "/$1"`
    : `path.join(${projectRootVar}, "${basePath.replace(/\\/g, "/")}")`;
  return { findSource, replacementCode };
}

/** Generate Vitest alias entries from merged paths, excluding any already in core (so root does not duplicate core). */
function buildVitestAliasEntriesFromPaths(paths) {
  const existingInCore = getExistingFindSourcesFromFile(
    "core/vitest.config.ts",
  );
  const projectRootVar = "projectRoot";
  const entries = [];
  for (const [key, value] of Object.entries(paths)) {
    if (!Array.isArray(value) || value.length === 0) continue;
    const { findSource, replacementCode } = pathToVitestAliasEntry(
      key,
      value,
      projectRootVar,
    );
    if (existingInCore.has(findSource)) continue;
    entries.push({ findSource, replacementCode });
  }
  return entries;
}

/** Sort alias entries so more specific (longer) find patterns come first; Vitest uses first match. */
function sortAliasEntriesSpecificFirst(aliasEntries) {
  return [...aliasEntries].sort(
    (a, b) => b.findSource.length - a.findSource.length,
  );
}

/** Overwrite vitest.config.mts so VitestConfig.resolve.alias is always up to date (spread from core + all path-derived entries). */
function writeVitestConfigMts(aliasEntries) {
  const vitestPath = path.join(ROOT, "vitest.config.mts");
  const sorted = sortAliasEntriesSpecificFirst(aliasEntries);
  const aliasLines = sorted
    .map(
      (e) => `  { find: /${e.findSource}/, replacement: ${e.replacementCode} }`,
    )
    .join(",\n");
  const content = `import { VitestConfig } from "./core/vitest.config";
import { defineConfig } from "vitest/config";
import path from "path";

const projectRoot = process.cwd();

VitestConfig.resolve.alias = [
  ...VitestConfig.resolve.alias,
${aliasLines}
];

export default defineConfig(VitestConfig);
`;
  fs.writeFileSync(vitestPath, content, "utf8");
}

function writeTsconfig(paths) {
  const output = {
    extends: "./core/tsconfig.json",
    compilerOptions: {
      baseUrl: ".",
      outDir: "./dist",
      paths,
    },
    exclude: [
      "node_modules",
      "dist",
      "**/dist/**",
      ...VITEST_CONFIG_EXCLUDES,
    ],
  };
  fs.writeFileSync(
    path.join(ROOT, "tsconfig.json"),
    JSON.stringify(output, null, 2) + "\n",
    "utf8",
  );
}

function patchTsconfigBuildExcludes() {
  const buildPath = path.join(ROOT, "tsconfig.build.json");
  const config = loadJson(buildPath);
  if (!config) return false;
  const exclude = new Set([...(config.exclude || []), ...VITEST_CONFIG_EXCLUDES]);
  config.exclude = [...exclude];
  fs.writeFileSync(buildPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  return true;
}

function main() {
  const paths = collectAllPaths();
  writeTsconfig(paths);
  console.log(
    "Wrote tsconfig.json (extends ./core/tsconfig.json) with",
    Object.keys(paths).length,
    "path mappings.",
  );

  const aliasEntries = buildVitestAliasEntriesFromPaths(paths);
  writeVitestConfigMts(aliasEntries);
  console.log(
    "Wrote vitest.config.mts: VitestConfig.resolve.alias has",
    aliasEntries.length,
    "path-derived entries (plus ...VitestConfig.resolve.alias from core).",
  );

  if (patchTsconfigBuildExcludes()) {
    console.log(
      "Updated tsconfig.build.json exclude for",
      VITEST_CONFIG_EXCLUDES.join(", "),
    );
  }
}

if (require.main === module) {
  main();
}

module.exports = { addPathsFromDirectory, writeTsconfig, mergePaths, ROOT };
