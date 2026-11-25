/**
 * Shared logic for generating index.ts files in feature and plugin directories.
 * Discovers *.suffix.ts files in order and writes an index.ts that re-exports them.
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { ROOT } = require("./generate-tsconfig.js");

/**
 * Resolves directory path to absolute (relative to root if not absolute).
 * @param {string} root - Repository root path
 * @param {string} directoryPath - Path from CLI (absolute or relative to root)
 * @returns {string} Absolute full path
 */
function resolveDirectoryPath(root, directoryPath) {
  return path.isAbsolute(directoryPath)
    ? directoryPath
    : path.join(root, directoryPath);
}

/**
 * Validates that path exists and is a directory. Exits process with message on failure.
 * @param {string} fullPath - Absolute path to check
 */
function validateDirectory(fullPath) {
  if (!fs.existsSync(fullPath)) {
    console.error(`Directory not found: ${fullPath}`);
    process.exit(1);
  }
  if (!fs.statSync(fullPath).isDirectory()) {
    console.error(`Path is not a directory: ${fullPath}`);
    process.exit(1);
  }
}

/**
 * Generates index.ts in the given directory, exporting files matching *.suffix.ts in order.
 * @param {string} fullDirectoryPath - Absolute path to the directory
 * @param {string[]} fileSuffixes - Suffix names in export order (e.g. ['module', 'service'])
 */
function generateIndex(fullDirectoryPath, fileSuffixes) {
  const exports = [];
  const files = fs.readdirSync(fullDirectoryPath);

  for (const suffix of fileSuffixes) {
    const suffixPattern = `.${suffix}.ts`;
    const matching = files.filter((f) => f.endsWith(suffixPattern));
    for (const fileName of matching) {
      const exportPath = `./${fileName.slice(0, -3)}`;
      exports.push(`export * from '${exportPath}';`);
    }
  }

  const indexPath = path.join(fullDirectoryPath, "index.ts");
  const content = exports.join("\n") + (exports.length > 0 ? "\n" : "");

  fs.writeFileSync(indexPath, content, "utf8");

  console.log(`Generated index.ts at: ${indexPath}`);
  console.log(`Exported ${exports.length} file(s):`);
  exports.forEach((exp, index) => {
    console.log(`  ${index + 1}. ${exp}`);
  });
}

export { ROOT, resolveDirectoryPath, validateDirectory, generateIndex };
