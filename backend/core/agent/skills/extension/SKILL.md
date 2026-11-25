---
name: extension
description: Ensures feature/component extensions, app-specific plugins, and consumer-specific plugin extensions are created in the correct app directory with the correct naming and API configuration pattern. Requires valid *.spec.ts testing harness files and extension documentation (app docs with Extensions/Consumer extensions sections). Use when the user asks to extend a core feature, add custom fields to a feature, create an extension model, add an app-specific plugin, or create a consumer-specific extension of a plugin (e.g. service, mapper, datasource, registry, middleware for a given consumer id).
---

# Extension and App Plugin Rules

When creating **extensions** of core components or **app-specific plugins**, follow these rules so extensions live in the app directory and do not modify core.

## Do not reference project code

**Do not reference project code.** Use only the templates in this skill and in the Feature skill (and feature-extension.md). Derive **$appId**, **$featureId**, **$FeatureName**, and all operation/getter/method names from the user prompt using the Feature skill "Deriving specific code from the user prompt." Extension API configuration getter names (e.g. users(), user(), userUpdate(), userDelete()) and resolver/controller method names and service calls must match the base feature's naming convention (generic or plural-resource). Custom fields on Ext types come from the user prompt (e.g. "add thumbnail, image, lastLogon, field1, field2, field3" → add those to Ext$FeatureName and Ext$FeatureNameInput). Do not look at existing project code to discover names or types.

## Never edit core-modules

**Do not, under any circumstance, edit files under `./core-modules/`.** Core-modules is read-only for extension work. All extensions, custom fields, extended types, and app-specific overrides must live under **`./src/apps/$appId/`** (e.g. `src/apps/catalyst-cerebrum/features/user/`) or, for new shared helpers not tied to one app, under **`./src/core-staging/`**. If you need to add or change behavior or types for an app, create or edit files only in those locations; never modify core-modules.

**This applies even when:**

- The base feature resolver, model, or parameters live in `core-modules/features/...`
- The base plugin service lives in `core-modules/plugins/...`
- The change is "small" (one GraphQL field, one filter arg, one enrichment hook)
- Existing imports or tsconfig already point at core-modules

**Example (correct):** BIWS workshop inventory on products → `src/apps/shell-biws/features/product/product-ext.model.ts`, `product.resolver.ts`, and `src/apps/shell-biws/plugins/commercetools/features/product/commercetools.product.service.ts` extending the base commercetools product service.

**Example (wrong):** Editing `core-modules/features/commerce/product/product.model.ts` to add `workshopInventory`.

## 1. Where Extension Files Go

- **Path rule**: Extension files belong under **`src/apps/$appId/`** where `$appId` is the application that needs the extension (e.g. `catalyst-cerebrum`).
- **Same path as core**: The directory path and **file name** under the app must match the core exactly. Where the *base* (core) component lives is governed by [Component location](../component-location/SKILL.md) (default `src/core-staging`; never `core/` or `core-modules/` unless explicitly requested).
  - Core (default): `src/core-staging/features/user/user.resolver.ts` → Extension: `src/apps/catalyst-cerebrum/features/user/user.resolver.ts`
- Do **not** add extension-only types or extension logic to files under `core-modules/` or `core/`. Keep core unchanged; override or extend only from the app.

## 2. Extension Class Naming

- Use the **`Ext`** prefix for extension types, not `Extension` or `Extended`.
  - ✅ `ExtUser`, `ExtUserResultSet`, `ExtUserInput`
  - ❌ `ExtendedUser`, `UserExtension`, `ExtendedUserResultSet`
- Name extension model files accordingly (e.g. `user-ext.model.ts` for `ExtUser`, `ExtUserResultSet`, `ExtUserInput`).

## 3. API Configuration Extensions

- Do **not** put extension response types directly on the base `operations` object in core.
- In the **app** extension of the API configuration (e.g. `src/apps/catalyst-cerebrum/features/user/user.api.configuration.ts`):
  - **Extend** the base API configuration class from the feature (e.g. `UserApiConfiguration` from `@feature-user`).
  - **Override the getter methods** (e.g. `users()`, `user()`, `userUpdate()`, `userDelete()`).
  - In each overridden getter: call `super.users()` (or the corresponding method), then **set the extension model on the returned options object** (e.g. set `restOptions.apiOkResponseOptions.type` to `ExtUserResultSet` or `ExtUser`), then **return** that object.

