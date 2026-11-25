---
title: Registry
layout: default
---

# Registry

A **registry** is a plugin component that provides a cached dataset for plugin-specific lookups. Registries are singleton components that load data at application startup and can refresh their data periodically or on-demand. They are commonly used to cache reference data, configuration mappings, or lookup tables that are accessed frequently by services, datasources, or mappers.

## What is a Registry?

A registry is a **singleton component** that:

- **Caches data** — Stores a dataset (typically loaded from a datasource, database, or external API) in memory for fast access
- **Supports multiple consumers** — While registries themselves are not consumer-specific, they can use consumer-specific datasources when loading data
- **Auto-refreshes** — Can be configured to automatically refresh data at a specified interval
- **Shared across apps** — Uses a custom singleton pattern to share instances across multiple NestJS applications (e.g. main app and admin app)

Registries extend `BaseRegistry` and implement:
- `load()` — Abstract method that loads data into the registry (typically calls `fetchData()`)
- `fetchData()` — Abstract method that retrieves data from a datasource, database, or external source
- `getRegistryData()` — Abstract method that returns the cached registry data

## Feature-specific registry vs common registry (feature groups)

A plugin can be attached to **multiple features** (e.g. in a feature group such as `tutorial` with features `user`, `pet`, `pharmacy`). The framework supports two registry scopes:

### Feature-specific registry

- **Scope**: One registry instance per **(plugin, feature)** pair.
- **File pattern**: `**/plugins/**/{pluginId}.{featureId}.registry.js`
- **File location and name**: Under the feature directory, e.g. `plugins/tutorial-pet-rest/features/user/tutorial-pet-rest.user.registry.ts`
- **Use when**: The cached data is specific to a single feature (e.g. user-related lookups for the user feature only). Each feature in the group has its own registry instance.

Example: `tutorial-pet-rest.user.registry.ts` for the user feature, `tutorial-pet-rest.pet.registry.ts` for the pet feature — separate data per feature.

### Common registry

- **Scope**: One registry instance per **plugin**, shared by all features that use that plugin.
- **File pattern**: `**/{pluginId}/**/*{pluginId}.common*.registry.js`
- **File location and name**: Anywhere under the plugin directory, with `.common` in the file name, e.g. `plugins/tutorial-pet-rest/common/tutorial-pet-rest.common.registry.ts`
- **Use when**: The cached data is shared across every feature that uses the plugin (e.g. shared reference data, logging configuration, or a single lookup table used by all plugin feature components). All features in the feature group that use the same plugin see the same common registry instance. A common use case is external system access credential caching to be used by all feature datasources of a plugin.

**Data fetching in a common registry**: Data loading should be done by leveraging a **base datasource** for the plugin. The framework resolves a plugin-level base datasource (file pattern `*{pluginId}.base.datasource`, e.g. `tutorial-pet-rest.base.datasource.ts`) that is available to the common registry. That base datasource should expose common data-fetching methods that are not tied to a single feature (e.g. “fetch all reference types”, “fetch shared config”). The common registry’s `fetchData()` (or `load()`) should call this base datasource rather than a feature-specific datasource, so the registry stays plugin-wide and does not depend on any one feature’s API shape.

Example: `tutorial-pet-rest.common.registry.ts` — one singleton for the plugin; the user, pet, and pharmacy features can all resolve and use it.

In a **feature group**, the same plugin is often referenced by multiple features. Feature-specific registries give each feature its own registry; common registries provide one shared registry for the whole plugin so that every feature in the group can access the same cached data without duplicating it per feature.

## How registries are initialized

Registries are initialized during plugin module initialization:

1. **Provider creation** — During `BasePluginModule.initializeModule()`, the framework calls `createPluginRegistryComponentProviders()` which:
   - Resolves registry classes using `ClassResolver` with pattern `**/plugins/**/{pluginId}.{featureId}.registry.js`
   - Also resolves common registries with pattern `**/{pluginId}/**/*{pluginId}.common*.registry.js`
   - Creates NestJS providers for each resolved registry class

