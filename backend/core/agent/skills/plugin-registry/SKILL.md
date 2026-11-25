---
name: create-plugin-registry
description: Guides creation of plugin registries extending BaseRegistry. Use when the user asks to create a plugin registry, add a registry to a plugin, or implement a common registry. Ensures correct base class usage, naming, plugin module discovery, and setup.env for REGISTRY_CONFIG.
---

# Create Plugin Registry

This skill guides creation of registries that integrate with the Cerebrum plugin module. Registries extend `BaseRegistry`, are discovered by file/class naming under the plugin path, and are configured via the `REGISTRY_CONFIG` environment variable (JSON).

## When to use this skill

- User asks to **create a plugin registry**, **add a registry** to a plugin, or **implement a registry**.
- User wants a **feature registry** (per–plugin-feature) or a **common registry** (shared across all features of a plugin).

## Base class (BaseRegistry)

**Source:** `core/foundation/registry/base.registry.ts`

- **Abstract (required in child):**
  - `protected abstract load(): Promise<any>` — load and store data (e.g. call `fetchData()`, then assign to private state).
  - `protected abstract fetchData(): Promise<any>` — fetch data from datasource/API; return raw data for `load()` to process.
  - `abstract getRegistryData()` — return the in-memory registry data (e.g. the private `data` object).

- **Provided by base (use in child):**
  - Constructor receives: `componentId`, `registryId`, `consumerIds`, `plugin`, `moduleRef`, `configService`, `logger`. Do not instantiate directly; the plugin module calls `RegistryClass.initializeInstance(...)`.
  - `this.defaultConsumerId` — resolved plugin default consumer.
  - `this.registryId` — e.g. `$pluginId.$featureId.registry` or `$pluginId.common.$name.registry`.
  - `this.plugin` — plugin module data (feature, configuration).
  - `fetchRegistryConfiguration()` — reads from `REGISTRY_CONFIG` env (JSON). Config key: `registryId` with `.registry` stripped (e.g. `commercetools.category` or `commercetools.common.oauth`).
  - `getRegistryConfiguration()` / `this.registryConfiguration` — `{ refreshInterval?: number; disabled?: boolean }`. If `disabled: true`, registry does not load; if `refreshInterval` (ms) is set, a timer calls `refresh()` periodically.
  - `getDatasource<T>(consumerId?, datasourceInterface?)` — get plugin datasource by consumer (defaults to `defaultConsumerId`). Pass `CommercetoolsCategoryDatasource` (or your datasource class) for typed access.
  - `getMapper<T>(consumerId?, mapperInterface?)`, `getService<T>(consumerId, serviceInterface)` — resolve plugin mapper/service.
  - `getRegistry<T>(registryInterface: { id: string }, consumerId?)` — get another registry by id.
  - `getRequestContext(consumerId?, locale?)` — build a minimal request context for datasource calls.
  - `getPluginConsumerConfiguration<T>(requestContext)`, `getPluginConfiguration<T>()`, `getFeatureConfiguration<T>()` — plugin/feature config.
  - `refresh()` — re-runs `load()`. Called by timer when `refreshInterval` is set, or manually.
  - `isEnabled()` — false if config has `disabled: true`.

- **RegistryConfiguration** (`core/foundation/registry/types/registry-configuration.type.ts`): `refreshInterval?: number` (milliseconds), `disabled?: boolean`.

## Naming and plugin module initialization

**Source:** `core/foundation/plugin/module/plugin.module.ts`

- **Component type:** `registry` — file suffix `*.registry.ts`, class name suffix `Registry`.
- **Feature registry:** Lives under the plugin feature directory. File pattern: `*$pluginId.$featureId*.registry.ts` (e.g. `commercetools.category.registry.ts`). Path: `plugins/$pluginId/features/$featureId/`. The plugin module builds the format `**/$pluginId/features/$featureId/**/*$pluginId.$featureId*.registry.js` and discovers the class; it sets `classObj.registryId = fileName.replace(".js", "")` (e.g. `commercetools.category.registry`).
- **Common registry:** Shared across all features of the plugin. File pattern: `*$pluginId.common*.registry.ts` (e.g. `commercetools.common.oauth.registry.ts`). Path: `plugins/$pluginId/common/`. File format used by module: `**/$pluginId/**/*$pluginId.common*.registry.js`.
- **REGISTRY_CONFIG key:** The base registry looks up config by `registryId.replace(".registry", "")` (e.g. `commercetools.category` or `commercetools.common.oauth`). Use that key in the JSON for `refreshInterval` and `disabled`.

