---
name: create-middleware
description: Guides creation of NestJS middleware extending BaseMiddleware. Use when the user asks to create middleware, add request middleware, or implement a new middleware class. Ensures correct base class usage, loader configuration, and setup.configuration.yaml (and optional app configuration.yaml) snippets.
---

# Create Middleware

This skill guides creation of middleware that integrates with the Cerebrum middleware loader. Middleware extends `BaseMiddleware`, is discovered by file/class naming, and is configured via `configuration.yaml`.

## When to use this skill

- User asks to **create middleware**, **add middleware**, or **implement** request middleware.
- User wants a new middleware class that runs on certain routes or consumers.
- User asks for **feature middleware** or **middleware for feature X** (e.g. "middleware for feature commerce/ec-user") → treat as **feature middleware** (see Feature middleware section).

## Base class (BaseMiddleware)

**Source:** `core/foundation/middleware/base.middleware.ts`

- **Abstract (required in child):**
  - `protected abstract execute(req: any, res: any, next: (error?: any) => void)` — your logic; call `next()` when done.
  - `protected abstract getClass(): typeof BaseMiddleware` — return the concrete class (e.g. `return MyMiddleware`).

- **Provided by base (use in child):**
  - `use(req, res, next)` — calls `canMiddlewareExecute(req)`; if true runs `execute(req, res, next)`, else `next()`. Do not override unless needed.
  - `canMiddlewareExecute(req)` — runs only when request consumer is in the middleware’s `consumerIds` or when `isAdminMiddleware` is true.
  - `getRequestContext(req)` → `RequestContext`.
  - `getConsumerMiddlewareConfiguration<T>(consumerId: string)` → per-consumer config (merge of root config + consumer config).
  - `getService<T>(requestContext, ServiceClass)` — resolve feature/plugin service by consumer.

- **Constructor (injected):** `ConfigService`, `ModuleRef`, `CACHE_MANAGER`, `Logger`. The loader attaches to the class: `consumerIds`, `id`, `consumerConfiguration`.

## Loader behavior (middleware.loader.ts)

- **File:** `**/*.middleware.ts` (or `.js` at runtime). **Class:** export whose name ends with `Middleware`.
- **Resolution order:** 1) **feature** middleware (`directoryName: "features"`), 2) **plugin** middleware (`"plugins"`), 3) **root** middleware (`"middleware"`). Then all are **sorted by `sequence`** (lower runs first). Core middleware (e.g. request.context, access-logging) use sequence 1, 2; config-derived entries get sequence ≥ 100 if not set.
- **Middleware id:** Derived from file path/name (e.g. `user.profile.middleware` for a file under a feature). Consumer-specific overrides use ids like `consumerId.user.profile.middleware`; base config can be under the non-prefixed id.
- **Application:** `forRoutes` (default `['*']`), `excludeRoutes` (health route is always excluded). Applied via Nest `MiddlewareConsumer.apply(classDef).exclude(...).forRoutes(...)`.

## Configuration shape

From `core/foundation/configuration/types/configuration.types.ts`:

- **MiddlewareConfiguration:** `id`, `enabled`, `sequence`, `configuration` (shared), `consumers` (optional; each: `id`, `configuration`), `forRoutes`, `excludeRoutes`.
- **MiddlewareConfigurationConfig:** arbitrary key/value for your middleware (e.g. `cacheTTL`). Typed in your middleware as an interface extending `MiddlewareConfigurationConfig`.

## Deriving names from the user prompt

| Placeholder | Derivation | Example (user says "user profile middleware") |
|-------------|------------|-----------------------------------------------|
| `$MiddlewareName` | PascalCase, ends with `Middleware` | `UserProfileMiddleware` |
| `$middlewareId` | Lowercase, dotted from feature/scope + purpose + "middleware" | `user.profile.middleware` |

Use these consistently in the class name, file name (`$middlewareId.ts` → `user.profile.middleware.ts`), and in `setup.configuration.yaml` and app `configuration.yaml` (`id: $middlewareId`).

## Default location

**Where to create:** Follow the uniform rules in [Component location](../component-location/SKILL.md). The rules are the same for all component types; never create under `core/` or `core-modules/` unless the user explicitly requests it, and create `src/core-staging` if it does not exist.

- **Default:** Create new middleware under **`src/core-staging`** (e.g. `src/core-staging/middleware/` for root middleware, or under `src/core-staging/features/$featureId/` for feature middleware), unless the user explicitly asks for **`src/apps/$appId`** or **core-modules**.
- **Root middleware:** `src/core-staging/middleware/` → configured in app `configuration.yaml` under top-level `middleware:`.
- **Feature middleware:** `src/core-staging/features/$featureId/` → configured under that feature’s `middleware:` in `configuration.yaml`.
- **Plugin middleware:** under the plugin’s feature path (rooted in `src/core-staging/plugins/$pluginId/features/$featureId/` by default) → configured under that plugin’s `middleware:` in `configuration.yaml`.

## Feature middleware

When the user says **"middleware for feature X"**, **"feature middleware for X/Y"**, or similar, treat the request as **feature middleware** and follow these rules.

- **Feature path derivation:** Parse the feature from the prompt (e.g. "commerce/ec-user" → group `commerce`, feature id `ec-user`). Use:
  - **File path:** `src/core-staging/features/<group>/<featureId>/` (e.g. `src/core-staging/features/commerce/ec-user/`). For a single segment "user", use `src/core-staging/features/user/`.
  - **Config placement:** The snippet goes under **that feature’s** `middleware:` key in `configuration.yaml`. In the YAML tree: `features` → (if group) `id: <group>` → `features` → `id: <featureId>` → `middleware:`.