2. **Singleton instantiation** — Each registry provider uses `BaseRegistry.initializeInstance()` which:
   - Checks if the registry has already been registered (to prevent duplicate instances)
   - Creates a new instance if not already registered
   - Stores the instance in a static `instance` property
   - Returns the singleton instance

3. **Constructor execution** — The registry constructor:
   - Reads registry configuration from environment variables (`REGISTRY_CONFIG`)
   - Determines if the registry is enabled (`disabled` flag)
   - Resolves the default consumer ID for the plugin
   - Stores references to `ModuleRef`, `ConfigService`, `Logger`, and plugin metadata

4. **NestJS lifecycle** — When NestJS calls `onApplicationBootstrap()`:
   - The registry checks if it's already initialized
   - If enabled, calls `initialize()` which:
     - Sets up a refresh timer (if `refreshInterval` is configured)
     - Calls `load()` to fetch and cache initial data

## How registries load data

The data loading process follows this flow:

1. **Initial load** — When `initialize()` is called during `onApplicationBootstrap()`:
   - If the registry is enabled, it calls `load()`
   - `load()` is implemented by the concrete registry class and typically:
     - Calls `fetchData()` to retrieve data from a datasource, database, or external API
     - Processes and transforms the data as needed
     - Stores the data in a protected property (e.g. `protected registryData`)

2. **Data fetching** — The `fetchData()` method (implemented by the concrete registry):
   - Can use `getDatasource()` to access a REST, GraphQL, or database datasource
   - Can use `getMapper()` to transform external data models
   - Can use `getService()` to call other plugin services
   - Can use `getRegistry()` to access other registries
   - Returns the raw data that will be cached

3. **Consumer-specific datasources** — While registries are not consumer-specific, they can use consumer-specific datasources:
   - Pass a `consumerId` to `getDatasource()` to use a consumer-specific datasource
   - If no `consumerId` is provided, uses the plugin's default consumer ID
   - This allows a registry to aggregate data from multiple consumers if needed

## How registries refresh data

Registries support two refresh mechanisms:

### Automatic refresh (timer-based)

If `refreshInterval` is configured in the registry configuration:

1. **Timer setup** — During `initialize()`, `initiateTimer()` is called:
   - Reads `refreshInterval` from `registryConfiguration` (in milliseconds)
   - Sets up a `setInterval` timer that calls `refresh()` at the specified interval
   - Logs the refresh interval for monitoring

2. **Periodic refresh** — The timer automatically calls `refresh()`:
   - `refresh()` calls `load()` to reload data from the source
   - The new data replaces the cached data
   - The refresh happens in the background without blocking requests

Example configuration (via `REGISTRY_CONFIG` environment variable):

```json
{
  "my-plugin.my-feature": {
    "refreshInterval": 300000,
    "disabled": false
  }
}
```

This refreshes the registry every 5 minutes (300,000 milliseconds).

### Manual refresh (on-demand)

Registries can be refreshed manually:

1. **Via admin API** — The admin app provides GraphQL mutations and REST endpoints to refresh registries:
   - `registryRefresh(id)` mutation or `POST /admin/registry/{id}/refresh` endpoint
   - Uses `RegistryUtility.getRegistryById()` to find the registry
   - Calls `refresh()` on the registry instance
   - Returns the refreshed data

2. **Programmatic refresh** — Components can refresh registries directly:
   ```typescript
   const registry = RegistryUtility.getRegistryById(registryId, moduleRef, logger);
   await registry.refresh();
   const data = registry.getRegistryData();
   ```

## How registry data is accessed

Other components (services, datasources, mappers) access registry data using `RegistryUtility`:

### From a service, datasource, or mapper

Components that extend `BasePluginComponent` (or `BasePluginServiceImpl`, `BaseDatasource`, `BaseMapper`) can use the `getRegistry()` helper method:

