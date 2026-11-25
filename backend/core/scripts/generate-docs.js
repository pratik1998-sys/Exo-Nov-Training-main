/**
 * Generates documentation structure for GitHub Pages:
 * 1. Copies ./core/docs to ./docs (root)
 * 2. Aggregates feature, plugin, and middleware docs by extension point (class-loading hierarchy: core-modules → core-staging → apps/global → apps/$appId). Each component has one index.md with base content plus sections "Staging", "All Apps", or appId for extensions. All other .md files from each docs dir are copied so links resolve.
 * 3. Copies database docs from ./core-modules/databases/{id}/docs to ./docs/databases/{id}
 * 4. Copies messenger docs from ./core-modules/messengers/{id}/docs to ./docs/messengers/{id}
 * 5. Updates ./docs/index.md with sections and links
 * 6. Creates/updates ./docs/plugins/index.md, ./docs/features/index.md, ./docs/middleware/index.md, ./docs/databases/index.md, and ./docs/messengers/index.md
 * 7. Processes app-specific docs: app index links to aggregated docs at project root (no duplicate copies)
 * 8. Adds Apps section to ./docs/index.md with links to app docs
 *
 * Run: npm run generate:docs
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");

// Constants
const MODULE_TYPES = {
  PLUGINS: "plugins",
  FEATURES: "features",
  MIDDLEWARE: "middleware",
  DATABASES: "databases",
  MESSENGERS: "messengers",
};

/** Class-loading order: core → core-modules → core-staging → apps/global → apps/$appId */
const HIERARCHY_BASE_PATHS = [
  "core-modules",
  "src/core-staging",
  "src/apps/global",
];

/**
 * Get ordered list of { basePath (absolute), label } for doc aggregation.
 * Label: null = base, "Staging" = core-staging, "All Apps" = global, appId for apps.
 */
function getHierarchyBases() {
  const bases = HIERARCHY_BASE_PATHS.map((p) => {
    const basePath = path.join(ROOT, p);
    let label = null;
    if (p.includes("core-staging")) label = "Staging";
    else if (p.includes("apps/global")) label = "All Apps";
    return { basePath, label };
  });
  const appsPath = path.join(ROOT, "src", "apps");
  if (fs.existsSync(appsPath)) {
    const appIds = getSubdirectories(appsPath);
    for (const appId of appIds) {
      if (appId === "global") continue;
      bases.push({
        basePath: path.join(appsPath, appId),
        label: appId,
      });
    }
  }
  return bases;
}

/**
 * Generate timestamp in format YYYYMMDDHHmmss
 */
function generateTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "");
}

/**
 * Get subdirectories from a path
 */
function getSubdirectories(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/**
 * Recursively copy directory contents
 */
function copyDirectoryContents(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    return false;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryContents(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  return true;
}

/**
 * Backup a directory with timestamp
 */
function backupDirectory(
  dirPath,
  timestamp,
  backupName = "docs",
  doBackup = false,
) {
  if (!doBackup || !fs.existsSync(dirPath)) {
    return false;
  }

  const backupPath = path.join(
    path.dirname(dirPath),
    `${backupName}_backup_${timestamp}`,
  );
  copyDirectoryContents(dirPath, backupPath);
  return backupPath;
}

/**
 * Read markdown file content
 */
function readMarkdownFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { lines: [], content: "" };
  }
  const content = fs.readFileSync(filePath, "utf8");
  return { lines: content.split("\n"), content };
}

/**
 * Write markdown file
 */
function writeMarkdownFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Strip "docs" path segment from relative URLs in markdown link destinations.
 * After generate-docs aggregates content, files live outside their source "docs"
 * directories (e.g. features/ec-user/docs/index.md becomes features/ec-user/index.md),
 * so links like (features/ec-user/docs/index.md) must become (features/ec-user/index.md).
 */
function stripDocsFromLinkUrl(url) {
  if (
    !url ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("#")
  ) {
    return url;
  }
  return url.replace(/(^|\/)docs\//g, "$1").replace(/\/docs$/g, "/");
}

/**
 * Rewrite markdown content so relative link paths no longer contain a "docs"
 * segment, making links valid in the aggregated docs output.
 */
function stripDocsFromRelativeLinks(content) {
  return content.replace(
    /\[([^\]]*)\]\(([^)]*)\)/g,
    (match, text, url) => `[${text}](${stripDocsFromLinkUrl(url)})`,
  );
}

/**
 * Recursively process all .md files under docsDir and rewrite relative links
 * that contain "docs" in the path so they point to the aggregated structure.
 */
function processMarkdownLinksInDocs(docsDir) {
  if (!fs.existsSync(docsDir)) {
    return;
  }
  const entries = fs.readdirSync(docsDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(docsDir, entry.name);
    if (entry.isDirectory()) {
      processMarkdownLinksInDocs(fullPath);
    } else if (entry.name.endsWith(".md")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const rewritten = stripDocsFromRelativeLinks(content);
      if (rewritten !== content) {
        fs.writeFileSync(fullPath, rewritten, "utf8");
        console.log(`  Rewrote links in: ${path.relative(ROOT, fullPath)}`);
      }
    }
  }
}

/**
 * Extract markdown links from content
 */
function extractMarkdownLinks(content) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({ text: match[1], path: match[2] });
  }
  return links;
}

/**
 * Find section index in lines array
 */
function findSectionIndex(lines, sectionTitle) {
  const escapedTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionRegex = new RegExp(`^##\\s+${escapedTitle}`, "m");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(sectionRegex)) {
      return i;
    }
  }
  return -1;
}

/**
 * Find insertion point after a section heading
 */
