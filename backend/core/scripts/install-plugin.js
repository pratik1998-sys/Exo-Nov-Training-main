/**
 * Installs plugins by:
 * 1. Adding plugin tsconfig.paths.json to root tsconfig.json
 * 2. Adding plugin setup.configuration.yaml to app configuration.yaml plugins field
 * 3. Appending plugin setup.env to app .env
 * 4. Running yarn install
 *
 * Usage: node core/scripts/install-plugin.js <appId> <pluginId1> [pluginId2 ...]
 * Example: node core/scripts/install-plugin.js catalyst-cerebrum adobe-aem
 */

const fs = require("fs");
const path = require("path");
const {
  generateTimestamp,
  createBackups,
  addTsconfigPaths,
  mergeConfigurationYaml,
  appendEnvBase,
  finalizeInstallation,
  findComponentDirectory,
  getSearchLocationsMessage,
  ROOT,
} = require("./install-utils");

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    "Usage: node core/scripts/install-plugin.js <appId> <pluginId1> [pluginId2 ...] [doBackup]",
  );
  process.exit(1);
}

const doBackup = args.includes("doBackup");
const filteredArgs = args.filter((arg) => arg !== "doBackup");

const appId = filteredArgs[0];
const pluginIds = filteredArgs.slice(1);

const appDir = path.join(ROOT, "src", "apps", appId);
const appConfigPath = path.join(appDir, "configuration.yaml");
const appEnvPath = path.join(appDir, ".env");

if (!fs.existsSync(appDir)) {
  console.error(`App directory not found: ${appDir}`);
  process.exit(1);
}

const timestamp = generateTimestamp();
createBackups(appDir, timestamp, doBackup);

const rootTsconfigPath = path.join(ROOT, "tsconfig.json");
const rootTsconfig = JSON.parse(fs.readFileSync(rootTsconfigPath, "utf8"));
let mergedPaths = { ...rootTsconfig.compilerOptions.paths };

for (const pluginId of pluginIds) {
  const pluginDir = findComponentDirectory("plugins", pluginId);

  if (!pluginDir) {
    console.warn(
      `Plugin directory not found in ${getSearchLocationsMessage("plugins", pluginId)}, skipping.`,
    );
    continue;
  }

  console.log(`Installing plugin: ${pluginId}`);

  addTsconfigPaths(pluginDir, mergedPaths, pluginId);
  mergeConfigurationYaml(
    appConfigPath,
    path.join(pluginDir, "setup.configuration.yaml"),
    "plugins",
    pluginId,
  );
  appendEnvBase(pluginDir, appEnvPath, pluginId, "Plugin");
}

finalizeInstallation(mergedPaths);
console.log("Plugin installation complete!");
