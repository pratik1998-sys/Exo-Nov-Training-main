---
title: Service
layout: default
---

# Service

A **plugin service** is the component that implements a feature's business logic for a given plugin. It orchestrates input validation, datasource calls, and mapping of external data into CatalystJS (feature) model schemas. Plugin services are consumer-aware: they resolve the correct datasource, mapper, and other plugin components per consumer using `RequestContext`.

## What is a Service?

A plugin service:

- **Implements the feature service contract** — Each feature defines an abstract service interface (e.g. `UserService`, `PetService`). A plugin provides a concrete implementation (e.g. `tutorial-pet-rest.user.service.ts`) that implements that interface.
- **Is consumer-scoped** — The same service class can serve multiple consumers; the framework resolves datasources and mappers per consumer from `requestContext.consumer`.
- **Orchestrates plugin components** — It uses datasources to fetch or persist data, mappers to transform between external and CatalystJS models, and optionally registries or other services.

Plugin services extend **`BasePluginServiceImpl`**. For plugins that use a datasource (REST, GraphQL), extend **`BaseDatasourcePluginServiceImpl`** instead so that `getDatasource()` is implemented. Database access via `getRepository()` / `getDatabaseConnection()` is available on **`BasePluginServiceImpl`** itself (see below), so it works regardless of which of these you extend — a REST/GraphQL plugin service can use `getDatasource()` and `getRepository()` together.

