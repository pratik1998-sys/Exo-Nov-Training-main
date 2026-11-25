---
name: plugin
description: Guides creation of plugins and database plugins. Use when the user asks to create a new plugin, implement a feature with a datasource (REST, GraphQL, or database), or add a database-backed plugin. Run as one of two parallel agents with feature/extension when both plugin and feature are needed and there are no dependencies between the two (launch a second agent for the Feature skill).
---

# Plugin

**STOP — REST/GraphQL datasource:** If the user asked to create a **new plugin** or a **new plugin feature** that will use a **REST or GraphQL** datasource, your **first reply must be** to ask for the **API source** (REST: OpenAPI path/URL or system documentation URL; GraphQL: system documentation URL or GraphQL endpoint for introspection). Do **not** create any schema, serviceDefinitions, or datasource files until the user has (1) provided that source, (2) received from you the operation list in a **markdown table with row numbers**, and (3) selected which operations to implement. There are no exceptions (existing plugin, known vendor API, or "obvious" operations). See "REST/GraphQL API discovery" below and [rest-plugin.md](rest-plugin.md) / [graphql-datasource.md](graphql-datasource.md).

**First action — no exploration before prompt:** When the user asks to create a **new plugin** or a **new plugin feature** (e.g. "create plugin feature X for plugin Y") that will use a REST or GraphQL datasource, you **must not** search the codebase, read existing plugin/feature files, or plan implementation **before** sending your first reply. Your **first reply** in the thread must **only** ask for the API source (REST: OpenAPI path/URL or system documentation URL; GraphQL: system documentation URL or GraphQL endpoint for introspection). Do not run codebase search, read_file, or similar tools for the plugin or feature until after the user has provided that source and selected operations. Treat "new plugin feature" / "add feature to plugin X" as a trigger: respond with the API-source prompt first; exploration and implementation come after discovery is complete. "First reply" means the very next message the user sees from you in this conversation must be the API-source question; no prior message may describe implementation steps, file paths, or create/edit any files.

## Mandatory gate: REST/GraphQL plugin or plugin feature

**Before running any other tool or writing any code**, determine: Is the user asking to create a **new plugin** or a **new plugin feature** that will use a **REST or GraphQL** datasource?

- **If yes:** Your **next message to the user** must be **only** the API-source prompt below. You **must not** before that message:
  - run codebase_search, read_file, grep, or list_dir for the plugin or feature;
  - create or edit any file (schema, datasource, mapper, service, module);
  - describe an implementation plan or file paths.
- **If no** (e.g. database-only plugin, or wiring only): Proceed with the rest of this skill.

**API-source prompt to send (adapt REST vs GraphQL as needed):**  
*"To implement this REST plugin feature I need the API definition. How would you like to provide it? (1) OpenAPI file — local path, (2) OpenAPI file — remote URL, or (3) System documentation URL. Once you provide the source I'll list the available operations in a table so you can choose which ones to implement."*  
For GraphQL: *"To implement this GraphQL plugin feature I need the API source. Please provide either a GraphQL endpoint URL (for introspection) or a system documentation URL. Once you provide it I'll list queries and mutations so you can choose which to implement."*

**Invalid reasons to skip this prompt (do not skip for these):**
- Other code in the repo already imports from this plugin feature (e.g. ec-authenticate imports ec-user).
- The backend is a well-known vendor (Commercetools, Stripe, Adobe Commerce, etc.).
- Other features in the same plugin already use the same API.
- The feature contract or existing types "imply" which operations are needed.
- You want to "fix" broken imports or make the project compile first.

Do not skip the API-source prompt for common well-known vendors or any other backend; treat every new REST/GraphQL plugin or plugin feature as requiring API discovery and operation selection.

**Common well-known vendors:** Still require the API-source prompt and operation selection; do not implement from prior knowledge of the API.

Plugins provide implementations for a feature (e.g. REST client, GraphQL client, or database-backed implementation). A feature declares one or more plugins in configuration; each plugin is a NestJS module that contributes services, datasources, mappers, and optionally entities. Plugins support multiple consumers and variants.

## When to use this skill

- Creating a **new plugin** (core or app-specific).
- Implementing a **database plugin** that backs a feature with TypeORM entities and a database.
- Wiring a plugin to a feature in `configuration.yaml` and defining `setup.configuration.yaml` / `setup.env`.

## Plugin type (required when creating a new plugin)

When **creating a new plugin**, the implementation differs by backend: **database** (TypeORM entities, repository, base in [database-plugin.md](database-plugin.md)) or **REST/GraphQL** (datasource calling external API, base in [rest-plugin.md](rest-plugin.md)).

**If the user has not specified whether the plugin is database-backed or REST/GraphQL-backed, prompt them to choose before proceeding.** For example: *"Should this plugin be backed by a database (e.g. PostgreSQL with TypeORM) or by a REST/GraphQL API? Please specify so I can generate the correct structure and files."* Do not assume or guess; ask once and then follow the chosen type (database → database-plugin.md; REST → rest-plugin.md; GraphQL → same as REST for module/datasource pattern). All plugin types extend the same **`BasePluginModule`** — database entity registration is built in and activates automatically when entities and `databases` are configured, so there is no separate database module base class. A plugin can declare more than one database connection under `databases`; entities register on the connection named by their `@PluginDatabaseConnection` decorator (from `@plugin/database`), or the plugin's primary connection when undecorated. See [database-plugin.md](database-plugin.md).

**When creating plugin feature datasources** (base or feature-specific), if the plugin is API-backed, determine REST vs GraphQL as follows. **If the plugin already has a common base datasource:** infer from that base class — if it extends **BaseGraphqlDatasource**, assume the new feature datasource is **GraphQL** unless the user explicitly specifies REST; if it extends **BaseRestDatasource**, assume the new feature datasource is **REST** unless the user explicitly specifies GraphQL. **If there is no common base datasource** (or no base class for this plugin), and the user has **not** specified REST vs GraphQL, prompt them to choose. For example: *"Should this plugin's datasource call a REST API or a GraphQL API? Please specify so I can create the correct base and feature datasource classes (BaseRestDatasource vs BaseGraphqlDatasource)."* Use [rest-plugin.md](rest-plugin.md) for REST; use [graphql-datasource.md](graphql-datasource.md) for GraphQL.

**No prior known API (REST/GraphQL datasource):** When creating or adding a **REST or GraphQL datasource** (new plugin or new feature on an existing plugin), **there is no prior known API.** Do not assume the API is known because the plugin already exists, because the backend is a well-known vendor (e.g. Commercetools, Stripe), or because other features in the same plugin use that backend. The only source of operations is the **user-provided API source** and the **user's operation selection.** Always run the full API discovery flow; never infer paths, methods, or types from existing plugin code or general API knowledge.

**Your first reply when creating or adding a REST/GraphQL plugin or plugin feature must be to ask for the API source.** Do not create any plugin or feature files (including schema or datasource) until the user has provided the API source and selected operations.