```typescript
import { BaseRegistryInterfaceParameter } from '@registry';
import { BasePluginServiceImpl } from '@plugin/service';

export class MyServiceImpl extends BasePluginServiceImpl {
  async someMethod(requestContext: RequestContext) {
    // Get registry using interface parameter
    const registryInterface: BaseRegistryInterfaceParameter = {
      id: 'my-plugin.my-feature.registry'
    };
    
    const registry = this.getRegistry(requestContext, registryInterface);
    const data = registry.getRegistryData();
    
    // Use the registry data
    return data;
  }
}
```

### Direct access via RegistryUtility

Components can also use `RegistryUtility` directly:

```typescript
import { RegistryUtility } from '@registry/utilities/registry.utility';
import { BaseRegistryInterfaceParameter } from '@registry';

const registryInterface: BaseRegistryInterfaceParameter = {
  id: 'my-plugin.my-feature.registry'
};

const registry = RegistryUtility.getRegistry(
  requestContext.consumer,
  registryInterface,
  moduleRef,
  logger
);

const data = registry.getRegistryData();
```

### By registry ID

If you know the exact registry ID (token), you can retrieve it directly:

```typescript
import { RegistryUtility } from '@registry/utilities/registry.utility';

const registry = RegistryUtility.getRegistryById(
  'my-plugin.my-feature.registry',
  moduleRef,
  logger
);

const data = registry.getRegistryData();
```

### From within a registry

Registries can access other registries using the `getRegistry()` helper method:

```typescript
export class MyRegistry extends BaseRegistry {
  async load() {
    // Access another registry
    const otherRegistry = this.getRegistry(
      { id: 'other-plugin.other-feature.registry' },
      this.defaultConsumerId
    );
    
    const otherData = otherRegistry.getRegistryData();
    
    // Use otherData to build this registry's data
    this.registryData = this.processData(otherData);
  }
}
```

## Registry configuration

Registry configuration is provided via the `REGISTRY_CONFIG` environment variable (JSON string):

```json
{
  "my-plugin.my-feature": {
    "refreshInterval": 300000,
    "disabled": false
  }
}
```

Configuration fields:

| Field | Type | Description |
|-------|------|-------------|
| `refreshInterval` | number | Optional. Refresh interval in milliseconds. If set, the registry automatically refreshes at this interval. |
| `disabled` | boolean | Optional. If `true`, the registry is not initialized and will not load data. Defaults to `false`. |

The configuration key is derived from the registry ID (e.g. `my-plugin.my-feature.registry` → `my-plugin.my-feature`).

## Example: Implementing a registry

```typescript
import { BaseRegistry } from '@registry';
import { BaseDatasourceInterfaceParameter } from '@plugin/datasource';

export class MyRegistry extends BaseRegistry {
  protected registryData: Map<string, any> = new Map();

  protected async fetchData(): Promise<any> {
    // Get a datasource to fetch data
    const datasource = this.getDatasource(
      this.defaultConsumerId,
      { id: 'my-plugin.my-feature.datasource' }
    );
    
    // Fetch data from the datasource
    const rawData = await datasource.fetchSomeData();
    
    // Transform and return
    return this.transformData(rawData);
  }

  protected async load(): Promise<void> {
    const data = await this.fetchData();
    
    // Cache the data
    this.registryData = new Map(
      data.map(item => [item.id, item])
    );
  }

  getRegistryData(): Map<string, any> {
    return this.registryData;
  }

  private transformData(rawData: any[]): any[] {
    // Transform raw data into registry format
    return rawData.map(item => ({
      id: item.id,
      name: item.name,
      // ... other fields
    }));
  }
}
```

## Related

- [Plugin — Deep dive](plugin.md) — Registries are plugin components
- [Datasources](datasources.md) — Registries often use datasources to fetch data
- [Class Loading Hierarchy](../class-loading-hierarchy.md) — How registry classes are resolved
