---
title: Feature — Deep dive
layout: default
---

# Feature — Deep dive

[← Back to Components](../../components.md)

## What is a Feature?

A **feature** is the primary unit of business capability in CatalystJS. It is a NestJS module that groups:

- **Controllers** — REST endpoints (using `@Controller` and operation decorators)
- **Resolvers** — GraphQL queries, mutations, and subscriptions (using `@Resolver` and operation decorators)
- **Services** — Business logic, injectable across the feature
- **Models, parameters, API configuration** — Shared DTOs and decorator metadata
- **Optional plugins** — One or more plugin modules that provide implementations (e.g. REST client, database)

A feature can have **multiple** controllers, resolvers, and models (e.g. `user.controller.ts`, `user-admin.controller.ts`, `user.resolver.ts`, `user-admin.resolver.ts`, plus several `*.model.ts` files). The framework discovers all matching files under the feature directory by type and registers them with the feature module.

Features are enabled and configured in `configuration.yaml` under `features`. They can be nested into **feature groups** (e.g. a `tutorial` group containing `user`, `pet`, `pharmacy`). Each feature is discovered at startup via the [class loading hierarchy](../../class-loading-hierarchy.md) and assembled by `ApplicationModuleLoader`.

## Feature component types

The framework resolves these component types for each feature (file suffixes and class name suffixes must match the [file naming rules](../../class-loading-hierarchy.md#file-naming-rules)). **Multiple** resolvers, controllers, and models can exist for a single feature—any file under the feature path that matches the suffix (e.g. `*.controller.ts`, `*.resolver.ts`, `*.model.ts`) is loaded.

| Type | File suffix | Class suffix | Purpose |
|------|-------------|--------------|---------|
| Module | `.module.ts` | `Module` | NestJS feature module |
| Model | `.model.ts` | `Model` | Data models / DTOs |
| Parameters | `.parameters.ts` | `Parameters` | Request parameter definitions |
| API configuration | `.api.configuration.ts` | `ApiConfiguration` | Shared API decorator options |
| Service | `.service.ts` | `Service` | Business logic contract |
| Controller | `.controller.ts` | `Controller` | REST API |
| Resolver | `.resolver.ts` | `Resolver` | GraphQL API |
| Subscription PubSub | `.subscription.pubsub.ts` | `SubscriptionPubSub` | GraphQL subscriptions |
| Error | `.error.ts` | `Error` | Custom errors |

## Configuration

Features are declared in the app `configuration.yaml`:

```yaml
features:
  - id: user
    enabled: true
    plugins:
      - id: my-plugin
        consumers:
          - id: site-1
  - id: health
    enabled: true
    standalone: true
```

- **`id`** — Feature identifier; used to resolve the feature module (e.g. `**/features/**/user.module.js`).
- **`enabled`** — When `false`, the feature is not loaded.
- **`standalone`** — When `true`, the feature has no plugins (e.g. health check).
- **`plugins`** — List of plugin IDs (and optional consumer bindings) that provide implementations for this feature.

Feature groups allow nesting:

```yaml
features:
  - id: tutorial
    isGroup: true
    features:
      - id: user
        enabled: true
        plugins: [...]
      - id: pet
        enabled: true
        plugins: [...]
```

## API configuration and decorators

Features use two key components for defining APIs:

- **[API Configuration](api-configuration.md)** (`*.api.configuration.ts`) — Defines operation metadata (ids, descriptions, auth, REST/GraphQL options) shared by controllers and resolvers.
- **[API Decorators](api-decorators.md)** — Custom decorators (`@Controller`, `@Resolver`, `@Get`, `@Post`, `@Query`, `@Mutation`, `@Field`, etc.) that extend NestJS decorators with framework behavior (authorization guard metadata, unified REST + GraphQL options).

**Best practice**: Define operations in your API configuration class with both `restOptions` and `queryOptions`/`mutationOptions`, then reference them in decorators (e.g. `@Get(UserApiConfiguration.users().restOptions, feature)` for REST, `@Query(() => UserResultSet, UserApiConfiguration.users().queryOptions, feature)` for GraphQL). This ensures REST and GraphQL operations share the same `id`, `description`, `isAuthRequired`, and `scope` for consistent authorization and documentation.


## Directory structure

Feature files must follow the [path matching rules](../../class-loading-hierarchy.md#path-matching-requirements). Standard layout (one of each type is common; you can add more controllers, resolvers, or models as needed):

```
features/
  {feature-id}/
    {feature-id}.module.ts
    {feature-id}.model.ts          # optional: additional {feature-id}.*.model.ts files
    {feature-id}.parameters.ts
    {feature-id}.api.configuration.ts
    {feature-id}.service.ts
    {feature-id}.controller.ts     # optional: additional {feature-id}.*.controller.ts files
    {feature-id}.resolver.ts       # optional: additional {feature-id}.*.resolver.ts files
    {feature-id}.error.ts
```

Example: `core-modules/features/user/user.module.ts`, `user.service.ts`, `user.controller.ts`, `user.resolver.ts`. For a larger feature you might add `user-admin.controller.ts`, `user-admin.resolver.ts`, and multiple models (e.g. `user.model.ts`, `user-profile.model.ts`).

## How features are loaded

1. **Configuration** — `ConfigurationLoader` reads `configuration.yaml` and builds the feature tree (including groups and plugins).
2. **Resolution** — `ApplicationModuleLoader.resolveFeatureModules()` runs for each enabled feature. It uses `ClassResolver.resolveClassPaths()` with pattern `**/features/**/{featureId}.module.js` (and app name) to find the feature module class.
3. **Import** — The resolved module file is dynamically imported.
4. **Initialization** — The feature module's `forRootAsync(configuration, featureModuleData, moduleClass)` is called (e.g. `BaseFeatureModule.initializeModule()`). This resolves controllers, resolvers, services, and subscription pub/sub via `ClassResolver`, then returns a NestJS `DynamicModule`.
5. **Registration** — The returned module is added to the application's `imports` and thus registered with NestJS.

## Extending or overriding a feature

- **New feature**: Add a new feature directory under `core-modules/features/{id}/` or `src/core-staging/features/{id}/` with the required files and register it in `configuration.yaml`.
- **Override a class**: Place a file with the **same relative path** and **same file name** under `src/apps/{appName}/features/{id}/` or `src/apps/global/features/{id}/`. For example, to override the user service, add `src/apps/my-app/features/user/user.service.ts`. The class loading hierarchy ensures the app or global version is used.

See [Class Loading Hierarchy](../../class-loading-hierarchy.md) and [Path Matching Requirements](../../class-loading-hierarchy.md#path-matching-requirements).

## Testing

The framework provides test harnesses for feature **resolvers** and **controllers**, so you can unit-test GraphQL and REST operations with a configured service and request context. Tests extend base harness classes, supply a `FeatureTestConfig`, and optionally override the resolved service or mocks. For a more in-depth overview—including which components are covered, harness structure, and usage—see [Feature component testing](testing.md).

## Related

- [Plugin — Deep dive](../plugin/plugin.md) — Features use plugins for implementations
- [Architecture](../../architecture.md) — How the application module is assembled
- [Authorization and Access Control](../../authorization-and-access-control.md) — Operation-level auth and scopes
