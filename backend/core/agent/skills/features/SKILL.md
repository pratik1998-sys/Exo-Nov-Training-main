---
name: feature
description: Guides creation of features and feature extensions. ALWAYS use ./src/core-staging unless the user explicitly says "core-modules" or "in core-modules" or an app path (src/apps/$appId). Before creating any feature file or exploring the codebase for similar features, read the "Feature location" and "STOP" sections and decide the root path (default src/core-staging/...). Use with Component location skill for path. Use when the user asks to create a new feature, add a feature to the core or app, or extend an existing feature with custom fields or types. Run as one of two parallel agents with plugin when both feature and plugin are needed and there are no dependencies between the two (launch a second agent for the Plugin skill).
---

# Feature

## STOP — Feature location (read before creating any file)

**ALWAYS use ./src/core-staging for new features.** The only exceptions: (1) user explicitly says "core-modules" or "in core-modules", (2) user explicitly says to create in an app (src/apps/$appId). Do NOT use core-modules/ just because the feature group (e.g. commerce) or other features/plugins live there or import from there. **Feature group** (e.g. "commerce feature group", "in commerce") = **group name only**. Path is `src/core-staging/features/<group>/$featureId/` (e.g. `src/core-staging/features/commerce/ec-user/`). Do **not** use `core-modules/features/commerce/...` just because other commerce features or plugins live there. Do **not** choose location by looking at where other features in the same group live (e.g. `core-modules/features/commerce/`); that is not a valid reason — use **`src/core-staging/features/<group>/$featureId/`** unless the user explicitly said "in core-modules" or "in core".

---

## STOP — Extending an existing core-modules feature (read before editing any file)

If the base feature or plugin already lives under **`core-modules/`** and the task adds fields, filter args, resolver/controller behavior, or service enrichment, **`core-modules/` is read-only**.

**Do not** edit `core-modules/features/...`, `core-modules/plugins/...`, or related core resolver/model/service files.

**Do instead:**

1. **App feature extension** — `src/apps/$appId/features/$featureId/` with the same filenames as core (`product.resolver.ts`, `product-ext.model.ts`, `product.api.configuration.ts`, …). Use **`Ext`** types and override API configuration getters. See [Feature extension](feature-extension.md) and the [Extension skill](../extension/SKILL.md).
2. **App plugin extension** — `src/apps/$appId/plugins/$pluginId/features/$featureId/` with `{pluginId}.{featureId}.service.ts` exporting a class that **extends** the base `*ServiceImpl` and ends with **`ServiceImpl`** (e.g. `ExtCommercetoolsProductServiceImpl`).
3. **Shared helper** (optional) — new logic that is not an override may live in **`src/core-staging/`** (e.g. inventory enrichment helper called from the app plugin extension).

**Invalid:** Adding `workshopInventory` to `core-modules/features/commerce/product/product.model.ts` when shell-biws needs it — put `ExtProduct` in `src/apps/shell-biws/features/product/product-ext.model.ts` instead.

**Before editing:** If the path starts with `core-modules/` and the user did not explicitly say "edit core-modules", stop and use an app or core-staging extension path.

---

## STOP — API decorators and `$featureId.api.configuration.ts` (read before resolver/controller)

**Every feature operation must be declared in `$featureId.api.configuration.ts` first, then wired in the resolver and controller through `@api-decorators`.** Do not ship empty `ApiConfiguration` subclasses or hand-written Nest route/GraphQL decorator options.

**Mandatory rules:**

1. **Populate `$featureId.api.configuration.ts` before `$featureId.resolver.ts` or `$featureId.controller.ts`.** Define one `operations` entry per query, mutation, and REST route (with `id`, `description`, `summary`, `restOptions`, and `queryOptions` or `mutationOptions`). Add static getters that return `this.composeOperationOptions(operations.<key>)`.
2. **GraphQL resolver decorators come from `@api-decorators` only:** `Args`, `Query`, `Mutation`, `Resolver`. **Never** import these from `@nestjs/graphql`. `@Context()` from `@nestjs/graphql` is allowed.
3. **REST route decorators come from `@api-decorators` only:** `Controller`, `Get`, `Post`, `Put`, `Delete`. **Never** import these from `@nestjs/common`. Parameter injection decorators (`Body`, `Param`, `Query`, `Req`) stay on `@nestjs/common`.
4. **Wire every operation to API configuration:**
   - Resolver: `@Query(() => Type, $FeatureNameApiConfiguration.<operation>().queryOptions, feature)` and `@Mutation(() => Type, $FeatureNameApiConfiguration.<operation>().mutationOptions, feature)`
   - Controller: `@Get($FeatureNameApiConfiguration.<operation>().restOptions, feature)` (same for `@Post`, `@Put`, `@Delete`)
5. **`@Args` must use request parameters:** `@Args({ parameter: $FeatureNameRequestParameters.<name>, type: () => ..., required: ... })`. **Never** use string arg names like `@Args('input')` or `@Args('workshopId')`.
6. **`@Controller` and `@Resolver` must pass `feature`:** `const feature = $FeatureNameModule.feature;` then `{ feature }` on the class decorator and as the last argument on each query/mutation/route decorator.
7. **REST query/path keys must use `$FeatureNameRequestParameters.<name>.id`**, not hard-coded strings like `@Query('workshopId')`.
8. **Order of work:** model → parameters → **api.configuration** → service → resolver → controller. If resolver or controller is written before api.configuration is complete, stop and finish api.configuration first.

**Common mistakes — DO NOT:**

- `@Query(() => [Item], { name: 'items' })` with options inline instead of `$FeatureNameApiConfiguration.items().queryOptions`
- `@Get('items')` or `@Post('items')` from `@nestjs/common` instead of `@Get($FeatureNameApiConfiguration.items().restOptions, feature)` from `@api-decorators`
- `export class FooApiConfiguration extends ApiConfiguration {}` with no `operations` object
- Resolver/controller method names that do not match api.configuration getter names and service methods

