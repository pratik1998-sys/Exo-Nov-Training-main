---
title: Datasources
layout: default
---

# Datasources: REST, GraphQL, and Database

Plugins call external systems via a **datasource** — **REST** (HTTP API client) or **GraphQL** (GraphQL client) — which reads connection/config from environment variables. Independently of that, **any** plugin can also be backed by a **database** (TypeORM): database access is a capability available on every plugin module and service, not a separate plugin style. A plugin can use a REST/GraphQL datasource, a database, or both at once (e.g. a REST plugin that enriches or persists data locally).

## Tying a plugin to a database

To give **any** plugin (REST, GraphQL, or otherwise) database access:

1. **Define the database** under the top-level `databases` key in `configuration.yaml`. Each entry has an `id`, `type` (e.g. `postgres`), and optional `configuration`.
2. **Reference that database from the plugin** by adding a `databases` array to the plugin definition (under `plugins`). Each entry's `id` references a top-level database's `id` (use a YAML anchor for reuse). Mark exactly one entry `primary: true` — this is the default connection used when an entity or query does not specify one explicitly.

Example:

```yaml
databases:
  - id: &db-cerebrum_tutorial_pet cerebrum_tutorial_pet
    type: postgres
    configuration: {}

plugins:
  - id: &tutorial-pet-db tutorial-pet-db
    tokenId: catalyst-tutorial
    databases:
      - id: *db-cerebrum_tutorial_pet
        primary: true
        configuration: {}
        consumers:
          - id: site-1

features:
  - id: user
    enabled: true
    plugins:
      - id: *tutorial-pet-db
```

The framework registers each of a plugin's `databases` entries as an available connection, then registers each TypeORM entity against a connection: the one named on the entity's `@PluginDatabaseConnection` decorator, or the plugin's primary connection when the entity is undecorated. See [How to assign entity classes to a database](assigning-entities-to-databases.md) for the full how-to (when the decorator is required, YAML + entity examples, service lookup, and boot-time validation).

## Multiple database connections per plugin

A plugin is not limited to a single database connection. Declare more than one entry under `databases` to give a plugin access to two (or more) connections at once:

```yaml
plugins:
  - id: &my-db my-db
    tokenId: my-db
    databases:
      - id: *primary-database
        primary: true
        consumers:
          - id: site-1
      - id: *reporting-database
        consumers:
          - id: site-1
```

**Assigning entities:** undecorated entities register on the **primary** connection. Entities that live on another declared connection use `@PluginDatabaseConnection('that-connection-id')` from `@plugin/database`, applied alongside `@Entity()`. The argument is the connection **id** (`plugins[].databases[].id`), not a table or schema name. Single-database plugins never need the decorator.

```typescript
import { Entity, PrimaryColumn } from 'typeorm';
import { PluginDatabaseConnection } from '@plugin/database';

@Entity({ name: 'usage_report', schema: 'reporting' })
@PluginDatabaseConnection('reporting-database')
export class MyDbUsageReportEntity {
  @PrimaryColumn()
  id: string;
}
```

For a one-off query against a connection other than the one an entity is registered on (or for raw queries / `QueryRunner` work), pass the connection id explicitly:

```typescript
this.getRepository(MyEntity, 'reporting-database');
this.getDatabaseConnection('reporting-database');
```

Step-by-step YAML, entity, and service examples: [How to assign entity classes to a database](assigning-entities-to-databases.md).

## Database integration is built into the standard base classes

There are no separate "database plugin" base classes to extend. Database support is built into the framework's standard module and service base classes, and activates automatically when entities and `databases` are configured:

