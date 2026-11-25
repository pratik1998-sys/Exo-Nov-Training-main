---
title: Agentic Development
layout: default
---

# Agentic Development

CatalystJS supports **agentic development** through custom agent skills that guide AI-assisted creation of features, plugins, extensions, middleware, and plugin registries. The skills live under `core/agent/skills/` and are applied by the agent when you ask to create or extend framework components. This document gives a high-level overview of those skills, example prompts they support, optional prompt text to steer behavior, and how the agent may interact with you during execution.

## Overview of custom agent skills

The following skills are used when your prompt indicates you want to **create** or **extend** framework components:

| Skill | Purpose | Location |
|-------|---------|----------|
| **Feature** | Create new features (core or app), extend existing features with custom fields/types, add features to configuration | `core/agent/skills/features/SKILL.md` |
| **Plugin** | Create new plugins (database, REST, or GraphQL), implement a feature with a datasource or database, wire plugins in configuration | `core/agent/skills/plugins/SKILL.md` |
| **Middleware** | Create NestJS middleware extending BaseMiddleware, wire middleware in configuration, generate setup.configuration.yaml and optional app configuration snippet | `core/agent/skills/middleware/SKILL.md` |
| **Plugin registry** | Create plugin registries (feature or common) extending BaseRegistry, wire REGISTRY_CONFIG in setup.env and optional app .env | `core/agent/skills/plugin-registry/SKILL.md` |
| **Extension** | Extend core features in an app (e.g. `ExtUser`), add app-specific plugins, add consumer-specific plugin extensions (service, mapper, datasource, registry, middleware) | `core/agent/skills/extension/SKILL.md` |

Supporting docs (e.g. `feature-extension.md`, `rest-plugin.md`, `graphql-datasource.md`, `database-plugin.md`) are referenced from the main skills for step-by-step and templated code.

**Rules that always apply:**

- When you ask to create **both** a feature and a plugin, the agent runs the **Feature** and **Plugin** skills in **parallel** (two agents). It does not implement both in a single agent.
- New features and new plugin code are created under **`src/core-staging`** by default unless you explicitly ask for an app directory (e.g. `src/apps/catalyst-cerebrum`) or **core-modules**.
- **Do not edit `core-modules/`** to extend or customize an existing feature or plugin (new fields, filter args, resolver/controller behavior, service enrichment). Use **`src/apps/$appId/`** (same filenames as core; `Ext*` types; plugin classes that extend `*ServiceImpl`) or **`src/core-staging/`** for new shared helpers. Edit `core-modules/` only when you explicitly ask to.
- Feature operations must be declared in **`$featureId.api.configuration.ts`** first, then wired in the resolver and controller through **`@api-decorators`** (not NestJS `@Query` / `@Get` from `@nestjs/graphql` or `@nestjs/common`).
- Database access is a capability of **every** plugin (`BasePluginModule` / `BasePluginServiceImpl`). There is no separate database module base class. A plugin may declare more than one connection under `databases[]`; assign entities with `@PluginDatabaseConnection` from `@plugin/database`.
- For **REST or GraphQL** plugin features, the agent **must** ask for the API source first and then for operation selection before writing any schema or datasource code.

---

## Example prompts the skills support

### Feature

- *"Create a new feature for user profile"* / *"Add a user feature"*
- *"Create a pet feature"* / *"Add feature for orders"*
- *"Create a standalone feature"* (no plugin; feature only)
- *"Add the feature to configuration"* / *"Enable the feature in setup"*
- *"Create the feature in core-modules"* / *"Create the feature in catalyst-cerebrum"* (explicit location override)

### Plugin

- *"Create a new plugin"* / *"Add a database plugin for user"*
- *"Create a REST plugin for the pet feature"* / *"GraphQL plugin for ec-user"*
- *"Create plugin feature ec-user for adobe-commerce plugin"*
- *"Add another feature to plugin X"* (e.g. add a new feature to an existing plugin)
- *"Create the plugin in the app"* / *"Create in catalyst-cerebrum"* (explicit app location)

### Middleware

- *"Create middleware"* / *"Add middleware"*
- *"Create a test-x middleware class for catalyst-cerebrum"*
- *"Create request middleware for user profile"* / *"Add middleware for feature X"*
- *"Create a feature middleware for commerce/ec-user"* / *"Create feature middleware 'text-y' for feature commerce/ec-user"* (feature middleware: created under `src/core-staging/features/<group>/<featureId>/`, config under that feature’s `middleware:`)
- *"Create the middleware in the app"* / *"Add middleware to catalyst-cerebrum"* (middleware class in default location; config snippet added to that app’s configuration.yaml)

### Plugin registry

- *"Create a plugin registry"* / *"Add a registry to the commercetools plugin"*
- *"Create a category registry for commercetools"* (feature registry under plugin feature)
- *"Create a common OAuth registry for the plugin"* (common registry under plugin/common)
- *"Create the registry for catalyst-cerebrum"* (registry in default location; REGISTRY_CONFIG merged into that app’s .env)

### Extension