**PATCH note:** `@api-decorators` exposes `Get`, `Post`, `Put`, and `Delete` (not `Patch`). Prefer `Put` with `isById: true` and `idPathParameter` in `restOptions`. Only use Nest `@Patch` when a PATCH verb is required and cannot be expressed as PUT; still define the operation in api.configuration.

---

Features are the main units of business capability. A feature is a NestJS module that groups controllers, resolvers, services, models, and optional plugins. Features are enabled and configured in `configuration.yaml` and can be nested (feature groups).

## When to use this skill

- Creating a **new feature** (core or app).
- **Extending an existing feature** with custom fields, new types, or app-specific API response types.
- Adding a feature to `configuration.yaml` or feature setup.

## Parallel execution (required)

When the user asks to create **both** a feature (or feature extension) **and** a plugin, you **must** run the Feature skill in parallel with the Plugin skill by launching a second agent via the task/agent tool (e.g. `mcp_task`). Do **not** implement both feature and plugin in a single agent. Launch the Feature/Extension agent and the Plugin agent in parallel; there are no dependencies between them when using the derivation rules.

## Using this skill without project code

**Do not reference project code.** Use only the templates in this skill (and linked docs) and data derived from the user prompt. All specific names, types, and method signatures are derived from placeholders and the derivation rules below. Project code may not be available; the skills are the single source of truth.

## Deriving specific code from the user prompt

From the user prompt, extract the following and use them consistently in every file (model, service, API configuration, parameters, errors, resolver, controller).

**Placeholders:**

| Placeholder | Derivation | Example (user says "user" or "user profile") |
|-------------|------------|----------------------------------------------|
| `$featureId` | Lowercase, hyphenated feature id from the resource name | `user` or `user-profile` |
| `$FeatureName` | PascalCase singular of the resource | `User` |
| `$FeatureNamePlural` | PascalCase plural (for naming convention below) | `Users` |
| `$featureNamePlural` | camelCase plural (for API getter names) | `users` |
| `$featureName` | camelCase singular (for API getter names) | `user` |

**Naming convention (choose one and use everywhere):**

- **Option A — Generic:** Use the template as-is: `getItems`, `getItem`, `createItem`, `updateItem`, `deleteItem`; API getters `items()`, `item()`, `itemCreate()`, `itemUpdate()`, `itemDelete()`; parameter names `filter`, `pagination`, `id`, `item`; errors `getFailed`, `createFailed`, `exists`, `notEditable`. Use for generic CRUD features when the user does not specify a domain resource name.
- **Option B — Plural-resource:** Replace "Item/Items" with the resource name: service methods `get$FeatureNamePlural`, `get$FeatureName`, `create$FeatureName`, `update$FeatureName`, `delete$FeatureName` (e.g. `getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser`); API operation ids and getters `$featureNamePlural()`, `$featureName()`, `$featureNameCreate()`, `$featureNameUpdate()`, `$featureNameDelete()` (e.g. `users()`, `user()`, `userCreate()`, `userUpdate()`, `userDelete()`); request parameter for the single-item body: `$featureName` (e.g. `user`); errors `get$FeatureNamePluralFailed`, `get$FeatureNameFailed`, `create$FeatureNameFailed`, `update$FeatureNameFailed`, `delete$FeatureNameFailed`, `$featureNameExists`, `$featureNameNotEditable` (e.g. `getUsersFailed`, `getUserFailed`, `createUserFailed`, `userExists`, `userNotEditable`). Error class name: `$FeatureNameErrors` (e.g. `UserErrors`). Use for domain resources (user, pet, order, etc.).

**Standalone feature (rare — only when explicitly requested):** Set **`standalone: true`** only when the user **explicitly** says the feature should be standalone (e.g. "standalone feature", "feature with no plugin", "feature that does not use a plugin"). Do **not** assume standalone just because no plugin was mentioned in the prompt. Most features expect a plugin to be bound in configuration (now or later). If the user did not request standalone, the feature is **not** standalone: use `plugin.id` in `setup.configuration.yaml` and in the application feature entry (with a placeholder plugin id if none was named, so that a plugin can be bound when one is added).

**Request parameters:** In `$featureId.parameters.ts`, expose at least `identifier` (for path/id), `filter`, `pagination`, and the item/body parameter (generic: `item`; plural-resource: `$featureName`). REST path parameter uses `$FeatureNameRequestParameters.identifier.id` (e.g. `UserRequestParameters.identifier.id`).

**Resolver and controller:** Method names must match the API getters and service: e.g. `users`, `user`, `userCreate`, `userUpdate`, `userDelete` (plural-resource) or `items`, `item`, `itemCreate`, `itemUpdate`, `itemDelete` (generic). Use the same `$FeatureNameRequestParameters` and `$FeatureNameService` method names in both.

**Making specific code from templates:** In every code block in this skill, replace `$featureId`, `$FeatureName`, `$FeatureNameModule`, `$FeatureNameService`, `$FeatureNameApiConfiguration`, `$FeatureNameRequestParameters`, `$FeatureNameFilterInput`, `$FeatureNameInput`, `$FeatureNameCreateInput`, `$FeatureNameCreate`, `$FeatureNameResultSet`, `$FeatureNameResultSetQuery`, `$FeatureErrors` with the derived names. Replace generic method names (getItems, items, item, …) with the chosen convention (e.g. getUsers, users, user, …) so that service, API config, resolver, and controller are consistent. Any plugin that implements this feature must implement the same method names and error contract.