function findInsertionPointAfterSection(lines, sectionIndex) {
  for (let i = sectionIndex + 1; i < lines.length; i++) {
    if (lines[i].match(/^##/) && i > sectionIndex + 1) {
      return i;
    }
  }
  return lines.length;
}

/**
 * Ensure section exists in markdown file, append if missing
 */
function ensureSectionInIndex(filePath, sectionTitle, sectionLink) {
  if (!fs.existsSync(filePath)) {
    console.warn(
      `  Warning: ${filePath} does not exist, skipping section check`,
    );
    return false;
  }

  const { content } = readMarkdownFile(filePath);
  if (findSectionIndex(content.split("\n"), sectionTitle) >= 0) {
    return false; // Section already exists
  }

  const sectionContent = `\n\n## ${sectionTitle}\n\n- [${sectionTitle}](${sectionLink}) — Documentation for ${sectionTitle.toLowerCase()}.\n`;
  writeMarkdownFile(filePath, content.trimEnd() + sectionContent);
  console.log(`  Added "${sectionTitle}" section to index.md`);
  return true;
}

/**
 * Create module index file template
 */
function createModuleIndexTemplate(moduleType) {
  const capitalizedType =
    moduleType.charAt(0).toUpperCase() + moduleType.slice(1);
  return `---
title: ${capitalizedType} Documentation
layout: default
---

# ${capitalizedType} Documentation

## Available ${capitalizedType}

`;
}

/**
 * Add link to markdown file in a section (replaces existing link with same text)
 */
function addLinkToSection(filePath, sectionTitle, linkText, linkDescription) {
  const { lines, content } = readMarkdownFile(filePath);

  // Ensure section exists
  let sectionIndex = findSectionIndex(lines, sectionTitle);
  if (sectionIndex === -1) {
    const sectionContent = `\n\n## ${sectionTitle}\n\n`;
    writeMarkdownFile(filePath, content.trimEnd() + sectionContent);
    const updated = readMarkdownFile(filePath);
    lines.length = 0;
    lines.push(...updated.lines);
    sectionIndex = findSectionIndex(lines, sectionTitle);
  }

  const sectionEnd = findInsertionPointAfterSection(lines, sectionIndex);
  const linkMatch = linkText.match(/\[([^\]]+)\]\(([^)]+)\)/);

  if (linkMatch) {
    const linkTextValue = linkMatch[1];
    const linkLine = `- ${linkText} — ${linkDescription}`;

    // Check if a link with the same text already exists in this section
    let linkReplaced = false;
    for (let i = sectionIndex + 1; i < sectionEnd; i++) {
      const existingLinkMatch = lines[i].match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (existingLinkMatch && existingLinkMatch[1] === linkTextValue) {
        // Replace existing link
        lines[i] = linkLine;
        linkReplaced = true;
        break;
      }
    }

    if (!linkReplaced) {
      // Insert new link
      const insertIndex = findInsertionPointAfterSection(lines, sectionIndex);
      lines.splice(insertIndex, 0, linkLine);
    }

    writeMarkdownFile(filePath, lines.join("\n"));
    return true;
  }

  return false;
}

/**
 * Create or update module index file with link
 */
function updateModuleIndex(
  moduleIndexPath,
  moduleType,
  moduleName,
  moduleDisplayName,
) {
  // Create file if it doesn't exist
  if (!fs.existsSync(moduleIndexPath)) {
    writeMarkdownFile(moduleIndexPath, createModuleIndexTemplate(moduleType));
  }

  const linkPath = `./${moduleName}/index.md`;
  const linkText = `[${moduleDisplayName}](${linkPath})`;
  const linkDescription = `${moduleDisplayName} ${moduleType} documentation.`;

  if (
    addLinkToSection(moduleIndexPath, "Available", linkText, linkDescription)
  ) {
    console.log(`  Added ${moduleType} link to index: ${moduleName}`);
    return true;
  }
  return false;
}

/**
 * Strip YAML frontmatter and first # heading from markdown (for extension sections).
 */