**REST/GraphQL API discovery (required — do not skip):** When creating a **new plugin** or a **new feature on an existing plugin** that uses a REST or GraphQL datasource, you **must not** write any datasource code (serviceDefinitions, paths, HTTP methods, request/response types, or schema types) until you have completed the API discovery flow. **Do not infer operations from other features in the same plugin or from general API knowledge.** For REST: follow [rest-plugin.md](rest-plugin.md) "API discovery and selection" — (1) **first message:** prompt the user to choose API source (OpenAPI local path, OpenAPI URL, or system documentation URL); (2) obtain the operation list from that source; (3) present the list **in a markdown table with row numbers** (see rest-plugin.md / graphql-datasource.md "Presenting the operation list") and **ask the user to select which operations** the datasource should implement (by row number or range); (4) only then define serviceDefinitions and methods from the **user-selected** operations. For GraphQL: follow [graphql-datasource.md](graphql-datasource.md) equivalent flow. If you have already written datasource code before completing discovery, you have made an error; treat discovery as a **mandatory gate** before any implementation. **Writing paths, methods, serviceDefinitions, or schema types before sending the API-source prompt is not allowed.**

**First action for REST/GraphQL datasource (no exceptions):** Whenever you are about to create or add a **REST** or **GraphQL** feature datasource (new plugin or new feature on an existing plugin), your **first response to the user in that thread must be** to ask for the **API source** (OpenAPI path/URL or system documentation URL). You must not create any new files (schema, datasource, serviceDefinitions, paths, or methods) until the user has (1) provided the API source, (2) received the operation list from you, and (3) selected which operations to implement. Treat the API as unknown in all cases — same plugin, same vendor (e.g. Commercetools, Stripe), or "obvious" operations are not exceptions. Do not infer paths or operations from existing feature datasources in the same plugin or from vendor documentation; the only valid source is the user-provided API source and the user's operation selection. If you have already written datasource or schema code before sending the API-source prompt, you have made an error.

**Pre-implementation checklist for any REST/GraphQL datasource (mandatory gate):**  
Before writing **any** schema, datasource, mapper, or service file for a REST/GraphQL plugin feature, **all** of the following must be true. If any is false, do **not** create or edit any such file; send the API-source prompt (or operation-selection prompt) instead. Do not skip the prompt for any of the reasons listed under "Invalid reasons to skip" in "Mandatory gate: REST/GraphQL plugin or plugin feature" above.

- [ ] My **first reply** in this thread was a message that asks for the API source (REST: OpenAPI path/URL or system documentation URL; GraphQL: system documentation URL or GraphQL endpoint for introspection). I did not create any files or code before that reply.
- [ ] I have sent the user a message that asks for the API source (REST: OpenAPI path/URL or system documentation URL; GraphQL: system documentation URL or GraphQL endpoint for introspection).
- [ ] The user has provided that source.
- [ ] I have obtained the operation list and sent it to the user **in a markdown table with row numbers** (see rest-plugin.md or graphql-datasource.md "Presenting the operation list").
- [ ] I have asked the user to select which operations (queries/mutations) the datasource should implement (by row number or range).
- [ ] The user has selected which operations the datasource should implement.
- [ ] **ALWAYS:** New plugin/plugin feature path is `src/core-staging/...`. I am NOT using `core-modules/` unless the user explicitly said "core-modules" or "in core-modules". (App path `src/apps/$appId` only when user explicitly said so.)
- [ ] I have determined the plugin feature root path: it is `src/core-staging/plugins/$pluginId/features/$featureId` (not under `core-modules`) unless the user explicitly requested core-modules. If the path would start with `core-modules/`, I am using `src/core-staging/...` instead.
- [ ] I am **not** creating any file under `core-modules/` unless the user **explicitly** requested "create in core-modules" (or equivalent). If I was about to use core-modules only to fix existing imports, I have switched to `src/core-staging` and will fix resolution separately.
- [ ] I have not yet written any serviceDefinitions, paths, HTTP methods, or schema types for this datasource.

If any item is unchecked, do not write datasource or schema code; send the appropriate prompt or wait for the user's selection.

**Adding a feature to an existing plugin ("add another feature to plugin X"):** Same as above — treat it as creating a new feature datasource. There is no prior known API for the new feature's datasource. Your **first message** must prompt for the API source (GraphQL: endpoint for introspection or system documentation URL; REST: OpenAPI path/URL or system documentation URL). Do not write any schema, serviceDefinitions, or datasource code until the user has provided that source and selected which operations to implement. You **must** run the full API discovery and selection flow (prompt for API source, obtain operation list, ask user to select operations) before writing any datasource code. Do not infer operations from other features in that plugin or from general API knowledge.

**New plugin feature (e.g. "create plugin feature ec-user for adobe-commerce"):** Same as above — your **first reply** must ask for the API source. Do not implement the feature datasource (including schema and datasource methods) until the user has provided that source and selected operations. Do not assume the API is known because the plugin or vendor (e.g. Adobe Commerce) is known.

## Parallel execution (required)

When the user asks to create **both** a plugin **and** a feature (or feature extension), you **must** run the Plugin skill in parallel with the Feature/Extension skill by launching a second agent via the task/agent tool (e.g. `mcp_task`). Do **not** implement both plugin and feature in a single agent. Launch the Plugin agent and the Feature/Extension agent in parallel; there are no dependencies between them when using the derivation rules.

## Using this skill without project code

**Do not reference project code.** Use only the templates in this skill (and database-plugin.md when applicable) and data derived from the user prompt. The plugin implements a **feature contract** (service interface, errors, parameter names). That contract is defined by the Feature skill; use the same derivation rules (see Feature SKILL "Deriving specific code from the user prompt") so that the plugin's service method names, error class/methods, and types match the feature. If the feature uses plural-resource naming (e.g. getUsers, getUser, UserErrors.getUserFailed), the plugin service must implement getUsers, getUser and throw UserErrors.getUserFailed(); if the feature uses generic naming (getItems, getItem, $FeatureErrors.getFailed), use that. Derive all names from the user prompt and the Feature skill; do not look at existing project code.

## Deriving specific code from the user prompt

