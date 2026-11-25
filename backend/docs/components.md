---
title: Components
layout: default
---

# Components

CatalystJS is built from a small set of core components that work together to form your application. Every component is **extendible and customizable**: you can override or extend the default behavior in `src/apps/{appName}`, `src/apps/global`, or `src/core-staging` to match your implementation without changing framework or core-module code.

This page gives a high-level overview of each component. Follow the links for deep-dive documentation.

---

## Feature

**Features** are the main units of business capability. A feature is a NestJS module that groups controllers, resolvers, services, models, and optional plugins (e.g. user, notification, health). Features are enabled and configured in `configuration.yaml` and can be nested (feature groups). They are discovered by the [class loading hierarchy](class-loading-hierarchy.md) and assembled at startup.

**Extensibility**: You can add new features in `core-modules` or `src/core-staging`, or override feature classes (e.g. a custom service or controller) per app by placing files in the same relative path under `src/apps/{appName}` or `src/apps/global`.

→ **[Feature ](components/feature/feature.md)**

---

## Plugin

**Plugins** provide implementations for a feature (e.g. REST client, GraphQL client, and optionally a database). Database access is a capability of every plugin — not a separate plugin style. A feature can declare one or more plugins in configuration; each plugin is a NestJS module that contributes services, datasources, mappers, registries, and optionally entities (including multiple connections via `databases[]`). Plugins support multiple consumers and variants so one feature can behave differently per tenant or channel.

**Extensibility**: You can add new plugins in `core-modules` or `src/core-staging`, or override plugin classes (e.g. a custom service or datasource) per app or per consumer by following the same relative path under `src/apps/{appName}` or `src/apps/global`.

→ **[Plugin ](components/plugin/plugin.md)**

---

## Middleware

**Middleware** runs on every request (or a subset of routes) before guards and controllers. The framework registers core middleware (e.g. request-context building, access logging) and can register feature- or plugin-specific middleware from configuration. Middleware order and route applicability (e.g. `forRoutes`, `excludeRoutes`) are configurable per app and per consumer.

**Extensibility**: You can add custom middleware in `core-modules` or app directories and register it in `configuration.yaml`. Middleware classes are resolved via the class loading hierarchy, so app-specific implementations can replace or extend defaults.

→ **[Middleware ](components/middleware.md)**

---

## Guards

**Guards** determine whether a request is allowed to reach a controller or resolver. CatalystJS registers a global **Authorization Guard** that enforces API access control (consumer/API key) and user authorization (identity and scopes), using metadata from the [API decorators](components/feature/api-decorators.md) and `configuration.yaml`. Guards run after middleware and before the request handler.

**Extensibility**: You can extend the default `AuthorizationGuard` (e.g. override `isUserAuthorized` or `getUserScope`) or add additional global guards. Guard classes are resolved from `guards` directories via the class loading hierarchy, so each app can register its own guard implementation.

→ **[Guards ](components/guards.md)**  
→ **[Authorization and Access Control](authorization-and-access-control.md)** — Configuration and decorator options for the authorization guard

---

## Logger

The **Logger** is a foundation component that provides application-wide logging. The framework resolves a logger module at startup (e.g. Winston-based) and uses it for framework and application log output. Configuration (e.g. levels, masked fields) is driven by `configuration.yaml` and environment variables.

**Extensibility**: You can replace or extend the default logger by providing your own logger module in an app or global directory. The resolved logger class is used as the NestJS application logger and is injectable where needed.

→ **[Logger ](components/logger.md)**

---

## Messenger

**Messengers** are microservice or message-broker clients (e.g. Kafka, Redis) that are connected to the NestJS application. They are configured in `configuration.yaml` and loaded at startup via `MessengerLoader`. Each messenger is registered as a NestJS microservice; the same app can connect to multiple transports if needed.

**Extensibility**: You can add new messenger types (e.g. custom transport or client wrapper) in `core-modules` or app code and register them in configuration. Connection options and client factories are customizable per implementation.

→ **[Messenger ](components/messenger.md)**

---

## Summary

| Component   | Purpose                                      | Extensibility                                      |
|------------|----------------------------------------------|----------------------------------------------------|
| **Feature** | Business capability (controllers, services, APIs) | New features; override classes per app/global     |
| **Plugin**  | Implementation of a feature (REST, DB, etc.) | New plugins; override per app/consumer             |
| **Middleware** | Request pipeline (context, logging)      | Add or override middleware; configure routes        |
| **Guards**  | Authorization (API access, user, scopes)      | Extend or replace authorization guard             |
| **Logger**  | Application logging                          | Replace or extend logger module                    |
| **Messenger** | Microservice / message clients             | Add transports; customize connection options       |

All of these components are discovered and wired at startup using the [Class Loading Hierarchy](class-loading-hierarchy.md), so keeping the correct [path structure](class-loading-hierarchy.md#path-matching-requirements) ensures your extensions are picked up correctly.
