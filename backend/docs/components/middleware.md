---
title: Middleware — Deep dive
layout: default
---

# Middleware — Deep dive

[← Back to Components](../components.md)

## What is Middleware?

**Middleware** runs on incoming HTTP requests before they reach guards and controllers. In CatalystJS, middleware is registered with NestJS’s `MiddlewareConsumer` during `ApplicationModule.configure(consumer)`. The **MiddlewareLoader** gathers middleware from configuration and the [class loading hierarchy](../class-loading-hierarchy.md), then applies it in sequence. Middleware can be scoped by route (`forRoutes`, `excludeRoutes`) and by consumer, so different apps or tenants can get different middleware stacks.

All framework middleware extends **BaseMiddleware**, which provides:

- **Consumer awareness** — `consumerIds` and `canMiddlewareExecute(req)` so middleware can run only for certain consumers
- **Request context** — Access to `RequestContext` (e.g. correlation id, consumer, user) set by earlier middleware
- **Configuration** — Optional per-consumer configuration via `consumerConfiguration`
- **Service resolution** — Helper to resolve feature services by consumer for use inside middleware

## Core middleware

The framework registers these middleware by default (order is important):

| Order | ID | Purpose |
|-------|----|--------|
| 1 | `request.context.middleware` | Builds and attaches `CoreRequestContext` to the request (correlation id, consumer, API key, user, locale, etc.). Required for the authorization guard and downstream code. |
| 2 | `access-logging.middleware` | Logs request/response (e.g. method, URL, status). |

Both are registered in `MiddlewareLoader` with `enabled: true`. They use empty `forRoutes` / `excludeRoutes` by default; the loader can merge in app-level route config.

## Feature and plugin middleware

Middleware can also be defined **per feature** or **per plugin** in `configuration.yaml`. For example:

```yaml
features:
  - id: user
    enabled: true
    middleware:
      - id: user.profile.middleware
        enabled: true
        forRoutes: ['*']
        excludeRoutes: ['health']
        configuration:
          cacheTTL: 10000
        consumers:
          - id: site-2
            configuration:
              cacheTTL: 5000
    plugins:
      - id: my-plugin
```

- **`id`** — Middleware identifier; used to resolve the class (e.g. `**/user.profile.middleware.js` in the appropriate directory).
- **`enabled`** — When `false`, this middleware is not applied.
- **`sequence`** — Order relative to other middleware (if not set, loader order applies).
- **`forRoutes`** / **`excludeRoutes`** — Route patterns (e.g. `'*'`, `'health'`) to include or exclude.
- **`configuration`** — Passed to the middleware (and optionally overridden per consumer under `consumers`).

Middleware is resolved from three buckets: **middleware** (root/core), **featureMiddleware** (from features), and **pluginMiddleware** (from plugins). The loader merges config, resolves class paths via `ClassResolver`, and then applies each middleware to the `MiddlewareConsumer` in sequence.

## Middleware component type

Middleware classes must follow the framework’s component type:

- **File suffix**: `.middleware.js` / `.middleware.ts`
- **Class suffix**: `Middleware`

They are discovered under directories such as `middleware`, `features`, and `plugins` depending on where they are configured. Path must still match the [path matching rules](../class-loading-hierarchy.md#path-matching-requirements) for overrides to work.

## Implementing custom middleware

1. **Extend BaseMiddleware** and implement `execute(req, res, next)` and `getClass()` (return the class so the base can read static `consumerIds` and `isAdminMiddleware`).
2. **Use dependency injection** — Constructor can inject `ConfigService`, `ModuleRef`, `CACHE_MANAGER`, `Logger`, and optional `consumerIds` / `isAdmin`.
3. **Respect consumer and routes** — Use `canMiddlewareExecute(req)` (which uses `consumerIds` and request consumer) and, if needed, route info from config.
4. **Place the file** in a directory that the loader scans (e.g. `core/middleware/`, or under a feature/plugin path) and ensure the file name matches the middleware `id` used in config (e.g. `user.profile.middleware.ts`).
5. **Register in configuration** — Add the middleware to `middleware` (root), or to a feature’s or plugin’s `middleware` array in `configuration.yaml`.

To **override** a core or feature middleware with an app-specific implementation, place your class in the same relative path under `src/apps/{appName}/` or `src/apps/global/` so `ClassResolver` picks it up.

## Related

- [Architecture](../architecture.md) — Request lifecycle and where middleware runs
- [Class Loading Hierarchy](../class-loading-hierarchy.md) — How middleware classes are resolved
- [Guards — Deep dive](guards.md) — Runs after middleware