- **Module**: Every plugin module extends **`BasePluginModule`** (from `@plugin/module`), regardless of datasource type. On initialization it discovers TypeORM entity files for the plugin/feature (matching `*{pluginId}.{featureId}*.entity.ts` or `*{pluginId}.common*.entity.ts`) and, if any are found, groups them by resolved database connection (decorator, or plugin's primary) and registers each group via `TypeOrmModule.forFeature` for that connection. If the plugin has no entity files, this is a no-op — the module behaves exactly like a REST/GraphQL-only module.
- **Service**: Every plugin service extends **`BasePluginServiceImpl`** (directly, or via `BaseDatasourcePluginServiceImpl` for REST/GraphQL datasource access). It provides **`getRepository<T>(entityClass, databaseId?): T`** and **`getDatabaseConnection(databaseId?): DataSource`**, which resolve the TypeORM repository/connection for the given entity. Connection resolution order: the explicit `databaseId` argument, then the entity's `@PluginDatabaseConnection` decorator, then the plugin's primary connection. A single service can call `this.getDatasource(requestContext)` for its REST/GraphQL datasource **and** `this.getRepository(YourEntity)` for database access — there's no need to choose one or the other.

This means a REST or GraphQL plugin can declare a `databases` block and entities to enrich or persist data alongside its external API calls, with no additional wiring beyond the standard configuration and entity files.

## Plugin base datasource

In addition to **feature-specific** datasources (e.g. `{pluginId}.{featureId}.datasource.ts` per feature), a plugin can define a **base datasource** that is scoped to the plugin as a whole. If one exists, the framework resolves it with the file pattern `*{pluginId}.base.datasource` (e.g. `tutorial-pet-rest.base.datasource.ts`) and initializes **its own instance** per consumer, separate from any feature datasource instances.

The base datasource is intended for **common data-fetching methods** that do not align to a single plugin feature — for example, shared reference endpoints, global config, or lookup APIs used across multiple features. It is **available for use by common registries**: when a [common registry](registry.md) needs to load data, it should call this base datasource from its `fetchData()` or `load()` implementation so that the registry is fed by plugin-wide data rather than by a feature-specific datasource. Feature-specific datasources remain the right place for CRUD or operations that map one-to-one to a feature (e.g. user, pet, pharmacy); the base datasource is the right place for shared fetching that supports the whole plugin, including common registries.

## Environment variable naming convention

Sensitive or environment-specific configuration for **datasources** (REST/GraphQL plugins) and **databases** is supplied via environment variables. The framework expects a fixed naming pattern; values are typically JSON (parsed at runtime).

### Database configuration

Used by database modules (TypeORM connection) and by database-backed plugins that reference a database in `configuration.yaml`.

| Pattern | Description | Example |
|--------|--------------|---------|
| `DATABASE_CONFIG_{TYPE}_{ID}` | Connection options for the database. `TYPE` and `ID` are the database's `type` and `id` from config, **uppercased** (e.g. `postgres`, `cerebrum_tutorial_pet`). Value is a **JSON string** (e.g. `host`, `database`, `port`, `username`, `password`, `schema`, `isLoggingEnabled`, optional `certificate`). | `DATABASE_CONFIG_POSTGRES_CEREBRUM_TUTORIAL_PET` |

Example in `.env`:

```bash
DATABASE_CONFIG_POSTGRES_CEREBRUM_TUTORIAL_PET='{"host":"localhost","database":"mydb","port":5432,"username":"app","password":"secret","schema":"public","isLoggingEnabled":false}'
```

**Required JSON fields (database, e.g. Postgres):**

| Field | Type | Description |
|-------|------|-------------|
| `host` | string | Database server host. |
| `database` | string | Database name. |
| `port` | number | Port (e.g. 5432). |
| `username` | string | Connection username. |
| `password` | string | Connection password. |
| `schema` | string | Optional. Schema name (e.g. `public`). |
| `isLoggingEnabled` | boolean | Optional. Enable TypeORM query logging. |
| `certificate` | string | Optional. Base64-encoded client certificate for TLS. |

### Datasource configuration (REST / GraphQL plugins)

Used by REST and GraphQL datasources (and services that depend on them) to get endpoint URLs, credentials, etc.

| Pattern | Description | Example |
|--------|--------------|---------|
| `DATASOURCE_CONFIG_{PLUGIN_ID}` | Default config for the plugin. `PLUGIN_ID` is the plugin's `id` from config, **uppercased** (hyphens allowed, e.g. `tutorial-pet-rest` → `TUTORIAL-PET-REST`). Value is a **JSON string**. | `DATASOURCE_CONFIG_TUTORIAL-PET-REST` |
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}` | Consumer-specific override. Same as above with consumer id prefix, **uppercased**. | `DATASOURCE_CONFIG_SITE-1_TUTORIAL-PET-REST` |
| `DATASOURCE_CONFIG_{PLUGIN_ID}_{COMPONENT_TOKEN}` | Optional per-datasource-class default. `{COMPONENT_TOKEN}` is the datasource `componentId` with `.datasource` stripped and remaining `.` replaced with `_` (e.g. `tutorial-pet-rest.pet.datasource` → `TUTORIAL-PET-REST_PET`). | `DATASOURCE_CONFIG_TUTORIAL-PET-REST_PET` |
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_{COMPONENT_TOKEN}` | Per-datasource-class override for one consumer. | `DATASOURCE_CONFIG_SITE-1_TUTORIAL-PET-REST_PET` |