**Model fields — integer, float, json, id, and list types:** When the user specifies a field type as **integer**, **float**, **json**, **id**, **integer list**, or **float list**, use the **FieldType** definition from `core/foundation/api/shared/decorators/field.decorator.ts` and apply it as the **second parameter** of the `@Field` decorator. Import `Field` and `FieldType` from `@api-decorators`. Map user-specified types as follows: **integer** → `FieldType.integer`; **float** → `FieldType.float`; **json** → `FieldType.json`; **id** → `FieldType.id`; **integer list** (or list of integers) → `FieldType.integerArray`; **float list** (or list of floats) → `FieldType.floatArray`. Example: `@Field({ description: 'department count' }, FieldType.integer)` for an integer field; `@Field({ description: 'annual revenue' }, FieldType.float)` for a float; `@Field({ description: 'store id' }, FieldType.id)` for an id. For list types use `FieldType.integerArray` or `FieldType.floatArray` as the second argument. Do not use raw GraphQL/TypeScript types (e.g. `Int`, `Float`, `() => Number`) for these scalar shapes — use FieldType so REST and GraphQL stay aligned.

## Deriving feature component patterns

Use these patterns so structure and naming do not require project code. Substitute the placeholders from the table above and the chosen naming convention (generic vs plural-resource).

| Component | File name | Class / export name | Key patterns |
|-----------|-----------|---------------------|--------------|
| **Module** | `$featureId.module.ts` | `$FeatureNameModule` | Extends `BaseFeatureModule`. Expose `feature` for resolver/controller. |
| **Service** | `$featureId.service.ts` | `$FeatureNameService` (abstract) | Methods: `get$FeatureNamePlural`/`get$FeatureName`/`create$FeatureName`/`update$FeatureName`/`delete$FeatureName` (plural-resource) or `getItems`/`getItem`/`createItem`/`updateItem`/`deleteItem` (generic). Plus `getTokenId(requestContext)`. |
| **Resolver** | `$featureId.resolver.ts` | `$FeatureNameResolver` | Import `Args`, `Mutation`, `Query`, `Resolver` from `@api-decorators` (never `@nestjs/graphql`). `@Resolver((of) => $Feature, { feature })`. Each `@Query`/`@Mutation` passes `$FeatureNameApiConfiguration.<operation>().queryOptions` or `.mutationOptions` and `feature`. `@Args({ parameter: $FeatureNameRequestParameters.<name>, ... })` — never string arg names. |
| **Controller** | `$featureId.controller.ts` | `$FeatureNameController` | Import `Controller`, `Get`, `Post`, `Put`, `Delete` from `@api-decorators` (never `@nestjs/common` for routes). `@Controller({ path: '$featureId', feature })`. Each route uses `@Get($FeatureNameApiConfiguration.<operation>().restOptions, feature)` (or `@Post`/`@Put`/`@Delete`). Use `@Body`/`@Param`/`@Query`/`@Req` from `@nestjs/common` for parameters. REST keys use `$FeatureNameRequestParameters.<name>.id`. |
| **Parameters** | `$featureId.parameters.ts` | `$FeatureNameRequestParameters` | Extend or match framework `RequestParameters`. Add: `identifier: { id: 'identifier', description: '...' }`, body param `$featureName: { id: 'user', description: 'user' }` (plural-resource) or `item: { id: 'item', description: 'item' }` (generic). Spread `...RequestParameters` so `filter`, `pagination`, and `id` (for path) remain available. REST path param key is `$FeatureNameRequestParameters.identifier.id` (value `'identifier'`). |
| **Errors** | `$featureId.error.ts` | `$FeatureNameErrors` | Extends `FeatureErrors`. Static methods: plural-resource `get$FeatureNamePluralFailed`, `get$FeatureNameFailed`, `create$FeatureNameFailed`, `update$FeatureNameFailed`, `delete$FeatureNameFailed`, `$featureNameExists`, `$featureNameNotEditable`; generic `getFailed`, `createFailed`, `updateFailed`, `deleteFailed`, `exists`, `notEditable`. Each returns `this.composeHTTPError(this.errors.<key>)`; define `errors` object with `code`, `message`, `statusCode` per key. |
| **API configuration** | `$featureId.api.configuration.ts` | `$FeatureNameApiConfiguration` | **Required before resolver/controller.** `operations`: keys = getter names (`$featureNamePlural`, `$featureName`, `$featureNameCreate`, …). Each operation has `id`, `description`, `summary`, `restOptions`, `queryOptions` or `mutationOptions`. Static getters return `this.composeOperationOptions(operations.<key>)`. Never leave an empty `extends ApiConfiguration {}` class. |

## Feature location (default: src/core-staging; never core-modules unless explicitly requested)

**Mandatory: Location check before creating the first file.** Before creating any feature file, you MUST:

0. **ALWAYS rule:** I am using `./src/core-staging` for this feature. I am NOT using `core/` or `core-modules/` unless the user explicitly said "core-modules", "in core-modules", or an app path. I did not infer core-modules from the feature group name or from where similar code lives in the repo.
1. **State path first:** State aloud the full root path you will use (e.g. "Creating feature at `src/core-staging/features/commerce/ec-user/`"). If the path you stated is under `core-modules/` and the user did not explicitly request core-modules, do not create files there; use `src/core-staging/...` instead.
2. **Confirm:** Am I about to create a file or directory under `core/` or `core-modules/`?
3. **If yes:** STOP. Only proceed if the user has **explicitly** said they want the work in core or core-modules (e.g. "create in core", "create in core-modules", "put it in core-modules"). If they did not, use **`src/core-staging/features/<group>/$featureId/`** (e.g. `src/core-staging/features/commerce/ec-user/`) instead. Do not use `core-modules/` because the rest of the feature group lives there or because existing code imports from there.
4. **Checklist:** I have read [Component location](../component-location/SKILL.md). I am creating under `src/core-staging/...` (not `core-modules/`) because the user did not explicitly request core or core-modules.

**Where to create:** Follow the uniform rules in [Component location](../component-location/SKILL.md). The rules are the same for all component types (features, plugins, middleware, etc.); never create under `core/` or `core-modules/` unless the user explicitly requests it, and create `src/core-staging` if it does not exist.

- **Default (always, unless user explicitly says otherwise):** Create new features under **`src/core-staging/features/$featureId/`**. **Create the directory `src/core-staging` (and any needed parent or child directories) if it does not exist.**
- **Only when user explicitly states:** Create under **`src/apps/$appId/features/$featureId/`** when the user explicitly says to create in the app or a specific app.
- **Only when user explicitly states:** Create under **`core/features/$featureId/`** or **`core-modules/features/$featureId/`** only when the user explicitly says to create in core or core-modules.