- *"Extend the user feature with custom fields"* / *"Add custom fields to the user feature"*
- *"Add thumbnail, image, lastLogon to user"* (concrete field names)
- *"Create an extension model for user"* / *"Ext type for user"*
- *"Add an app-specific plugin"* / *"Create plugin in the app"*
- *"Create an extension of the db-user plugin feature user service for consumer site-1"* (consumer-specific plugin extension)

### Feature + Plugin together

- *"Create a user feature and a database plugin for it"*
- *"Create the pet feature and a REST plugin that implements it"*

For these, the agent launches two parallel agents: one for the feature (contract), one for the plugin (implementation).

---

## Optional prompt text to drive behavior

You can add short phrases to your prompt to steer where things are created and how they behave.

| Intent | Optional prompt text | Effect |
|--------|----------------------|--------|
| Standalone feature (no plugin) | *"standalone feature"* | Feature is created with `standalone: true` in configuration; no plugin block. |
| Create in core-modules | *"create in core-modules"* / *"create the feature in core-modules"* | New feature or plugin is created under `core-modules/` instead of `src/core-staging`. |
| Create in a specific app | *"create in catalyst-cerebrum"* / *"create in the app"* | New feature or plugin is created under `src/apps/<appId>/`. |
| Custom fields on extension | *"add thumbnail, image, lastLogon"* / *"add field1, field2, field3"* | Extension model gets those fields on `Ext$Feature` and `Ext$FeatureNameInput`. |
| Plugin type | *"database plugin"* / *"REST plugin"* / *"GraphQL plugin"* | Agent uses the corresponding plugin skill path (database-plugin, rest-plugin, graphql-datasource). If you don’t specify, the agent will ask you to choose. |
| Consumer-specific extension | *"for consumer site-1"* / *"extension for consumer X"* | Extension is consumer-specific; file naming uses `$consumerId.$originalFileName` in the same directory as the extended file. |
| Middleware for a specific app | *"for catalyst-cerebrum"* / *"add to app configuration"* | Middleware class is created under `src/core-staging` (default); a `setup.configuration.yaml` is created alongside it; the config snippet is also added to `src/apps/<appId>/configuration.yaml`. |
| Plugin registry for a specific app | *"for catalyst-cerebrum"* / *"apply config in .env for the app"* | Registry is created under `src/core-staging/plugins/...` (default); a `setup.env` is created with REGISTRY_CONFIG example; the registry config is merged into `src/apps/<appId>/.env`. |

---

## User interaction during execution

The agent may pause and ask you for input in these situations:

### 1. REST or GraphQL plugin / plugin feature

**Before** writing any schema or datasource code, the agent **must**:

1. **Ask for the API source**
   - **REST:** *"How would you like to define the APIs? (1) OpenAPI file — local path, (2) OpenAPI file — URL, or (3) System documentation URL."*
   - **GraphQL:** *"Please provide a system documentation URL or a GraphQL endpoint (for introspection)."*

2. **Present the operation list**  
   After it has the source, the agent produces a **markdown table with row numbers** (e.g. paths/methods for REST, queries/mutations for GraphQL).

3. **Ask you to select operations**  
   *"Which of these should this datasource implement? Reply with the row number(s), e.g. 1, 2, 7 or 1–5."*

Only after you provide the source and select operations will the agent generate `serviceDefinitions`, schema, and datasource methods. This applies even when adding a feature to an existing plugin or when the backend is a well-known API.

### 2. Plugin type not specified

If you ask for a **new plugin** but don’t say whether it’s database, REST, or GraphQL, the agent will ask:

- *"Should this plugin be backed by a database (e.g. PostgreSQL with TypeORM) or by a REST/GraphQL API? Please specify."*

For a new **feature datasource** on an existing plugin, if it can’t infer from an existing base datasource, it may ask:

- *"Should this plugin's datasource call a REST API or a GraphQL API? Please specify."*

### 3. Feature + plugin in one request

When you ask for **both** a feature and a plugin (e.g. *"Create user feature and a database plugin for it"*), the agent **launches two parallel agents** (e.g. via the task/agent tool). You don’t need to do anything special; one agent follows the Feature skill, the other the Plugin skill. There is no extra prompt for this; it’s automatic.

### 4. Extension and testing

When creating **extensions** (feature resolver/controller, plugin service/datasource/mapper), the agent will also create the corresponding **`*.spec.ts`** test files using the appropriate harness (e.g. `FeatureResolverTestHarness`, `PluginServiceTestHarness`). No separate prompt is required; this is part of the Extension and Feature/Plugin skill checklists.

---

## Where to find the skills

- **Feature:** `core/agent/skills/features/SKILL.md` and linked docs in that directory.
- **Plugin:** `core/agent/skills/plugins/SKILL.md` and `rest-plugin.md`, `graphql-datasource.md`, `database-plugin.md`, `plugin-docs.md`.
- **Middleware:** `core/agent/skills/middleware/SKILL.md`.
- **Plugin registry:** `core/agent/skills/plugin-registry/SKILL.md`.
- **Extension:** `core/agent/skills/extension/SKILL.md` (and Feature skill for derivation and naming).

The workspace rule that triggers these skills is in `core/agent/rules/feature-plugin-skills.mdc` (and the equivalent under `.cursor/rules/` when used in Cursor).