The first matching key (most specific first) supplies the **base** config for every service operation on that datasource class. To point only a **subset** of operations at a different host or credentials, use the `_OVERRIDES` keys below.

Example in `.env`:

```bash
DATASOURCE_CONFIG_TUTORIAL-PET-REST='{"host":"https://api.example.com","clientId":"my-client","clientSecret":"secret"}'
```

### Service-operation-level configuration overrides {#service-operation-level-configuration-overrides}

`DATASOURCE_CONFIG_..._OVERRIDES` is a JSON object keyed by an arbitrary **label**. Each entry has its own config fields (same required fields as the base datasource, e.g. `host` for REST) plus a `services` array of service-operation ids (`serviceDefinitions` keys). Resolution uses the same 4-level fallback with an `_OVERRIDES` suffix:

| Pattern | Applies to |
|---------|------------|
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_{COMPONENT_TOKEN}_OVERRIDES` | Named operations on one datasource class, one consumer (most specific) |
| `DATASOURCE_CONFIG_{PLUGIN_ID}_{COMPONENT_TOKEN}_OVERRIDES` | Named operations on one datasource class |
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_OVERRIDES` | Named operations, one consumer, plugin-wide |
| `DATASOURCE_CONFIG_{PLUGIN_ID}_OVERRIDES` | Named operations, plugin-wide |

Example — only `getPet` and `listPets` for consumer `site-1` hit staging; every other operation on the same datasource keeps the base config:

```bash
DATASOURCE_CONFIG_SITE-1_TUTORIAL-PET-REST_PET_OVERRIDES='{
  "staging-api": {
    "host": "https://staging.example.com",
    "services": ["getPet", "listPets"],
    "clientId": "staging-client",
    "clientSecret": "staging-secret"
  }
}'
```

- An override whose `services` is not an array, or that is not an object, fails startup (`PLUGIN_DATASOURCE_INVALID_OVERRIDE_CONFIGURATION_...`).
- A `services` entry that does not match a known operation id is skipped with a warning.
- Two override blocks that claim the same service id for the same consumer fail startup (`PLUGIN_DATASOURCE_AMBIGUOUS_OVERRIDE_CONFIGURATION_...`).
- Cache keys include the override label so overridden and default responses do not collide.

REST datasources resolve overrides in `onModuleInit()`. GraphQL datasources inherit that behavior. Design notes: [Enhancement: Datasource Service-Level Configuration Override](../../enhancements/datasource-service-level-configuration-override.md).

**Required JSON fields (REST datasource):**

| Field | Type | Description |
|-------|------|-------------|
| `host` | string | Base URL of the REST API (e.g. `https://api.example.com`). |

**Optional JSON fields (REST datasource):**

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | Basic-auth username. |
| `password` | string | Basic-auth password. |
| `clientId` | string | Client identifier (e.g. for token or headers). |
| `clientSecret` | string | Client secret (e.g. for token or headers). |
| `apiKey` | string | API key (e.g. for headers). |
| `headers` | object | Optional key-value headers added to every request. |

**Required JSON fields (GraphQL datasource):**

| Field | Type | Description |
|-------|------|-------------|
| `host` | string | Base URL of the GraphQL server (e.g. `https://api.example.com`). |
| `graphqlPath` | string | Path to the GraphQL endpoint (e.g. `graphql` or `v1/graphql`). Full URL is typically `{host}/{graphqlPath}`. |

**Optional JSON fields (GraphQL datasource):** Same as REST (`username`, `password`, `clientId`, `clientSecret`, `apiKey`, `headers`).

## REST datasource service operation configuration