## Default location

**Where to create:** Follow the uniform rules in [Component location](../component-location/SKILL.md). The rules are the same for all component types; never create under `core/` or `core-modules/` unless the user explicitly requests it, and create `src/core-staging` if it does not exist.

- Create new registry under **`src/core-staging`**: feature registry at `src/core-staging/plugins/$pluginId/features/$featureId/`, common registry at `src/core-staging/plugins/$pluginId/common/`. Use **`src/apps/$appId`** or **core-modules** only when the user explicitly requests it.

## Feature registry template

Use this pattern (based on `core-modules/plugins/commerce/commercetools/features/category/commercetools.category.registry.ts`). Replace `$PluginId`, `$FeatureId`, `$PluginName`, `$FeatureName`, `$RegistryName`, `$ItemType`, and the datasource/getter logic.

```typescript
import { BaseRegistry } from "@registry";
import { $PluginName$FeatureNameDatasource } from "./$pluginId.$featureId.datasource";
// Import schema/type for $ItemType (e.g. from ./schema/...)

export class $PluginName$FeatureNameRegistry extends BaseRegistry {
    private data: Record<string, $ItemType> = {};

    protected async load() {
        const methodname = `${$PluginName$FeatureNameRegistry.name}.load`;

        const items = await this.fetchData();

        if (items?.length > 0) {
            const map: Record<string, $ItemType> = {};
            items.forEach((item) => {
                map[item.id] = item;
            });
            this.data = map;
        }

        this.logger.info(`${methodname} - Loaded registry [${this.registryId}]: ${this.logger.formatJSON(this.data)}`);
    }

    protected async fetchData() {
        const methodname = `${$PluginName$FeatureNameRegistry.name}.fetchData`;

        const ds = this.getDatasource<$PluginName$FeatureNameDatasource>(this.defaultConsumerId, $PluginName$FeatureNameDatasource);

        try {
            return await ds.getYourResultSet({ consumer: this.defaultConsumerId });
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching data: ${this.logger.formatJSON(error)}`);
        }
        return [];
    }

    getRegistryData() {
        return this.data;
    }

    getItem(id: string) {
        return this.data[id];
    }
}
```

- **File name:** `$pluginId.$featureId.registry.ts` (e.g. `commercetools.category.registry.ts`).
- **Registry id:** `$pluginId.$featureId.registry`. Config key in REGISTRY_CONFIG: `$pluginId.$featureId`.

## Common registry template

Use this pattern (based on `core-modules/plugins/commerce/commercetools/common/commercetools.common.oauth.registry.ts`). Replace placeholders; common registries often use a **common** or **base** datasource.

```typescript
import { BaseRegistry } from "@registry";
import { $PluginNameBaseDatasource } from "./$pluginId.base.datasource";
// Import response/type (e.g. GetTokenResponse) from ./schema/ or ./types

export class $PluginNameCommon$RegistryNameRegistry extends BaseRegistry {
    private data: { /* shape, e.g. adminClient: TokenResponse; client: TokenResponse */ };

    protected async load() {
        const methodname = `${$PluginNameCommon$RegistryNameRegistry.name}.load`;

        const fetched = await this.fetchData();

        this.data = {
            // assign from fetched (e.g. adminClient, client)
        };
    }

    protected async fetchData(): Promise</* your type */> {
        const methodname = `${$PluginNameCommon$RegistryNameRegistry.name}.fetchData`;

        const ds = this.getDatasource<$PluginNameBaseDatasource>(this.defaultConsumerId, $PluginNameBaseDatasource);

        try {
            const [adminClient, client] = await Promise.all([
                ds.getClientToken({ consumer: this.defaultConsumerId }, false),
                ds.getClientToken({ consumer: this.defaultConsumerId }, true),
            ]);
            return [adminClient, client];
        } catch (error) {
            this.logger.info(`${methodname} - Error: ${error}`);
        }
        return [];
    }

