---
title: Guards — Deep dive
layout: default
---

# Guards — Deep dive

[← Back to Components](../components.md)

## What are Guards?

**Guards** determine whether a request is allowed to reach a controller or GraphQL resolver. They run in the NestJS pipeline **after** middleware and **before** the request handler. CatalystJS registers one or more **global guards** (via `APP_GUARD`) at startup; the primary one is the **Authorization Guard**, which enforces API access control (consumer/API key) and user authorization (identity and scopes) using metadata from the [API decorators](feature/api-decorators.md) and `configuration.yaml`.

Guards are resolved from the `guards` directory via the [class loading hierarchy](../class-loading-hierarchy.md). Each app can supply its own guard implementation (e.g. an extended `AuthorizationGuard`) by placing it in `src/apps/{appName}/guards/` or `src/apps/global/guards/` with the correct file name so that the loader picks it up instead of the default.

## Authorization Guard

The default global guard is **AuthorizationGuard**. For each request it:

1. **Gets request context** — Reads `CoreRequestContext` from the request (set by request-context middleware): `apiKey`, `consumer`, `user`, etc.
2. **Reads API metadata** — Uses NestJS `Reflector` to get:
   - **Class**: `CoreApi` (API `id`, `feature`)
   - **Handler**: `CoreApiOperation` (operation `id`, `isAuthRequired`, `suppressAPIAccessControl`, `scope`)
3. **API access control** — If the operation does not set `suppressAPIAccessControl` and the app has API access control enabled (`doAPIAccessControl`), the guard checks that the request’s API key (or consumer) is allowed in `apiAccessControl` config. If not, the request is denied.
4. **User authorization** — If the operation (or app default `doAPIUserAuthorizationByDefault`) requires user auth:
   - Calls **isUserAuthorized(requestContext, context)**. If it returns `false`, the guard throws `UnauthorizedException`.
   - Then checks **user scope**: the operation’s required `scope` (from decorator or feature config) must intersect with the user’s scopes (from **getUserScope(requestContext, context)**). If there are required scopes and the user has none of them, the request is denied.

If both checks pass, the request is allowed to proceed to the controller or resolver.

## Configuration

Relevant keys (in `configuration.yaml` or environment):

| Key | Description |
|-----|-------------|
| `doAPIAccessControl` | When `true`, API access control is enforced for operations that do not set `suppressAPIAccessControl`. |
| `doAPIUserAuthorizationByDefault` | Default for `isAuthRequired` when an operation does not set it. |
| `apiAccessControl` | Map of API key (or clientId) to `{ isEnabled }`; populated when `doAPIAccessControl` is true. |

Operation-level behavior is controlled by decorators (`suppressAPIAccessControl`, `isAuthRequired`, `scope`) and optionally by feature YAML (`operations[].acp`).

## Extending the Authorization Guard

To customize user auth or scopes, **extend** `AuthorizationGuard` and override:

- **isUserAuthorized(requestContext, context)** — Return `true` if the user is authenticated/authorized (e.g. validate token, check `requestContext.user`). Default returns `true`.
- **getUserScope(requestContext, context)** — Return the list of scope strings for the current user (e.g. from `requestContext.user.scopes` or token). Default returns a sample list.

Then ensure your guard class is the one resolved as the global guard. Place your file in `src/apps/{appName}/guards/authorization/` (or `src/apps/global/guards/...`) with the same file name pattern the loader expects (e.g. `authorization.global.guard.ts`), so that `ApplicationModuleLoader` registers it as `APP_GUARD` instead of the base guard. The loader resolves guard classes from the `guards` directory via `ClassResolver`; the first match in the hierarchy wins.

## Admin guard

The admin app can use a separate guard (e.g. **AuthorizationAdminGuard** extending **AuthorizationGuard**) with different behavior (e.g. admin-only routes). The admin application module resolves and registers its own global guard(s) from the same `guards` directory; use file naming or app-specific paths to distinguish admin vs main app guards if needed.

## Related

- [Authorization and Access Control](../authorization-and-access-control.md) — Full guard flow, configuration, and decorator reference
- [API decorators](feature/api-decorators.md) — How controllers/resolvers expose metadata to the guard
- [Architecture](../architecture.md) — Request lifecycle (middleware → guard → handler)
- [Middleware — Deep dive](middleware.md) — Builds request context used by the guard
