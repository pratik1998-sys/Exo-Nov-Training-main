/**
 * Shared utilities for install-plugin.js, install-feature.js, and install-database.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const {
  addPathsFromDirectory,
  writeTsconfig,
  mergePaths,
  ROOT,
} = require("./generate-tsconfig");

/**
 * Finds a component directory by checking multiple locations in order of priority.
 * @param {string} componentType - Type of component: 'features', 'plugins', or 'databases'
 * @param {string} componentId - ID/name of the component
 * @returns {string|null} - Path to the component directory, or null if not found
 */
function findComponentDirectory(componentType, componentId) {
  const searchPaths = [
    path.join(ROOT, "core-modules", componentType, componentId),
    path.join(ROOT, "core-staging", componentType, componentId),
    path.join(ROOT, "src", "core-staging", componentType, componentId),
  ];

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      return searchPath;
    }
  }

  return null;
}

/**
 * Gets a formatted list of search locations for error messages.
 * @param {string} componentType - Type of component: 'features', 'plugins', or 'databases'
 * @param {string} componentId - ID/name of the component
 * @returns {string} - Formatted list of search paths
 */
function getSearchLocationsMessage(componentType, componentId) {
  const locations = [
    `core-modules/${componentType}/${componentId}`,
    `core-staging/${componentType}/${componentId}`,
    `src/core-staging/${componentType}/${componentId}`,
  ];
  return locations.join(", ");
}

function generateTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "");
}

function createBackups(appDir, timestamp, doBackup = false) {
  if (!doBackup) {
    return;
  }

  const appConfigPath = path.join(appDir, "configuration.yaml");
  const appEnvPath = path.join(appDir, ".env");

  if (fs.existsSync(appConfigPath)) {
    const backupConfigPath = path.join(
      appDir,
      `configuration.backup_${timestamp}.yaml`,
    );
    fs.copyFileSync(appConfigPath, backupConfigPath);
    console.log(`Created backup: configuration.backup_${timestamp}.yaml`);
  }

  if (fs.existsSync(appEnvPath)) {
    const backupEnvPath = path.join(appDir, `.env.backup_${timestamp}`);
    fs.copyFileSync(appEnvPath, backupEnvPath);
    console.log(`Created backup: .env.backup_${timestamp}`);
  }
}

function addTsconfigPaths(itemDir, mergedPaths, itemType) {
  const itemPaths = addPathsFromDirectory(itemDir);
  if (Object.keys(itemPaths).length > 0) {
    mergePaths(mergedPaths, itemPaths);
    console.log(
      `  Added ${Object.keys(itemPaths).length} path mappings from ${itemType}`,
    );
    return true;
  }
  return false;
}

function applyReplacements(content, replacements) {
  if (!replacements || typeof replacements !== "object") return content;
  let result = content;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.split(String(key)).join(value);
  }
  return result;
}

function mergeConfigurationYaml(
  appConfigPath,
  itemConfigPath,
  targetField,
  itemType,
  replacements = null,
) {
  if (!fs.existsSync(itemConfigPath)) return false;

  const appConfigContent = fs.readFileSync(appConfigPath, "utf8");
  let itemConfigContent = fs.readFileSync(itemConfigPath, "utf8").trim();
  itemConfigContent = applyReplacements(itemConfigContent, replacements);

  // Check if item config has id or type (basic validation)
  if (
    !itemConfigContent.includes("id:") &&
    !itemConfigContent.includes("type:")
  ) {
    return false;
  }

  const lines = appConfigContent.split("\n");

  // Find the target field line index
  let targetFieldLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith(`${targetField}:`)) {
      targetFieldLineIndex = i;
      break;
    }
  }

  if (targetFieldLineIndex === -1) {
    // Field doesn't exist, add it before the last top-level key or at the end
    let insertIndex = lines.length;

    // Find last top-level key (non-indented line ending with :)
    for (let i = lines.length - 1; i >= 0; i--) {
      if (/^[a-zA-Z]/.test(lines[i]) && lines[i].includes(":")) {
        insertIndex = i + 1;
        break;
      }
    }

    const indent = "  ";
    const itemLines = itemConfigContent.split("\n");
    // Put "-" on its own line, then indent all content lines
    const indentedItem = `${indent}-\n${itemLines.map((line) => `${indent}  ${line}`).join("\n")}`;

    const newField = `${targetField}:\n${indentedItem}`;
    lines.splice(insertIndex, 0, newField);
    fs.writeFileSync(appConfigPath, lines.join("\n"), "utf8");
    console.log(`  Added ${itemType} configuration to configuration.yaml`);
    return true;
  }

  // Field exists, find where to insert (after the last item in the array)
  // Find the end of the target field's array (next top-level key at column 0)
  let insertLineIndex = targetFieldLineIndex + 1;
  let lastArrayItemLine = -1;

  for (let i = targetFieldLineIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      continue; // Skip empty lines
    }

    // Check if this is a top-level key (starts at column 0, not a comment)
    if (
      /^[a-zA-Z]/.test(trimmed) &&
      !line.startsWith(" ") &&
      !line.startsWith("#") &&
      line.includes(":")
    ) {
      insertLineIndex = i;
      break;
    }

    // Track array items (starts with "  - ")
    if (line.match(/^  - /)) {
      lastArrayItemLine = i;
      insertLineIndex = i + 1;
    } else if (lastArrayItemLine !== -1 && line.startsWith("  ")) {
      // Continuation of the last array item (indented but not starting with "-")
      insertLineIndex = i + 1;
    }
  }

  // Prepare the item content with proper indentation
  // Put "-" on its own line, then indent all content lines
  const itemLines = itemConfigContent.split("\n");
  const indent = "  ";
  const indentedItem = `${indent}-\n${itemLines.map((line) => `${indent}  ${line}`).join("\n")}`;

  // Insert the new item
  lines.splice(insertLineIndex, 0, indentedItem);
  fs.writeFileSync(appConfigPath, lines.join("\n"), "utf8");
  console.log(`  Added ${itemType} configuration to configuration.yaml`);
  return true;
}