- **`$pluginId`** — Plugin id from the user prompt (e.g. "user-db" → `user-db`, "my-db" → `my-db`). Use lowercase, hyphenated.
- **`$featureId`**, **`$FeatureName`** — Same as in the Feature skill: the feature this plugin implements. From the user prompt (e.g. "plugin for user feature" → featureId `user`, FeatureName `User`).
- **Feature contract** — The plugin service implements the feature's abstract service. Use the **exact same** method names and error contract as the feature. If the feature was created with plural-resource naming (getUsers, getUser, createUser, updateUser, deleteUser, UserErrors.getUserFailed(), etc.), the plugin service and mapper must use: getUsers, getUser, createUser, updateUser, deleteUser; mapUserResultSet, mapUser; getUserMapper, getUserRepository (or get$FeatureNameRepository). If the feature uses generic naming (getItems, getItem, …), use getItems, getItem, map$FeatureNameResultSet, map$FeatureName, get$FeatureNameRepository. Choose based on what the user asked for (e.g. "user profile plugin" → User feature → plural-resource). When in doubt, use plural-resource for domain resources (user, pet, order).
- **Datasource naming (REST/GraphQL only):** The **datasource** layer (service definition `id`, interface property names, and **method names**) must use the **backend API's operation and resource names** from the chosen API (e.g. Commercetools Customers API → `queryCustomers`, `getCustomerById`, `createCustomer`), **not** the feature id (e.g. `getEcUsers`, `getEcUser`, `createEcUser`). The **plugin service** implements the feature contract (e.g. `getEcUsers`, `getEcUser`) and calls the datasource's backend-named methods (e.g. `queryCustomers`, `getCustomerById`). See [rest-plugin.md](rest-plugin.md) "Datasource naming: align to the backend system".
- **Mapper method names** — Match the feature model: map$FeatureNameResultSet and map$FeatureName (e.g. mapUserResultSet, mapUser).
- **Repository getter** — get$FeatureNameRepository() (e.g. getUserRepository) or the equivalent in the template; entity class name follows DB$PluginId$FeatureNameEntity (e.g. UserDbUserEntity for plugin user-db, feature user).

## Deriving plugin component patterns

Use these patterns so structure and naming do not require project code. Substitute placeholders from the derivation rules above and match the **feature contract** (method names, errors, types) from the Feature skill.

| Component | File name / path | Class / export name | Key patterns |
|-----------|------------------|---------------------|--------------|
| **Service** | `features/$featureId/$pluginId.$featureId.service.ts` | Database: `DB$PluginId$FeatureNameServiceImpl`. REST/GraphQL: `$PluginId$FeatureNameServiceImpl` (or same with DB prefix if convention used). | Extends plugin base service from `common/` when present; otherwise extends framework base directly — `BasePluginServiceImpl` (DB-only) or `BaseDatasourcePluginServiceImpl` (REST/GraphQL; also has `getRepository`/`getDatabaseConnection` since it extends `BasePluginServiceImpl`). Implements `$FeatureNameService`. Methods match feature; protected helpers: `getMapper(requestContext)`, for DB `get$FeatureNameRepository()`, for REST/GraphQL `getDatasource()` as needed. |
| **Mapper** | `features/$featureId/$pluginId.$featureId.mapper.ts` | `DB$PluginId$FeatureNameMapper` (or `$PluginId$FeatureNameMapper` for non-DB). | Extends plugin base mapper from `common/` when present; otherwise extends `BaseMapper`. Methods: `map$FeatureNameResultSet`, `map$FeatureName`; use `this.composePagination(limit, offset, count)` for result set. |
| **Datasource** | `features/$featureId/$pluginId.$featureId.datasource.ts` (if REST/GraphQL); base: `common/$pluginId.base.datasource.ts` | `$PluginId$FeatureNameDatasource`; base: `$PluginIdBaseDatasource`. | Extends plugin base from `common/` when present; else framework base. REST: [rest-plugin.md](rest-plugin.md). GraphQL: [graphql-datasource.md](graphql-datasource.md) (schema in `features/$featureId/schema/$pluginId.$featureId.schema.ts`). |
| **Entity** | `features/$featureId/entities/$pluginId.$featureId.entity.ts` | `DB$PluginId$FeatureNameEntity` | Database plugins only. `@Entity({ name: '$table_name', schema: '$schema_name' })`. Columns with explicit `type`, `length` (varchar), `nullable`. See [database-plugin.md](database-plugin.md). |
| **Module** | `features/$featureId/$pluginId.$featureId.module.ts` | `DB$PluginId$FeatureNameModule` (or `$PluginId$FeatureNameModule`) | Extend `BasePluginModule` (from `@plugin/module`) — for **all** plugin types (REST, GraphQL, and database). It discovers and registers this feature's entities automatically when they exist and `databases` is configured; no separate database module base class is needed. Registers feature implementation for the plugin. |
| **Base mapper** | `common/$pluginId.base.mapper.ts` (REST/GraphQL); `common/db-$pluginId.base.mapper.ts` (DB) | `$PluginIdBaseMapper` (or `DB$PluginIdBaseMapper` for DB) | Extends `BaseMapper`. Shared helpers (e.g. `mapPagination`). Feature mappers extend this when plugin has `common/`. |
| **Base service** | `common/$pluginId.base.service.ts` (REST/GraphQL); `common/db-$pluginId.base.service.ts` (DB) | `$PluginIdBaseServiceImpl` (or `DB$PluginIdBaseServiceImpl` for DB) | Extends `BaseDatasourcePluginServiceImpl` (REST/GraphQL) or `BasePluginServiceImpl` directly (DB-only). Shared logic (e.g. `composeQuery`). Feature services extend this when plugin has `common/`. |
| **Base datasource** | `common/$pluginId.base.datasource.ts` (REST/GraphQL only) | `$PluginIdBaseDatasource` | Extends `BaseRestDatasource` or `BaseGraphqlDatasource`. Feature datasources extend this when plugin has `common/`. |

**Index:** In `features/$featureId/index.ts` export entity, mapper, service, module (and datasource if present).

## Base classes and common directory (required for new plugins)

**When creating a new plugin:** You **must** create a **`common/`** directory at the plugin root and add **base classes** there. Feature-specific implementations (mapper, service, and for REST/GraphQL the datasource) **extend** these base classes; they do not extend framework base classes directly.

- **Base datasource** (REST/GraphQL only): `common/$pluginId.base.datasource.ts` — extends `BaseRestDatasource` or `BaseGraphqlDatasource`. Feature datasources extend this class.
- **Base mapper:** `common/$pluginId.base.mapper.ts` (REST/GraphQL) or `common/db-$pluginId.base.mapper.ts` (database) — extends `BaseMapper`. Shared mapping helpers (e.g. pagination, thumbnail). Feature mappers extend this class.
- **Base service:** `common/$pluginId.base.service.ts` (REST/GraphQL) or `common/db-$pluginId.base.service.ts` (database) — extends `BaseDatasourcePluginServiceImpl` (REST/GraphQL) or `BasePluginServiceImpl` directly (DB-only, no external datasource). Shared logic (e.g. `composeQuery`). Feature services extend this class.

Feature-specific classes **must extend** the corresponding plugin base class when the plugin has `common/` with that base. Do not have feature classes extend the framework base (e.g. `BaseMapper`, `BaseRestDatasource`) when a plugin base exists.

**Reference:** `core-modules/plugins/tutorial-pet-rest` — `common/` contains `tutorial-pet-rest.base.datasource.ts`, `tutorial-pet-rest.base.mapper.ts`, `tutorial-pet-rest.base.service.ts`, and optional config/schema; `features/pet/` (and other features) contain classes that extend these bases.

**When the plugin already exists and has no `common/` directory (or no base class for a given component):** Do not invent a plugin base. Have the feature class extend the **framework** base class (e.g. `BaseMapper`, `BaseDatasourcePluginServiceImpl`, `BaseRestDatasource`, `BaseGraphqlDatasource`), since there is no plugin-specific base to extend.

## Plugin location