function stripFrontmatterAndFirstHeading(content) {
  let out = content;
  const frontMatterMatch = out.match(/^\s*---\s*\n[\s\S]*?\n---\s*\n?/);
  if (frontMatterMatch) {
    out = out.slice(frontMatterMatch[0].length);
  }
  const firstHeadingMatch = out.match(/^\s*#\s+.+$/m);
  if (firstHeadingMatch) {
    out = out
      .slice(out.indexOf(firstHeadingMatch[0]) + firstHeadingMatch[0].length)
      .replace(/^\n+/, "");
  }
  return out.trim();
}

/**
 * Collect feature docs paths by logical key (e.g. "notification", "commerce/ec-user") in hierarchy order.
 * Returns Map<key, Array<{ label, docsPath }>>.
 */
function discoverFeatureExtensionPoints() {
  const map = new Map();
  const bases = getHierarchyBases();
  for (const { basePath, label } of bases) {
    const featuresPath = path.join(basePath, "features");
    if (!fs.existsSync(featuresPath)) continue;
    const groups = getSubdirectories(featuresPath);
    for (const groupName of groups) {
      const groupPath = path.join(featuresPath, groupName);
      const groupDocsPath = path.join(groupPath, "docs");
      if (
        fs.existsSync(groupDocsPath) &&
        fs.existsSync(path.join(groupDocsPath, "index.md"))
      ) {
        const key = groupName;
        if (!map.has(key)) map.set(key, []);
        const arr = map.get(key);
        if (!arr.some((s) => s.docsPath === groupDocsPath)) {
          arr.push({ label, docsPath: groupDocsPath });
        }
      }
      const subNames = getSubdirectories(groupPath);
      for (const subName of subNames) {
        const subDocsPath = path.join(groupPath, subName, "docs");
        if (
          !fs.existsSync(subDocsPath) ||
          !fs.existsSync(path.join(subDocsPath, "index.md"))
        )
          continue;
        const key = `${groupName}/${subName}`;
        if (!map.has(key)) map.set(key, []);
        const arr = map.get(key);
        if (!arr.some((s) => s.docsPath === subDocsPath)) {
          arr.push({ label, docsPath: subDocsPath });
        }
      }
    }
  }
  return map;
}

/**
 * Collect plugin root docs and plugin feature docs in hierarchy order.
 * Returns { pluginRoots: Map<pluginId, Array<{label, docsPath}>>, pluginFeatures: Map<pluginId, Map<featureId, Array<{label, docsPath}>>> }.
 */
function discoverPluginExtensionPoints() {
  const pluginRoots = new Map();
  const pluginFeatures = new Map();
  const bases = getHierarchyBases();
  for (const { basePath, label } of bases) {
    const pluginsPath = path.join(basePath, "plugins");
    if (!fs.existsSync(pluginsPath)) continue;
    const pluginIds = getSubdirectories(pluginsPath);
    for (const pluginId of pluginIds) {
      const pluginDocsPath = path.join(pluginsPath, pluginId, "docs");
      if (
        fs.existsSync(pluginDocsPath) &&
        fs.existsSync(path.join(pluginDocsPath, "index.md"))
      ) {
        if (!pluginRoots.has(pluginId)) pluginRoots.set(pluginId, []);
        const arr = pluginRoots.get(pluginId);
        if (!arr.some((s) => s.docsPath === pluginDocsPath)) {
          arr.push({ label, docsPath: pluginDocsPath });
        }
      }
      const featuresPath = path.join(pluginsPath, pluginId, "features");
      if (!fs.existsSync(featuresPath)) continue;
      const featureIds = getSubdirectories(featuresPath);
      for (const featureId of featureIds) {
        const featureDocsPath = path.join(featuresPath, featureId, "docs");
        if (
          !fs.existsSync(featureDocsPath) ||
          !fs.existsSync(path.join(featureDocsPath, "index.md"))
        )
          continue;
        if (!pluginFeatures.has(pluginId))
          pluginFeatures.set(pluginId, new Map());
        const featMap = pluginFeatures.get(pluginId);
        if (!featMap.has(featureId)) featMap.set(featureId, []);
        const arr = featMap.get(featureId);
        if (!arr.some((s) => s.docsPath === featureDocsPath)) {
          arr.push({ label, docsPath: featureDocsPath });
        }
      }
    }
  }
  return { pluginRoots, pluginFeatures };
}

/**
 * Build aggregated index.md from base + extension sections and write to destPath.
 * sources[0] is base (label null); rest are extensions with section headings.
 */
function writeAggregatedIndex(sources, destIndexPath) {
  if (sources.length === 0) return;
  const basePath = path.join(sources[0].docsPath, "index.md");
  let aggregated = fs.readFileSync(basePath, "utf8");
  for (let i = 1; i < sources.length; i++) {
    const extPath = path.join(sources[i].docsPath, "index.md");
    const extContent = fs.readFileSync(extPath, "utf8");
    const body = stripFrontmatterAndFirstHeading(extContent);
    const sectionTitle = sources[i].label || "Extension";
    aggregated += "\n\n---\n\n## " + sectionTitle + "\n\n" + body;
  }
  const dir = path.dirname(destIndexPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(destIndexPath, aggregated, "utf8");
}

/**
 * List all .md files under dir recursively (relative paths).
 */
function listMarkdownFilesRecursive(dir, prefix = "") {
  const result = [];
  if (!fs.existsSync(dir)) return result;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      result.push(
        ...listMarkdownFilesRecursive(path.join(dir, entry.name), rel),
      );
    } else if (entry.name.endsWith(".md")) {
      result.push(rel);
    }
  }
  return result;
}

/**
 * Copy all .md files except index.md at root from each source docs dir to destDir (preserving relative paths), in order (later overwrites).
 */