REST datasources define **service operations** (endpoints) in a `serviceDefinitions` object. Each operation specifies how to make HTTP requests to a specific API endpoint. Service definitions are defined in your datasource class as a protected property.

### Service operation fields

Each service operation object (`RestDatasourceServiceDefinition`) contains the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the operation (e.g. `getPet`, `createPet`). Used for logging and service registration. |
| `method` | string | Yes | HTTP method: `get`, `post`, `put`, `delete`, or `patch`. Use constants from `HttpMethods` (e.g. `HttpMethods.get`). |
| `path` | string | Yes | API endpoint path relative to the datasource `host`. Can include path parameters (e.g. `pet/{identifier}`). |
| `timeout` | number | No | Request timeout in milliseconds. Defaults to `5000` if not specified. |
| `retryConfig` | object | No | Retry configuration for failed requests. See [Retry configuration](#retry-configuration) below. |
| `headers` | object | No | Additional headers to include with this operation's requests. Merged with datasource-level headers. |
| `isNoAuthorization` | boolean | No | If `true`, skips adding authorization headers for this operation. |
| `cacheConfig` | object | No | **Not yet supported.** Future caching configuration (`ttl` in seconds). |

### Retry configuration

The `retryConfig` object controls automatic retries for failed requests:

| Field | Type | Description |
|-------|------|-------------|
| `maxAttempts` | number | Maximum number of retry attempts (including the initial request). Defaults to `1` if not specified. |
| `ignoreStatuses` | number[] | Array of HTTP status codes that should **not** trigger a retry. For example, `[400, 401, 403]` will retry on 500 errors but not on client errors. |

### Example: REST service definitions

```typescript
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';

export interface MyPluginDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
  getPets: RestDatasourceServiceDefinition;
  getPet: RestDatasourceServiceDefinition;
  createPet: RestDatasourceServiceDefinition;
  updatePet: RestDatasourceServiceDefinition;
  deletePet: RestDatasourceServiceDefinition;
}

export class MyPluginDatasource extends BaseRestDatasource {
  protected serviceDefinitions: MyPluginDatasourceServiceDefinitions = {
    getPets: {
      id: 'getPets',
      method: HttpMethods.get,
      path: 'pet',
      timeout: 5000,
    },
    getPet: {
      id: 'getPet',
      method: HttpMethods.get,
      path: 'pet/{identifier}',
      timeout: 5000,
      retryConfig: {
        maxAttempts: 3,
        ignoreStatuses: [400, 404],
      },
    },
    createPet: {
      id: 'createPet',
      method: HttpMethods.post,
      path: 'pet',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    updatePet: {
      id: 'updatePet',
      method: HttpMethods.put,
      path: 'pet/{identifier}',
      timeout: 10000,
    },
    deletePet: {
      id: 'deletePet',
      method: HttpMethods.delete,
      path: 'pet/{identifier}',
      timeout: 5000,
      isNoAuthorization: true, // Skip auth for this operation
    },
  };

  // Implementation methods use this.serviceDefinitions.getPet, etc.
}
```

### Path parameters (paramMap)

REST datasources support **path parameters** for dynamic URL segments. Path parameters allow you to define reusable endpoint patterns with placeholders that are replaced at runtime.

**How it works:**

1. **Define path placeholders** in your service definition `path` using curly braces: `pet/{identifier}`, `users/{userId}/orders/{orderId}`, etc.
2. **Create a path parameter constants object** (recommended) to avoid typos and ensure consistency:

```typescript
export const MyDatasourcePathParams = {
  identifier: '{identifier}',
  userId: '{userId}',
  orderId: '{orderId}',
};

// Use in paths
path: `pet/${MyDatasourcePathParams.identifier}`,
path: `users/${MyDatasourcePathParams.userId}/orders/${MyDatasourcePathParams.orderId}`,
```

3. **Pass a `paramMap`** when calling `execute()`. The `paramMap` is an object where keys match the placeholder names (without curly braces) and values are the actual values to substitute:

```typescript
async getPet(requestContext: RequestContext, identifier: string): Promise<Pet> {
  const paramMap = {
    [MyDatasourcePathParams.identifier]: identifier, // Maps '{identifier}' → actual value
  };

  return await this.execute(
    requestContext,
    this.serviceDefinitions.getPet,
    {},      // queryParams
    {},      // headers
    paramMap // path parameter map
  );
}

async updateOrder(
  requestContext: RequestContext,
  userId: string,
  orderId: string,
  body: OrderUpdate
): Promise<Order> {
  const paramMap = {
    [MyDatasourcePathParams.userId]: userId,
    [MyDatasourcePathParams.orderId]: orderId,
  };

  return await this.execute(
    requestContext,
    this.serviceDefinitions.updateOrder,
    {},      // queryParams
    {},      // headers
    paramMap, // path parameter map
    body     // request body
  );
}
```

**Important notes:**
- Path parameter placeholders use the format `{placeholderName}` (with curly braces).
- The `paramMap` keys should match the placeholder names **without** curly braces (e.g., `identifier` not `{identifier}`).
- All placeholders in the path must have corresponding entries in `paramMap`, or they will remain unreplaced.
- Path parameters are replaced using `replaceAll()`, so the same placeholder can appear multiple times in a path.

## GraphQL datasource service operation configuration

GraphQL datasources define **service operations** (queries/mutations) in a `serviceDefinitions` object. Each operation specifies a GraphQL query or mutation to execute. Service definitions are defined in your datasource class as a protected property.

### Service operation fields

Each service operation object (`GraphqlDatasourceServiceDefinition`) contains the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the operation (e.g. `getUser`, `createOrder`). Used for logging and service registration. |
| `method` | string | Yes | HTTP method: `get` or `post`. Use constants from `GraphqlHttpMethods` (e.g. `GraphqlHttpMethods.post`). |
| `query` | object | No | GraphQL query definition. See [Query configuration](#query-configuration) below. If not provided, you must pass a query when executing the operation. |
| `timeout` | number | No | Request timeout in milliseconds. Defaults to `5000` if not specified. |
| `retryConfig` | object | No | Retry configuration for failed requests. See [Retry configuration](#retry-configuration) above. |
| `headers` | object | No | Additional headers to include with this operation's requests. Merged with datasource-level headers. |
| `isNoAuthorization` | boolean | No | If `true`, skips adding authorization headers for this operation. |
| `cacheConfig` | object | No | **Not yet supported.** Future caching configuration (`ttl` in seconds). |

### Query configuration

The `query` object (`GraphqlDatasourceQuery`) contains:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `queryId` | string | Yes | Unique identifier for the query (e.g. `getUserQuery`, `createOrderMutation`). Used for caching and logging. |
| `query` | string | Yes | The GraphQL query or mutation string. Whitespace is normalized automatically. |
| `id` | string | No | Optional identifier (alternative to `queryId`). |

### Best practice: Define queries in schema files

**It is best practice to define GraphQL queries and mutations in separate `*.schema.ts` files** rather than inline in the datasource class. This approach:

- **Separates concerns** — Keeps query definitions separate from datasource logic
- **Improves maintainability** — Makes queries easier to find, update, and reuse
- **Enables reuse** — Allows queries to be shared across multiple datasources or operations
- **Improves readability** — Keeps the datasource class focused on execution logic

**Example structure:**

```typescript
// schema/my-graphql.schema.ts
import { GraphqlDatasourceQuery } from '@plugin-datasource-graphql';

export const getUserQuery: GraphqlDatasourceQuery = {
  queryId: 'getUserQuery',
  query: `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
      }
    }
  `,
};

export const getUsersQuery: GraphqlDatasourceQuery = {
  queryId: 'getUsersQuery',
  query: `
    query GetUsers($limit: Int, $offset: Int) {
      users(limit: $limit, offset: $offset) {
        id
        name
        email
      }
    }
  `,
};

export const createOrderMutation: GraphqlDatasourceQuery = {
  queryId: 'createOrderMutation',
  query: `
    mutation CreateOrder($input: OrderInput!) {
      createOrder(input: $input) {
        id
        status
        total
      }
    }
  `,
};
```

```typescript
// my-graphql.datasource.ts
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from '@plugin-datasource-graphql';
import { getUserQuery, getUsersQuery, createOrderMutation } from './schema/my-graphql.schema';

export class MyGraphQLDatasource extends BaseGraphqlDatasource {
  protected serviceDefinitions: GraphqlDatasourceServiceDefinitions = {
    getUser: {
      id: 'getUser',
      method: GraphqlHttpMethods.post,
      timeout: 5000,
      query: getUserQuery, // Reference from schema file
    },
    getUsers: {
      id: 'getUsers',
      method: GraphqlHttpMethods.post,
      timeout: 10000,
      query: getUsersQuery, // Reference from schema file
    },
    createOrder: {
      id: 'createOrder',
      method: GraphqlHttpMethods.post,
      timeout: 15000,
      query: createOrderMutation, // Reference from schema file
    },
  };
}
```

### Example: GraphQL service definitions

```typescript
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from '@plugin-datasource-graphql';

export interface MyGraphQLDatasourceServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
  getUser: GraphqlDatasourceServiceDefinition;
  getUsers: GraphqlDatasourceServiceDefinition;
  createOrder: GraphqlDatasourceServiceDefinition;
}

export class MyGraphQLDatasource extends BaseGraphqlDatasource {
  protected serviceDefinitions: MyGraphQLDatasourceServiceDefinitions = {
    getUser: {
      id: 'getUser',
      method: GraphqlHttpMethods.post,
      timeout: 5000,
      query: {
        queryId: 'getUserQuery',
        query: `
          query GetUser($id: ID!) {
            user(id: $id) {
              id
              name
              email
            }
          }
        `,
      },
    },
    getUsers: {
      id: 'getUsers',
      method: GraphqlHttpMethods.post,
      timeout: 10000,
      retryConfig: {
        maxAttempts: 2,
        ignoreStatuses: [400, 401],
      },
      query: {
        queryId: 'getUsersQuery',
        query: `
          query GetUsers($limit: Int, $offset: Int) {
            users(limit: $limit, offset: $offset) {
              id
              name
              email
            }
          }
        `,
      },
      headers: {
        'X-Custom-Header': 'value',
      },
    },
    createOrder: {
      id: 'createOrder',
      method: GraphqlHttpMethods.post,
      timeout: 15000,
      query: {
        queryId: 'createOrderMutation',
        query: `
          mutation CreateOrder($input: OrderInput!) {
            createOrder(input: $input) {
              id
              status
              total
            }
          }
        `,
      },
    },
  };

  // Implementation methods use this.serviceDefinitions.getUser, etc.
  // Variables are passed when calling executeGQLService()
}
```

**Dynamic queries:** You can also provide a query dynamically when executing an operation by passing a `GraphqlDatasourceQuery` object to `executeGQLService()`. This is useful when queries are generated at runtime or loaded from external sources.

### GraphQL variables vs path parameters

**GraphQL datasources do not use path parameters** like REST datasources. Instead, GraphQL uses **variables** passed in the request body (or query string for GET requests). Variables are defined in your GraphQL query/mutation and passed when calling `executeGQLService()`:

```typescript
// Query defines variables
query GetUser($id: ID!, $includeEmail: Boolean) {
  user(id: $id) {
    id
    name
    email @include(if: $includeEmail)
  }
}

// Variables passed at execution time
const variables = {
  id: 'user-123',
  includeEmail: true,
};

const result = await this.executeGQLService(
  requestContext,
  this.serviceDefinitions.getUser,
  variables // GraphQL variables, not path parameters
);
```

The GraphQL endpoint path itself is fixed (defined in datasource config as `graphqlPath`), so there are no dynamic path segments to replace.

## Operation-level logging

REST and GraphQL datasources support **operation (service) level logging**: you can enable detailed logs (request URL, params, body, headers, execution time, and response) per datasource operation. This is useful for debugging and auditing integration calls. Logging is driven by configuration and can be toggled at runtime via the admin datasource API. See [Logging datasource operations](logging-datasource-operations.md) for what the logging framework does, how it works, and configuration examples (e.g. for a single operation or for all operations of a datasource).

## Related

- [Plugin — Deep dive](plugin.md) — Plugins use datasources for data access
- [How to assign entity classes to a database](assigning-entities-to-databases.md) — `@PluginDatabaseConnection` how-to for multi-database plugins
- [Feature — Deep dive](../feature/feature.md) — Features declare plugins with datasources