**Where to create:** **ALWAYS use ./src/core-staging for new plugins and plugin features.** Only use core-modules/ or core/ when the user explicitly requests it; only use src/apps/$appId when the user explicitly requests the app. Follow the uniform rules in [Component location](../component-location/SKILL.md). The rules are the same for all component types; never create under `core/` or `core-modules/` unless the user explicitly requests it, and create `src/core-staging` if it does not exist.

- **Default (always, unless user explicitly says otherwise):** Create new plugins under **`src/core-staging/plugins/$pluginId/`**. **New features added to an existing plugin** go under **`src/core-staging/plugins/$pluginId/features/$featureId/`**. **Create the directory `src/core-staging` (and any needed parent or child directories) if it does not exist.**
- **Pre-implementation check (required):** Before creating the *first* plugin or plugin feature file, state the root path you are using (e.g. `src/core-staging/plugins/commercetools/features/ec-user`). If that path would be under `core/` or `core-modules/`, use `src/core-staging/...` instead unless the user explicitly said "in core" or "in core-modules".
- **Only when user explicitly states:** Create under **`src/apps/$appId/plugins/$pluginId/`** when the user explicitly says to create in the app or a specific app.
- **Only when user explicitly states:** Create under **`core/plugins/$pluginId/`** or **`core-modules/plugins/$pluginId/`** only when the user explicitly says to create in core or core-modules.

## Plugin structure (generic)

| Path | Purpose |
|------|--------|
| `setup.configuration.yaml` | Plugin id, tokenId, and (for DB plugins) `databases` (array of `{ id, primary, configuration, consumers }`). **Must be created** with example YAML; for database plugins, include an example database configuration snippet. |
| `setup.env` | Example env vars for the datasource (e.g. DB host, port, user). **Must be created**; for database plugins this is the database connection configuration. |
| `tsconfig.paths.json` | Path alias `@plugin-$pluginId` and `@plugin-$pluginId/*` (repo-relative paths for app plugins). **Must be created** so generate-tsconfig merges it. |
| `common/` | **New plugin (required):** Base datasource (`$pluginId.base.datasource.ts`), base mapper (`$pluginId.base.mapper.ts`), base service (`$pluginId.base.service.ts`); optional config and `common/schema/`. Feature datasource, mapper, and service **extend** these. **Existing plugin without common:** Feature classes extend framework base classes directly. |
| `common/schema/` | Optional shared schema types (e.g. `$pluginId.base.schema.ts` for pagination, result set, thumbnail). |
| `docs/index.md` | Plugin documentation (overview; backend integration or DB tables). Content and required diagrams — see [Documentation skill](../docs/SKILL.md), [plugin-docs.md](../docs/plugin-docs.md) (§4 Diagrams). When listing feature(s), **link to `features/$featureId/docs/index.md`** (the feature docs directory), not `features/$featureId/index.md`. |
| `features/$featureId/` | Per-feature implementation: datasource (REST/GraphQL), mapper, service, module, index; optional `schema/`, `entities/` (DB). |
| `features/$featureId/docs/index.md` | **When the feature is an addition to existing core-modules** (e.g. new plugin feature in src/core-staging): create docs at this path; do not update core-modules docs. Title and required diagrams per [plugin-docs.md](../docs/plugin-docs.md) (§4 Diagrams). |
| `features/$featureId/entities/` | TypeORM entities for database plugins (file: `$pluginId.$featureId.entity.ts`). |

Entity discovery for database plugins: the framework looks for files matching **`$pluginId/features/$featureId/**/*$pluginId.$featureId*.entity.ts`** (and `**/*$pluginId.common*.entity.ts`). Example: `my-db/features/user/entities/my-db.user.entity.ts`.

---

## Templated example code (tutorial-pet-rest)

The following examples are based on **`core-modules/plugins/tutorial-pet-rest`** and its features (e.g. **pet**). Substitute placeholders: `$pluginId`, `$PluginId` (PascalCase), `$featureId`, `$FeatureName`, `$FeatureNamePlural`, `$featureNamePlural`, `$featureName`; match the feature contract (method names, errors) from the Feature skill.

**Common directory (create first when creating a new plugin):**

**Example common base datasource (REST):**

```ts
// common/$pluginId.base.datasource.ts
import { RequestContext } from '@context/request';
import { $PluginIdDatasourceConfig } from './$pluginId.datasource.config';
import { BaseRestDatasource, RestDatasourceServiceDefinition } from '@plugin-datasource-rest';

export const $PluginIdBaseDatasourcePathParams = {
    identifier: '{identifier}',
};

export abstract class $PluginIdBaseDatasource extends BaseRestDatasource {
    protected consumerApiKeys: Record<string, string> = {};
    protected readonly headerAPIKey: string = 'x-api-key';
    protected readonly headerToken: string = 'x-token';

    protected composeHeaders(
        requestContext: RequestContext,
        datasourceConfig: any,
        headers: Record<string, any>,
        serviceDefinition: RestDatasourceServiceDefinition,
    ) {
        headers = super.composeHeaders(requestContext, datasourceConfig, headers, serviceDefinition);
        const { clientId, clientSecret } = this.getDatasourceConfig<$PluginIdDatasourceConfig>(requestContext);
        if (!this.consumerApiKeys[requestContext.consumer]) {
            this.consumerApiKeys[requestContext.consumer] = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        }
        headers[this.headerAPIKey] = this.consumerApiKeys[requestContext.consumer];
        headers[this.headerToken] = requestContext.tokens?.[this.getPluginTokenId(requestContext)]?.token;
        return headers;
    }
}
```

**Example common datasource config:**

```ts
// common/$pluginId.datasource.config.ts
import { RestDatasourceConfiguration } from '@plugin-datasource-rest';

export interface $PluginIdDatasourceConfig extends RestDatasourceConfiguration { }
```

**Example common base schema:**

```ts
// common/schema/$pluginId.base.schema.ts
export interface $PluginIdPagination {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    resultCount?: number;
    hasMorePages?: boolean;
}

export interface $PluginIdResultSet {
    pagination?: $PluginIdPagination;
    results?: any[];
}

export interface $PluginIdQuery {
    page?: number;
    pageSize?: number;
    sortBy?: string;
}
```

**Example common base mapper (REST):**

```ts
// common/$pluginId.base.mapper.ts
import { RequestContext } from '@context/request';
import { $PluginIdPagination } from './schema/$pluginId.base.schema';
import { BaseMapper } from '@plugin/mapper';
import { Pagination } from '@feature/models';

export class $PluginIdBaseMapper extends BaseMapper {
    mapPagination(requestContext: RequestContext, dsPagination: $PluginIdPagination): Pagination {
        return dsPagination
            ? {
                  page: dsPagination.page,
                  pageSize: dsPagination.pageSize,
                  pageCount: dsPagination.pageCount,
                  hasMorePages: dsPagination.hasMorePages,
                  resultCount: dsPagination.resultCount,
              }
            : null;
    }
}
```

**Example common base service (REST):**

