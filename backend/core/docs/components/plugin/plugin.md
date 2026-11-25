---
title: Plugin — Deep dive
layout: default
---

# Plugin — Deep dive

[← Back to Components](../../components.md)

## What is a Plugin?

A **plugin** provides an implementation for a **feature**. A feature can declare one or more plugins in `configuration.yaml`; each plugin is a NestJS module that contributes:

- **Services** — Plugin-specific business logic (e.g. calling an external REST API or database)
- **Datasources** — Data access or client wrappers (e.g. HTTP client, repository)
- **Mappers** — Transformations between external and internal models
- **Registries** — Component registries for plugin-specific lookups
- **Entities** — Optional TypeORM entities. Any plugin can use a database; this is not a separate plugin style. A single `*.entity.ts` file may export more than one `*Entity` class.

Plugins support **consumers** and **variants**: the same feature can use different plugin implementations or configurations per consumer (e.g. tenant or channel). Plugin classes are resolved via the [class loading hierarchy](../class-loading-hierarchy.md), so you can override a plugin’s service or datasource per app or per consumer by placing a file in the same relative path under `src/apps/{appName}` or `src/apps/global`.

## Plugin component types

| Type | File suffix | Class suffix | Purpose |
|------|-------------|--------------|---------|
| Module | `.module.ts` | `Module` | NestJS plugin module |
| [Service](service.md) | `.service.ts` | `ServiceImpl` | Plugin service implementation |
| [Datasource](datasources.md) | `.datasource.ts` | `Datasource` | Data access / client |
| [Mapper](mapper.md) | `.mapper.ts` | `Mapper` | Data transformation |
| [Registry](registry.md) | `.registry.ts` | `Registry` | Component registry |
| Entity | `.entity.ts` | `Entity` | ORM entity (e.g. TypeORM) |

