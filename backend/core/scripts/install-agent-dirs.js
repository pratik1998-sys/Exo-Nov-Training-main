/**
 * Installs agent-related directories at project root so Cursor and GitHub Copilot
 * use the shared skills and rules from core/agent. Run as part of install-core.
 *
 * 0. If .cursor or .github already exist, renames them to .cursor.$ISO and .github.$ISO
 *    (e.g. .cursor.20260225152600) before overwriting from core.
 * 1. Creates .cursor/skills/ with symlinks to core/agent/skills/ (features, plugins, extension)
 * 2. Creates .cursor/rules/ with symlink to core/agent/rules/feature-plugin-skills.mdc
 * 3. Creates .github/skills/ with symlinks to core/agent/skills/
 * 4. Creates symlinks in .github/ to core/.github/ (copilot-instructions.md, README.md, pull_request_template.md)
 * 5. Creates .github/workflows/ with symlinks to core/.github/workflows/
 *
 * These directories reference core/agent so projects get the latest when they apply the latest core package.
 *
 * Run: node core/scripts/install-agent-dirs.js
 */

const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "../..");
const CORE = path.join(ROOT, "core");
const CORE_AGENT = path.join(CORE, "agent");
const CORE_CURSOR = path.join(CORE, ".cursor");
const CORE_GITHUB = path.join(CORE, ".github");

const SKILL_NAMES = ["docs", "features", "plugins", "extension"];
const RULE_FILE = "feature-plugin-skills.mdc";
const GITHUB_FILES = [
  "copilot-instructions.md",
  "README.md",
  "pull_request_template.md",
];

function getBackupTimestamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${y}${m}${d}${h}${min}${s}`;
}

function backupIfExists(dirName, backupTs) {
  const dirPath = path.join(ROOT, dirName);
  if (!fs.existsSync(dirPath)) return;
  const backupPath = path.join(ROOT, `${dirName}.${backupTs}`);
  fs.renameSync(dirPath, backupPath);
  console.log(`Backed up ${dirName} to ${dirName}.${backupTs}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createSymlink(targetPath, linkPath) {
  const relativeTarget = path.relative(path.dirname(linkPath), targetPath);
  if (fs.existsSync(linkPath)) {
    try {
      const current = fs.readlinkSync(linkPath);
      if (current === relativeTarget) return;
    } catch (_) {
      // not a symlink
    }
    fs.unlinkSync(linkPath);
  }
  fs.symlinkSync(relativeTarget, linkPath);
}

function installCursorDir() {
  const cursorSkills = path.join(ROOT, ".cursor", "skills");
  const cursorRules = path.join(ROOT, ".cursor", "rules");
  ensureDir(cursorSkills);
  ensureDir(cursorRules);

  for (const name of SKILL_NAMES) {
    const target = path.join(CORE_AGENT, "skills", name);
    const link = path.join(cursorSkills, name);
    if (!fs.existsSync(target)) continue;
    createSymlink(target, link);
  }

  const ruleTarget = path.join(CORE_AGENT, "rules", RULE_FILE);
  const ruleLink = path.join(cursorRules, RULE_FILE);
  if (fs.existsSync(ruleTarget)) {
    createSymlink(ruleTarget, ruleLink);
  }
}

function installGitHubDir() {
  const githubSkills = path.join(ROOT, ".github", "skills");
  ensureDir(githubSkills);

  for (const name of SKILL_NAMES) {
    const target = path.join(CORE_AGENT, "skills", name);
    const link = path.join(githubSkills, name);
    if (!fs.existsSync(target)) continue;
    createSymlink(target, link);
  }

  for (const file of GITHUB_FILES) {
    const target = path.join(CORE_GITHUB, file);
    const link = path.join(ROOT, ".github", file);
    if (fs.existsSync(target)) {
      ensureDir(path.dirname(link));
      createSymlink(target, link);
    }
  }

  const coreWorkflows = path.join(CORE_GITHUB, "workflows");
  const rootWorkflows = path.join(ROOT, ".github", "workflows");
  if (fs.existsSync(coreWorkflows)) {
    ensureDir(path.dirname(rootWorkflows));
    createSymlink(coreWorkflows, rootWorkflows);
  }
}

if (!fs.existsSync(CORE_AGENT)) {
  console.warn("core/agent not found, skipping install-agent-dirs");
  process.exit(0);
}

const backupTs = getBackupTimestamp();
backupIfExists(".cursor", backupTs);
backupIfExists(".github", backupTs);

installCursorDir();
installGitHubDir();
console.log("Installed .cursor and .github (referencing core/agent)");