File and class naming must follow the [file naming rules](../class-loading-hierarchy.md#file-naming-rules): e.g. `{pluginId}.{featureId}.service.ts` and class suffix `ServiceImpl`.

## Getting other service implementation class instances

To use another **feature service** implementation (e.g. from the same or another feature), use the base class helper **`getService()`**:

```typescript
import { BaseFeatureServiceParameter } from '@feature/service';

// Service interface parameter: { id: string } where id is the feature service token
const userServiceInterface: BaseFeatureServiceParameter = {
  id: 'feature-user.user.service'  // example token for user feature service
};

const userService = this.getService(requestContext, userServiceInterface);
const result = await userService.someMethod(args, requestContext, context);
```

- **`getService<T>(requestContext, serviceInterface): T`** — Resolves the feature service instance for the current consumer. `serviceInterface.id` is the NestJS provider token for that service (typically derived from feature id and file suffix). The resolved instance is cached per consumer.

Use this when your plugin service needs to call another feature's service (e.g. user service calling auth or another plugin’s service).

## Getting mapper class instances

To get a **mapper** instance (for the current consumer), use **`getMapper()`**:

```typescript
import { BaseMapperInterfaceParameter } from '@plugin/mapper';

// Option 1: Mapper for this plugin/feature (default). Uses consumer-specific mapper resolved in onModuleInit.
const mapper = this.getMapper(requestContext);

// Option 2: Specific mapper by interface (e.g. another feature’s mapper).
const otherMapperInterface: BaseMapperInterfaceParameter = {
  id: 'other-plugin.other-feature.mapper'
};
const otherMapper = this.getMapper(requestContext, otherMapperInterface);
```

- **`getMapper<T>(requestContext, mapperInterface?): T`** — If `mapperInterface` is provided, resolves that mapper by id for the current consumer. Otherwise returns the mapper for the current plugin/feature (from `consumerMappers[consumerId]`), which is populated in `onModuleInit()`.

Mappers convert external/datasource models to and from CatalystJS (feature) models. Use the default mapper when mapping this plugin’s datasource responses to the feature’s public schema.

## Getting datasource class instances

To get a **datasource** instance (for the current consumer), use **`getDatasource()`**:

```typescript
import { BaseDatasourceInterfaceParameter } from '@plugin/datasource';

// Option 1: Datasource for this plugin/feature (default). Uses consumer-specific datasource resolved in onModuleInit.
const datasource = this.getDatasource(requestContext);

// Option 2: Specific datasource by interface.
const otherDsInterface: BaseDatasourceInterfaceParameter = {
  id: 'other-plugin.other-feature.datasource'
};
const otherDatasource = this.getDatasource(requestContext, otherDsInterface);
```

- **`getDatasource<T>(requestContext, datasourceInterface?): T`** — Available only when extending **`BaseDatasourcePluginServiceImpl`**. If `datasourceInterface` is provided, resolves that datasource by id for the current consumer. Otherwise returns the datasource for the current plugin/feature (from `consumerDatasources[consumerId]`).

If you extend `BasePluginServiceImpl` and not `BaseDatasourcePluginServiceImpl`, calling `getDatasource()` throws; use `BaseDatasourcePluginServiceImpl` for REST/GraphQL plugins.

## Base class helper methods

The following helpers are available on **`BasePluginServiceImpl`** (and thus on `BaseDatasourcePluginServiceImpl`, since it extends `BasePluginServiceImpl`).

### Configuration and context

| Method | Description |
|--------|-------------|
| **`getPluginConsumerConfiguration<T>(requestContext)`** | Returns the plugin’s consumer-specific configuration for the current request (from `configuration.yaml` and config service). |
| **`getPluginConfiguration<T>(requestContext)`** | Returns the plugin’s general configuration. |
| **`getFeatureConfiguration<T>()`** | Returns the feature’s configuration. |
| **`getConsumerId(requestContext)`** | Returns the consumer id from the request context (`requestContext.consumer`). |
| **`getPluginTokenId(requestContext)`** | Returns the plugin’s token id (e.g. for auth). |
| **`getPluginToken<T>(requestContext)`** | Returns the token object for the plugin from the request context. |

### Other plugin components

| Method | Description |
|--------|-------------|
| **`getRegistry<T>(requestContext, registryInterface)`** | Resolves a [registry](registry.md) instance by interface for the current consumer. |
| **`getService<T>(requestContext, serviceInterface)`** | Resolves another feature service by interface (see above). |
| **`getMapper<T>(requestContext, mapperInterface?)`** | Resolves a mapper (see above). |
| **`getDatasource<T>(requestContext, datasourceInterface?)`** | Resolves a datasource (see above); only in `BaseDatasourcePluginServiceImpl`. |

### Pagination helpers

| Method | Description |
|--------|-------------|
| **`translateLimitOffsetPagination(requestContext, paginationInput, defaultLimit?)`** | Converts API pagination input (`PaginationInput`: `page`, `pageSize`) into **limit/offset** for the datasource. Uses consumer config for default page size if available. Returns `{ limit, offset }`. |
| **`translateCursorPagination(paginationInput, defaultLimit?)`** | Converts API pagination input into **cursor-based** pagination for the datasource. Returns `{ first, after }` (e.g. for GraphQL). |
| **`validatePagination(paginationInput, requestContext, disableMaxPagination?)`** | Validates and normalizes `PaginationInput` (e.g. applies default page size, enforces max page size from consumer config). Throws if max page size exceeded. Returns the validated input. |
| **`composeResultSetWithPagination<T>(paginationInput, resultList, requestContext)`** | Builds a feature `ResultSet` from an in-memory list: translates limit/offset, slices `resultList`, and fills `pagination` (`page`, `pageSize`, `resultCount`, `pageCount`, `hasMorePages`). |

### Token / identity

| Method | Description |
|--------|-------------|
| **`getTokenId(requestContext)`** | Returns the plugin’s token id (delegates to `getPluginTokenId`). |

### Database access

Available on **every** plugin service (defined on `BasePluginServiceImpl`), regardless of datasource type. Functional whenever the plugin has a `databases` array and, for `getRepository()`, the entity is registered for the resolved connection.

| Method | Description |
|--------|-------------|
| **`getRepository<T>(entityClass, databaseId?)`** | Returns the TypeORM repository for the given entity. Connection resolution: explicit `databaseId` → the entity's `@PluginDatabaseConnection` decorator → the plugin's primary connection. See [How to assign entity classes to a database](assigning-entities-to-databases.md). |
| **`getDatabaseConnection(databaseId?)`** | Returns the underlying TypeORM `DataSource` — for multi-entity transactions, raw queries, or a `QueryRunner`. Uses `databaseId` when passed, otherwise the plugin's primary connection. |

## Typical flow of a service method

A typical plugin service method follows this pattern:

1. **Process input** — Validate and normalize inputs (filters, pagination, body). Use `getPluginConsumerConfiguration()` for consumer-specific settings, and helpers like `validatePagination()` or `translateLimitOffsetPagination()` / `translateCursorPagination()` to build datasource query parameters.
2. **Execute datasource** — Call the appropriate method on the datasource (e.g. `getPet()`, `getPets()`, `createPet()`) using `this.getDatasource(requestContext)`. Handle errors and translate to feature errors if needed.
3. **Process datasource response** — Optionally post-process the raw datasource result (e.g. extract list and total count for result sets).
4. **Map to CatalystJS model schema** — Use the mapper to convert the external/datasource model to the feature’s public model (e.g. `this.getMapper(requestContext).mapPet(requestContext, dsResult)` or `mapPetResultSet(...)`). Return the mapped result.

Example (conceptual):

```typescript
async getPet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet> {
  // 1. Process input (optional config/logging)
  const { configuration } = this.getPluginConsumerConfiguration<MyConsumerConfig>(requestContext);

  // 2. Execute datasource
  let dsResult: ExternalPet;
  try {
    dsResult = await this.getDatasource(requestContext).getPet(requestContext, identifier);
  } catch (error) {
    throw PetErrors.getPetFailed();
  }

  // 3. (Optional) Process datasource response
  // e.g. normalize, filter

  // 4. Map to CatalystJS model schema
  return this.getMapper(requestContext).mapPet(requestContext, dsResult);
}
```

For list/result-set methods, the same flow applies with pagination and mapping of result sets:

```typescript
async getPets(filter: PetFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PetResultSet> {
  // 1. Process input
  pagination = this.validatePagination(pagination, requestContext);
  const query = this.buildQuery(requestContext, pagination, filter);  // plugin-specific

  // 2. Execute datasource
  let dsResultSet: ExternalPetResultSet;
  try {
    dsResultSet = await this.getDatasource(requestContext).getPets(requestContext, query);
  } catch (error) {
    throw PetErrors.getPetsFailed();
  }

  // 3. (Optional) Process response
  // 4. Map to CatalystJS model schema
  return this.getMapper(requestContext).mapPetResultSet(requestContext, dsResultSet);
}
```

This keeps a clear separation: **service** = orchestration and error handling; **datasource** = data access; **mapper** = transformation to feature schema.

## Related

- [Plugin — Deep dive](plugin.md) — Services are plugin components
- [Datasources](datasources.md) — How to get and use datasources
- [How to assign entity classes to a database](assigning-entities-to-databases.md) — `@PluginDatabaseConnection` and `getRepository` connection resolution
- [Registry](registry.md) — How to get and use registries from a service
- [Class Loading Hierarchy](../class-loading-hierarchy.md) — How service classes are resolved