function getEnvKeys(content) {
  const keys = new Set();
  for (const line of (content || "").split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const key = trimmed.split("=")[0].trim();
      if (key) keys.add(key);
    }
  }
  return keys;
}

function removeExistingEnvBlock(content, itemType, itemId) {
  const marker = `# ${itemType}: ${itemId}`;
  const lines = content.split("\n");
  const out = [];
  let inBlock = false;
  for (const line of lines) {
    if (line.trim() === marker) {
      inBlock = true;
      continue;
    }
    if (inBlock) {
      if (/^#\s+(Plugin|Feature|Database):\s+\S+/.test(line.trim())) {
        inBlock = false;
        out.push(line);
      }
      continue;
    }
    out.push(line);
  }
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function appendEnvBase(
  itemDir,
  appEnvPath,
  itemId,
  itemType,
  replacements = null,
) {
  const itemEnvBasePath = path.join(itemDir, "setup.env");
  if (!fs.existsSync(itemEnvBasePath)) return false;

  let itemEnvContent = fs.readFileSync(itemEnvBasePath, "utf8");
  itemEnvContent = applyReplacements(itemEnvContent, replacements);
  let appEnvContent = fs.existsSync(appEnvPath)
    ? fs.readFileSync(appEnvPath, "utf8")
    : "";

  appEnvContent = removeExistingEnvBlock(appEnvContent, itemType, itemId);
  const existingKeys = getEnvKeys(appEnvContent);

  const itemLines = itemEnvContent.split("\n");
  const linesToAppend = [];
  for (const line of itemLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      linesToAppend.push(line);
      continue;
    }
    const key = trimmed.split("=")[0].trim();
    if (existingKeys.has(key)) continue;
    existingKeys.add(key);
    linesToAppend.push(line);
  }

  const blockContent = linesToAppend.join("\n").trim();
  if (!blockContent) return false;

  if (appEnvContent && !appEnvContent.endsWith("\n")) {
    appEnvContent += "\n";
  }
  appEnvContent += `# ${itemType}: ${itemId}\n${blockContent}`;
  if (!appEnvContent.endsWith("\n")) {
    appEnvContent += "\n";
  }

  fs.writeFileSync(appEnvPath, appEnvContent, "utf8");
  console.log(`  Appended setup.env to .env`);
  return true;
}

function finalizeInstallation(mergedPaths) {
  writeTsconfig(mergedPaths);
  console.log(
    `Updated tsconfig.json with ${Object.keys(mergedPaths).length} total path mappings.`,
  );

  console.log("Running yarn install...");
  execSync("yarn install", { cwd: ROOT, stdio: "inherit" });
}

module.exports = {
  generateTimestamp,
  createBackups,
  addTsconfigPaths,
  mergeConfigurationYaml,
  appendEnvBase,
  finalizeInstallation,
  findComponentDirectory,
  getSearchLocationsMessage,
  ROOT,
};