**Feature group vs. location:** Naming a **feature group** (e.g. "commerce feature group", "in commerce") only specifies which group the feature belongs to (e.g. commerce, navigation). It does **not** mean to create under `core/` or `core-modules/`. If the user only specified a feature group (e.g. "in commerce" or "commerce feature group"), the root path is **`src/core-staging/features/<group>/$featureId/`** (e.g. `src/core-staging/features/commerce/ec-user/`), **not** `core-modules/features/commerce/$featureId/`. Use the default location unless the user explicitly says to create in core or core-modules.

**Common mistake — DO NOT:** Do **not** infer "create in core-modules" from phrases like "in commerce", "commerce feature group", or "for the commerce group". Those specify **group only**; location remains the default (`src/core-staging/...`). Do **not** create under `core-modules/` because the rest of the feature group or existing plugins live there or import from there. **Example:** "Create the feature ec-user in commerce feature group" → use **`src/core-staging/features/commerce/ec-user/`**, **not** `core-modules/features/commerce/ec-user/`.

**Before creating the first feature file:** If the user mentioned a feature group (e.g. commerce, navigation) but did not say "in core-modules" or "in core", use **`src/core-staging/features/<group>/$featureId/`** as the root. Do not use `core-modules/` because the rest of the group lives there.

**Plugin feature (implementation in a plugin):** When the user asks for a **new plugin feature** or **new feature for plugin X**, the default location for the plugin's implementation is **`src/core-staging/plugins/$pluginId/features/$featureId/`** (governed by the Plugin skill and by [Component location](../component-location/SKILL.md)).

## Feature structure (core)

A feature lives under **`src/core-staging/features/$featureId/`** (default—always use unless the user explicitly states app or core-modules), **`src/apps/$appId/features/$featureId/`** (only when the user explicitly states to create in the app or a specific app), or **`core-modules/features/$featureId/`** (only when the user explicitly asks for core-modules). Use the same structure across features. Replace `$featureId` (e.g. `user`, `pet`) and `$FeatureName` with your feature name.

**Feature complete = code + docs.** Delivering a new feature requires both the code files below and **`docs/index.md`** (overview, API, schema, service contract, and required Mermaid diagrams per [feature-docs.md](../docs/feature-docs.md)). Do not consider feature creation complete until `docs/index.md` exists at the feature root. Skipping docs is a deliverable failure.

| File / folder | Purpose |
|---------------|--------|
| `$featureId.module.ts` | Extends `BaseFeatureModule`. |
| `$featureId.model.ts` | GraphQL types: `$Feature`, `$FeatureInput`, `$FeatureResultSet`, etc. Use `FieldType` from `@api-decorators` (see "Model fields — integer, float, json, id, and list types") for integer, float, json, id, integer list, float list. |
| `$featureId.service.ts` | Abstract service extending `BaseFeatureService` (e.g. `getById`, `getList`, `create`, `update`, `delete`). |
| `$featureId.resolver.ts` | GraphQL resolver; uses `$FeatureApiConfiguration` and `getRequestContextAndService(context, $FeatureService)`. |
| `$featureId.controller.ts` | REST controller; same service resolution. |
| `$featureId.api.configuration.ts` | Static operations and getters; use names from derivation (e.g. `items()`/`item()` generic or `users()`/`user()`/`userCreate()`/… plural-resource). |
| `$featureId.parameters.ts` | Request parameter definitions; include `identifier`, `filter`, `pagination`, and body param per derivation. |
| `$featureId.error.ts` | Feature-specific errors; use names from derivation (e.g. `getFailed`/`createFailed` generic or `getUserFailed`/`createUserFailed` plural-resource). |
| `setup.configuration.yaml` | Feature id, enabled, and **`plugin.id: $PLUGIN_ID`** (default—feature expects a plugin; use a placeholder if no plugin was named). Use **`standalone: true`** only when the user **explicitly** requests a standalone feature. **Must be created** with example YAML for the feature. |
| `tsconfig.paths.json` | Path alias `@feature-$featureId` and `@feature-$featureId/*` (repo-relative). **Must be created** so generate-tsconfig merges it. |
| `docs/index.md` | Feature documentation (overview, API, schema, service contract). **Must be created.** Content and required diagrams — see [Documentation skill](../docs/SKILL.md), [feature-docs.md](../docs/feature-docs.md) (§6 Diagrams). Do not ship a new feature without this file. |
| `index.ts` | Re-exports public API. |

**Templated examples** below are based on the **tutorial-pet** feature (`core-modules/features/tutorial-pet/pet`). Substitute placeholders ($featureId, $FeatureName, etc.) and choose generic vs plural-resource naming per the derivation table.

**Example core feature module:**

```ts
// src/core-staging/features/$featureId/$featureId.module.ts
import { BaseFeatureModule } from "@feature/module";

export class $FeatureNameModule extends BaseFeatureModule { }
```

**Example setup.configuration.yaml** (default — feature expects a plugin; use this unless the user explicitly requested standalone):

```yaml
id: $featureId
enabled: true
plugin:
  id: $PLUGIN_ID
```

Use a concrete plugin id if the user named one (e.g. `user-db`); otherwise use a placeholder like `$PLUGIN_ID` so that a plugin can be bound in configuration when one is added.

**Example setup.configuration.yaml** (only when the user **explicitly** requests a standalone feature):

```yaml
id: $featureId
enabled: true
standalone: true
```

**Example abstract service (plural-resource; from tutorial-pet):**

