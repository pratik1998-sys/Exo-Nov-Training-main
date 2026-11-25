---
title: Logging datasource operations
layout: default
---

# Logging datasource operations

The framework can log REST and GraphQL datasource **operations** (each outgoing request/response) at a fine-grained level. You can enable logging for a single operation, for all operations of one datasource, or for all operations of a plugin. Logged data includes request details (method, host, path, params, query, body, headers — with masks applied to sensitive fields), execution time, and response or error payloads.

## What the logging framework does

- **Operation-level control** — Logging is configured per “service” (operation): each REST or GraphQL call (e.g. `getPet`, `getPets`, `createPet`) is a separate operation. You turn logging on or off per operation, per feature datasource, or for the whole plugin.
- **Request and response logging** — When logging is enabled for an operation, the framework logs:
  - Before the call: integration id, HTTP method, host, path, query params, request body, and headers (with sensitive fields masked per the application's [logger configuration](../logger.md#configuration), e.g. `loggerMaskedFields`).
  - After the call: execution time (ms) and the response body (or error).
- **Runtime updates** — Configuration is read from a registry that loads from environment variables. The admin app can update logging flags at runtime (e.g. via admin datasource API), and the registry’s in-memory config is updated so subsequent calls use the new setting without restart.
- **REST and GraphQL** — The same mechanism applies to both REST and GraphQL datasources: each registered “service” (REST endpoint or GraphQL operation) can have logging enabled or disabled independently.

## How it works

1. **Registry** — A global **ApiDatasourceServiceLoggingRegistry** (a [configurable logging registry](registry.md) variant) holds the logging flags. It is initialized at application startup and loads its configuration from the `SERVICE_LOGGING` environment variable (JSON).
2. **Registration** — Each REST and GraphQL datasource registers its operations with this registry in `onModuleInit()`: for every service definition (e.g. `getPet`, `getPets`), it calls `registerService(datasourceId, serviceDefinition)`. The registry stores them under a composite key: `pluginId.featureId.serviceId`.
3. **Lookup** — Before executing a request, the datasource calls `isServiceLoggingEnabled(featureId, pluginId, serviceId)`. The registry resolves the value from its nested config (plugin → feature → service). It supports a **wildcard** `*` at any level: e.g. `*` for serviceId means “all operations of this plugin+feature datasource.”
4. **Logging** — If enabled, the REST/GraphQL datasource logs the composed request (with masks), then after the HTTP/GraphQL call logs execution time and result (or error). Sensitive fields are masked using the application’s log-mask configuration.

So: **configuration** (env or admin-updated) → **registry** → **isServiceLoggingEnabled(...)** → **datasource** logs or skips logging per call.

## Configuration definition

Logging is configured via the **`SERVICE_LOGGING`** environment variable. The value must be a **JSON string** representing a flat object. Each key is a dot-separated identifier:

**Key format:** `pluginId.featureId.serviceId`

- **pluginId** — The plugin id (e.g. `tutorial-pet-rest`).
- **featureId** — The feature id (e.g. `pet`, `user`).
- **serviceId** — The operation id as defined in the datasource’s service definitions (e.g. `getPet`, `getPets`, `createPet`).

**Value:** `true` to enable logging for that key, `false` to disable.

The registry builds a nested map from these keys and supports a **wildcard** `*` at any segment. So you can use:

- A full key for one operation: `pluginId.featureId.serviceId`
- A wildcard for serviceId to enable all operations of one datasource: `pluginId.featureId.*`
- Wildcards for feature and service to enable all operations of a plugin: `pluginId.*.*`

## Configuration examples

### Enable logging for a specific datasource operation

Enable logging only for the `getPet` operation of the `tutorial-pet-rest` plugin’s `pet` feature:

```json
{
  "tutorial-pet-rest.pet.getPet": true
}
```

Example in `.env`:

```bash
SERVICE_LOGGING='{"tutorial-pet-rest.pet.getPet":true}'
```

Only calls to the `getPet` operation of that datasource will log request/response and execution time; other operations (e.g. `getPets`, `createPet`) will not.

### Enable logging for all operations of a datasource

Enable logging for every operation of the same plugin+feature (e.g. all pet REST calls):

```json
{
  "tutorial-pet-rest.pet.*": true
}
```

Example in `.env`:

```bash
SERVICE_LOGGING='{"tutorial-pet-rest.pet.*":true}'
```

All operations of the `tutorial-pet-rest` plugin’s `pet` datasource (e.g. `getPet`, `getPets`, `createPet`, `updatePet`, `deletePet`) will be logged.

### Enable logging for all operations of a plugin

Enable logging for every REST/GraphQL operation of a plugin (all features, all operations):

```json
{
  "tutorial-pet-rest.*.*": true
}
```

Example in `.env`:

```bash
SERVICE_LOGGING='{"tutorial-pet-rest.*.*":true}'
```

Every registered operation of every datasource under the `tutorial-pet-rest` plugin will be logged.

### Multiple entries and disabling

You can combine multiple keys and use `false` to disable:

```json
{
  "tutorial-pet-rest.pet.getPet": true,
  "tutorial-pet-rest.pet.getPets": true,
  "tutorial-pet-rest.user.*": false
}
```

Example in `.env`:

```bash
SERVICE_LOGGING='{"tutorial-pet-rest.pet.getPet":true,"tutorial-pet-rest.pet.getPets":true,"tutorial-pet-rest.user.*":false}'
```

This enables logging only for `getPet` and `getPets` in the pet feature, and explicitly disables it for all user feature operations (useful if a broader wildcard is set elsewhere or for documentation).

## Related

- [Datasources](datasources.md) — REST, GraphQL, and database datasource configuration
- [Registry](registry.md) — How configurable logging registries work
- [Logger](../logger.md) — Application logging and log levels
