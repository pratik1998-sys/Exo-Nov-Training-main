---
title: Versions
layout: default
---

# Versions

This page documents the version history of CatalystJS and the changes introduced in each version. For the design rationale and implementation detail behind a given change, see the related [Enhancement Plans](enhancements/index.md).

## Active patches {#active-patches}

`node_modules` patches applied by yarn `postinstall` (`core/package.json`). When upstream ships a fix: delete the script, remove the `postinstall` entry, and delete the row here.

| Patch | Since | Target | Why | Remove when |
|-------|-------|--------|-----|-------------|
| `core/scripts/patch-nestjs-fastify-reply.js` | 1.4.0 | `@nestjs/platform-fastify` `adapters/fastify-adapter.js` | Nest 12 does `import * as Reply from 'fastify/lib/reply.js'`. Fastify 5 is CJS, so that import is a module namespace and `new Reply()` throws `Reply is not a constructor`. The patch changes it to `import Reply from 'fastify/lib/reply.js'`. | `@nestjs/platform-fastify` uses a default import (or otherwise exports a Reply constructor) so exception filters can send HTTP errors without this script. Last checked against `12.0.1`; Nest master still had `import * as Reply`. |

## Version 1.4.0 {#v1-4-0}

### NestJS 12 and TypeScript 6

- Upgraded NestJS to 12 (`@nestjs/common`, `core`, platforms, microservices, testing, swagger, and typeorm `^12`; `@nestjs/cli` / `schematics` `^12`; `@nestjs/graphql` / `apollo` `^14`; `@nestjs/axios`, `cache-manager`, `config`, and `event-emitter` `^12`).
- TypeScript 6 (`^6.0.3`). `tsconfig.base.json` uses `ignoreDeprecations: "6.0"` and keeps `esModuleInterop` (required for CJS default imports such as `YAML.parse`).
- `useUnknownInCatchVariables: false` so existing `catch` clauses stay compatible.

### GraphQL

- GraphQL module uses `graphiql: false` (Nest 12 replaced `playground`).
- Subscriptions use `graphql-ws` only. `subscriptions-transport-ws` is no longer configured (removed in Nest 12 GraphQL). Clients on the old protocol must switch.

### HTTP server and CLI

