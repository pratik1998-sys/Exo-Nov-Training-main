# Agent skills and rules (shared)

This directory is the **single source of truth** for AI agent skills and rules used by both **Cursor** and **GitHub Copilot**. It lives under **`core/agent/`** so the core engineering team can keep it updated; projects get the latest when they run **`npm run install-core`** (which runs `install-agent-dirs.js` and copies `.cursor` and `.github` to the project root with symlinks referencing `core/agent`).

## Layout

- **`skills/`** — Agent skills (Markdown with YAML frontmatter). Each subdirectory is one skill:
  - `docs/` — **Documentation** (single source for all component types): SKILL.md, feature-docs.md, plugin-docs.md, extension-docs.md. Feature, plugin, and extension skills reference these for doc requirements.
  - `features/` — Feature and feature-extension creation (SKILL.md, feature-extension.md; doc requirements → docs/feature-docs.md)
  - `plugins/` — Plugin and database-plugin creation (SKILL.md, database-plugin.md; doc requirements → docs/plugin-docs.md)
  - `extension/` — Extension and app-plugin rules, including consumer-specific extensions (SKILL.md; doc requirements → docs/extension-docs.md)
- **`rules/`** — Project rules that apply across tools (e.g. when to use feature/plugin skills).

## How projects use this

- **Install:** Running `npm run install-core` (or `node core/scripts/install-agent-dirs.js`) creates at **project root**:
  - **`.cursor/skills/`** — Symlinks to `core/agent/skills/` (features, plugins, extension)
  - **`.cursor/rules/`** — Symlink to `core/agent/rules/feature-plugin-skills.mdc`
  - **`.github/skills/`** — Symlinks to `core/agent/skills/`
  - **`.github/copilot-instructions.md`** and **`.github/README.md`** — Copied from `core/.github/`
- **Cursor** reads `.cursor/skills/` and `.cursor/rules/` at root (which point at `core/agent`).
- **GitHub Copilot** reads `.github/skills/` and `.github/copilot-instructions.md` at root.

## Editing

1. Edit files under **`core/agent/skills/`** or **`core/agent/rules/`**.
2. Do not edit the same content under the project root `.cursor/` or `.github/`; those are installed from core and reference `core/agent`.
3. Skill files use standard Markdown; SKILL.md files include YAML frontmatter (`name`, `description`) compatible with both Cursor and Copilot.

## Adding a new skill

1. Create a new directory under `core/agent/skills/<skill-name>/` (lowercase, hyphens for spaces).
2. Add `SKILL.md` with frontmatter and body; add any supplementary `.md` files and reference them from SKILL.md.
3. Add the skill name to `SKILL_NAMES` in `core/scripts/install-agent-dirs.js` so it is symlinked when install-core runs.
