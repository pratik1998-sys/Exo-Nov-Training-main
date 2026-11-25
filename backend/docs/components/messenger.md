---
title: Messenger — Deep dive
layout: default
---

# Messenger — Deep dive

[← Back to Components](../components.md)

## What is a Messenger?

**Messengers** are microservice or message-broker clients (e.g. Kafka, Redis, or other transports) that are connected to the NestJS application. They are configured in `configuration.yaml` under `messengers` and loaded at startup by **MessengerLoader**. Each messenger is registered as a NestJS microservice client (e.g. via `ClientsModule` or equivalent); the same app can connect to multiple messengers and multiple transports if needed. Messengers are used for event-driven or async messaging (publish/subscribe, message queues, etc.).

Messengers are **extendible**: you can add new messenger types (e.g. a custom transport or client wrapper) in `core-modules` or app code and register them in configuration. Connection options and client factories are customizable per implementation.

## How messengers are loaded

1. **Configuration** — `ConfigurationLoader` reads `messengers` from `configuration.yaml` (and applies environment overrides). Each entry has an `id`, `type`, and optional `configuration`.
2. **MessengerLoader** — `ApplicationModuleLoader.doDatastoreImports()` calls `MessengerLoader.load(appId, configuration)`. The loader:
   - Filters to **enabled** messengers (and may exclude certain types, e.g. Apollo).
   - For each messenger config, resolves the **datastore client module** (e.g. the NestJS module that registers the client for that transport) via the datastore loader pattern (directory like `messengers`, type from config).
   - Returns a list of **DatastoreDynamicModule** (or equivalent) that register the microservice clients.
3. **Module registration** — These modules are added to the application’s `imports`, so NestJS registers the clients.
4. **Connection at bootstrap** — After `NestFactory.create()`, `NestServer.connectMessengers()` gets each messenger’s options from the module (e.g. via a token like `BaseMessengerModule.composeMessengerOptionsToken(messengerId)`) and calls `app.connectMicroservice(options)` and then `app.startAllMicroservices()`.

The **MessengerModule** (foundation) also initializes per-messenger **service** providers (e.g. injectable client wrappers) by resolving a class pattern like `**/{type}.messenger.service.js` from the `messenger` directory, so application code can inject a service by token (e.g. `message_service:{messengerId}`) and use the connected client.

## Configuration

In `configuration.yaml`:

```yaml
messengers:
  - id: my-kafka
    type: kafka
    configuration:
      # transport-specific options
```

Environment variables are typically used for sensitive or environment-specific connection details (e.g. broker URLs, credentials). The loader merges config with env (e.g. `MESSENGER_CONFIG_KAFKA_MY_KAFKA`) so that connection options are not hardcoded in YAML.

- **id** — Unique messenger identifier; used for dependency injection tokens and connection lookup.
- **type** — Transport type (e.g. `kafka`, `redis`); used to resolve the correct client module and messenger service class.
- **configuration** — Transport-specific options (can be overridden or extended via env).

## Implementing a custom messenger type

1. **Client module** — Implement a NestJS dynamic module that registers the microservice client (e.g. `ClientsModule.registerAsync([...])`) and provides a token that exposes the client options (so `connectMessengers` can call `app.connectMicroservice(options)`). Place it where the datastore loader discovers it (e.g. under a `messengers` directory in core-modules or app).
2. **Messenger service class** — Implement a service class that wraps the client (e.g. `KafkaMessengerService`) and is resolved by the pattern `**/{type}.messenger.service.js` under the `messenger` root directory. Accept configuration, `ConfigService`, `ModuleRef`, and logger in the constructor.
3. **Register in configuration** — Add a new entry under `messengers` with a unique `id` and your `type`. Ensure the loader knows how to load your type (e.g. by adding support in the loader for the new type or by following an existing convention).

Because messengers are loaded via the same class resolution and config patterns as other datastores, keeping the same directory and naming conventions ensures your type is discovered and wired.

## Related

- [Architecture](../architecture.md) — Bootstrap and `connectMessengers`
- [Class Loading Hierarchy](../class-loading-hierarchy.md) — How messenger modules and services are resolved
- [Components overview](../components.md) — How messengers fit with features and plugins