- **File name:** Still `$middlewareId.ts` (e.g. `text-y.middleware.ts`). The loader discovers it under the `features` directory; the config id in the feature’s `middleware:` list is `$middlewareId` (e.g. `text-y.middleware`).
- **setup.configuration.yaml for feature middleware:** Create it next to the middleware file. The snippet must be a **single list item** (one entry under the feature’s `middleware:`), not a full top-level `middleware:` block. Add a comment documenting the feature path and where to paste (e.g. "Add under feature ec-user's middleware:. Path: features → commerce → features → ec-user → middleware:").

## Middleware template

Use this pattern (based on `core-modules/features/user/user.profile.middleware.ts`). Replace `$MiddlewareName`, `$middlewareId`, and optional consumer config interface with the user’s names.

```typescript
import { MiddlewareConfigurationConfig } from '@configuration/types';
import { BaseMiddleware } from '@middleware-foundation';
import { RequestContext } from '@context/request';

export interface $MiddlewareNameConsumerConfiguration extends MiddlewareConfigurationConfig {
    // Example: cacheTTL: number;
}

export class $MiddlewareName extends BaseMiddleware {
    protected getClass() {
        return $MiddlewareName;
    }

    protected async execute(req: any, res: any, next: () => void) {
        const requestContext = this.getRequestContext(req);
        const consumerConfiguration = this.getConsumerMiddlewareConfiguration<$MiddlewareNameConsumerConfiguration>(requestContext.consumer);

        // Your logic here. Call next() when done.
        next();
    }
}
```

- **Optional:** Use `this.cacheManager`, `this.logger`, `this.getService<T>(requestContext, SomeService)` as needed.
- **Naming:** Class name must end with `Middleware`. File name must be `*.middleware.ts` (e.g. `my-feature.profile.middleware.ts` → id `my-feature.profile.middleware` in config).

## Setup and app configuration

1. **Create `setup.configuration.yaml`** next to the middleware file (same directory) with an example snippet the user can copy into their root or feature/plugin config.

2. **If the user specifies an app** (e.g. "for catalyst-cerebrum" or "add to app configuration"): **also** insert the same snippet into `src/apps/$appId/configuration.yaml` in the correct place (root `middleware:` or under the feature's/plugin's `middleware:`).

### Example `setup.configuration.yaml` (root middleware)

Place alongside the middleware file, e.g. `src/core-staging/middleware/my-feature.profile.middleware.ts` → `src/core-staging/middleware/setup.configuration.yaml`:

```yaml
# Copy this block into your app configuration.yaml under the top-level 'middleware:' key
# (or under a feature's/plugin's 'middleware:' key if this is feature/plugin middleware).
middleware:
  -
    id: $middlewareId
    enabled: true
    sequence: 100
    forRoutes:
      - '*'
    excludeRoutes: []
    configuration:
      # Example: cacheTTL: 300000
    consumers:
      -
        id: *your-consumer-id
        configuration: {}
```

Replace `$middlewareId` with the actual middleware id (e.g. `my-feature.profile.middleware`). For feature middleware, the config goes under the feature's `middleware:` in `configuration.yaml`; for plugin middleware, under the plugin's `middleware:`.

### Example `setup.configuration.yaml` (feature middleware)

Place alongside the middleware file under the feature path, e.g. `src/core-staging/features/commerce/ec-user/text-y.middleware.ts` → `src/core-staging/features/commerce/ec-user/setup.configuration.yaml`:

```yaml
# Feature middleware for <group>/<featureId> (e.g. commerce/ec-user).
# Add this under the <featureId> feature's middleware: key in configuration.yaml.
# Path: features -> id: <group> -> features -> id: <featureId> -> middleware:
  -
    id: $middlewareId
    enabled: true
    sequence: 100
    forRoutes:
      - '*'
    excludeRoutes: []
    configuration: {}
    consumers:
      -
        id: site-1
        configuration: {}
```

Use a **list item** only (the `  -` and its children). The user pastes this under the feature’s `middleware:` list. Replace `$middlewareId` and the comment placeholders with the actual feature path and feature id.

### If user specified an app

- Open `src/apps/$appId/configuration.yaml`.
- Add or merge the snippet into the root `middleware:` list, or into the appropriate feature/plugin `middleware:` entry. Preserve YAML structure and anchors (e.g. `*site-1`) used for consumer ids.

## Checklist

- [ ] New middleware class extends `BaseMiddleware`, implements `getClass()` and `execute(req, res, next)`.
- [ ] Class name ends with `Middleware`; file name is `*.middleware.ts`.
- [ ] Consumer-specific config typed (e.g. interface extending `MiddlewareConfigurationConfig`) and read via `getConsumerMiddlewareConfiguration<T>()`.
- [ ] `setup.configuration.yaml` created alongside the middleware file with the correct `id`, `sequence`, `forRoutes`, `excludeRoutes`, and example `configuration`/`consumers`.
- [ ] **If feature middleware:** Path is `src/core-staging/features/<group>/<featureId>/`; `setup.configuration.yaml` documents the feature path and provides the **list item** (one `  -` entry) for that feature’s `middleware:`, not a full top-level `middleware:` block.
- [ ] If user specified an app, the same snippet is added to `src/apps/$appId/configuration.yaml` in the correct `middleware:` section.