File and class naming must follow the [file naming rules](../class-loading-hierarchy.md#file-naming-rules). Plugin files must be prefixed with `{pluginId}.{featureId}` (e.g. `tutorial-pet-db.user.service.ts`).

## Configuration

Plugins are referenced under a feature in `configuration.yaml`. Plugins can be defined once at the top level and referenced by anchor:

```yaml
plugins:
  - id: &tutorial-pet-db tutorial-pet-db

features:
  - id: user
    enabled: true
    plugins:
      - id: *tutorial-pet-db
        consumers:
          - id: site-1
  - id: pet
    enabled: true
    plugins:
      - id: *tutorial-pet-db
```

- **`id`** — Plugin identifier; used to resolve the plugin module (e.g. `**/plugins/**/tutorial-pet-db.user.module.js`).
- **`consumers`** — Optional list of consumer IDs that use this plugin; supports consumer-specific configuration and consumer-specific class overrides (e.g. `site-2.tutorial-pet-db.user.service.ts`).
- **`variants`** — Optional list of plugin variants. Variants allow you to group consumers that share similar configuration needs. See [Plugin Variants](#plugin-variants) below.

## Plugin Variants

**Plugin variants** provide a way to group multiple consumers that share similar configuration requirements. Instead of duplicating configuration for each consumer, you can define a variant once and assign multiple consumers to it. Variants sit in the configuration hierarchy between plugin feature configuration and consumer configuration, allowing you to share common settings across a group of consumers while still allowing per-consumer overrides.

### How variants work

1. **Variant definition** — Variants are defined at the **plugin global level** (in the top-level `plugins` array) with an `id` and a list of `consumerIds` that use that variant.

2. **Automatic assignment** — When a consumer is listed in a variant's `consumerIds`, the framework automatically sets that consumer's `variantId` property.

3. **Configuration merge** — Variant configuration is merged into the consumer configuration hierarchy:
   - Plugin global configuration
   - Feature configuration
   - Plugin feature configuration
   - **Plugin variant configuration** (if consumer uses a variant)
   - Plugin feature consumer configuration (final override)

4. **Variant configuration** — Each variant can have its own `configuration` object that applies to all consumers assigned to that variant. This configuration is merged with the plugin feature configuration, with variant configuration taking precedence.

### Example: Using variants

Consider a plugin that needs different configurations for different regions:

```yaml
plugins:
  - id: my-plugin
    configuration:
      field1: value1
      field2: false
    variants:
      - id: us-variant
        consumerIds:
          - site-us-1
          - site-us-2
          - site-us-3
        configuration:
          region: us
          timezone: America/New_York
          currency: USD
      - id: eu-variant
        consumerIds:
          - site-eu-1
          - site-eu-2
        configuration:
          region: eu
          timezone: Europe/London
          currency: EUR
    consumers:
      - id: site-us-1
        configuration:
          pagination:
            pageSize:
              default: 50
      - id: site-us-2
        configuration:
          pagination:
            pageSize:
              default: 100
      - id: site-eu-1
        configuration:
          pagination:
            pageSize:
              default: 25

features:
  - id: user
    plugins:
      - id: my-plugin
        configuration:
          field2: true
```

**Result for `user` feature, `my-plugin`, consumer `site-us-1`:**
```json
{
  "field1": "value1",                             // From plugin global
  "field2": true,                                 // From plugin feature
  "region": "us",                                 // From us-variant
  "timezone": "America/New_York",                // From us-variant
  "currency": "USD",                              // From us-variant
  "pagination": {
    "pageSize": {
      "default": 50                               // From consumer (site-us-1 specific)
    }
  }
}
```

**Result for `user` feature, `my-plugin`, consumer `site-eu-1`:**
```json
{
  "field1": "value1",                             // From plugin global
  "field2": true,                                 // From plugin feature
  "region": "eu",                                 // From eu-variant
  "timezone": "Europe/London",                    // From eu-variant
  "currency": "EUR",                              // From eu-variant
  "pagination": {
    "pageSize": {
      "default": 25                               // From consumer (site-eu-1 specific)
    }
  }
}
```

### Variant configuration fields

Each variant (`PluginVariantConfiguration`) contains:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the variant (e.g. `us-variant`, `eu-variant`). |
| `consumerIds` | string[] | Yes | Array of consumer IDs that use this variant. The framework automatically sets each consumer's `variantId` to match this variant's `id`. |
| `configuration` | Record<string, any> | No | Variant-specific configuration. This is merged with plugin feature configuration, with variant configuration taking precedence. |

### Key points about variants

- **Variants are defined globally** — Variants must be defined at the plugin global level (in the top-level `plugins` array), not at the feature level.
- **Consumers inherit variant configuration** — All consumers listed in a variant's `consumerIds` automatically inherit that variant's configuration.
- **Consumer configuration overrides variant** — Individual consumer configuration still takes precedence over variant configuration, allowing per-consumer customization.
- **Variants cannot be overridden at feature level** — Variants are defined globally and cannot be redefined or overridden at the feature level. However, variant configuration can be merged with plugin feature configuration.
- **Use cases** — Variants are ideal for scenarios where multiple consumers share common settings (e.g., regional settings, environment-specific configs, deployment tiers) but still need individual customization.

### Variant-specific file naming conventions

You can create **variant-specific implementations** of plugin components (service, mapper, datasource, registry) by using a variant-specific file naming pattern. This allows you to provide different implementations for consumers that use different variants.

**File naming pattern for variant-specific files:**

```
{pluginId}.{variantId}.{featureId}.{componentType}
```

**Examples:**

- **Service**: `my-plugin.us-variant.user.service.ts`
- **Datasource**: `my-plugin.us-variant.user.datasource.ts`
- **Mapper**: `my-plugin.us-variant.user.mapper.ts`
- **Registry**: `my-plugin.us-variant.user.registry.ts`

**Directory structure:**

```
plugins/
  {plugin-id}/
    features/
      {feature-id}/
        {plugin-id}.{feature-id}.service.ts          # Default implementation
        {plugin-id}.{variant-id}.{feature-id}.service.ts  # Variant-specific implementation
```

**Example:**

```yaml
plugins:
  - id: my-plugin
    variants:
      - id: us-variant
        consumerIds:
          - site-us-1
          - site-us-2
      - id: eu-variant
        consumerIds:
          - site-eu-1
          - site-eu-2
```

**File structure:**

```
plugins/my-plugin/features/user/
  my-plugin.user.service.ts              # Default service (used if no variant match)
  my-plugin.us-variant.user.service.ts   # US variant service (used for site-us-1, site-us-2)
  my-plugin.eu-variant.user.service.ts   # EU variant service (used for site-eu-1, site-eu-2)
```

**How it works:**

1. When a consumer uses a variant (via `variantId`), the framework searches for variant-specific files matching `{pluginId}.{variantId}.{featureId}.{componentType}`.
2. If a variant-specific file is found, it is used for all consumers assigned to that variant.
3. If no variant-specific file exists, the default `{pluginId}.{featureId}.{componentType}` file is used.
4. Variant-specific files can be overridden at the app level using the same naming pattern in `src/apps/{appName}/plugins/{plugin-id}/features/{feature-id}/`.

**Combining with consumer-specific files:**

You can combine variant-specific and consumer-specific file naming:

```
plugins/my-plugin/features/user/
  my-plugin.user.service.ts                    # Default
  my-plugin.us-variant.user.service.ts         # US variant (for site-us-1, site-us-2)
  site-us-1.my-plugin.user.service.ts         # Consumer-specific override (takes precedence)
```

**Resolution order:**

1. Consumer-specific: `{consumerId}.{pluginId}.{featureId}.{componentType}` (highest priority)
2. Variant-specific: `{pluginId}.{variantId}.{featureId}.{componentType}`
3. Default: `{pluginId}.{featureId}.{componentType}` (lowest priority)

### Variants vs. consumer configuration

- **Variants** — Best for sharing configuration across multiple consumers that have similar needs (e.g., all US sites, all staging environments). Variants can also have variant-specific implementations (service, mapper, datasource, etc.).
- **Consumer configuration** — Best for consumer-specific overrides and settings unique to a single consumer. Consumer-specific files take precedence over variant-specific files.

You can use both together: define common settings in a variant, then override specific values per consumer in the consumer's configuration. You can also provide variant-specific implementations and override them with consumer-specific files when needed.

## Service

**Services** implement a feature’s business logic for a plugin. They orchestrate input handling, datasource calls, and mapping of external data into CatalystJS models. See the [Service deep dive](service.md) for:

- What a plugin service is and which base class to extend
- How to get other service, mapper, and datasource class instances
- Base class helper methods (pagination translation, validation, configuration, registry access)
- Typical flow of a service method: process input → execute datasource → process response → map to CatalystJS schema

## Datasources

Plugins typically implement a **REST** or **GraphQL** datasource for external APIs. **Database access is a capability of every plugin**, not a third datasource style — declare `databases[]` and entity files on the same module that already extends `BasePluginModule`. See the [Datasources deep dive](datasources.md) for details on:

- Tying a plugin to a database
- Multiple database connections per plugin
- Service helpers (`getRepository` / `getDatabaseConnection`) on `BasePluginServiceImpl`
- Environment variable naming conventions for databases and REST/GraphQL datasources (including per-operation `_OVERRIDES`)
- Required and optional JSON configuration fields

When a plugin has more than one database connection, assign each TypeORM entity to a connection with `@PluginDatabaseConnection` (or leave it undecorated to use the primary). See [How to assign entity classes to a database](assigning-entities-to-databases.md).

## Registry

**Registries** are singleton components that cache datasets for plugin-specific lookups. They load data at application startup and can refresh automatically or on-demand. See the [Registry deep dive](registry.md) for details on:

- What a registry is and how it works
- How registries are initialized and loaded
- How registries refresh their data (automatic and manual)
- How to access registry data from services, datasources, and mappers

## Mapper

**Mappers** transform data between external formats (e.g. API or database responses) and internal CatalystJS models. They are used by services after datasource calls to map raw results into the schema expected by the API. See the [Mapper deep dive](mapper.md) for:

- What a mapper is and which base class to extend
- Helper methods on the base class (pagination mapping, plugin configuration, getMapper / getService / getDatasource / getRegistry)
- Overview of the mapper method logging framework (with a link to the [technical logging guide](logging-mapper.md) for configuration and invocation)

## Directory structure

Plugin modules live under `plugins/{plugin-id}/features/{feature-id}/`. Path must match the [path matching rules](../class-loading-hierarchy.md#path-matching-requirements).

```
plugins/
  {plugin-id}/
    features/
      {feature-id}/
        {plugin-id}.{feature-id}.module.ts
        {plugin-id}.{feature-id}.datasource.ts
        {plugin-id}.{feature-id}.mapper.ts
        {plugin-id}.{feature-id}.registry.ts
        {plugin-id}.{feature-id}.service.ts
        {plugin-id}.{feature-id}.entity.ts   # optional
```

Example: `core-modules/plugins/tutorial-pet-db/features/user/tutorial-pet-db.user.service.ts`.

Consumer-specific overrides use a file name prefix: `{consumer-id}.{plugin-id}.{feature-id}.service.ts` (e.g. `site-2.tutorial-pet-db.user.service.ts`).

## How plugins are loaded

1. **Feature config** — For each enabled feature, `ApplicationModuleLoader` reads the feature’s `plugins` list.
2. **Resolution** — For each plugin, it calls `ClassResolver.resolveClassPaths()` with a pattern like `**/plugins/**/{pluginId}.{featureId}.module.js` (and directory `**/plugins`) to find the plugin module.
3. **Import** — The resolved plugin module file is dynamically imported.
4. **Initialization** — The plugin module’s `forRootAsync(configuration, pluginModuleData, moduleClass)` runs (e.g. `BasePluginModule.initializeModule()`). It resolves services, datasources, mappers, registries (and optionally entities) per consumer/variant via `ClassResolver`, then returns a NestJS module.
5. **Registration** — The plugin module is loaded as part of the feature’s dependency graph and registered in the application’s `imports`.

Plugins are loaded **after** their feature module is resolved; the feature module imports its plugin modules.

## Extending or overriding a plugin

- **New plugin**: Add a new plugin under `core-modules/plugins/{plugin-id}/features/{feature-id}/` (or `src/core-staging/...`) with the required files and reference it in the feature’s `plugins` in `configuration.yaml`.
- **Override a plugin class**: Add a file with the **same relative path** under `src/apps/{appName}/plugins/{plugin-id}/features/{feature-id}/` (or `src/apps/global/...`). For example, `src/apps/my-app/plugins/tutorial-pet-db/features/user/tutorial-pet-db.user.service.ts` overrides the default user service for that plugin.
- **Consumer-specific implementation**: Use the naming convention `{consumer-id}.{plugin-id}.{feature-id}.service.ts` in the same directory so that only requests for that consumer use that class.

See [Class Loading Hierarchy](../class-loading-hierarchy.md) and [Path Matching Requirements](../class-loading-hierarchy.md#path-matching-requirements).

## Testing

The framework provides test harnesses for plugin **services**, **mappers**, and **datasources**, so you can unit-test business logic, data mapping, and external calls with configurable dependencies and mocks. Tests extend base harness classes, supply a `PluginTestConfig`, and override resolvers or execute methods as needed. For a more in-depth overview—including which components are covered, harness structure, and usage—see [Plugin component testing](testing.md).

## Related

- [Feature — Deep dive](../feature/feature.md) — Features declare and use plugins
- [Service](service.md) — Plugin service implementation and helpers
- [Datasources](datasources.md) — Plugin datasource implementations
- [How to assign entity classes to a database](assigning-entities-to-databases.md) — `@PluginDatabaseConnection` and primary-connection defaults
- [Registry](registry.md) — Plugin registry components for cached lookups
- [Mapper](mapper.md) — Plugin mappers and transformation helpers
- [Architecture](../architecture.md) — Module assembly and load order
- [Class Loading Hierarchy](../class-loading-hierarchy.md) — Resolution order and consumer overrides