```ts
// src/core-staging/features/$featureId/$featureId.service.ts
import { BaseFeatureService } from '@feature/service';
import { $Feature, $FeatureFilterInput, $FeatureInput, $FeatureResultSet } from '@feature-$featureId';
import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';

export abstract class $FeatureNameService extends BaseFeatureService {
    abstract get$FeatureNamePlural(filter: $FeatureNameFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<$FeatureNameResultSet>;
    abstract get$FeatureName(identifier: string, requestContext: RequestContext, context?: any): Promise<$Feature>;
    abstract create$FeatureName($featureName: $FeatureNameInput, requestContext: RequestContext, context?: any): Promise<$Feature>;
    abstract update$FeatureName(identifier: string, $featureName: $FeatureNameInput, requestContext: RequestContext, context?: any): Promise<$Feature>;
    abstract delete$FeatureName(identifier: string, requestContext: RequestContext, context?: any): Promise<$Feature>;
}
```

For generic naming, use `getItems`, `getItem`, `createItem`, `updateItem`, `deleteItem` and body parameter `item` / type `$FeatureNameInput`; add `abstract getTokenId(requestContext: RequestContext): string` if required by the base.

**Example API configuration (plural-resource; from tutorial-pet):**

```ts
// src/core-staging/features/$featureId/$featureId.api.configuration.ts
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import { $Feature, $FeatureInput, $FeatureNameRequestParameters, $FeatureNameResultSet } from '@feature-$featureId';

export interface $FeatureNameApiOperations {
    $featureNamePlural: ApiOperationDefinition;
    $featureName: ApiOperationDefinition;
    $featureNameCreate: ApiOperationDefinition;
    $featureNameUpdate: ApiOperationDefinition;
    $featureNameDelete: ApiOperationDefinition;
}

export class $FeatureNameApiConfiguration extends ApiConfiguration {
    static operations: $FeatureNameApiOperations = {
        $featureNamePlural: {
            id: '$featureNamePlural',
            description: 'Get $featureName result set',
            summary: 'Get $featureName result set',
            restOptions: {
                apiOkResponseOptions: { type: $FeatureNameResultSet },
                tags: [],
            },
            queryOptions: { required: false },
        },
        $featureName: {
            id: '$featureName',
            description: 'Get $featureName by identifier',
            summary: 'Get $featureName by identifier',
            restOptions: {
                isById: true,
                idPathParameter: $FeatureNameRequestParameters.identifier,
                apiOkResponseOptions: { type: $Feature },
                tags: [],
            },
            queryOptions: { required: false },
        },
        $featureNameCreate: {
            id: '$featureNameCreate',
            description: 'Create $featureName',
            summary: 'Create $featureName',
            restOptions: {
                apiOkResponseOptions: { type: $Feature },
                apiBodyOptions: { type: $FeatureNameInput },
                tags: [],
            },
            mutationOptions: { required: false },
        },
        $featureNameUpdate: {
            id: '$featureNameUpdate',
            description: 'Update $featureName',
            summary: 'Update $featureName',
            restOptions: {
                path: `:${$FeatureNameRequestParameters.identifier.id}`,
                apiOkResponseOptions: { type: $Feature },
                apiBodyOptions: { type: $FeatureNameInput },
                tags: [],
            },
            mutationOptions: { required: false },
        },
        $featureNameDelete: {
            id: '$featureNameDelete',
            description: 'Delete $featureName',
            summary: 'Delete $featureName',
            restOptions: {
                path: `:${$FeatureNameRequestParameters.identifier.id}`,
                apiOkResponseOptions: { type: $Feature },
                tags: [],
            },
            mutationOptions: { required: false },
        },
    };

    static $featureNamePlural(): ApiOperationOptions {
        return this.composeOperationOptions($FeatureNameApiConfiguration.operations.$featureNamePlural);
    }
    static $featureName(): ApiOperationOptions {
        return this.composeOperationOptions($FeatureNameApiConfiguration.operations.$featureName);
    }
    static $featureNameCreate(): ApiOperationOptions {
        return this.composeOperationOptions($FeatureNameApiConfiguration.operations.$featureNameCreate);
    }
    static $featureNameUpdate(): ApiOperationOptions {
        return this.composeOperationOptions($FeatureNameApiConfiguration.operations.$featureNameUpdate);
    }
    static $featureNameDelete(): ApiOperationOptions {
        return this.composeOperationOptions($FeatureNameApiConfiguration.operations.$featureNameDelete);
    }
}
```

Resolvers and controllers use `this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService)` and call the abstract service methods. The concrete implementation is provided by the plugin bound to the feature in `configuration.yaml`.

**Example model (plural-resource; from tutorial-pet):**

```ts
// src/core-staging/features/$featureId/$featureId.model.ts
import { Field, FieldType } from '@api-decorators';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { ObjectType, InputType } from '@nestjs/graphql';

const { id } = FieldType;

@InputType({ description: '$FeatureName Filter Input' })
export class $FeatureNameFilterInput {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'user identifier' })
    userIdentifier?: string;
}

@InputType({ description: '$FeatureName Input' })
export class $FeatureNameInput {
    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'user identifier' })
    userIdentifier?: string;
}

@ObjectType({ description: '$FeatureName' })
export class $Feature {
    @Field({ description: 'id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'user identifier' })
    userIdentifier?: string;
}

@ObjectType({ description: '$FeatureName Result Set' })
export class $FeatureNameResultSet extends ResultSet<$Feature> {
    @Field({ type: () => [$Feature], description: 'results' })
    results?: $Feature[];
}

export class $FeatureNameResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];

    @Field({ description: 'user identifier' })
    userIdentifier?: string;

    @Field({ description: 'first name' })
    firstName?: string;
}
```

**Example resolver (plural-resource; from tutorial-pet):**

