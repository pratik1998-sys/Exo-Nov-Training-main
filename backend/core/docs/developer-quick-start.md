---
title: Developer Quick Start
layout: default
---

# Developer Quick Start

This guide will walk you through setting up CatalystJS from scratch, from cloning the repository to running your first application.

## Prerequisites

- Node.js (v22 or higher)
- Yarn package manager
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repo-name>
```

### 2. Install Core Dependencies

After cloning the repository, run the core installation script. This command will:

- Generate required project configuration files (tsconfig.json, nest-cli.json, etc.)
- Merge core scripts and workspaces into the root package.json (including the `core` workspace). Runtime dependencies stay in `core/package.json`; only missing root test deps (`vitest`, `vite-tsconfig-paths`) are copied
- Copy `Dockerfile` and `.dockerignore` to the project root
- Generate documentation structure
- Copy agent skill/rule directories (`.cursor`, `.github`)
- Install project dependencies and run `dedupe-typeorm`

```bash
yarn install:core
```

This script automatically executes `yarn install` at the end, so you don't need to run it separately.

### 3. Start an Application

CatalystJS supports multiple applications in a single repository. To start an application, use:

```bash
yarn start <app-id>
```

For example, to start the tutorial application:

```bash
yarn start catalyst-tutorial
```

The start script will:
- Set the environment to `local` by default
- Start the NestJS application in watch mode
- Use the entry file located at `src/apps/<app-id>/app.js`


## Available Scripts

The following scripts are available in the `./core/scripts` directory and can be executed via yarn commands:

| Script File | Yarn Command | Description |
|------------|--------------|-------------|
| `install-core.js` | `yarn install:core` | Initializes the project by generating configuration files (tsconfig, nest-cli.json, scripts, Dockerfile, `.dockerignore`, docs, agent dirs) and installing dependencies (then `dedupe-typeorm`). Run this after cloning or when updating core. |
| `start.js` | `yarn start <app-id>` | Starts a specific application by app ID. Sets up the local environment and runs NestJS in watch mode. |
| `docker-build.js` | `yarn docker:build <app-id>` | Builds a Docker image for the app (`APP_ID` build-arg) and saves it as `image-<app-id>-<platform>-MMDD_HH-mm.tar`. Flags: `--no-cache`, `--pull`, `--platform <os/arch>`. |
| `generate-tsconfig.js` | `yarn generate:tsconfig` | Merges TypeScript path definitions from core, core-modules, core-staging, and app directories into the root tsconfig.json. Discovers and merges all tsconfig.paths.json files. |
| `generate-nest-cli.js` | `yarn generate:nest-cli` | Copies the core nest-cli.json configuration to the project root so Nest CLI uses the correct settings when run from the project root. |
| `generate-scripts.js` | (internal) | Merges core package.json scripts and workspaces with the root package.json. Adds missing scripts from core without overwriting existing root scripts. Does **not** copy all core `dependencies`/`devDependencies` to root — only required root test deps (`vitest`, `vite-tsconfig-paths`) when missing. |
| `generate-dockerfile.js` | (internal) | Copies `core/Dockerfile` and `core/.dockerignore` to the project root. Overwrites existing root files only with `--override-dockerfile`. |
| `generate-docs.js` | `yarn generate:docs` | Generates the complete documentation structure for GitHub Pages by copying docs from core, plugins, features, databases, and messengers. Creates index files and updates documentation links. |
| `generate-feature-index.js` | `yarn generate:feature:index` | Generates an index.ts file for a feature directory, exporting files in the correct order (modules, models, parameters, API configs, services, controllers, resolvers, errors). |
| `generate-plugin-index.js` | `yarn generate:plugin:index` | Generates an index.ts file for a plugin feature directory, exporting files in the correct order (modules, datasources, mappers, registries, services, errors, schemas, types). |
| `install-feature.js` | `yarn install:feature <app-id> <feature-id>` | Installs a feature by adding its tsconfig paths to root tsconfig.json, merging its configuration YAML into the app's configuration.yaml, and running yarn install. |
| `install-plugin.js` | `yarn install:plugin <app-id> <plugin-id>` | Installs a plugin by adding its tsconfig paths, merging configuration YAML, appending environment variables to .env, and running yarn install. |
| `install-database.js` | `yarn install:database <app-id> <db-type> <db-id>` | Installs a database module by adding tsconfig paths, merging database configuration into configuration.yaml, appending database environment variables to .env, and running yarn install. |

## Docker images

After `yarn install:core` has copied `Dockerfile` and `.dockerignore` to the repo root, build a local image and tar archive:

```bash
yarn docker:build catalyst-tutorial
yarn docker:build catalyst-tutorial --platform linux/amd64
yarn docker:build catalyst-tutorial --no-cache --pull
```

The image is tagged `<app-id>:latest` and saved as `image-<app-id>-<platform>-MMDD_HH-mm.tar`. The Dockerfile is multi-stage (UBI 10 Node.js 24): the builder stage uses `$BUILDPLATFORM` so `yarn install` runs on the host architecture, then the runtime stage copies `dist` and starts with `yarn start $APP_ID --docker`.

## Documentation

The project uses Jekyll to build and serve documentation (the "wiki") from Markdown. Documentation is generated by copying docs from core and from plugins, features, databases, and messengers into a single `docs/` tree, then served locally or published (e.g. to GitHub Pages).

### Building docs: `yarn generate:docs`

**`yarn generate:docs`** runs `core/scripts/generate-docs.js`. It:

1. **Copies core docs** — Copies `./core/docs` to `./docs` (project root). This is the base documentation (architecture, configuration, components, quick start, etc.).
2. **Merges plugin docs** — For each plugin under `./core-modules/plugins/{plugin-id}/`, if a `docs` directory exists, copies it to `./docs/plugins/{plugin-id}/`.
3. **Merges feature docs** — For each feature under `./core-modules/features/{feature-id}/`, if a `docs` directory exists, copies it to `./docs/features/{feature-id}/`.
4. **Merges database docs** — For each database under `./core-modules/databases/{id}/`, if a `docs` directory exists, copies it to `./docs/databases/{id}/`.
5. **Merges messenger docs** — For each messenger under `./core-modules/messengers/{id}/`, if a `docs` directory exists, copies it to `./docs/messengers/{id}/`.
6. **Updates root index** — Ensures `./docs/index.md` has sections (and links) for Plugins, Features, Databases, and Messengers when any of those have docs.
7. **Creates/updates module index files** — Creates or updates `./docs/plugins/index.md`, `./docs/features/index.md`, `./docs/databases/index.md`, and `./docs/messengers/index.md` with links to each merged module’s docs.
8. **Processes app-specific docs** — For each app under `src/apps/{app-id}/`, looks for `plugins/{plugin-id}/docs` and `features/{feature-id}/docs`; copies those into the app’s `docs/` tree and updates the app’s `docs/index.md` with links.
9. **Adds Apps section** — Copies each app’s `docs/` to `./docs/apps/{app-id}/` (when the app has docs) and adds an "Apps" section to the root `./docs/index.md` with links to each app’s documentation.

**What plugins, features, databases, and messengers need for docs to be merged:**

- **Plugins** — Place documentation in `core-modules/plugins/{plugin-id}/docs/`. Any structure (e.g. `index.md`, subfolders) is copied as-is to `docs/plugins/{plugin-id}/`.
- **Features** — Place documentation in `core-modules/features/{feature-id}/docs/`. Same behavior: copied to `docs/features/{feature-id}/`.
- **Databases** — Place documentation in `core-modules/databases/{id}/docs/`. Copied to `docs/databases/{id}/`.
- **Messengers** — Place documentation in `core-modules/messengers/{id}/docs/`. Copied to `docs/messengers/{id}/`.

If a module has no `docs` directory, it is skipped; no empty placeholder is created. The script only adds links to the root and module index files for modules that actually have docs.

### Viewing the wiki locally: `yarn start:wiki`

To view the full documentation site locally (with core + all merged plugin/feature/database/messenger and app docs):

```bash
yarn start:wiki
```

This command:

1. Runs **`yarn generate:docs`** to refresh `./docs` from core and all modules.
2. Runs **`bundle install`** in the `docs/` directory (if needed for Jekyll).
3. Runs **`bundle exec jekyll serve`** to serve the site.

The wiki is then available at **http://localhost:4000** (Jekyll’s default port). Use this to browse the rich documentation, including Mermaid diagrams, navigation, and any theme styling (e.g. Minima) configured in `docs/_config.yml`.

## Next Steps

- Read the [Architecture](architecture.md) documentation to understand how CatalystJS is structured
- Explore [Components](components.md) to learn about features, plugins, and databases
- Review [Authorization and Access Control](authorization-and-access-control.md) for security configuration
