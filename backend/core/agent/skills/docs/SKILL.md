---
name: docs
description: Single source of truth for documentation requirements for all component types (features, plugins, extensions, and app-specific components). Use when creating or updating documentation for any feature, plugin, plugin feature, extension, or app. Feature, Plugin, and Extension skills reference this skill for doc structure, content, and diagrams.
---

# Documentation skill

This skill defines **documentation requirements for all component types** in one place. When you create or update a **feature**, **plugin**, **plugin feature**, or **extension**, follow the corresponding doc spec below so doc rules can be updated here without changing multiple skills.

## When to use this skill

- You are creating or updating **feature** docs → use [Feature documentation](feature-docs.md).
- You are creating or updating **plugin** or **plugin feature** docs → use [Plugin documentation](plugin-docs.md).
- You are creating or updating **extension** docs (feature extensions, app-specific plugins, consumer-specific plugin components) → use [Extension documentation](extension-docs.md).

## Doc requirements by component type

| Component type | Doc path (where to write) | Full requirements |
|----------------|---------------------------|--------------------|
| **Feature** | `docs/index.md` next to the feature (e.g. `src/core-staging/features/$featureId/docs/index.md`) | [feature-docs.md](feature-docs.md) |
| **Plugin** (root) | `docs/index.md` at plugin root (e.g. `src/core-staging/plugins/$pluginId/docs/index.md`) | [plugin-docs.md](plugin-docs.md) |
| **Plugin feature** | `features/$featureId/docs/index.md` under the plugin | [plugin-docs.md](plugin-docs.md) |
| **Feature extension** | `src/apps/$appId/features/$featureId/docs/index.md` | [extension-docs.md](extension-docs.md) |
| **App plugin** | `src/apps/$appId/plugins/$pluginId/docs/index.md` | [extension-docs.md](extension-docs.md) |
| **Consumer extension** (plugin component) | `src/apps/$appId/plugins/$pluginId/features/$featureId/docs/index.md` | [extension-docs.md](extension-docs.md) |

## Common rules (all component types)

- **YAML frontmatter:** Every `index.md` starts with `title:` and `layout: default`.
- **Document title (location suffix):** First-level heading must include **" (Staging)"** when under `src/core-staging`, **" ($appId)"** when under `src/apps/$appId`.
- **Mermaid diagrams (feature and plugin docs):** Feature and plugin `docs/index.md` **must include** the required Mermaid diagrams (component diagram and sequence diagram(s)). Do not skip. Full requirements: [feature-docs.md](feature-docs.md) §6 (Diagrams), [plugin-docs.md](plugin-docs.md) §4 (Diagrams).
- **Do not update core-modules docs** when adding components under core-staging or apps; create docs at the new component location only.
- **After writing or updating docs:** Run **`yarn generate:docs`** so the project’s doc script aggregates app/plugin/feature docs into the root `docs/` tree.

## Updating doc requirements

To change how features, plugins, or extensions are documented, edit the corresponding file in this skill only:

- **Feature docs** (overview, API, schema, service contract, diagrams) → [feature-docs.md](feature-docs.md)
- **Plugin docs** (overview, backend integration, DB schema, diagrams) → [plugin-docs.md](plugin-docs.md)
- **Extension docs** (app docs, Extensions / Consumer extensions sections) → [extension-docs.md](extension-docs.md)

The Feature, Plugin, and Extension skills reference these files; no need to duplicate content there.