```ts
// src/core-staging/features/$featureId/$featureId.resolver.ts
import { $Feature, $FeatureFilterInput, $FeatureNameInput, $FeatureNameResultSet } from '@feature-$featureId';
import { $FeatureNameRequestParameters } from './$featureId.parameters';
import { $FeatureNameApiConfiguration } from './$featureId.api.configuration';
import { Context } from '@nestjs/graphql';
import { $FeatureNameService } from './$featureId.service';
import { $FeatureNameModule } from './$featureId.module';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';

const feature = $FeatureNameModule.feature;

@Resolver((of) => $Feature, { feature })
export class $FeatureNameResolver extends BaseFeatureResolver {
    @Query(() => $FeatureNameResultSet, $FeatureNameApiConfiguration.$featureNamePlural().queryOptions, feature)
    async $featureNamePlural(
        @Args({ parameter: $FeatureNameRequestParameters.filter, type: () => $FeatureNameFilterInput, required: false })
        filter: $FeatureNameFilterInput,
        @Args({ parameter: $FeatureNameRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context() context: any,
    ): Promise<$FeatureNameResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return await service.get$FeatureNamePlural(filter, pagination, requestContext, context);
    }

    @Query(() => $Feature, $FeatureNameApiConfiguration.$featureName().queryOptions, feature)
    async $featureName(
        @Args({ parameter: $FeatureNameRequestParameters.identifier, required: true })
        identifier: string,
        @Context() context: any,
    ): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return await service.get$FeatureName(identifier, requestContext, context);
    }

    @Mutation(() => $Feature, $FeatureNameApiConfiguration.$featureNameCreate().mutationOptions, feature)
    async $featureNameCreate(
        @Args({ parameter: $FeatureNameRequestParameters.$featureName, type: () => $FeatureNameInput, required: true })
        $featureName: $FeatureNameInput,
        @Context() context: any,
    ): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return await service.create$FeatureName($featureName, requestContext, context);
    }

    @Mutation(() => $Feature, $FeatureNameApiConfiguration.$featureNameUpdate().mutationOptions, feature)
    async $featureNameUpdate(
        @Args({ parameter: $FeatureNameRequestParameters.identifier, required: true })
        identifier: string,
        @Args({ parameter: $FeatureNameRequestParameters.$featureName, type: () => $FeatureNameInput, required: true })
        $featureName: $FeatureNameInput,
        @Context() context: any,
    ): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return await service.update$FeatureName(identifier, $featureName, requestContext, context);
    }

    @Mutation(() => $Feature, $FeatureNameApiConfiguration.$featureNameDelete().mutationOptions, feature)
    async $featureNameDelete(
        @Args({ parameter: $FeatureNameRequestParameters.identifier, required: true })
        identifier: string,
        @Context() context: any,
    ): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return await service.delete$FeatureName(identifier, requestContext, context);
    }
}
```

**Example controller (plural-resource; from tutorial-pet):**

```ts
// src/core-staging/features/$featureId/$featureId.controller.ts
import { Body, Param, Query, Req } from '@nestjs/common';
import { $FeatureNameRequestParameters } from './$featureId.parameters';
import { $Feature, $FeatureNameFilterInput, $FeatureNameInput, $FeatureNameResultSet, $FeatureNameResultSetQuery } from './$featureId.model';
import { FastifyRequest } from 'fastify';
import { $FeatureNameService } from './$featureId.service';
import { $FeatureNameModule } from './$featureId.module';
import { $FeatureNameApiConfiguration } from './$featureId.api.configuration';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';

const feature = $FeatureNameModule.feature;

@Controller({ tags: '$featureId', path: '$featureId', feature })
export class $FeatureNameController extends BaseFeatureController {
    @Get($FeatureNameApiConfiguration.$featureNamePlural().restOptions, feature)
    async $featureNamePlural(@Req() request: FastifyRequest, @Query() query: $FeatureNameResultSetQuery): Promise<$FeatureNameResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);
        const filter: $FeatureNameFilterInput = {
            identifiers: query.identifiers,
            userIdentifier: query.userIdentifier,
            firstName: query.firstName,
        };
        return await service.get$FeatureNamePlural(filter, resultSetQuery.pagination, requestContext, request);
    }

    @Get($FeatureNameApiConfiguration.$featureName().restOptions, feature)
    async $featureName(
        @Param($FeatureNameRequestParameters.identifier.id) identifier: string,
        @Req() request: FastifyRequest,
    ): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        return await service.get$FeatureName(identifier, requestContext, request);
    }

    @Post($FeatureNameApiConfiguration.$featureNameCreate().restOptions, feature)
    async $featureNameCreate(@Body() $featureName: $FeatureNameInput, @Req() request: FastifyRequest): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        return await service.create$FeatureName($featureName, requestContext, request);
    }

    @Put($FeatureNameApiConfiguration.$featureNameUpdate().restOptions, feature)
    async $featureNameUpdate(
        @Param($FeatureNameRequestParameters.identifier.id) identifier: string,
        @Body() $featureName: $FeatureNameInput,
        @Req() request: FastifyRequest,
    ): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        return await service.update$FeatureName(identifier, $featureName, requestContext, request);
    }

    @Delete($FeatureNameApiConfiguration.$featureNameDelete().restOptions, feature)
    async $featureNameDelete(
        @Param($FeatureNameRequestParameters.identifier.id) identifier: string,
        @Req() request: FastifyRequest,
    ): Promise<$Feature> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        return await service.delete$FeatureName(identifier, requestContext, request);
    }
}
```

**Example parameters (plural-resource; from tutorial-pet):**

```ts
// src/core-staging/features/$featureId/$featureId.parameters.ts
import { RequestParameterDefinition, RequestParameters, RequestParametersType } from '@api-parameters';

export interface $FeatureNameRequestParametersType extends RequestParametersType {
    $featureName: RequestParameterDefinition;
}

export const $FeatureNameRequestParameters: $FeatureNameRequestParametersType = {
    ...RequestParameters,
    $featureName: {
        id: '$featureName',
        description: '$featureName',
    },
};
```

If the framework `RequestParameters` does not include `identifier`, add `identifier: { id: 'identifier', description: 'Path identifier' }`. REST path param uses `$FeatureNameRequestParameters.identifier.id`. For generic naming use `item` instead of `$featureName`.

**Example errors (plural-resource; from tutorial-pet):**

