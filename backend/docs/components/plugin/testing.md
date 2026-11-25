---
title: Plugin component testing
layout: default
---

# Plugin component testing

[← Back to Plugin](plugin.md) · [Testing overview](../../testing.md)

The framework provides a **plugin component testing** harness so you can unit-test plugin **services**, **mappers**, and **datasources** without resolving real implementations from `ModuleRef`. All harness code lives under `core/foundation/plugin/testing/` and is exposed via **`@plugin/testing`**.

## Components covered

| Component | Harness | Purpose |
|-----------|---------|---------|
| **Service** | `PluginServiceTestHarness` | Test plugin services; override `getDatasource` / `getMapper` (and optionally other resolvers) with mocks via `createService(ServiceImplClass, { componentId, datasource?, mapper?, ... })`. |
| **Mapper** | `PluginMapperTestHarness` | Test plugin mappers; override `getMapper`, `getService`, `getDatasource`, `getRegistry` via `createMapper(MapperImplClass, { componentId, mapper?, service?, datasource?, registry?, ... })`. |
| **Datasource** | `PluginDatasourceTestHarness` | Test plugin datasources; ConfigService is set up so `DATASOURCE_CONFIG_*` returns test config (e.g. `host`, `clientId`, `clientSecret`), and you override `execute` (or other resolvers) via `createDatasource(DatasourceImplClass, { componentId, execute?, ... })`. |

## Structure

- **Config** — `PluginTestConfig`: `pluginId`, `featureId`, `featureGroup?`, `consumerIds`, `defaultConsumerId?`, `consumerConfiguration?`, `datasourceConfig?`. Merged with `DEFAULT_PLUGIN_TEST_CONFIG` when you pass partial overrides.
- **Base** — `PluginComponentTestHarness` (abstract) holds shared state (config, plugin, configService, logger, moduleRef, requestContext) and a protected `createComponentInstance(ComponentClass, options)` that instantiates a plugin component and applies resolver overrides from a subclass-defined **resolver map** (e.g. `datasource` → `getDatasource`, `mapper` → `getMapper`).
- **Subclasses** — Each harness defines its own resolver map and public `createService` / `createMapper` / `createDatasource`. All use `PluginServiceTestHarness.create(partialConfig?)` (and similarly for mapper/datasource) to build the harness.
- **Mocks** — `createMockLogger`, `createMockPlugin`, `createMockConfigService`, `createMockRequestContext` are available from `@plugin/testing` for ad-hoc use.

Plugin components share the same constructor shape (componentId, consumerIds, plugin, moduleRef, configService, logger). The harness builds a minimal Nest testing module, then instantiates your class and overwrites the appropriate getters (e.g. `getDatasource`, `getMapper`) so the component uses your mocks instead of `ModuleRef`.

## Usage summary

1. **Services:** `PluginServiceTestHarness.create({ pluginId, featureId, consumerIds })` → `harness.createService(MyServiceImpl, { componentId, datasource: mockDs, mapper: mockMapper })`. Use `harness.requestContext()` in tests.
2. **Mappers:** `PluginMapperTestHarness.create({ ... })` → `harness.createMapper(MyMapperImpl, { componentId })` (optionally pass mapper/service/datasource/registry mocks).
3. **Datasources:** `PluginDatasourceTestHarness.create({ ..., datasourceConfig: { host, clientId, clientSecret } })` → `harness.createDatasource(MyDatasourceImpl, { componentId, execute: mockExecute })`.

See the source README at `core/foundation/plugin/testing/README.md` and example specs under `core-modules/plugins/tutorial-pet-rest/features/pet/*.spec.ts` for full examples.

## Related

- [Testing overview](../../testing.md) — How to run tests and how the test scripts work
- [Feature component testing](../feature/testing.md) — Testing feature resolvers and controllers