Example pattern:

```ts
import { ApiOperationOptions } from '@api';
import { UserApiConfiguration as BaseUserApiConfiguration } from '@feature-user';
import { ExtUser, ExtUserResultSet } from './user-ext.model';

export class UserApiConfiguration extends BaseUserApiConfiguration {
    static override users(): ApiOperationOptions {
        const options = super.users();
        if (options.restOptions) {
            options.restOptions = {
                ...options.restOptions,
                apiOkResponseOptions: {
                    ...options.restOptions.apiOkResponseOptions,
                    type: ExtUserResultSet,
                },
            };
        }
        return options;
    }
    // ... same pattern for user(), userUpdate(), userDelete()
}
```

## 4. App-Specific Plugins

- **Where to create:** Follow the uniform rules in [Component location](../component-location/SKILL.md). For new plugins: default **`src/core-staging/plugins/$pluginId/`**; use **`src/apps/$appId/plugins/`** only when the user explicitly states to create in the app; use **`core/`** or **`core-modules/plugins/`** only when the user explicitly requests it. Create `src/core-staging` if it does not exist.
  - Example (app, when user explicitly requested): `src/apps/catalyst-cerebrum/plugins/user-db/`
- Core-modules plugins are for shared, reusable implementations; app plugins are for that app only.
- In app plugins, import extension types (e.g. `ExtUser`) from the app's feature extension using a **relative path** to the app's feature (e.g. `../../../../features/user/user-ext.model` from the plugin's feature folder).

## 5. Resolver and Controller Extensions

- In the app's `user.resolver.ts` and `user.controller.ts`:
  - Import the **app's** `UserApiConfiguration` (the one that extends the base and overrides getters) from the same app directory (e.g. `./user.api.configuration`).
  - Use the **Ext** types (e.g. `ExtUser`, `ExtUserResultSet`) from the app's extension model (e.g. `./user-ext.model`) for return types and decorators.

## 6. Consumer-specific extensions

A **consumer-specific extension** overrides or extends a **plugin component** or **middleware** (framework component) for a single consumer (e.g. `site-1`). The user might say: *"Create an extension of the db-user plugin feature user service for consumer site-1."*

### What can be consumer-specific

Consumer-specific extensions are allowed for:

- **Plugin components:** plugin **datasource**, **service**, **mapper**, and **registry** (plugin-layer only).
- **Middleware:** middleware is a **framework component**, not a plugin component; consumer-specific middleware extensions are allowed and follow the same file-naming rule (e.g. `$consumerId.$originalFileName`), but live under the framework middleware path, not under a plugin.

**Features cannot have consumer-specific extensions.**

### Where consumer extension files go

- **Same directory as the extended file**: Use the same path under the app as the core/plugin (or framework) file you are extending.
- **Plugin components:** Under **`src/apps/$appId/plugins/$pluginId/...`** (or the equivalent path where the plugin file lives). The directory structure must match the plugin’s structure.
- **Middleware:** Under the framework middleware path (middleware is a framework component, not under a plugin).
- **Do not** put consumer-specific logic in core or in the non-consumer-specific file; keep core and shared code unchanged.

### File naming: prepend consumerId

**Prepend the consumer id** to the file name, then the original base name. The extension lives in the **same directory** as the file it extends.

Format: **`$consumerId.$originalFileName`**

Examples:

| Extended file (core or plugin) | Consumer extension (app) |
|--------------------------------|--------------------------|
| `src/core-staging/plugins/db-user/features/user/db-user.user.service.ts` | `src/apps/catalyst-cerebrum/plugins/db-user/features/user/site-1.db-user.user.service.ts` |
| `src/core-staging/plugins/db-user/features/user/db-user.user.mapper.ts` | `src/apps/catalyst-cerebrum/plugins/db-user/features/user/site-1.db-user.user.mapper.ts` |

**Concrete example:** A site-1–specific extension of the db-user plugin’s user service in app `catalyst-cerebrum`:

- Base (e.g. core-staging): `./src/core-staging/plugins/db-user/features/user/db-user.user.service.ts`
- Consumer extension: `./src/apps/catalyst-cerebrum/plugins/db-user/features/user/site-1.db-user.user.service.ts`

(If the core file is named `db-user.service.ts` under that path, then the consumer file is `site-1.db-user.service.ts` in the same directory.)

Same rules as other extensions: same directory path as the extended file; only the file name gains the `$consumerId.` prefix.

### Summary

- Consumer-specific = one consumer id (e.g. `site-1`).
- Allowed for **plugin components** (datasource, service, mapper, registry) and for **middleware** (framework component). **Not** for features.
- File name: **`$consumerId.$originalFileName`** in the **same directory** as the extended file.
- Directory path: plugin components under app plugins path; middleware under framework middleware path.

## 7. Extension testing (*.spec.ts)

**You must create a valid `*.spec.ts` testing harness file for every extension you create** for the following component types. Do not skip specs. The spec file lives in the **same directory** as the extended file (under `src/apps/$appId/`), with the same base name and a `.spec.ts` suffix.

### When to create extension specs

| Extension type | File created | Spec file required |
|----------------|--------------|--------------------|
| Feature resolver | `$featureId.resolver.ts` | `$featureId.resolver.spec.ts` |
| Feature controller | `$featureId.controller.ts` | `$featureId.controller.spec.ts` |
| Plugin service | `$pluginId.$featureId.service.ts` (or consumer `$consumerId.$pluginId.$featureId.service.ts`) | `$pluginId.$featureId.service.spec.ts` (or `$consumerId.$pluginId.$featureId.service.spec.ts`) |
| Plugin datasource | `$pluginId.$featureId.datasource.ts` (or consumer-prefixed) | `$pluginId.$featureId.datasource.spec.ts` (or consumer-prefixed) |
| Plugin mapper | `$pluginId.$featureId.mapper.ts` (or consumer-prefixed) | `$pluginId.$featureId.mapper.spec.ts` (or consumer-prefixed) |

### How to implement extension specs

- **Feature resolver:** Use `FeatureResolverTestHarness.create({ featureId: '$featureId', consumerIds: ['site-1'] })` and `harness.createResolver(ExtendedResolverClass, { service: mockService })`. Mock the feature's abstract service. Assert that resolver methods (queries/mutations) behave correctly; if the extension only overrides decorators or return types, assert those or that the extended resolver delegates to the service as expected.
- **Feature controller:** Use the project's controller test harness. Mock the feature service. Assert REST endpoint behavior; if the extension overrides response types or behavior, assert that the extended controller returns or delegates as expected.
- **Plugin service:** Use `PluginServiceTestHarness.create({ pluginId, featureId, consumerIds, pluginConfiguration?, datasourceConfig? })` and `harness.createService(ExtendedServiceClass, { componentId, datasource: mockDatasource, mapper: mockMapper })`. Mock the datasource and mapper. Assert that overridden methods behave correctly (e.g. call super after extension logic) and that other methods delegate to the base or mocks. If the extension only overrides specific methods, test those overrides and at least one delegation path.
- **Plugin datasource:** Use `PluginDatasourceTestHarness.create({ pluginId, featureId, consumerIds, datasourceConfig? })` and `harness.createDatasource(ExtendedDatasourceClass, { componentId, execute: mockExecute })`. Mock `execute` (and any REST/GraphQL base as needed). Assert that datasource methods call the expected service definitions and params; if the extension adds or overrides methods, test those.
- **Plugin mapper:** Use `PluginMapperTestHarness.create({ pluginId, featureId, consumerIds })` and `harness.createMapper(ExtendedMapperClass, { componentId })`. Assert entity → feature model mapping and result-set mapping; if the extension overrides map methods, assert the extended mapping behavior.

### Requirements

- Extension specs must be **valid** (correct harness, mocks, and assertions so the test run passes). Use the same harness and patterns as the base component's spec (see Feature SKILL "Testing" and Plugin SKILL "Testing").
- Place each spec in the **same directory** as the extended file under the app (e.g. `src/apps/catalyst-cerebrum/features/user/user.resolver.spec.ts`, `src/apps/catalyst-cerebrum/plugins/commercetools/features/ec-user/commercetools.ec-user.service.spec.ts`).
- When the extended class depends on a base in core or core-staging, ensure mocks or harness config satisfy the base constructor (e.g. for plugin components, mock `@plugin-datasource-rest` or other base deps if the test environment requires it).

## 8. Extension documentation

When creating **any** extension (feature resolver/controller/API config, app-specific plugin, or consumer-specific plugin component), **create or update documentation** so the extension is visible in the generated docs. Follow the **docs skill** ([extension-docs](../docs/extension-docs.md)) for full requirements. Extension component docs must explain **what was extended**, **how it was extended** (overridden methods, new methods), and **purpose**. The project’s `yarn generate:docs`.

### Where to put extension docs

- **Feature extensions:** **`src/apps/$appId/features/$featureId/docs/index.md`** — **Extensions** section with **what was extended**, **how** (overridden getters/methods, new methods, custom fields), and **purpose** per component.
- **App-specific plugin:** Create or update **`src/apps/$appId/plugins/$pluginId/docs/index.md`** with an overview of the app-specific plugin and its behavior.
- **Consumer-specific plugin extensions** (service, datasource, mapper, registry): Create or update the **plugin feature** doc directory for the extended feature: **`src/apps/$appId/plugins/$pluginId/features/$featureId/docs/index.md`** (e.g. `src/apps/catalyst-cerebrum/plugins/commercetools/features/ec-user/docs/index.md`). Add a **Consumer extensions** (or **Extensions**) section that lists each consumer extension, for example:
  - Consumer id (e.g. `site-1`).
  - Component extended (e.g. ec-user service), file name (e.g. `site-1.commercetools.ec-user.service.ts`), and class name (e.g. `Site1CommercetoolsEcUserServiceImpl`).
  - Short description of what is overridden or added (e.g. “Overrides `getEcUsers` to log and delegate to parent.”).

If the app already has plugin feature docs at that path, add the Extensions / Consumer extensions section to the existing `index.md` instead of overwriting it.

### Doc format

- **YAML frontmatter:** Start `index.md` with `title:` and `layout: default` (same pattern as feature or plugin docs elsewhere in the project).
- **Title:** Use a clear, location-specific title (e.g. `commercetools plugin (catalyst-cerebrum)`, `User feature (catalyst-cerebrum)`, or for plugin feature extension docs: `commercetools ec-user (catalyst-cerebrum)`).
- **Content:** Overview (and optionally “Backend integration” for plugins), then **Extensions** or **Consumer extensions** with what/how/purpose and overridden and new methods. See [extension-docs](../docs/extension-docs.md) for detail. No need for full Mermaid diagrams for extension-only docs unless the extension introduces new flows; a short prose description is enough.

### After writing docs

- Run **`yarn generate:docs`** (or the project’s doc-generation command) so the new or updated app docs are copied into the root `docs/` tree and linked from `docs/apps/$appId/index.md`.

## Quick Checklist

When adding or reviewing an extension:

- [ ] **No edits in `./core-modules/`** — never modify core-modules; all extension and custom code goes under `src/apps/$appId/`.
- [ ] Extension files are under `src/apps/$appId/` with the **same path and file names** as core (or, for consumer-specific, same path with **`$consumerId.$originalFileName`**).
- [ ] Extension class names use the **`Ext`** prefix (e.g. `ExtUser`, not `ExtendedUser`) for feature/model extensions.
- [ ] API configuration extension **overrides getter methods**, sets the extension type on the composed options object, and returns it (no extension types in core).
- [ ] **Where to create new plugins:** Follow [Component location](../component-location/SKILL.md). Default `src/core-staging/plugins/`; app or core-modules only when the user explicitly requests.
- [ ] **Consumer-specific:** Only plugin components (datasource, service, mapper, registry) and middleware (framework component); never features. File name is `$consumerId.$originalFileName` in the same directory as the extended file.
- [ ] Core feature and core plugin code is **unchanged** (no extension logic in core).
- [ ] **Extension testing:** For every extension created for feature resolver, feature controller, plugin service, plugin datasource, or plugin mapper, a valid `*.spec.ts` file exists in the same directory, using the appropriate test harness (FeatureResolverTestHarness, controller harness, PluginServiceTestHarness, PluginDatasourceTestHarness, or PluginMapperTestHarness) and mocks; tests pass.
- [ ] **Extension documentation:** For every extension, create or update the corresponding app docs (see §8 and [extension-docs](../docs/extension-docs.md)). Each extension component must document **what was extended**, **how it was extended** (overridden methods, new methods), and **purpose**. Run `yarn generate:docs` so docs are aggregated.
