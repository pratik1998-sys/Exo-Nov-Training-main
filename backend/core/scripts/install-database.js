/**
 * Installs a database by:
 * 1. Adding database module tsconfig.paths.json to root tsconfig.json
 * 2. Adding database setup.configuration.yaml to app configuration.yaml databases field (with $DATABASE_ID replaced by databaseId, lowercase)
 * 3. Appending database setup.env to app .env (with $DATABASE_ID replaced by databaseId, uppercase)
 * 4. Running yarn install
 *
 * Usage: node core/scripts/install-database.js <appId> <databaseType> <databaseId> [doBackup]
 * Example: node core/scripts/install-database.js catalyst-cerebrum postgres cerebrum_healthcare
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
if (args.length < 3) {
  console.error(
    "Usage: node core/scripts/install-database.js <appId> <databaseType> <databaseId> [doBackup]",
  );
  process.exit(1);
}

const doBackup = args.includes("doBackup");
const filteredArgs = args.filter((arg) => arg !== "doBackup");

const appId = filteredArgs[0];
const databaseType = filteredArgs[1];
const databaseId = filteredArgs[2];

const appDir = path.join(ROOT, "src", "apps", appId);
const appConfigPath = path.join(appDir, "configuration.yaml");
const appEnvPath = path.join(appDir, ".env");

if (!fs.existsSync(appDir)) {
  console.error(`App directory not found: ${appDir}`);
  process.exit(1);
}

const databaseDir = findComponentDirectory("databases", databaseType);
if (!databaseDir) {
  console.error(
    `Database module directory not found in ${getSearchLocationsMessage("databases", databaseType)}`,
  );
  process.exit(1);
}

const timestamp = generateTimestamp();
createBackups(appDir, timestamp, doBackup);

const rootTsconfigPath = path.join(ROOT, "tsconfig.json");
const rootTsconfig = JSON.parse(fs.readFileSync(rootTsconfigPath, "utf8"));
let mergedPaths = { ...rootTsconfig.compilerOptions.paths };

console.log(`Installing database: ${databaseType} (id: ${databaseId})`);

addTsconfigPaths(databaseDir, mergedPaths, "Database");
mergeConfigurationYaml(
  appConfigPath,
  path.join(databaseDir, "setup.configuration.yaml"),
  "databases",
  "Database",
  {
    $DATABASE_ID: databaseId.toLowerCase(),
  },
);
appendEnvBase(databaseDir, appEnvPath, databaseId, "Database", {
  $DATABASE_ID: databaseId.toUpperCase(),
});

finalizeInstallation(mergedPaths);
console.log("Database installation complete!");
