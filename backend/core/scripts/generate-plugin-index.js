/**
 * Generates an index.ts file for a plugin feature directory.
 * Exports files in the correct order required for the application to start.
 *
 * Usage: node core/scripts/generate-plugin-index.js <directoryPath>
 * Example: node core/scripts/generate-plugin-index.js core-modules/plugins/adobe-aem/features/navigation
 *
 * File order:
 * 1. *.module.ts
 * 2. *.datasource.ts
 * 3. *.mapper.ts
 * 4. *.registry.ts
 * 5. *.service.ts
 * 6. *.error.ts
 * 7. schema/*.ts (if schema subdirectory exists)
 * 8. types/*.ts (if types subdirectory exists)
 */

import fs from "fs";
import path from "path";
import {
  ROOT,
  resolveDirectoryPath,
  validateDirectory,
  generateIndex,
} from "./generate-index-common.js";

const SCRIPT = "generate-plugin-index.js";
const FILE_SUFFIXES = [
  "module",
  "datasource",
  "mapper",
  "registry",
  "service",
  "error",
];

/**
 * Adds exports for all .ts files in a subdirectory to the index.ts file.
 * @param {string} fullDirectoryPath - Absolute path to the parent directory
 * @param {string} subdirectoryName - Name of the subdirectory (e.g., "schema", "types")
 * @returns {string[]} Array of export statements
 */
function getSubdirectoryExports(fullDirectoryPath, subdirectoryName) {
  const exports = [];
  const subdirectoryPath = path.join(fullDirectoryPath, subdirectoryName);

  if (
    fs.existsSync(subdirectoryPath) &&
    fs.statSync(subdirectoryPath).isDirectory()
  ) {
    const files = fs.readdirSync(subdirectoryPath);
    const tsFiles = files.filter(
      (f) => f.endsWith(".ts") && !f.endsWith(".d.ts"),
    );

    for (const fileName of tsFiles.sort()) {
      const exportPath = `./${subdirectoryName}/${fileName.slice(0, -3)}`;
      exports.push(`export * from '${exportPath}';`);
    }
  }

  return exports;
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(`Usage: node core/scripts/${SCRIPT} <directoryPath>`);
  console.error(
    `Example: node core/scripts/${SCRIPT} core-modules/plugins/adobe-aem/features/navigation`,
  );
  process.exit(1);
}

const fullDirectoryPath = resolveDirectoryPath(ROOT, args[0]);
validateDirectory(fullDirectoryPath);

// Generate the main index with standard file suffixes
generateIndex(fullDirectoryPath, FILE_SUFFIXES);

// Add exports for schema and types subdirectories
const indexPath = path.join(fullDirectoryPath, "index.ts");
let content = fs.readFileSync(indexPath, "utf8");

const schemaExports = getSubdirectoryExports(fullDirectoryPath, "schema");
const typesExports = getSubdirectoryExports(fullDirectoryPath, "types");

if (schemaExports.length > 0 || typesExports.length > 0) {
  // Remove trailing newline if present, then add subdirectory exports
  content = content.trimEnd();
  if (content.length > 0) {
    content += "\n";
  }

  if (schemaExports.length > 0) {
    content += "\n" + schemaExports.join("\n");
  }

  if (typesExports.length > 0) {
    content += "\n" + typesExports.join("\n");
  }

  content += "\n";

  fs.writeFileSync(indexPath, content, "utf8");

  const totalExports = schemaExports.length + typesExports.length;
  if (totalExports > 0) {
    console.log(`Added ${totalExports} subdirectory export(s):`);
    [...schemaExports, ...typesExports].forEach((exp, index) => {
      console.log(`  ${index + 1}. ${exp}`);
    });
  }
}