```ts
// common/$pluginId.base.service.ts
import { RequestContext } from '@context/request';
import { $PluginIdQuery } from './schema/$pluginId.base.schema';
import { BaseDatasourcePluginServiceImpl } from '@plugin/service';
import { PaginationInput, SortByInput } from '@feature/models';

export class $PluginIdBaseServiceImpl extends BaseDatasourcePluginServiceImpl {
    protected composeQuery(requestContext: RequestContext, pagination: PaginationInput, sort: SortByInput): $PluginIdQuery {
        return {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
        };
    }
}
```

**Example common index:**

```ts
// common/index.ts (optional — export base classes and config for @plugin-$pluginId/common)
export * from './$pluginId.datasource.config';
export * from './$pluginId.base.datasource';
export * from './$pluginId.base.mapper';
export * from './$pluginId.base.service';
export * from './schema/$pluginId.base.schema';
```

**Feature directory (extends common base classes):**

**Example feature schema (REST):**

```ts
// features/$featureId/schema/$pluginId.$featureId.schema.ts
import { $PluginIdQuery, $PluginIdResultSet } from '@plugin-$pluginId/common/schema/$pluginId.base.schema';

export interface $PluginId$FeatureNameBodyBase {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    userIdentifier?: string;
}

export interface $PluginId$FeatureNameBodyCreate extends $PluginId$FeatureNameBodyBase {}
export interface $PluginId$FeatureNameBodyUpdate extends $PluginId$FeatureNameBodyBase {}

export interface $PluginId$FeatureName {
    id?: string;
    identifier?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    userIdentifier?: string;
}

export interface $PluginId$FeatureNameQuery extends $PluginIdQuery {
    identifiers?: string[];
    userIdentifier?: string;
}

export interface $PluginId$FeatureNameResultSet extends $PluginIdResultSet {
    results?: $PluginId$FeatureName[];
}
```

**Example feature datasource (REST; extends plugin base):**

```ts
// features/$featureId/$pluginId.$featureId.datasource.ts
import { RequestContext } from '@context/request';
import {
    $PluginId$FeatureNameQuery,
    $PluginId$FeatureNameResultSet,
    $PluginId$FeatureName,
    $PluginId$FeatureNameBodyCreate,
    $PluginId$FeatureNameBodyUpdate,
} from './schema/$pluginId.$featureId.schema';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';
import { $PluginIdBaseDatasource, $PluginIdBaseDatasourcePathParams } from '@plugin-$pluginId/common/$pluginId.base.datasource';

export const $PluginId$FeatureNameDatasourcePathParams = { ...$PluginIdBaseDatasourcePathParams };
export const pathRoot = '$featureId';
export const pathByIdentifier = `${pathRoot}/${$PluginId$FeatureNameDatasourcePathParams.identifier}`;

export interface $PluginId$FeatureNameDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    get$FeatureNamePlural: RestDatasourceServiceDefinition;
    get$FeatureName: RestDatasourceServiceDefinition;
    create$FeatureName: RestDatasourceServiceDefinition;
    update$FeatureName: RestDatasourceServiceDefinition;
    delete$FeatureName: RestDatasourceServiceDefinition;
}

export class $PluginId$FeatureNameDatasource extends $PluginIdBaseDatasource {
    protected serviceDefinitions: $PluginId$FeatureNameDatasourceServiceDefinitions = {
        get$FeatureNamePlural: { id: 'get$FeatureNamePlural', method: HttpMethods.get, path: pathRoot, timeout: 5000 },
        get$FeatureName: { id: 'get$FeatureName', method: HttpMethods.get, path: pathByIdentifier, timeout: 5000 },
        create$FeatureName: { id: 'create$FeatureName', method: HttpMethods.post, path: pathRoot, timeout: 5000 },
        update$FeatureName: { id: 'update$FeatureName', method: HttpMethods.put, path: pathByIdentifier, timeout: 5000 },
        delete$FeatureName: { id: 'delete$FeatureName', method: HttpMethods.delete, path: pathByIdentifier, timeout: 5000 },
    };

    async get$FeatureNamePlural(requestContext: RequestContext, query: $PluginId$FeatureNameQuery): Promise<$PluginId$FeatureNameResultSet> {
        return await this.execute(requestContext, this.serviceDefinitions.get$FeatureNamePlural, query);
    }

    async get$FeatureName(requestContext: RequestContext, identifier: string): Promise<$PluginId$FeatureName> {
        const paramMap = { [$PluginId$FeatureNameDatasourcePathParams.identifier]: identifier };
        return await this.execute(requestContext, this.serviceDefinitions.get$FeatureName, {}, {}, paramMap);
    }

    async create$FeatureName(requestContext: RequestContext, body: $PluginId$FeatureNameBodyCreate): Promise<$PluginId$FeatureName> {
        return await this.execute(requestContext, this.serviceDefinitions.create$FeatureName, {}, {}, {}, body);
    }

    async update$FeatureName(requestContext: RequestContext, identifier: string, body: $PluginId$FeatureNameBodyUpdate): Promise<$PluginId$FeatureName> {
        const paramMap = { [$PluginId$FeatureNameDatasourcePathParams.identifier]: identifier };
        return await this.execute(requestContext, this.serviceDefinitions.update$FeatureName, {}, {}, paramMap, body);
    }

    async delete$FeatureName(requestContext: RequestContext, identifier: string): Promise<$PluginId$FeatureName> {
        const paramMap = { [$PluginId$FeatureNameDatasourcePathParams.identifier]: identifier };
        return await this.execute(requestContext, this.serviceDefinitions.delete$FeatureName, {}, {}, paramMap);
    }
}
```

**Example feature mapper (extends plugin base mapper):**

```ts
// features/$featureId/$pluginId.$featureId.mapper.ts
import { RequestContext } from '@context/request';
import { $PluginId$FeatureName, $PluginId$FeatureNameResultSet } from './schema/$pluginId.$featureId.schema';
import { $PluginIdBaseMapper } from '@plugin-$pluginId/common/$pluginId.base.mapper';
import { $FeatureNameResultSet, $Feature } from '@feature-$featureId';

export class $PluginId$FeatureNameMapper extends $PluginIdBaseMapper {
    map$FeatureNameResultSet(requestContext: RequestContext, dsResultSet: $PluginId$FeatureNameResultSet): $FeatureNameResultSet {
        return dsResultSet
            ? {
                  pagination: this.mapPagination(requestContext, dsResultSet.pagination),
                  results: dsResultSet.results?.map((ds) => this.map$FeatureName(requestContext, ds)),
              }
            : null;
    }

    map$FeatureName(requestContext: RequestContext, ds: $PluginId$FeatureName): $Feature {
        return ds
            ? {
                  id: ds.id,
                  identifier: ds.identifier,
                  firstName: ds.firstName,
                  middleName: ds.middleName,
                  lastName: ds.lastName,
                  userIdentifier: ds.userIdentifier,
              }
            : null;
    }
}
```

**Example feature service (extends plugin base service; implements feature contract):**

