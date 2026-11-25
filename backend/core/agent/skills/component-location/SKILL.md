---
name: component-location
description: Canonical rules for where to create new components (features, plugins, plugin features, registries, middleware, etc.). ALWAYS use ./src/core-staging. Only two exceptions—(1) user explicitly says "core-modules" or "in core-modules", (2) user explicitly says app or src/apps/$appId. Never use core/ or core-modules/ unless the user explicitly requests it. Referenced by Feature, Plugin, Plugin Registry, Middleware, Extension, and any other skills that create components.
---

# Component location (where to create)

This skill defines **uniform rules** for where to create new components. The rules apply to **all component types**: features, plugins, plugin features, registries, middleware, and any other creatable components. Skills that create components (Feature, Plugin, Plugin Registry, Middleware, Extension, etc.) **must** follow these rules and may reference this skill instead of duplicating them.

## When to use this skill

- You are about to create a **new** feature, plugin, plugin feature, registry, middleware, or other component.
- You need to decide the **root path** (e.g. `src/core-staging/...`, `src/apps/$appId/...`, or—only if explicitly requested—`core/...` or `core-modules/...`).
- You are writing or updating another skill that creates components and need the canonical location rules.
- You are about to **search the codebase** for where similar components live to decide where to put a new one → **stop**. Use this skill's default (`src/core-staging`) instead; do not infer location from existing code.

## ALWAYS use ./src/core-staging (only two exceptions)

- **Default (always):** Create new components under **`./src/core-staging`** (or `src/core-staging`), in the path appropriate for the component type (e.g. `src/core-staging/features/$featureId/`, `src/core-staging/plugins/$pluginId/`, `src/core-staging/middleware/`).
- **Only two exceptions:**
  1. **User explicitly states core-modules:** e.g. "create in core-modules", "put it in core-modules", "in core-modules" → then and only then use **`core-modules/`**.
  2. **User explicitly states app (or src/apps/$appId):** e.g. "create in the app", "in catalyst-cerebrum", "in src/apps/my-app" → then use **`src/apps/$appId/...`**.
- **Anything else (e.g. "commerce feature", "in commerce", "for plugin X", existing code in core-modules, tsconfig pointing to core-modules) is NOT an exception.** Still use **`./src/core-staging`**.

## Default location

- **Default (always):** Create new components under **`src/core-staging`**, in the path appropriate for the component type (e.g. `src/core-staging/features/$featureId/`, `src/core-staging/plugins/$pluginId/`, `src/core-staging/middleware/`).
- **Create `src/core-staging` if it does not exist.** Do not put components somewhere else (e.g. `core/`) just because `src/core-staging` is missing; create the directory and any needed parent or child directories.
- **Only when the user explicitly states:** Create under **`src/apps/$appId/...`** when the user explicitly says to create in the app or a specific app (e.g. "create in the app", "create in catalyst-cerebrum").
- **Only when the user explicitly states:** Create under **`core/`** or **`core-modules/`** when the user explicitly says so (e.g. "create in core", "create in core/features", "create in core-modules"). Do **not** use these paths otherwise.

## Mandatory: No `core/` or `core-modules/` unless explicitly requested

**Rule:** Location is **ALWAYS** `./src/core-staging` unless the user explicitly said "core-modules" (or "in core-modules") or an app path (e.g. `src/apps/$appId`). Do not infer core-modules from feature group, existing imports, or similar components in the repo.

**Before creating any new component file**, you MUST:

1. **Confirm:** Am I about to create a file or directory under `core/` (e.g. `core/features/...`, `core/plugins/...`, `core/middleware/...`) or `core-modules/`?
2. **If yes:** STOP. Only proceed if the user has **explicitly** said they want the work in `core/` or `core-modules` (e.g. "create in core", "create in core/features", "create in core/plugins", "create in core-modules", "put it in core-modules"). If they did not, create under **`src/core-staging`** (or the app path they specified) and fix path/import resolution separately.
3. **Invalid reasons to use `core/` or `core-modules/` (do not use these paths for these reasons):**
   - Existing code in the repo already imports from a path under `core/` or `core-modules/`, and the current tsconfig points there.
   - The rest of the feature, plugin, or component group lives in `core/` or `core-modules/`.
   - You want to avoid broken imports or extra path/tsconfig work.
   - The user specified only a feature or plugin group (e.g. "commerce feature group", "in commerce", "for plugin X"). Group names define logical grouping (e.g. path segment `commerce/`); they do not define location. Use **`src/core-staging/.../<group>/...`** (e.g. `src/core-staging/features/commerce/$featureId/`), not `core-modules/...`.
   - **Do not** infer location by searching the codebase for similar components (e.g. "other commerce features are in core-modules") or by following where existing imports point. The default is **always** `src/core-staging/...` unless the user explicitly said otherwise.

**Pre-creation step (required):** Before creating any new component file, **state the full root path** you will use (e.g. `src/core-staging/features/commerce/ec-user/`). If that path is under `core/` or `core-modules/`, you may only use it if the user **explicitly** requested it. If you did not get an explicit request, use `src/core-staging/...` and state that path.

**Feature group (e.g. commerce):** If the user said "commerce feature group", "in commerce", "for commerce", or "create the feature X in commerce", that specifies **group only**. Use **`src/core-staging/features/commerce/$featureId/`**. Do **not** use `core-modules/features/commerce/$featureId/`.

**Rule:** New components go in `src/core-staging` by default. Using `core/` or `core-modules/` to satisfy existing imports or tsconfig is **forbidden**; resolve paths/imports after placing code in the default location.

## Examples

- **Wrong:** Creating under `core/features/$featureId/` or `core-modules/plugins/$pluginId/features/$featureId/` so that existing imports keep resolving.
- **Right:** Creating under `src/core-staging/features/$featureId/` or `src/core-staging/plugins/$pluginId/features/$featureId/`. Then, as a separate step: add or adjust path aliases or update the build so the new location is used.

## Summary for other skills

When authoring or updating a skill that creates components:

1. **Reference this skill:** Add a line such as: *"**Where to create:** Follow the uniform rules in [Component location](../component-location/SKILL.md)."* (Use `../component-location/SKILL.md` when your skill lives in a subfolder of `core/agent/skills/`.)
2. **Default path:** State the component-specific default path under `src/core-staging` (e.g. features → `src/core-staging/features/$featureId/`, plugins → `src/core-staging/plugins/$pluginId/`).
3. **Do not duplicate** the full "Mandatory: No core/ or core-modules/" section; point to this skill instead so the rules stay uniform and single-sourced.