- `nest-cli.json` uses the `tsc` builder. Asset `outDir` is `dist` because Nest CLI 12 strips asset paths from the tsconfig root, not `src`. `watchAssets` is enabled so yaml and `.env` files copy in watch mode.
- Nest 12 Fastify `Reply` constructor workaround: see [Active patches](#active-patches).

### Dependency injection

- `FeatureModuleData` is a class so Nest 12 can use it as an injection token. Feature modules provide `{ provide: FeatureModuleData, useValue: feature }`.
- `BaseMiddleware` no longer takes unused `consumerIds: string[]` / `isAdmin: boolean` constructor args (Nest 12 treated those as `Array` / `Boolean` providers). Middleware constructors inject `CACHE_MANAGER` and `LoggerKey` explicitly.

### Boot debug

- Replaced `nestjs-spelunker` with Nest's native `SerializedGraph`. Config is `appBootDebug.logSerializedGraph` (the old top-level `spelunkerEnabled` did not reach the boot check). `NestFactory.create` sets `snapshot: true` when that flag is on.

## Version 1.3.113 {#v1-3-113}

### Plugin database access

- [Database access for all plugins](enhancements/database-access-for-all-plugins.md) — entity registration and repository access moved into `BasePluginModule` / `BasePluginServiceImpl`, so any plugin (REST, GraphQL, or otherwise) can use a database. Dedicated `BaseDatabasePluginModule` / `BaseDatabasePluginServiceImpl` and the `@plugin-datasource-database` path aliases are removed.
- [Multi-database-per-plugin support](enhancements/multi-database-per-plugin.md) — `plugin.database` is replaced by `plugin.databases[]` with a `primary` flag. Entities and queries select a connection via `@PluginDatabaseConnection` or an explicit `databaseId`. How-to: [Assigning entity classes to a database](components/plugin/assigning-entities-to-databases.md).
- A single `*.entity.ts` file can export more than one `*Entity` class; class loading now registers every matching export (`classObjs`), not just the first.
- `catalyst-tutorial-saas` `configuration.yaml` uses `plugins[].databases[]` with `primary: true` as the sample.

### Datasource configuration

- [Datasource service-level configuration override](enhancements/datasource-service-level-configuration-override.md) — per-service-operation datasource config via `DATASOURCE_CONFIG_..._OVERRIDES` environment variables, so a subset of a REST/GraphQL datasource's operations can use a different host/credentials than the rest. See [Datasources](components/plugin/datasources.md#service-operation-level-configuration-overrides).

### Docker and install

- Multi-stage `Dockerfile` on UBI 10 Node.js 24; the builder stage uses `$BUILDPLATFORM` so `yarn install` runs on the host architecture (avoids OpenSSL TLS failures under linux/amd64 QEMU).
- Added `core/.dockerignore`. `generate-dockerfile` copies both `Dockerfile` and `.dockerignore` to the repo root.
- Added `yarn docker:build <app-id>` (`core/scripts/docker-build.js`) to build an image and save it as a local tar (`--no-cache`, `--pull`, `--platform`).
- `install:core` / `generate-scripts` no longer copy all core dependencies onto the root `package.json`. Root workspaces now include `core`; only required root test deps (`vitest`, `vite-tsconfig-paths`) are merged when missing; `dedupe-typeorm` runs after `yarn install`.
- TypeScript 6: `tsconfig.base.json` uses `ignoreDeprecations: "6.0"` (replacing `esModuleInterop`).

### HTTP server

- Optional `fastifyBodyLimit` on `AppConfiguration` is passed to the Fastify adapter and to binary content-type parsers.
- Fastify parsers for `application/octet-stream`, common image types, and common video types so those bodies are available as buffers.
- Auth-token cookie utilities updated for the `cookie` package API (`parseCookie` / `stringifySetCookie`). The cookie header is also read from the raw `IncomingMessage` when Fastify has not parsed it onto the request.
- Safer error handling in Nest server listen and REST/GraphQL datasource execute (`unknown`-typed catch).

### API and services

- `FieldType.json` maps GraphQL to `GraphQLJSON` (was `GraphQLJSONObject`).
- `ApiOperationDefinition` includes `scope?: string[]` so operation-level user scopes can be declared next to the other API configuration fields.
- `BasePluginServiceImpl.composeResultSetWithPagination()` builds a limit/offset `ResultSet` (page, pageSize, resultCount, pageCount, hasMorePages) from a list.

### Agentic development

- Skills and rules: do not edit `core-modules/` when extending an existing feature or plugin — use `src/apps/$appId/` or `src/core-staging/`. See [Agentic Development](agentic-development.md).
- Feature skill: every operation must be declared in `$featureId.api.configuration.ts` and wired through `@api-decorators` (not NestJS route/GraphQL decorators).
- Plugin skills updated for database-as-capability and multi-database (`@PluginDatabaseConnection`).

### Dependencies

- Updated NestJS, Apollo, Fastify (`@fastify/static` 10), TypeORM, axios, GraphQL, and related packages; added `bcrypt`; pinned `strip-ansi` via yarn `resolutions`.

## Version 1.3.112 {#v1-3-112}
- Added optional log mask list to mask logger
- Added `datasourceConfig` parameter to `addAuthTokenToHeaders(..)` in REST datasource
- Fixed circular dependency in REST datasource imports
- Enhanced REST datasource execute logging to apply configured mask fields to query params and headers
- Added `.npmrc` file to enforce rules to protect from supply chain attacks (`min-release-age`, `ignore-scripts`, `save-exact`); `install-core` copies it to the project root
- Pinned `axios` and `@nestjs/axios` to exact versions
- Added HTTP-only auth token cookie support for REST and GraphQL authentication responses (`AuthTokenCookiePlugin`, `AuthTokenCookieInterceptor`, cookie utilities)
- Registered `@fastify/cookie` and bridged parsed cookies to raw `IncomingMessage` so middleware can read them reliably
- `RequestContextMiddleware` reads auth token from cookie as a fallback to the Authorization header
- Fixed admin datasource PUT endpoint to update a single datasource service by id (`datasourceServiceUpdate`)
- Moved admin datasource, messenger, and registry plugin implementations from native to catalyst plugin
- Admin app enabled by default in configuration loader
- Added **article** feature with GraphQL/REST list and get-by-id operations
- Added **catalyst** core-modules plugin with configuration/static-data implementations for article, region, notification, and navigation
- Added **logout** operation to authenticate feature (REST + GraphQL) to clear the auth token cookie

## Version 1.3.111 {#v1-3-111}
- Added additional agent skills
- Enhanced doc generator script to aggregate "common" docs across the extension hierarchy

## Version 1.3.110 {#v1-3-110}
- Fixed TS path resolution in testing *.spec.ts files
- Initial version of agentic skills, both Cursor and Github Copilot. Common directory for skills, IDE specific skills reference those.
- Bundled in ./core, and "installed" to project root via ```yarn install:core```

## Version 1.3.100 {#v1-3-100}

- Added initial automated test support for **features** (resolvers and controllers) and **plugins** (service, datasource, and mapper) using [Vitest](https://vitest.dev/) and the NestJS [@nestjs/testing](https://docs.nestjs.com/fundamentals/testing) package. Test harnesses and base classes allow unit testing of GraphQL/REST operations and plugin implementations with configurable dependencies and mocks.

## Version 1.3.000 {#v1-3-000}

- Decoupled the underlying framework foundation and engine from "EXO" to align its use cases with what is possible within the code itself. This was largely renaming of variables, classes, and configuration
- Introduced the core-modules directory for drag and drop of "official" packages (features, plugins, middleware, databases, etc) which allows a pure core directory that can be packaged, dragged, and dropped, without affecting any implementation code within the project
- Moved core-staging directory to src directory to signify "this is where to code vanilla components for core-modules packaging candidates
- Moved core project configuration files into the core directory (ie package.json, tsconfig.json, etc) and created scripts to copy/merge into project root
- Created scripts to "install" plugins/features, where a plugin/feature should have a corresponding setup.configuration.yaml file that has the yaml snippet to be copied into the app configuration.yaml, setup.env with example .env entries for required configuration, and tsconfig.paths.json for the yarn generate:tsconfig script (which gets called via yarn build) to copy the tsconfig path aliases to the project tsconfig.json file.

## Version 1.2.010 {#v1-2-010}

- Reworked the custom decorators for API (REST and Graphql) and Properties:
  - Added ability for developers to pass along underlying decorator native options instead of severely limiting the options
  - Added types for REST and Graphql type "mismatches" to reference instead of duplicating everywhere (ex REST "integer" vs GraphQL Int)
- Added base API configuration "best practice" where these decorator options are defined in the same class, and referenced accordingly in the resolvers and controllers, ensuring ease of uniformity of descriptions, and other common decorator options (ex disabling service level auth check)
- Added user scope level authorization check. If scopes are defined in a controller/resolver operation decorator, or if defined in the feature operation configuration in configuration.yaml, and if authorization check is enabled, the user scopes will be checked in the authorization guard
- Refactored ClassResolver to be more dynamic on the directories it processes

## Version 1.2.004 {#v1-2-004}

- Added logging around configuration environment variable override, and fixed issue where API Access Control is enabled, but no API Access Control definition in the environment variables

## Version 1.2.003 {#v1-2-003}

- Added ability to override configuration values from configuration.yaml with environment variables
- Fixed issue with API Access Control and Paths that have core middleware disabled (ie /health)

## Version 1.2.002 {#v1-2-002}

- Added ASCII graphic to server startup
- Fixed URL_BASE_PATH not being bound to configuration on startup
- Parameterized app start script in package.json
  - New start command is `yarn start $appId [--local]`
  - Environment (dev/qa/prod etc) start should not include --local flag

## Version 1.2.001 {#v1-2-001}

- Added notification feature