```ts
// src/core-staging/features/$featureId/$featureId.error.ts
import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface $FeatureNameErrorsType extends FeatureErrorsType {
    get$FeatureNamePluralFailed: ErrorType;
    get$FeatureNameFailed: ErrorType;
    create$FeatureNameFailed: ErrorType;
    update$FeatureNameFailed: ErrorType;
    delete$FeatureNameFailed: ErrorType;
    $featureNameExists: ErrorType;
    $featureNameNotEditable: ErrorType;
}

export class $FeatureNameErrors extends FeatureErrors {
    protected static errors: $FeatureNameErrorsType = {
        ...FeatureErrors.errors,
        get$FeatureNamePluralFailed: {
            code: 'GET_$FEATURENAMEPLURAL_FAILED',
            message: 'Get $featureNamePlural failed',
            statusCode: 400,
        },
        get$FeatureNameFailed: {
            code: 'GET_$FEATURENAME_FAILED',
            message: 'Get $featureName failed',
            statusCode: 400,
        },
        create$FeatureNameFailed: {
            code: 'CREATE_$FEATURENAME_FAILED',
            message: 'Create $featureName failed',
            statusCode: 400,
        },
        update$FeatureNameFailed: {
            code: 'UPDATE_$FEATURENAME_FAILED',
            message: 'Update $featureName failed',
            statusCode: 400,
        },
        delete$FeatureNameFailed: {
            code: 'DELETE_$FEATURENAME_FAILED',
            message: 'Delete $featureName failed',
            statusCode: 400,
        },
        $featureNameExists: {
            code: '$FEATURENAME_EXISTS',
            message: '$FeatureName already exists',
            statusCode: 400,
        },
        $featureNameNotEditable: {
            code: '$FEATURENAME_NOT_EDITABLE',
            message: '$FeatureName not editable',
            statusCode: 400,
        },
    };

    static get$FeatureNamePluralFailed(): HttpException {
        return this.composeHTTPError(this.errors.get$FeatureNamePluralFailed);
    }
    static get$FeatureNameFailed(): HttpException {
        return this.composeHTTPError(this.errors.get$FeatureNameFailed);
    }
    static create$FeatureNameFailed(): HttpException {
        return this.composeHTTPError(this.errors.create$FeatureNameFailed);
    }
    static update$FeatureNameFailed(): HttpException {
        return this.composeHTTPError(this.errors.update$FeatureNameFailed);
    }
    static delete$FeatureNameFailed(): HttpException {
        return this.composeHTTPError(this.errors.delete$FeatureNameFailed);
    }
    static $featureNameExists(): HttpException {
        return this.composeHTTPError(this.errors.$featureNameExists);
    }
    static $featureNameNotEditable(): HttpException {
        return this.composeHTTPError(this.errors.$featureNameNotEditable);
    }
}
```

In the `errors` object, use literal uppercase codes (e.g. `PETS_GET_FAILED` for pet); the placeholders `$FEATURENAMEPLURAL` / `$FEATURENAME` above indicate the pattern. For generic naming use `getFailed`, `createFailed`, `updateFailed`, `deleteFailed`, `exists`, `notEditable`.

**Example index (re-exports):**

```ts
// src/core-staging/features/$featureId/index.ts
export * from './$featureId.module';
export * from './$featureId.model';
export * from './$featureId.parameters';
export * from './$featureId.api.configuration';
export * from './$featureId.service';
export * from './$featureId.controller';
export * from './$featureId.resolver';
export * from './$featureId.error';
```

## Testing

**You must create a corresponding `*.spec.ts` file for every feature resolver and controller file you create or extend.** Do not skip specs.

- **Resolver:** For every `$featureId.resolver.ts` created, create `$featureId.resolver.spec.ts` in the same directory. Use `FeatureResolverTestHarness.create({ featureId: '$featureId', consumerIds: ['site-1'] })` and `harness.createResolver($FeatureNameResolver, { service: mockService })`. Mock the feature's abstract service and assert query/mutation behavior.
- **Controller:** For every `$featureId.controller.ts` created, create `$featureId.controller.spec.ts` in the same directory. Use the appropriate controller test harness; mock the feature service and assert REST endpoint behavior.

When extending a feature in an app (e.g. feature extension), create or update the resolver and controller spec files so they exercise the extended resolver and controller. Do not skip specs when adding or extending a resolver or controller.

## tsconfig.paths.json

**Always create** a `tsconfig.paths.json` at the feature root. It is discovered by `yarn generate:tsconfig` and merged into the root tsconfig. Use repo-relative paths so that no project-specific config need be read.

**How to generate paths:**

1. **Resolve feature root path `$FEATURE_PATH`** (repo-relative, no leading slash):
   - **Default:** `src/core-staging/features/$featureId`
   - **Only when user explicitly stated app:** `src/apps/$appId/features/$featureId` (derive `$appId` from prompt, e.g. "catalyst-cerebrum" → `catalyst-cerebrum`)
   - **Only when user explicitly asked for core-modules:** `core-modules/features/$featureId`
2. **Build the paths object:** Two entries so imports like `@feature-$featureId` and `@feature-$featureId/models` resolve:
   - `"@feature-$featureId"` → `["$FEATURE_PATH"]`
   - `"@feature-$featureId/*"` → `["$FEATURE_PATH/*"]`
3. **Top-level key:** Use `"paths"` at the root of the JSON (some repos merge this into `compilerOptions.paths`; the build tool discovers it).

**Example (default — core-staging feature):**

```json
{
  "paths": {
    "@feature-$featureId": ["src/core-staging/features/$featureId"],
    "@feature-$featureId/*": ["src/core-staging/features/$featureId/*"]
  }
}
```

**Example (app feature):** Replace the path array with `["src/apps/$appId/features/$featureId"]` and `["src/apps/$appId/features/$featureId/*"]`.

## setup.configuration.yaml

**Always create** a `setup.configuration.yaml` in the feature directory with example YAML configuration for the feature: `id`, `enabled`, and **`plugin.id`** (default—feature expects a plugin; use a placeholder if no plugin was named). Use **`standalone: true`** only when the user **explicitly** requested a standalone feature. This is used by install/configuration tooling. See the examples in the Feature structure section above.