```ts
// features/$featureId/$pluginId.$featureId.service.ts
import { RequestContext } from '@context/request';
import { $PluginId$FeatureNameQuery, $PluginId$FeatureNameResultSet, $PluginId$FeatureName, $PluginId$FeatureNameBodyCreate, $PluginId$FeatureNameBodyUpdate } from './schema/$pluginId.$featureId.schema';
import { $PluginId$FeatureNameDatasource } from './$pluginId.$featureId.datasource';
import { $PluginId$FeatureNameMapper } from './$pluginId.$featureId.mapper';
import { PaginationInput } from '@feature/models';
import { $FeatureNameFilterInput, $FeatureNameResultSet, $Feature, $FeatureNameInput } from '@feature-$featureId';
import { $FeatureNameService } from '@feature-$featureId';
import { $PluginIdBaseServiceImpl } from '@plugin-$pluginId/common/$pluginId.base.service';
import { $FeatureNameErrors } from '@feature-$featureId';

export class $PluginId$FeatureNameServiceImpl extends $PluginIdBaseServiceImpl implements $FeatureNameService {
    async get$FeatureNamePlural(filter: $FeatureNameFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<$FeatureNameResultSet> {
        pagination = this.validatePagination(pagination, requestContext);
        const query: $PluginId$FeatureNameQuery = this.composeQuery(requestContext, pagination, null);
        query.identifiers = filter?.identifiers;
        query.userIdentifier = filter?.userIdentifier;
        let dsResultSet: $PluginId$FeatureNameResultSet;
        try {
            dsResultSet = await this.get$FeatureNameDatasource(requestContext).queryCustomers(requestContext, query);
        } catch (error) {
            throw $FeatureNameErrors.get$FeatureNamePluralFailed();
        }
        return this.get$FeatureNameMapper(requestContext).map$FeatureNameResultSet(requestContext, dsResultSet);
    }

    async get$FeatureName(identifier: string, requestContext: RequestContext, context?: any): Promise<$Feature> {
        let dsResult: $PluginId$FeatureName;
        try {
            dsResult = await this.get$FeatureNameDatasource(requestContext).getCustomerById(requestContext, identifier);
        } catch (error) {
            throw $FeatureNameErrors.get$FeatureNameFailed();
        }
        return this.get$FeatureNameMapper(requestContext).map$FeatureName(requestContext, dsResult);
    }

    async create$FeatureName($featureName: $FeatureNameInput, requestContext: RequestContext, context?: any): Promise<$Feature> {
        const body = this.composeBody(requestContext, $featureName) as $PluginId$FeatureNameBodyCreate;
        let dsResult: $PluginId$FeatureName;
        try {
            dsResult = await this.get$FeatureNameDatasource(requestContext).createCustomer(requestContext, body);
        } catch (error) {
            throw $FeatureNameErrors.create$FeatureNameFailed();
        }
        return this.get$FeatureNameMapper(requestContext).map$FeatureName(requestContext, dsResult);
    }

    async update$FeatureName(identifier: string, $featureName: $FeatureNameInput, requestContext: RequestContext, context?: any): Promise<$Feature> {
        const body = this.composeBody(requestContext, $featureName) as $PluginId$FeatureNameBodyUpdate;
        let dsResult: $PluginId$FeatureName;
        try {
            dsResult = await this.get$FeatureNameDatasource(requestContext).updateCustomerById(requestContext, identifier, body);
        } catch (error) {
            throw $FeatureNameErrors.update$FeatureNameFailed();
        }
        return this.get$FeatureNameMapper(requestContext).map$FeatureName(requestContext, dsResult);
    }

    async delete$FeatureName(identifier: string, requestContext: RequestContext, context?: any): Promise<$Feature> {
        let dsResult: $PluginId$FeatureName;
        try {
            dsResult = await this.get$FeatureNameDatasource(requestContext).deleteCustomerById(requestContext, identifier);
        } catch (error) {
            throw $FeatureNameErrors.delete$FeatureNameFailed();
        }
        return this.get$FeatureNameMapper(requestContext).map$FeatureName(requestContext, dsResult);
    }

    protected composeBody(requestContext: RequestContext, input: $FeatureNameInput): $PluginId$FeatureNameBodyCreate | $PluginId$FeatureNameBodyUpdate {
        return { firstName: input.firstName, middleName: input.middleName, lastName: input.lastName, userIdentifier: input.userIdentifier };
    }

    protected get$FeatureNameDatasource(requestContext: RequestContext) {
        return this.getDatasource<$PluginId$FeatureNameDatasource>(requestContext, $PluginId$FeatureNameDatasource);
    }

    protected get$FeatureNameMapper(requestContext: RequestContext) {
        return this.getMapper<$PluginId$FeatureNameMapper>(requestContext, $PluginId$FeatureNameMapper);
    }
}
```

The framework base `BaseDatasourcePluginServiceImpl` provides `getDatasource<T>(requestContext, Class)` and `getMapper<T>(requestContext, Class)`. Feature-specific helpers `get$FeatureNameDatasource` and `get$FeatureNameMapper` call these with the feature datasource and mapper classes. The **service** implements the feature contract (e.g. `get$FeatureNamePlural`, `get$FeatureName`) and calls the **datasource's backend-named methods** (e.g. `queryCustomers`, `getCustomerById`, `createCustomer`). Adjust `composeBody` to match the feature input and schema body types.

**Example feature module:**

```ts
// features/$featureId/$pluginId.$featureId.module.ts
import { BasePluginModule } from '@plugin/module';

export class $PluginId$FeatureNameModule extends BasePluginModule {}
```

**Example feature index:**

```ts
// features/$featureId/index.ts
export * from './$pluginId.$featureId.module';
export * from './$pluginId.$featureId.datasource';
export * from './$pluginId.$featureId.mapper';
export * from './$pluginId.$featureId.service';
export * from './schema/$pluginId.$featureId.schema';
```

## Testing

**You must create a corresponding `*.spec.ts` file for every plugin service, datasource, and mapper file you create.** Place each spec in the same directory as the file it tests. Do not skip specs.

- **Service:** For every `$pluginId.$featureId.service.ts` created, create `$pluginId.$featureId.service.spec.ts`. Mock the repository (and optionally the mapper) to avoid TypeORM reflection in tests. Use a shared map function variable in the result-set mock to avoid "Mock is not callable" (see database-plugin.md Specs section).
- **Mapper:** For every `$pluginId.$featureId.mapper.ts` created, create `$pluginId.$featureId.mapper.spec.ts` using the plugin mapper test harness (e.g. `PluginMapperTestHarness.create({ pluginId, featureId, consumerIds })` and `harness.createMapper(MapperClass, { componentId })`). Assert entity → feature model and result-set mapping.
- **Datasource:** For every plugin datasource file created (e.g. `$pluginId.$featureId.datasource.ts`), create `$pluginId.$featureId.datasource.spec.ts`. Follow the project datasource test patterns.

Do not skip specs when adding or extending a datasource, mapper, or service.

## tsconfig.paths.json

**Always create** a `tsconfig.paths.json` at the plugin root. It is discovered by `yarn generate:tsconfig` and merged into the root tsconfig. Use **repo-relative** paths so that no project-specific config need be read.

