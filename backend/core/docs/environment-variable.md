---
title: Environment variables
layout: default
---

# Environment variables

CatalystJS reads a set of **core environment variables** for application behavior, overrides to `configuration.yaml`, and configurable logging or registry data. The canonical list of variable **names** (the string keys used in `process.env`) is defined in **`core/foundation/configuration/environment/environment.configuration.ts`** as **EnvironmentVariableKeys**. This page gives an overview of what each core variable does.

## Overview table

| Variable name | Key in code | Purpose |
|---------------|-------------|---------|
| `APP_ENV` | `appNodeEnv` | Application environment (e.g. `local`, `dev`, `qa`, `stage`, `prod`). Used for boot behavior, logger formatting, and optional features like generator. |
| `HOST` | `host` | Host the main server binds to. |
| `PORT` | `port` | Port for the main HTTP server (default typically `3000`). |
| `ADMIN_PORT` | `adminPort` | Port for the admin HTTP server (default typically `4000`). |
| `GRAPHQL_DEBUG` | `graphqlDebug` | Enables GraphQL debug behavior when set. |
| `DISABLE_GRAPHQL_PLAYGROUND` | `disableGraphqlPlayground` | Overrides `isGraphqlPlaygroundDisabled` in configuration (disable GraphQL Playground UI). |
| `DISABLE_OPENAPI_SWAGGER` | `disableOpenAPISwagger` | Overrides `isSwaggerDisabled` in configuration (disable Swagger/OpenAPI UI). |
| `DISABLE_ADMIN_APP` | `disableAdminApp` | When set, can disable or hide the admin app/API. |
| `SERVICE_LOGGING` | `serviceLogging` | JSON string configuring **datasource operation logging** (which REST/GraphQL operations log request/response). See [Logging datasource operations](components/plugin/logging-datasource-operations.md). |
| `MAPPER_LOGGING` | `mapperLogging` | JSON string configuring **mapper method logging** (which mapper methods log input/output). See [Logging mapper methods](components/plugin/logging-mapper.md). |
| `MESSENGER_LOGGING` | `messengerLogging` | JSON string configuring messenger logging (which messengers or topics log). |
| `REGISTRY_CONFIG` | `registryConfig` | JSON string used by configurable registries (e.g. logging registries) to load registry data from the environment instead of or in addition to other sources. |
| `ACCESS_LOGGING` | `accessLogging` | When set (e.g. to a truthy value), enables framework **access logging** for API requests. |
| `MESSENGERS` | `messengers` | Set by the configuration loader with a JSON string of configured messengers; may be read by messenger utilities. Usually not set manually. |
| `URL_BASE_PATH` | `urlBasePath` | Overrides `urlBasePath` in configuration (base path for the API). |
| `API_ACCESS_CONTROL` | `apiAccessControl` | JSON string defining the **API access control** list (client id, client secret, scopes, etc.) when API access control is enabled. |
| `LOGGER_LEVELS` | `loggerLevels` | JSON string of log level overrides; applied at startup to the logger. |
| `GENERATOR_OVERRIDE_DIRECTORY_SUPPRESSION` | `generatorOverrideDirectorySuppression` | Affects generator behavior (override directory suppression). |
| `API_ACCESS_CONTROL_ENABLED` | `doAPIAccessControl` | Overrides `doAPIAccessControl` in configuration (enable/disable API key access control). |

## Reference

The source of truth for variable **names** is **EnvironmentVariableKeys** in:

**`core/foundation/configuration/environment/environment.configuration.ts`**

That file also defines **EnvironmentVariableValues** (e.g. allowed values for `APP_ENV`: `local`, `dev`, `qa`, `stage`, `prod`). How each variable is **used** (e.g. which loader or service reads it) is spread across the codebase; the table above summarizes the main purposes.

## Related conventions (not in EnvironmentVariableKeys)

These names are composed at runtime from plugin, consumer, and datasource ids. They are not listed in **EnvironmentVariableKeys**.

| Pattern | Purpose |
|---------|---------|
| `DATABASE_CONFIG_{TYPE}_{ID}` | TypeORM connection JSON for a top-level `databases[]` entry. See [Datasources](components/plugin/datasources.md#database-configuration). |
| `DATASOURCE_CONFIG_{PLUGIN_ID}` (and consumer / `{COMPONENT_TOKEN}` variants) | REST/GraphQL datasource host and credentials. See [Datasources](components/plugin/datasources.md#datasource-configuration-rest--graphql-plugins). |
| `DATASOURCE_CONFIG_..._OVERRIDES` | Per-service-operation datasource config (subset of operations on a different host). See [Datasources — Service-operation-level configuration overrides](components/plugin/datasources.md#service-operation-level-configuration-overrides). |

## Related

- [Configuration](configuration.md) — configuration.yaml and environment variable overriding
- [Datasources](components/plugin/datasources.md) — `DATABASE_CONFIG_*` and `DATASOURCE_CONFIG_*` (including `_OVERRIDES`)
- [Logging datasource operations](components/plugin/logging-datasource-operations.md) — `SERVICE_LOGGING` format
- [Logging mapper methods](components/plugin/logging-mapper.md) — `MAPPER_LOGGING` format