## Application configuration.yaml (feature entry)

To enable the feature in an application without reading existing `configuration.yaml`, add a feature entry under the top-level `features:` key. Use the templated snippet below and derive values as follows.

**How to derive template values:**

| Placeholder | Derivation |
|-------------|------------|
| `$featureId` | Feature id from the user prompt (e.g. `user`, `pet`). Same as in "Deriving specific code." |
| `$plugin_anchor` | YAML anchor name for the plugin this feature uses. Derive from prompt when the user names a plugin (e.g. "user-db plugin" → `&user-db`, reference as `*user-db`). When no plugin was named, use a placeholder (e.g. `$PLUGIN_ID`) so a plugin can be bound later. Omit only when the user **explicitly** requested a standalone feature. |
| `enabled` | `true` to enable the feature; omit or set `false` to disable. |
| `standalone` | Set **`standalone: true`** only when the user **explicitly** requests a standalone feature (no plugins). Do not assume standalone when no plugin was mentioned—default is that the feature expects a plugin. |

**Templated feature entry (paste under `features:` in application configuration.yaml):**

**Default (feature expects a plugin—use unless the user explicitly requested standalone):**

```yaml
  -
    id: $featureId
    enabled: true
    plugin:
      id: *$plugin_anchor
```

When the user named a plugin, use its anchor. When no plugin was named, use a placeholder plugin id so that a plugin can be bound in configuration when one is added.

**Only when the user explicitly specifies the feature is standalone** (no plugins):

```yaml
  -
    id: $featureId
    enabled: true
    standalone: true
```

**Note:** The application must define a `plugins:` block with an entry whose `id` matches the plugin when the feature uses a plugin (the default). If the plugin is a database plugin, the application must also define a `databases:` block and reference that database in the plugin's `database.id`. See the Plugin skill "Application configuration.yaml (plugin and feature wiring)" for a full snippet that includes databases, plugins, and features.

## Documentation

**Mandatory:** Every new feature **must** include a **`docs`** directory with **`index.md`**; feature creation is incomplete without it.

Feature documentation lives in a **`docs`** directory next to the feature, with an **`index.md`** that describes the feature for developers and integrators.

→ **Content and structure:** [Documentation skill](../docs/SKILL.md), [feature-docs.md](../docs/feature-docs.md)

**Diagrams:** Required; see [feature-docs.md](../docs/feature-docs.md) §6 (Diagrams).

**Additions to existing core-modules:** When the new feature is an addition to existing core-modules (e.g. created under `src/core-staging` while related code exists in core-modules), create docs at the **new component location only**; **do not create or update documentation under core-modules.**

**Document title:** The first-level heading in `index.md` must include a location suffix: **" (Staging)"** when the feature is under `src/core-staging`; **" ($appId)"** when under `src/apps/$appId`. See [feature-docs.md](../docs/feature-docs.md).

Summary: document purpose and logic; controller operations (if any); GraphQL queries and mutations (if any); schema (model) detail; and the **service interface contract** that plugins must implement.

**Checklist (feature deliverables):** If the user only mentioned a feature group (e.g. "commerce", "commerce feature group"), I am using the default path (`src/core-staging/...`) and **not** creating under `core-modules/` unless they explicitly requested core or core-modules. Mentioning a feature group (e.g. "in commerce", "commerce feature group", "for commerce") counts as only mentioning the group — use **`src/core-staging/features/<group>/$featureId/`** and do **not** create under `core-modules/`. **`$featureId.api.configuration.ts` is fully populated** with every operation before resolver/controller are written. Resolver imports `Args`, `Query`, `Mutation`, `Resolver` from `@api-decorators` and wires each handler to `$FeatureNameApiConfiguration.<operation>()`. Controller imports `Controller`, `Get`, `Post`, `Put`, `Delete` from `@api-decorators` and wires each route to `$FeatureNameApiConfiguration.<operation>().restOptions`. For every resolver file created → `$featureId.resolver.spec.ts`; for every controller file created → `$featureId.controller.spec.ts`; `tsconfig.paths.json` created; `setup.configuration.yaml` created with example YAML; `docs/index.md` created per [Documentation skill](../docs/SKILL.md) / [feature-docs.md](../docs/feature-docs.md) (at the new component location when an addition to core-modules; title includes " (Staging)" or " ($appId)" when in core-staging or app; diagrams per feature-docs.md §6).

**Docs gate:** I have created **`docs/index.md`** at the feature root (e.g. `$featureRoot/docs/index.md`) with overview, controller/GraphQL API, schema, service contract, and the required Mermaid diagrams from [feature-docs.md](../docs/feature-docs.md) §6. Feature creation is not complete without this file.

## Feature extension

When an app needs to add custom fields or response types to a core feature (without changing core), use a **feature extension** in the app directory. This keeps core unchanged and allows the API to expose extended types (e.g. `Ext$Feature`, `Ext$FeatureResultSet`).

→ **Full steps and code:** [feature-extension.md](feature-extension.md)

Summary:

- Extension files go under **`src/apps/$appId/features/$featureId/`** with the **same path and file names** as core.
- Use the **`Ext`** prefix for extension types (e.g. `Ext$Feature`, `Ext$FeatureResultSet`, `Ext$FeatureInput`).
- Extend the base API configuration and **override getter methods** to set the extension type on the returned options object, then return it.
- Resolver and controller in the app import the app’s API configuration and Ext types; they return Ext types and use the same service interface.

## Parallel use

**You must launch a separate agent** running the Plugin skill when both a feature (or feature extension) and a plugin are being created and there are no dependencies between the two. Use the task/agent tool to launch the Plugin agent in parallel (e.g. `mcp_task` with subagent_type and a prompt that instructs the agent to follow the Plugin skill). Do **not** implement the plugin yourself in the same agent. This skill defines the contract; the other agent provides the implementation.
