---
title: "Enhancement: Database Access for All Plugins"
layout: default
---

# Enhancement: Database Access for All Plugins

**Status:** Shipped in [1.3.113](../versions.md#v1-3-113)
**Shipped:** `59a786b` (2026-09-05)

## Problem

Database-backed plugins used to require dedicated base classes — `BaseDatabasePluginModule` and `BaseDatabasePluginServiceImpl` (introduced in commit `5fc270a`, 2026-02-17, under `core/foundation/plugin/datasource/database/`). REST and GraphQL plugins extended a different set of base classes (`BasePluginModule`, `BaseDatasourcePluginServiceImpl`) that had no entity discovery, no TypeORM `forFeature` registration, and no `getRepository()`/`getDatabaseConnection()` methods.

This forced an artificial choice at plugin-authoring time: a plugin was either a "database plugin" or a "REST/GraphQL plugin," never both. In practice, plenty of real plugins need both — for example, a REST-backed plugin that also needs to persist request/response data, cache upstream results, or maintain local state. Under the old design, that required either duplicating the plugin as a separate database plugin, or hand-rolling TypeORM wiring outside the framework's supported path.

## Change

Entity discovery/registration and repository/connection resolution were moved out of the dedicated database base classes and into the framework's standard base classes:

- **`core/foundation/plugin/module/plugin.module.ts`** — `BasePluginModule.createPluginImports()` now delegates to `createPluginDatabaseImports()`, which discovers this plugin/feature's `*.entity.ts` files (via `resolveEntitiesClassPaths()`) and, when the plugin has a `database`/`databases` configuration block, registers them with `TypeOrmModule.forFeature(...)`.
- **`core/foundation/plugin/service/plugin.service.ts`** — `BasePluginServiceImpl` gained `getRepository(repositoryClass)` and `getDatabaseConnection()`, resolving the TypeORM repository/connection tokens via `ModuleRef`.
- **Deleted:** `core/foundation/plugin/datasource/database/database.plugin.module.ts`, `database.plugin.service.ts`, and `index.ts` — the dedicated `BaseDatabasePluginModule`/`BaseDatabasePluginServiceImpl` classes no longer exist. There is nothing left to extend for "database plugin" behavior specifically.

## Effect

Database access is now a capability available on **every** plugin module and service, not a separate plugin style:

- A plugin gets database access simply by declaring a database configuration block and having `*.entity.ts` files discovered under it — regardless of whether the plugin is REST-backed, GraphQL-backed, or has no external datasource at all.
- A plugin with no database configuration and no entity files is unaffected — `createPluginDatabaseImports()` is a no-op in that case.
- Any service extending `BasePluginServiceImpl` (which includes `BaseDatasourcePluginServiceImpl`, the shared base for REST/GraphQL plugin services) can call `this.getRepository(MyEntity)` or `this.getDatabaseConnection()` directly, with no separate base class to opt into.

## Usage

1. Add a `database`/`databases` block to the plugin's `configuration.yaml` entry (see [Configuration](../configuration.md)).
2. Add entity files following the plugin/feature entity naming convention (e.g. `*{pluginId}.{featureId}*.entity.ts` or `*{pluginId}.common*.entity.ts`) so they're picked up by `resolveEntitiesClassPaths()`.
3. In the plugin's service (any class extending `BasePluginServiceImpl`), call:
   - `this.getRepository(MyEntity)` to get a TypeORM `Repository<MyEntity>`
   - `this.getDatabaseConnection()` to get the raw `DataSource` (e.g. for transactions)

See [Datasources — Tying a plugin to a database](../components/plugin/datasources.md) for the full reference. To bind a specific entity class to one of several plugin connections, see [How to assign entity classes to a database](../components/plugin/assigning-entities-to-databases.md).

## Related

- [Multi-database-per-plugin support](multi-database-per-plugin.md) builds directly on this by letting a plugin declare more than one database connection and choosing which entities/queries use which connection.
- [How to assign entity classes to a database](../components/plugin/assigning-entities-to-databases.md) — `@PluginDatabaseConnection` how-to.