function copyNonIndexMarkdown(sources, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  for (const { docsPath } of sources) {
    if (!fs.existsSync(docsPath)) continue;
    const mdFiles = listMarkdownFilesRecursive(docsPath);
    for (const rel of mdFiles) {
      if (rel === "index.md") continue;
      const srcPath = path.join(docsPath, rel);
      const destPath = path.join(destDir, rel);
      const destParent = path.dirname(destPath);
      if (!fs.existsSync(destParent))
        fs.mkdirSync(destParent, { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Aggregate one component's docs: single index.md (base + sections) and all other .md files.
 */
function aggregateComponentDocs(moduleType, logicalKey, sources, destBasePath) {
  const destSegments = logicalKey.split("/");
  const destDir = path.join(destBasePath, moduleType, ...destSegments);
  const destIndexPath = path.join(destDir, "index.md");
  writeAggregatedIndex(sources, destIndexPath);
  copyNonIndexMarkdown(sources, destDir);
  console.log(
    `  Aggregated ${moduleType} docs: ${logicalKey} (${sources.length} extension point(s))`,
  );
}

/**
 * Process features with aggregation: one doc per logical feature with base + Staging / All Apps / appId sections.
 */
function processAggregatedFeatures() {
  const destBasePath = path.join(ROOT, "docs");
  const featureMap = discoverFeatureExtensionPoints();
  const processedModules = [];
  for (const [key, sources] of featureMap) {
    if (sources.length === 0) continue;
    aggregateComponentDocs(MODULE_TYPES.FEATURES, key, sources, destBasePath);
    const displayName = sources.length > 1 ? `${key} (aggregated)` : key;
    processedModules.push({ name: key, displayName });
  }
  if (processedModules.length > 0) {
    const moduleIndexPath = path.join(
      destBasePath,
      MODULE_TYPES.FEATURES,
      "index.md",
    );
    if (!fs.existsSync(moduleIndexPath)) {
      writeMarkdownFile(
        moduleIndexPath,
        createModuleIndexTemplate(MODULE_TYPES.FEATURES),
      );
    }
    for (const module of processedModules) {
      updateModuleIndex(
        moduleIndexPath,
        MODULE_TYPES.FEATURES,
        module.name,
        module.displayName,
      );
    }
  }
  return processedModules.length > 0;
}

/**
 * Process plugins and plugin features with aggregation.
 */
function processAggregatedPlugins() {
  const destBasePath = path.join(ROOT, "docs");
  const { pluginRoots, pluginFeatures } = discoverPluginExtensionPoints();
  const processedPluginIds = new Set();

  for (const [pluginId, sources] of pluginRoots) {
    const destPluginPath = path.join(
      destBasePath,
      MODULE_TYPES.PLUGINS,
      pluginId,
    );
    if (!fs.existsSync(destPluginPath))
      fs.mkdirSync(destPluginPath, { recursive: true });
    aggregateComponentDocs(
      MODULE_TYPES.PLUGINS,
      pluginId,
      sources,
      destBasePath,
    );
    processedPluginIds.add(pluginId);
  }

  for (const [pluginId, featMap] of pluginFeatures) {
    for (const [featureId, sources] of featMap) {
      const logicalKey = `${pluginId}/features/${featureId}`;
      aggregateComponentDocs(
        MODULE_TYPES.PLUGINS,
        logicalKey,
        sources,
        destBasePath,
      );
    }
    if (!processedPluginIds.has(pluginId)) {
      const destPluginPath = path.join(
        destBasePath,
        MODULE_TYPES.PLUGINS,
        pluginId,
      );
      if (!fs.existsSync(destPluginPath))
        fs.mkdirSync(destPluginPath, { recursive: true });
      const featureIds = Array.from(featMap.keys());
      const featureLinks = featureIds
        .map(
          (fid) =>
            `- [${fid}](features/${fid}/index.md) — ${fid} plugin feature (Staging).`,
        )
        .join("\n");
      const pluginIndexPath = path.join(destPluginPath, "index.md");
      const indexContent = `---
title: ${pluginId} plugin (Staging)
layout: default
---

# ${pluginId} plugin (Staging)

## Overview

This plugin provides staging implementations under \`src/core-staging/plugins/${pluginId}\`. It is listed in project root docs so that integrators know a core-staging plugin exists with the following feature(s).

## Features

${featureLinks}
`;
      writeMarkdownFile(pluginIndexPath, indexContent);
      console.log(
        `  Created plugin index for staging plugin (from feature docs): ${pluginId}`,
      );
      processedPluginIds.add(pluginId);
    }
  }

  if (processedPluginIds.size > 0) {
    const moduleIndexPath = path.join(
      destBasePath,
      MODULE_TYPES.PLUGINS,
      "index.md",
    );
    if (!fs.existsSync(moduleIndexPath)) {
      writeMarkdownFile(
        moduleIndexPath,
        createModuleIndexTemplate(MODULE_TYPES.PLUGINS),
      );
    }
    for (const pluginId of processedPluginIds) {
      updateModuleIndex(
        moduleIndexPath,
        MODULE_TYPES.PLUGINS,
        pluginId,
        pluginId,
      );
    }
  }
  return processedPluginIds.size > 0;
}

/**
 * Collect root middleware docs paths by middleware id in hierarchy order.
 * Root middleware lives under {base}/middleware/{middlewareId}/docs.
 * Returns Map<middlewareId, Array<{ label, docsPath }>>.
 */
function discoverMiddlewareExtensionPoints() {
  const map = new Map();
  const bases = getHierarchyBases();
  for (const { basePath, label } of bases) {
    const middlewarePath = path.join(basePath, "middleware");
    if (!fs.existsSync(middlewarePath)) continue;
    const ids = getSubdirectories(middlewarePath);
    for (const id of ids) {
      const docsPath = path.join(middlewarePath, id, "docs");
      if (
        !fs.existsSync(docsPath) ||
        !fs.existsSync(path.join(docsPath, "index.md"))
      )
        continue;
      if (!map.has(id)) map.set(id, []);
      const arr = map.get(id);
      if (!arr.some((s) => s.docsPath === docsPath)) {
        arr.push({ label, docsPath });
      }
    }
  }
  return map;
}

/**
 * Process root middleware docs with aggregation (same as features/plugins).
 */
function processAggregatedMiddleware() {
  const destBasePath = path.join(ROOT, "docs");
  const middlewareMap = discoverMiddlewareExtensionPoints();
  const processedModules = [];
  for (const [id, sources] of middlewareMap) {
    if (sources.length === 0) continue;
    aggregateComponentDocs(MODULE_TYPES.MIDDLEWARE, id, sources, destBasePath);
    const displayName = sources.length > 1 ? `${id} (aggregated)` : id;
    processedModules.push({ name: id, displayName });
  }
  if (processedModules.length > 0) {
    const moduleIndexPath = path.join(
      destBasePath,
      MODULE_TYPES.MIDDLEWARE,
      "index.md",
    );
    if (!fs.existsSync(moduleIndexPath)) {
      writeMarkdownFile(
        moduleIndexPath,
        createModuleIndexTemplate(MODULE_TYPES.MIDDLEWARE),
      );
    }
    for (const module of processedModules) {
      updateModuleIndex(
        moduleIndexPath,
        MODULE_TYPES.MIDDLEWARE,
        module.name,
        module.displayName,
      );
    }
  }
  return processedModules.length > 0;
}

/**
 * Process module docs (plugins or features) from source to destination
 * Used for databases and messengers (no aggregation).
 */
function processModuleDocs(
  moduleType,
  moduleName,
  moduleDocsPath,
  destBasePath,
) {
  const destPath = path.join(destBasePath, moduleType, moduleName);
  if (copyDirectoryContents(moduleDocsPath, destPath)) {
    console.log(`  Copied ${moduleType} docs: ${moduleName}`);
    return true;
  }
  return false;
}

/**
 * Copy a plugin's feature docs from pluginSourcePath/features/{featureId}/docs
 * to destBasePath/plugins/{pluginId}/features/{featureId}.
 * Called when copying plugin docs so that both plugin root and feature docs are present.
 */
function copyPluginFeatureDocs(pluginsSourcePath, pluginId, destBasePath) {
  const featuresPath = path.join(pluginsSourcePath, pluginId, "features");
  if (!fs.existsSync(featuresPath)) {
    return;
  }

  const featureIds = getSubdirectories(featuresPath);
  for (const featureId of featureIds) {
    const srcFeatureDocs = path.join(featuresPath, featureId, "docs");
    if (!fs.existsSync(srcFeatureDocs)) {
      continue;
    }
    const destFeaturePath = path.join(
      destBasePath,
      MODULE_TYPES.PLUGINS,
      pluginId,
      "features",
      featureId,
    );
    if (copyDirectoryContents(srcFeatureDocs, destFeaturePath)) {
      console.log(
        `  Copied plugin feature docs: ${pluginId}/features/${featureId}`,
      );
    }
  }
}

/**
 * Copy a feature group's subfeature docs from featuresSourcePath/{groupName}/{subName}/docs
 * to destBasePath/features/{groupName}/{subName}.
 * Called when copying feature docs so that both the group doc and individual subfeature docs
 * are present (e.g. commerce group + commerce/cart, commerce/category, commerce/product).
 */
function copyFeatureGroupSubfeatureDocs(
  featuresSourcePath,
  groupName,
  destBasePath,
) {
  const groupPath = path.join(featuresSourcePath, groupName);
  if (!fs.existsSync(groupPath)) {
    return;
  }

  const subNames = getSubdirectories(groupPath);
  for (const subName of subNames) {
    const srcSubfeatureDocs = path.join(groupPath, subName, "docs");
    if (!fs.existsSync(srcSubfeatureDocs)) {
      continue;
    }
    const destSubfeaturePath = path.join(
      destBasePath,
      MODULE_TYPES.FEATURES,
      groupName,
      subName,
    );
    if (copyDirectoryContents(srcSubfeatureDocs, destSubfeaturePath)) {
      console.log(
        `  Copied feature group subfeature docs: ${groupName}/${subName}`,
      );
    }
  }
}

/**
 * Process all modules of a given type (plugins or features)
 */
function processAllModules(moduleType, modulesBasePath) {
  const modulesPath = path.join(ROOT, modulesBasePath);
  const destBasePath = path.join(ROOT, "docs");

  const isStagingSource = modulesBasePath.startsWith("src/core-staging/");

  const modules = getSubdirectories(modulesPath);
  if (modules.length === 0) {
    console.log(`  No ${moduleType} directory found at ${modulesBasePath}`);
    return false;
  }

  const processedModules = [];
  for (const moduleName of modules) {
    const moduleDocsPath = path.join(modulesPath, moduleName, "docs");
    if (fs.existsSync(moduleDocsPath)) {
      if (
        processModuleDocs(moduleType, moduleName, moduleDocsPath, destBasePath)
      ) {
        if (moduleType === MODULE_TYPES.PLUGINS) {
          copyPluginFeatureDocs(modulesPath, moduleName, destBasePath);
        }
        if (moduleType === MODULE_TYPES.FEATURES) {
          copyFeatureGroupSubfeatureDocs(modulesPath, moduleName, destBasePath);
        }
        processedModules.push({
          name: moduleName,
          displayName: isStagingSource ? `${moduleName} (Staging)` : moduleName,
        });
      }
    }
  }

  // Update module index if any modules were processed
  if (processedModules.length > 0) {
    const moduleIndexPath = path.join(destBasePath, moduleType, "index.md");
    for (const module of processedModules) {
      updateModuleIndex(
        moduleIndexPath,
        moduleType,
        module.name,
        module.displayName,
      );
    }
  }

  return processedModules.length > 0;
}

/**
 * Discover staging plugins that have feature docs but no plugin root docs;
 * create a minimal plugin docs structure and add to docs/plugins so project root docs list the plugin.
 */
function processStagingPluginsFromFeatureDocs() {
  const stagingPluginsPath = path.join(ROOT, "src", "core-staging", "plugins");
  const destBasePath = path.join(ROOT, "docs");

  if (!fs.existsSync(stagingPluginsPath)) {
    return false;
  }

  const pluginIds = getSubdirectories(stagingPluginsPath);
  const processedPlugins = [];

  for (const pluginId of pluginIds) {
    const pluginRootDocs = path.join(stagingPluginsPath, pluginId, "docs");
    if (fs.existsSync(pluginRootDocs)) {
      continue; // Already handled by processAllModules
    }

    const featuresPath = path.join(stagingPluginsPath, pluginId, "features");
    if (!fs.existsSync(featuresPath)) {
      continue;
    }

    const featureIds = getSubdirectories(featuresPath);
    const featuresWithDocs = featureIds.filter((fid) =>
      fs.existsSync(path.join(featuresPath, fid, "docs", "index.md")),
    );
    if (featuresWithDocs.length === 0) {
      continue;
    }

    const destPluginPath = path.join(
      destBasePath,
      MODULE_TYPES.PLUGINS,
      pluginId,
    );
    if (!fs.existsSync(destPluginPath)) {
      fs.mkdirSync(destPluginPath, { recursive: true });
    }

    for (const featureId of featuresWithDocs) {
      const srcFeatureDocs = path.join(featuresPath, featureId, "docs");
      const destFeaturePath = path.join(destPluginPath, "features", featureId);
      copyDirectoryContents(srcFeatureDocs, destFeaturePath);
      console.log(
        `  Copied staging plugin feature docs: ${pluginId}/features/${featureId}`,
      );
    }

    const pluginIndexPath = path.join(destPluginPath, "index.md");
    const featureLinks = featuresWithDocs
      .map(
        (fid) =>
          `- [${fid}](features/${fid}/index.md) — ${fid} plugin feature (Staging).`,
      )
      .join("\n");
    const indexContent = `---
title: ${pluginId} plugin (Staging)
layout: default
---

# ${pluginId} plugin (Staging)

## Overview

This plugin provides staging implementations under \`src/core-staging/plugins/${pluginId}\`. It is listed in project root docs so that integrators know a core-staging plugin exists with the following feature(s).

## Features

${featureLinks}
`;
    writeMarkdownFile(pluginIndexPath, indexContent);
    console.log(
      `  Created plugin index for staging plugin (from feature docs): ${pluginId}`,
    );

    processedPlugins.push({
      name: pluginId,
      displayName: `${pluginId} (Staging)`,
    });
  }

  if (processedPlugins.length > 0) {
    const moduleIndexPath = path.join(
      destBasePath,
      MODULE_TYPES.PLUGINS,
      "index.md",
    );
    if (!fs.existsSync(moduleIndexPath)) {
      writeMarkdownFile(
        moduleIndexPath,
        createModuleIndexTemplate(MODULE_TYPES.PLUGINS),
      );
    }
    for (const plugin of processedPlugins) {
      updateModuleIndex(
        moduleIndexPath,
        MODULE_TYPES.PLUGINS,
        plugin.name,
        plugin.displayName,
      );
    }
  }

  return processedPlugins.length > 0;
}

/**
 * Process staging feature docs from src/core-staging/features/{group}/{feature}/docs
 */
function processStagingFeatures() {
  const rootStagingFeaturesPath = path.join(
    ROOT,
    "src",
    "core-staging",
    "features",
  );
  const destBasePath = path.join(ROOT, "docs");

  const groups = getSubdirectories(rootStagingFeaturesPath);
  if (groups.length === 0) {
    console.log(
      "  No staging features directory found at src/core-staging/features",
    );
    return false;
  }

  const processedModules = [];
  for (const groupName of groups) {
    const groupPath = path.join(rootStagingFeaturesPath, groupName);
    const groupDocsPath = path.join(groupPath, "docs");
    if (fs.existsSync(groupDocsPath)) {
      if (
        processModuleDocs(
          MODULE_TYPES.FEATURES,
          groupName,
          groupDocsPath,
          destBasePath,
        )
      ) {
        processedModules.push({
          name: groupName,
          displayName: `${groupName} (Staging)`,
        });
      }
    }
    const featureIds = getSubdirectories(groupPath);
    for (const featureId of featureIds) {
      const moduleDocsPath = path.join(groupPath, featureId, "docs");
      if (fs.existsSync(moduleDocsPath)) {
        const moduleName = `${groupName}/${featureId}`;
        if (
          processModuleDocs(
            MODULE_TYPES.FEATURES,
            moduleName,
            moduleDocsPath,
            destBasePath,
          )
        ) {
          processedModules.push({
            name: moduleName,
            displayName: `${moduleName} (Staging)`,
          });
        }
      }
    }
  }

  if (processedModules.length > 0) {
    const moduleIndexPath = path.join(
      destBasePath,
      MODULE_TYPES.FEATURES,
      "index.md",
    );
    for (const module of processedModules) {
      updateModuleIndex(
        moduleIndexPath,
        MODULE_TYPES.FEATURES,
        module.name,
        module.displayName,
      );
    }
  }

  return processedModules.length > 0;
}

/**
 * Create app index file template
 */
function createAppIndexTemplate(appName) {
  const displayName = formatAppDisplayName(appName);
  return `---
title: ${displayName} Documentation
layout: default
---

# ${displayName} Documentation

`;
}

/**
 * Add module link to app index.md
 */
function addModuleLinkToAppIndex(
  appIndexPath,
  moduleType,
  moduleId,
  moduleDocsIndexPath,
  appName,
) {
  // Create file if it doesn't exist
  if (!fs.existsSync(appIndexPath)) {
    const appDisplayName =
      appName || path.basename(path.dirname(path.dirname(appIndexPath)));
    writeMarkdownFile(appIndexPath, createAppIndexTemplate(appDisplayName));
  }

  // Calculate relative path
  const appDocsDir = path.dirname(appIndexPath);
  const relativePath = path
    .relative(appDocsDir, moduleDocsIndexPath)
    .replace(/\\/g, "/");
  const linkPath = relativePath.startsWith(".")
    ? relativePath
    : `./${relativePath}`;
  const linkText = `[${moduleId}](${linkPath})`;
  const sectionTitle = moduleType.charAt(0).toUpperCase() + moduleType.slice(1);
  const linkDescription = `${moduleId} ${moduleType} documentation.`;

  if (addLinkToSection(appIndexPath, sectionTitle, linkText, linkDescription)) {
    console.log(`  Added ${moduleType} link to app index: ${moduleId}`);
    return true;
  }
  return false;
}

/**
 * Copy module docs to app docs directory
 */
function copyModuleDocsToAppDocs(
  appPath,
  appDocsPath,
  moduleType,
  moduleId,
  moduleDocsPath,
) {
  const destPath = path.join(appDocsPath, moduleType, moduleId);
  if (copyDirectoryContents(moduleDocsPath, destPath)) {
    console.log(`  Copied ${moduleType} docs to app docs: ${moduleId}`);
    return true;
  }
  return false;
}

/**
 * Process modules (plugins or features) for an app: add links in app index to aggregated docs at project root (no copy).
 */
function processAppModules(
  appPath,
  appName,
  appIndexPath,
  appDocsPath,
  moduleType,
) {
  const modulesPath = path.join(appPath, moduleType);
  if (!fs.existsSync(modulesPath)) return false;
  const topLevelIds = getSubdirectories(modulesPath);
  const moduleIds = [];

  for (const id of topLevelIds) {
    const docsPath = path.join(modulesPath, id, "docs");
    if (
      fs.existsSync(docsPath) &&
      fs.existsSync(path.join(docsPath, "index.md"))
    ) {
      moduleIds.push(id);
    } else {
      const subIds = getSubdirectories(path.join(modulesPath, id));
      for (const subId of subIds) {
        const subDocsPath = path.join(modulesPath, id, subId, "docs");
        if (
          fs.existsSync(subDocsPath) &&
          fs.existsSync(path.join(subDocsPath, "index.md"))
        ) {
          moduleIds.push(`${id}/${subId}`);
        }
      }
    }
  }

  let hasUpdates = false;
  const rootDocsPath = path.join(ROOT, "docs");
  for (const moduleId of moduleIds) {
    const segments = moduleId.split("/");
    const aggregatedIndexPath = path.join(
      rootDocsPath,
      moduleType,
      ...segments,
      "index.md",
    );
    if (
      addModuleLinkToAppIndex(
        appIndexPath,
        moduleType,
        moduleId,
        aggregatedIndexPath,
        appName,
      )
    ) {
      hasUpdates = true;
    }
  }

  return hasUpdates;
}

/**
 * Process app-specific docs
 */
function processAppDocs(appPath, appName, timestamp, doBackup = false) {
  const appDocsPath = path.join(appPath, "docs");
  const appIndexPath = path.join(appDocsPath, "index.md");

  // Backup existing app docs directory
  if (fs.existsSync(appDocsPath)) {
    if (backupDirectory(appDocsPath, timestamp, "docs", doBackup)) {
      console.log(`  Created backup: ${appName}/docs_backup_${timestamp}`);
    }
  } else {
    fs.mkdirSync(appDocsPath, { recursive: true });
  }

  // Process plugins, features, and middleware (links to aggregated docs at root)
  const hasPluginUpdates = processAppModules(
    appPath,
    appName,
    appIndexPath,
    appDocsPath,
    MODULE_TYPES.PLUGINS,
  );
  const hasFeatureUpdates = processAppModules(
    appPath,
    appName,
    appIndexPath,
    appDocsPath,
    MODULE_TYPES.FEATURES,
  );
  const hasMiddlewareUpdates = processAppModules(
    appPath,
    appName,
    appIndexPath,
    appDocsPath,
    MODULE_TYPES.MIDDLEWARE,
  );

  return hasPluginUpdates || hasFeatureUpdates || hasMiddlewareUpdates;
}

/**
 * Copy app docs to project root docs/apps directory
 */
function copyAppDocsToRoot(appPath, appName) {
  const appDocsPath = path.join(appPath, "docs");
  const appIndexPath = path.join(appDocsPath, "index.md");

  // Only copy if docs directory exists and has an index.md file
  if (!fs.existsSync(appDocsPath) || !fs.existsSync(appIndexPath)) {
    return false;
  }

  const destDocsPath = path.join(ROOT, "docs", "apps", appName);
  if (copyDirectoryContents(appDocsPath, destDocsPath)) {
    console.log(`  Copied app docs to docs/apps/${appName}`);
    return true;
  }
  return false;
}

/**
 * Process all apps
 */
function processAllApps(timestamp, doBackup = false) {
  const appsPath = path.join(ROOT, "src", "apps");
  const apps = getSubdirectories(appsPath);

  if (apps.length === 0) {
    console.log("  No src/apps directory found");
    return [];
  }

  const processedApps = [];
  for (const appName of apps) {
    const appPath = path.join(appsPath, appName);
    console.log(`\nProcessing app: ${appName}`);
    processAppDocs(appPath, appName, timestamp, doBackup);

    // Copy app docs to project root docs/apps directory after index.md is updated
    const hasDocs = copyAppDocsToRoot(appPath, appName);

    // Include app in processedApps if it has docs (for Apps section)
    if (hasDocs) {
      processedApps.push(appName);
    }
  }

  return processedApps;
}

/**
 * Format app name for display (e.g., "_lobal" -> "global")
 */
function formatAppDisplayName(appName) {
  return appName === "global" ? "global" : appName;
}

/**
 * Create app link line
 */
function createAppLink(appName) {
  const appDocsPath = `./apps/${appName}/index.md`;
  const displayName = formatAppDisplayName(appName);
  return `- [${displayName}](${appDocsPath}) — ${displayName} application documentation.`;
}

/**
 * Update Apps section in root docs/index.md
 */
function updateAppsSection(docsIndexPath, processedApps) {
  if (!fs.existsSync(docsIndexPath)) {
    return;
  }

  const { lines, content } = readMarkdownFile(docsIndexPath);
  const sectionIndex = findSectionIndex(lines, "Apps");

  // If no apps to add, remove section if it exists
  if (processedApps.length === 0) {
    if (sectionIndex !== -1) {
      const sectionEnd = findInsertionPointAfterSection(lines, sectionIndex);
      const linesBeforeSection = lines.slice(0, sectionIndex);
      const linesAfterSection = lines.slice(sectionEnd);
      const newLines = [...linesBeforeSection, ...linesAfterSection];
      writeMarkdownFile(docsIndexPath, newLines.join("\n"));
      console.log("  Removed Apps section (no apps with docs)");
    }
    return;
  }

  if (sectionIndex === -1) {
    // Create Apps section
    const appsLinks = processedApps.map(createAppLink).join("\n");
    const appsSection = `\n\n## Apps\n\n${appsLinks}\n`;
    writeMarkdownFile(docsIndexPath, content.trimEnd() + appsSection);
    console.log("  Added Apps section to root docs/index.md");
    return;
  }

  // Replace existing Apps section content
  const sectionEnd = findInsertionPointAfterSection(lines, sectionIndex);

  // Create new links for all processed apps
  const newLinks = processedApps.map(createAppLink);

  // Remove old section content and insert new links
  const linesBeforeSection = lines.slice(0, sectionIndex + 1);
  const linesAfterSection = lines.slice(sectionEnd);
  const newLines = [...linesBeforeSection, ...newLinks, ...linesAfterSection];

  writeMarkdownFile(docsIndexPath, newLines.join("\n"));
  console.log(`  Updated Apps section with ${newLinks.length} app link(s)`);
}

/**
 * Main function
 */
function main() {
  console.log("Generating documentation structure...");

  const doBackup = process.argv.includes("doBackup");
  const timestamp = generateTimestamp();

  // 1. Copy core docs to root with backup
  const coreDocsPath = path.join(ROOT, "core", "docs");
  const rootDocsPath = path.join(ROOT, "docs");

  if (fs.existsSync(coreDocsPath)) {
    if (fs.existsSync(rootDocsPath)) {
      if (doBackup) {
        const backupPath = path.join(ROOT, `docs_backup_${timestamp}`);
        fs.renameSync(rootDocsPath, backupPath);
        console.log(`Created backup: docs_backup_${timestamp}`);
      } else {
        // Remove existing directory if not backing up
        fs.rmSync(rootDocsPath, { recursive: true, force: true });
      }
    }
    copyDirectoryContents(coreDocsPath, rootDocsPath);
    console.log("Copied core/docs to docs/");
  } else {
    console.warn("Warning: core/docs directory not found");
  }

  // 2. Aggregate plugins and features by extension point (one doc per component with base + Staging / All Apps / appId sections)
  console.log("\nProcessing plugins (aggregated by extension point)...");
  const hasPlugins = processAggregatedPlugins();

  console.log("\nProcessing features (aggregated by extension point)...");
  const hasFeatures = processAggregatedFeatures();

  console.log("\nProcessing middleware (aggregated by extension point)...");
  const hasMiddleware = processAggregatedMiddleware();

  console.log("\nProcessing databases...");
  const hasDatabases = processAllModules(
    MODULE_TYPES.DATABASES,
    "core-modules/databases",
  );

  console.log("\nProcessing messengers...");
  const hasMessengers = processAllModules(
    MODULE_TYPES.MESSENGERS,
    "core-modules/messengers",
  );

  // 3. Update root index.md with sections
  const docsIndexPath = path.join(ROOT, "docs", "index.md");
  if (fs.existsSync(docsIndexPath)) {
    if (hasPlugins) {
      ensureSectionInIndex(docsIndexPath, "Plugins", "./plugins/index.md");
    }
    if (hasFeatures) {
      ensureSectionInIndex(docsIndexPath, "Features", "./features/index.md");
    }
    if (hasMiddleware) {
      ensureSectionInIndex(
        docsIndexPath,
        "Middleware",
        "./middleware/index.md",
      );
    }
    if (hasDatabases) {
      ensureSectionInIndex(docsIndexPath, "Databases", "./databases/index.md");
    }
    if (hasMessengers) {
      ensureSectionInIndex(
        docsIndexPath,
        "Messengers",
        "./messengers/index.md",
      );
    }
  }

  // 4. Process apps
  console.log("\nProcessing apps...");
  const processedApps = processAllApps(timestamp, doBackup);

  // 5. Update Apps section in root docs/index.md
  updateAppsSection(docsIndexPath, processedApps);

  // 6. For each app, ensure there is an "$appId Components" section in root docs index
  if (fs.existsSync(docsIndexPath) && Array.isArray(processedApps)) {
    for (const appName of processedApps) {
      const sectionTitle = `${appName} Components`;
      const sectionLink = `./apps/${appName}/index.md`;
      ensureSectionInIndex(docsIndexPath, sectionTitle, sectionLink);
    }
  }

  // 7. Strip "docs" from relative link paths in aggregated markdown (links are valid in source but not after aggregation)
  console.log("\nRewriting relative links in aggregated docs...");
  processMarkdownLinksInDocs(rootDocsPath);

  console.log("\nDocumentation generation complete!");
}

if (require.main === module) {
  main();
}

module.exports = { main };