**How to generate paths:**

1. **Resolve plugin root path `$PLUGIN_PATH`** (repo-relative, no leading slash):
   - **Default:** `src/core-staging/plugins/$pluginId`
   - **Only when user explicitly stated app:** `src/apps/$appId/plugins/$pluginId` (derive `$appId` from prompt)
   - **Only when user explicitly asked for core-modules:** `core-modules/plugins/$pluginId`
2. **Build the paths object:** Two entries so imports like `@plugin-$pluginId` and `@plugin-$pluginId/common` resolve:
   - `"@plugin-$pluginId"` → `["$PLUGIN_PATH"]`
   - `"@plugin-$pluginId/*"` → `["$PLUGIN_PATH/*"]`
3. **Top-level key:** Use either `"paths"` at the root of the JSON or nest under `"compilerOptions": { "paths": { ... } }` to match how the repo merges plugin path files. If unsure, use top-level `"paths"` as in the default example below.

**Example (default — core-staging plugin):**

```json
{
  "paths": {
    "@plugin-$pluginId": ["src/core-staging/plugins/$pluginId"],
    "@plugin-$pluginId/*": ["src/core-staging/plugins/$pluginId/*"]
  }
}
```

**Example (app plugin):** Use `["src/apps/$appId/plugins/$pluginId"]` and `["src/apps/$appId/plugins/$pluginId/*"]` for the path arrays.

## setup.configuration.yaml and setup.env

**Always create** both files at the plugin root:

- **setup.configuration.yaml:** Example YAML configuration for the plugin (id, tokenId, and for database plugins: `databases` array with `id`, `primary`, `consumers` per entry). For **database plugins**, do **not** put connection details (host, port, username, password, database, schema) in the application `configuration.yaml` or in the snippet; those come from `.env`. Include only a minimal `databases` entry (id, type) in the example snippet. See [database-plugin.md](database-plugin.md) for the full example.
- **setup.env:** Example environment variables for the datasource. For **database plugins**, this is the database connection (host, port, username, password, database, schema). The env var key must be **all uppercase** (e.g. `DATABASE_CONFIG_POSTGRES_USER-DB-DATABASE` for database id `user-db-database`). Copy to `.env` and set values.

## Application configuration.yaml (plugin and feature wiring)

To wire the plugin and connect it to the feature in an application without reading existing `configuration.yaml`, use the templated snippets below. Derive values as in the table.

**How to derive template values:**

| Placeholder | Derivation |
|-------------|------------|
| `$pluginId` | Plugin id from the user prompt (e.g. `user-db`, `my-rest`). Lowercase, hyphenated. |
| `$featureId` | Feature id the plugin implements (e.g. `user`, `pet`). Same as in the Feature skill. |
| `$DATABASE_ID` | Database connection id. For database plugins: derive from `$pluginId` (e.g. `$pluginId-database` → `user-db-database`). Used in `databases[].id` and `plugins[].databases[].id`. |
| `$db_anchor`, `$plugin_anchor` | YAML anchor names. Use the same as the id (e.g. `&user-db-database user-db-database`, `&user-db user-db`) so other blocks can reference with `*user-db-database`, `*user-db`. |
| `$CONSUMER_ANCHOR` | Reference to the consumer(s) that can use this plugin (e.g. `*site-1`). The anchor is defined in the top-level `consumers:` block (e.g. `id: &site-1 site-1`). Derive consumer id from user prompt or use a default like `site-1`. |

**Templated application configuration.yaml snippets:**

Do **not** put database connection details (host, port, username, password, database, schema) in `configuration.yaml`. Those are loaded from `.env` via the database configuration value. The env var key must be **all uppercase** (e.g. for database id `user-db-database`, use `DATABASE_CONFIG_POSTGRES_USER-DB-DATABASE`). In `configuration.yaml` only register the database by `id` and `type`.

```yaml
# 1) Define the database (required for database plugins). Place under top-level key: databases
#    Connection details (host, port, username, password, database, schema) come from .env, not from here.
databases:
  -
    id: &$db_anchor $DATABASE_ID
    type: postgres

# 2) Register the plugin. Place under top-level key: plugins
plugins:
  # ... other plugins ...
  -
    id: &$plugin_anchor $pluginId
    tokenId: $pluginId-token
    databases:
      - id: *$db_anchor
        primary: true
        consumers:
          - id: *$CONSUMER_ANCHOR

# 3) Enable the feature and bind the plugin. Place under top-level key: features
features:
  # ... other features ...
  -
    id: $featureId
    enabled: true
    plugin:
      id: *$plugin_anchor
```

**Notes:** (1) For non-database plugins, omit the `databases` entry and the `database` block in the plugin entry (or use plugin-specific config only). (2) Replace `$CONSUMER_ANCHOR` with the YAML alias for the consumer (e.g. `*site-1`), matching an anchor defined under `consumers:`. (3) Document in `setup.env` the env var for the database connection: the key must be **all uppercase** (e.g. `DATABASE_CONFIG_POSTGRES_USER-DB-DATABASE` for database id `user-db-database`), with JSON value containing host, port, username, password, database, schema.

## Documentation

**Documentation is mandatory.** When creating a new plugin or adding a plugin feature, you **must** create the corresponding `docs/index.md` (at plugin root for a new plugin, or at `features/$featureId/docs/index.md` when adding a feature). Do not consider the task complete without it.

Plugin documentation lives in a **`docs`** directory at the plugin root, with an **`index.md`** that describes the plugin for developers and integrators.

→ **Content and structure:** [Documentation skill](../docs/SKILL.md), [plugin-docs.md](../docs/plugin-docs.md)

**Diagrams:** Required; see [plugin-docs.md](../docs/plugin-docs.md) §4 (Diagrams).

**Additions to existing core-modules:** When the new components are additions to existing core-modules (e.g. a new plugin feature under `src/core-staging/plugins/$pluginId/features/$featureId`), create **`features/$featureId/docs/index.md`** at the new component location. **Do not create or update documentation under core-modules.** When adding a plugin feature under **src/core-staging**, also create **plugin root docs** at **`src/core-staging/plugins/$pluginId/docs/index.md`** if that path does not exist, so that `yarn generate:docs` lists the plugin in project root docs (see [plugin-docs.md](../docs/plugin-docs.md) "Plugin root docs when adding a feature under core-staging").

**Document title:** The first-level heading in `index.md` must include a location suffix: **" (Staging)"** when the component is under `src/core-staging`; **" ($appId)"** when under `src/apps/$appId`. Do not update existing core-modules docs.

Summary: document purpose and overview; for **non-database plugins**, specify the **backend services** the plugin integrates with (REST/GraphQL endpoints, APIs); for **database plugins**, document the **tables and their columns** (and schema if applicable).

