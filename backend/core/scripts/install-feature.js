/**
 * Installs features by:
 * 1. Adding feature tsconfig.paths.json to root tsconfig.json
 * 2. Adding feature setup.configuration.yaml to app configuration.yaml features field
 * 3. Running yarn install
 *
 * Usage: node core/scripts/install-feature.js <appId> <featureId1> [featureId2 ...]
 * Example: node core/scripts/install-feature.js catalyst-cerebrum notification
 */

const path = require("path");
const fs = require("fs");
const {
  generateTimestamp,
  createBackups,
  addTsconfigPaths,
  mergeConfigurationYaml,
  finalizeInstallation,
  findComponentDirectory,
  getSearchLocationsMessage,
  ROOT,
} = require("./install-utils");

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    "Usage: node core/scripts/install-feature.js <appId> <featureId1> [featureId2 ...] [doBackup]",
  );
  process.exit(1);
}

const doBackup = args.includes("doBackup");
const filteredArgs = args.filter((arg) => arg !== "doBackup");

const appId = filteredArgs[0];
const featureIds = filteredArgs.slice(1);

const appDir = path.join(ROOT, "src", "apps", appId);
const appConfigPath = path.join(appDir, "configuration.yaml");

if (!fs.existsSync(appDir)) {
  console.error(`App directory not found: ${appDir}`);
  process.exit(1);
}

const timestamp = generateTimestamp();
createBackups(appDir, timestamp, doBackup);

const rootTsconfigPath = path.join(ROOT, "tsconfig.json");
const rootTsconfig = JSON.parse(fs.readFileSync(rootTsconfigPath, "utf8"));
let mergedPaths = { ...rootTsconfig.compilerOptions.paths };

for (const featureId of featureIds) {
  const featureDir = findComponentDirectory("features", featureId);

  if (!featureDir) {
    console.warn(
      `Feature directory not found in ${getSearchLocationsMessage("features", featureId)}, skipping.`,
    );
    continue;
  }

  console.log(`Installing feature: ${featureId}`);

  addTsconfigPaths(featureDir, mergedPaths, featureId);
  mergeConfigurationYaml(
    appConfigPath,
    path.join(featureDir, "setup.configuration.yaml"),
    "features",
    featureId,
  );
}

finalizeInstallation(mergedPaths);
console.log("Feature installation complete!");