    getRegistryData() {
        return this.data;
    }

    getAdminClientAccessToken() {
        return this.data.adminClient?.access_token;
    }

    getClientAccessToken() {
        return this.data.client?.access_token;
    }
}
```

- **File name:** `$pluginId.common.$name.registry.ts` (e.g. `commercetools.common.oauth.registry.ts`).
- **Registry id:** `$pluginId.common.$name.registry`. Config key in REGISTRY_CONFIG: `$pluginId.common.$name`.

## Setup.env and REGISTRY_CONFIG

- **REGISTRY_CONFIG** is a single environment variable whose value is a **JSON string**. It holds a map of registry config keys to `{ refreshInterval?: number; disabled?: boolean }`.
- **Config key:** Use `registryId.replace(".registry", "")` (e.g. `commercetools.category`, `commercetools.common.oauth`).

Create a **`setup.env`** file alongside the registry file (same directory) with an example the user can copy into their app `.env`:

```bash
# Registry configuration (JSON string). Merge the object below into REGISTRY_CONFIG in your app .env.
# If REGISTRY_CONFIG already exists, merge the "$configKey" entry into the existing JSON.
# REGISTRY_CONFIG={"$configKey":{"refreshInterval":300000,"disabled":false}}
REGISTRY_CONFIG={"$configKey":{"refreshInterval":300000,"disabled":false}}
```

Replace `$configKey` with the actual key (e.g. `my-plugin.my-feature` or `my-plugin.common.oauth`). For multiple registries, the value is one JSON object with multiple keys, e.g. `{"plugin1.feature1":{"refreshInterval":300000,"disabled":false},"plugin1.common.oauth":{"refreshInterval":60000}}`.

### If user specified an app

- Open `src/apps/$appId/.env` (or the app’s env file path).
- If `REGISTRY_CONFIG` is not set, add a line: `REGISTRY_CONFIG={"$configKey":{"refreshInterval":300000,"disabled":false}}`.
- If `REGISTRY_CONFIG` already exists, merge the new registry’s key into the existing JSON (parse, add key, stringify back). Preserve other registries in the same variable.

## Deriving names from the user prompt

| Placeholder | Derivation | Example (plugin "my-plugin", feature "category") |
|-------------|------------|--------------------------------------------------|
| `$pluginId` | Lowercase, hyphenated plugin id | `my-plugin` |
| `$featureId` | Lowercase, hyphenated feature id (feature registry) | `category` |
| `$PluginName` | PascalCase plugin name | `MyPlugin` |
| `$FeatureName` | PascalCase feature name | `Category` |
| `$RegistryName` | Purpose for common registry (PascalCase) | `OAuth` |
| **Feature registry class** | `$PluginName$FeatureNameRegistry` | `MyPluginCategoryRegistry` |
| **Feature registry file** | `$pluginId.$featureId.registry.ts` | `my-plugin.category.registry.ts` |
| **Common registry class** | `$PluginNameCommon$RegistryNameRegistry` | `MyPluginCommonOAuthRegistry` |
| **Common registry file** | `$pluginId.common.$name.registry.ts` | `my-plugin.common.oauth.registry.ts` |
| **Config key (feature)** | `$pluginId.$featureId` | `my-plugin.category` |
| **Config key (common)** | `$pluginId.common.$name` | `my-plugin.common.oauth` |

## Checklist

- [ ] New registry class extends `BaseRegistry`, implements `load()`, `fetchData()`, and `getRegistryData()`.
- [ ] Class name ends with `Registry`; file name is `*.registry.ts` and matches plugin pattern (feature: `$pluginId.$featureId.registry.ts`; common: `$pluginId.common.$name.registry.ts`).
- [ ] Feature registry lives under `src/core-staging/plugins/$pluginId/features/$featureId/`; common under `src/core-staging/plugins/$pluginId/common/`.
- [ ] `setup.env` created alongside the registry with a `REGISTRY_CONFIG` example using the correct config key (`registryId` with `.registry` removed).
- [ ] If user specified an app, merge or add the registry config into that app’s `.env` for `REGISTRY_CONFIG`.