**Checklist (plugin deliverables):** For every service file created → corresponding `*.service.spec.ts`; for every mapper file created → corresponding `*.mapper.spec.ts`; for every datasource file created → corresponding `*.datasource.spec.ts`; `tsconfig.paths.json` created; `setup.configuration.yaml` created (with example database snippet for DB plugins); `setup.env` created; **Documentation (mandatory):** Create `docs/index.md` at plugin root for a new plugin, or **`features/$featureId/docs/index.md`** when adding a plugin feature — do not finish the task without it. When adding a plugin feature under **src/core-staging**, also create **plugin root** `docs/index.md` at **`src/core-staging/plugins/$pluginId/docs/`** if it does not exist, so project root docs list the plugin. Title and diagrams per [plugin-docs.md](../docs/plugin-docs.md) (§4). **REST/GraphQL feature datasource:** API discovery completed? (User prompted for source → operation list obtained → user selected operations → only then implement.)

**Completion checklist (before considering the task complete):** Before finishing, confirm:

- [ ] I have created **`features/$featureId/docs/index.md`** when adding a plugin feature (or `docs/index.md` at plugin root for a new plugin).
- [ ] When adding a plugin feature under **src/core-staging**, I have created **plugin root** `docs/index.md` at **`src/core-staging/plugins/$pluginId/docs/`** if it did not exist, so project root docs list the plugin.
- [ ] The doc title includes the location suffix " (Staging)" or " ($appId)" when in core-staging or app.
- [ ] The doc satisfies the diagram requirements in [plugin-docs.md](../docs/plugin-docs.md) §4.

If any item is unchecked, create or update the documentation; do not skip.

## REST plugin

A **REST plugin** implements a feature by calling an external REST API. It uses a base REST datasource (shared auth/headers) and per-feature datasources that define HTTP operations and call `execute`. The feature service uses the datasource and mapper to fulfill the feature contract.

→ **Full steps and templated code:** [rest-plugin.md](rest-plugin.md)

Before generating any datasource code, the API discovery and selection steps in this skill (including the mandatory pre-implementation checkpoint under "Mandatory gate: REST/GraphQL plugin or plugin feature") must be completed.

Summary:

- **API discovery:** Before generating datasource code, **you must** follow the REST plugin "API discovery and selection" flow in [rest-plugin.md](rest-plugin.md): **(1)** Prompt the user to choose one of: OpenAPI file (local path), OpenAPI file (remote URL), or system documentation URL — do not assume or discover a URL on your own; **(2)** obtain the operation list (read/fetch OpenAPI or parse system docs and create/save an OpenAPI file); **(3)** present the list of operations **in a markdown table with row numbers** and **ask the user to select which APIs** the datasource should integrate with (by row number or range) — do not choose for them. Use only the selected operations to define `serviceDefinitions` and methods.
- Base datasource in `common/$pluginId.base.datasource.ts` extends `BaseRestDatasource`; optional `composeHeaders` and path params. Optional config in `common/$pluginId.datasource.config.ts`.
- Feature datasource in `features/$featureId/$pluginId.$featureId.datasource.ts` defines `serviceDefinitions` (method, path, timeout) and methods that call `this.execute` with the appropriate service definition, query, paramMap, or body.
- Schema types (query, result set, entity, body create/update) live under `features/$featureId/schema/` and align with the API. Service and mapper consume the datasource and map API responses to the feature model.
- **Must** add `*.datasource.spec.ts` for every datasource file; use `PluginDatasourceTestHarness` and mock `execute` (and optionally `@plugin-datasource-rest`).

## GraphQL plugin

A **GraphQL plugin** implements a feature by calling an external GraphQL API. It uses a base GraphQL datasource (shared auth/headers) and per-feature datasources that define operations and call `executeGQLService`. Query and mutation definitions live in **`features/$featureId/schema/$pluginId.$featureId.schema.ts`**.

→ **Full steps and templated code:** [graphql-datasource.md](graphql-datasource.md)

Summary:

- **API discovery:** Before generating datasource code, ask the user for a **system documentation URL** (parse docs to list queries/mutations) or a **GraphQL endpoint** (run **introspection query** to get full schema). Present the list of queries and mutations **in a markdown table with row numbers** and ask the user to select which operations the datasource should integrate with (by row number or range). Use the selected operations to define the schema file and `serviceDefinitions`.
- Base datasource in `common/$pluginId.base.datasource.ts` extends `BaseGraphqlDatasource`; optional `composeHeaders` and `addAuthTokenToHeaders`.
- Schema file at `features/$featureId/schema/$pluginId.$featureId.schema.ts`: types (with `static baseGQL` for field selection), input types, and `GraphqlDatasourceQueries` (query/mutation documents). Feature datasource imports from this file and sets `serviceDefinitions.query` per operation.
- Feature datasource in `features/$featureId/$pluginId.$featureId.datasource.ts` defines `serviceDefinitions` (id, method: GraphqlHttpMethods.post/get, timeout, retryConfig?, query) and methods that call `this.executeGQLService` with variables and optional `maskedLogParams` (e.g. `['password']`).
- Feature module extends `BasePluginModule`. **Must** add `*.datasource.spec.ts`; mock `executeGQLService` and optionally `@plugin-datasource-graphql`.

## Database plugin

A **database plugin** implements a feature by reading and writing to a database (e.g. PostgreSQL). It uses TypeORM entities; the base service extends `BasePluginServiceImpl` directly (database access via `getRepository`/`getDatabaseConnection` is built into that base class), and the feature module extends `BasePluginModule`, which discovers this feature's entities and registers them with `TypeOrmModule.forFeature(entities, pluginConfig.database.id)` automatically.

→ **Full steps and code:** [database-plugin.md](database-plugin.md)

Summary:

- Create entity under `features/$featureId/entities/$pluginId.$featureId.entity.ts`; use `@Entity({ name: 'table_name', schema: 'optional_schema' })`.
- Base service extends `BasePluginServiceImpl`; use `this.getRepository(Entity)` (repository is keyed by `plugin.configuration.database.id`).
- Base mapper extends `BaseMapper` and implements `composePagination(limit, offset, count)`.
- Feature service implements the feature's abstract service interface; uses repository and mapper; maps entity ↔ feature model (or Ext model if app extension).
- Feature module extends `BasePluginModule` (same as REST/GraphQL plugins — no separate database module base class).
- `setup.configuration.yaml` must include `database.id: $DATABASE_ID` (e.g. `ase-database`). The application `configuration.yaml` must define `databases` with that id and reference it in the plugin's `database.id`.
- **Must** add `*.spec.ts` for every mapper and service (and datasource, if present); mock repository in service spec to avoid TypeORM reflection issues.
- A plugin does **not** need to be "database-only" to use this — a REST or GraphQL plugin can add entities and a `database.id` the same way to gain `getRepository()`/`getDatabaseConnection()` alongside its datasource.

## Parallel use

**You must launch a separate agent** running the Feature (or Extension) skill when both a plugin and a feature are being created and there are no dependencies between the two. Use the task/agent tool to launch the Feature/Extension agent in parallel (e.g. `mcp_task` with subagent_type and a prompt that instructs the agent to follow the Feature/Extension skill). Do **not** implement the feature or extension yourself in the same agent. This skill provides the implementation; the other agent defines the contract.
