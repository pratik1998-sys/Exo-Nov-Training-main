---
title: Mapper — Deep dive
layout: default
---

# Mapper — Deep dive

[← Back to Plugin](plugin.md)

## What is a Mapper?

A **mapper** is a plugin component that transforms data between external representations and internal CatalystJS models. Services call datasources to fetch raw data (e.g. REST/GraphQL responses or database rows), then use mappers to convert that data into the shapes expected by your API (e.g. CatalystJS feature models or GraphQL schema types). Mappers keep transformation logic in one place and make it easy to reuse and test.

You implement a mapper by extending **BaseMapper** and placing your class in a file named `{pluginId}.{featureId}.mapper.ts` (e.g. `tutorial-pet-rest.pet.mapper.ts`). The framework resolves and injects mappers per consumer; services obtain a mapper instance via `getMapper(requestContext, { id: 'mapper-interface-id' })` where the `id` matches the mapper’s component id.

## Base class and helper methods

**BaseMapper** extends **BasePluginComponent**, so you have access to:

### From BasePluginComponent

- **getMapper**, **getService**, **getDatasource**, **getRegistry** — Resolve another mapper, service, datasource, or registry for the current consumer (see [Service](service.md) for typical usage).
- **getPluginConfiguration**, **getPluginConsumerConfiguration**, **getFeatureConfiguration** — Read plugin/feature/consumer configuration from the app config.
- **getPluginToken**, **getPluginTokenId** — Access the plugin’s token (e.g. for auth) from the request context.
- **plugin**, **consumerIds**, **configService**, **logger** — Injected plugin metadata, consumer list, config, and logger.

### From BaseMapper

- **mapLimitOffsetPagination(requestContext, limitOffset, totalCount)** — Builds a standard **Pagination** object from limit/offset and total count (e.g. for list endpoints). Returns an object with `page`, `pageSize`, `resultCount`, `pageCount`, `hasMorePages`.
- **logTransformation(methodname, requestContext, mapperId, input, output)** — Conditionally logs the input and output of a mapping step when mapper logging is enabled for that `mapperId`. See [Mapper method logging](#mapper-method-logging) below.
- **loadExternalFeatureMapper(mapperInterface)** — *(Deprecated)* Returns a map of consumer id → mapper instance for an external feature mapper. Prefer using `getMapper(requestContext, mapperInterface)` from a service or the current mapper.

Typical usage: a service calls the datasource, then calls a mapper method such as `mapper.toPet(response)`, and the mapper returns the CatalystJS model; for list results, the mapper may use `mapLimitOffsetPagination` to build the pagination object and map each item with a small transformation method.

## Mapper method logging

The framework provides **mapper method logging**: optional, config-driven logging of input and output for specific mapper methods. This helps with debugging and auditing transformation behavior without adding custom log statements everywhere.

- **How it works at a glance** — A **MapperLoggingRegistry** (backed by the `MAPPER_LOGGING` environment variable) stores which plugin/feature/mapper-method combinations have logging enabled. When your mapper calls **logTransformation(methodname, requestContext, mapperId, input, output)**, the base class checks the registry; if logging is enabled for that `mapperId` (in the current plugin/feature), it logs the input and output (e.g. via `logger.info`). Configuration uses dot-separated keys and supports wildcards (e.g. enable all methods of a mapper).

For a **technical overview** — how the registry works, how to invoke logging from your mapper methods, and the exact configuration format with examples — see [Logging mapper methods](logging-mapper.md).

## Related

- [Plugin — Deep dive](plugin.md) — Plugins and component types
- [Service](service.md) — Services use mappers after datasource calls
- [Logging mapper methods](logging-mapper.md) — Mapper logging configuration and invocation
- [Datasources](datasources.md) — Datasources supply raw data that mappers transform
