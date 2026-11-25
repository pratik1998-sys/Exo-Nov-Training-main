/**
 * Generates an index.ts file for a feature directory.
 * Exports files in the correct order required for the application to start.
 *
 * Usage: node core/scripts/generate-feature-index.js <directoryPath>
 * Example: node core/scripts/generate-feature-index.js src/core-staging/features/healthcare/pharmacy
 *
 * File order:
 * 1. *.module.ts
 * 2. *.model.ts
 * 3. *.parameters.ts
 * 4. *.api.configuration.ts
 * 5. *.service.ts
 * 6. *.controller.ts
 * 7. *.resolver.ts
 * 8. *.error.ts
 */

import {
  ROOT,
  resolveDirectoryPath,
  validateDirectory,
  generateIndex,
} from "./generate-index-common.js";

const SCRIPT = "generate-feature-index.js";
const FILE_SUFFIXES = [
  "module",
  "model",
  "parameters",
  "api.configuration",
  "service",
  "controller",
  "resolver",
  "error",
];

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(`Usage: node core/scripts/${SCRIPT} <directoryPath>`);
  console.error(
    `Example: node core/scripts/${SCRIPT} src/core-staging/features/healthcare/pharmacy`,
  );
  process.exit(1);
}

const fullDirectoryPath = resolveDirectoryPath(ROOT, args[0]);
validateDirectory(fullDirectoryPath);
generateIndex(fullDirectoryPath, FILE_SUFFIXES);
