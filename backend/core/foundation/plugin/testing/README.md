# Plugin component testing framework

Single point of truth for testing plugin **services**, **mappers**, and **datasources** without duplicating mock/harness setup.

## Quick start (plugin service)

```ts
import { PluginServiceTestHarness } from "@plugin/testing";

// In beforeEach:
const harness = await PluginServiceTestHarness.create({
  pluginId: "tutorial-pet-rest",
  featureId: "pet",
  consumerIds: ["site-1"],
});

const service = harness.createService(MyServiceImpl, {
  componentId: "my-plugin.my-feature.service",
  datasource: mockDatasource,
  mapper: mockMapper,
});

const requestContext = harness.requestContext();
```

## Config (same for all plugin components)

`PluginTestConfig` is the single shape; only values differ per plugin/feature:

| Option | Default | Description |
|--------|---------|-------------|
| `pluginId` | `"tutorial-pet-rest"` | Plugin id |
| `featureId` | `"pet"` | Feature id |
| `featureGroup` | `""` | Feature group for configuredFeatures |
| `consumerIds` | `["site-1"]` | Consumers this plugin serves |
| `defaultConsumerId` | First of `consumerIds` | Consumer used by `requestContext()` |
| `consumerConfiguration` | `{ pagination: { pageSize: { default: 10, max: 20 } } }` | Returned by `getPluginConsumerConfiguration()` |
| `datasourceConfig` | `{ baseUrl: "http://localhost" }` (when key is `DATASOURCE_CONFIG_*`) | For datasource harness: config returned by `ConfigService.get()` so `BaseDatasource` constructor succeeds. Override if your datasource's `getRequiredConfigFields()` needs more. |

Pass only overrides; the rest are merged with `DEFAULT_PLUGIN_TEST_CONFIG`.

## Harness API

- **`PluginServiceTestHarness.create(partialConfig?)`**  
  Returns a harness with: `config`, `plugin`, `configService`, `logger`, `moduleRef`, `requestContext(overrides?)`, **`createService(ServiceImplClass, options)`**.

- **`PluginMapperTestHarness.create(partialConfig?)`**  
  Returns a harness with: `config`, `plugin`, `configService`, `logger`, `moduleRef`, `requestContext(overrides?)`, **`createMapper(MapperImplClass, options)`**.

- **`PluginDatasourceTestHarness.create(partialConfig?)`**  
  Returns a harness with: `config`, `plugin`, `configService`, `logger`, `moduleRef`, `requestContext(overrides?)`, **`createDatasource(DatasourceImplClass, options)`**.

- **`createService(ServiceImplClass, { componentId, datasource?, mapper?, ...overrides })`**  
  Instantiates the service with the harness's plugin/config/logger/moduleRef and overrides:
  - **`datasource`** / **`mapper`** → set `getDatasource` / `getMapper` on the instance so the service uses your mocks instead of ModuleRef.
  - Any other **`overrides`** → assigned to the instance (e.g. `getPetDatasource`, `getPetMapper` for service-specific resolvers).

- **`createMapper(MapperImplClass, { componentId, mapper?, service?, datasource?, registry?, ...overrides })`**  
  Instantiates the mapper with the harness's plugin/config/logger/moduleRef and overrides `getMapper` / `getService` / `getDatasource` / `getRegistry` (and any other **`overrides`**) so the mapper uses your mocks instead of ModuleRef.

- **`createDatasource(DatasourceImplClass, { componentId, mapper?, service?, datasource?, registry?, ...overrides })`**  
  Instantiates the datasource with the harness's plugin/config/logger/moduleRef (ConfigService returns `datasourceConfig` for `DATASOURCE_CONFIG_*` keys so the constructor succeeds) and overrides `getMapper` / `getService` / `getDatasource` / `getRegistry` (and any other **`overrides`**) so the datasource uses your mocks instead of ModuleRef.

## Base harness (class hierarchy)

Service, mapper, and datasource harnesses use a **base class + subclasses** with a shared static `create()` and overridable `getResolverMap()`:

- **`PluginComponentTestHarness`** (abstract) – Base class. Holds `config`, `plugin`, `configService`, `logger`, `moduleRef`, `requestContext`. Subclasses override **`getResolverMap()`** to define which option keys map to which instance methods (e.g. `datasource` → `getDatasource`). **`static create(partialConfig?)`** runs the async setup and returns an instance of the subclass (e.g. `PluginServiceTestHarness.create(config)` returns a `PluginServiceTestHarness`).
- **`PluginServiceTestHarness`** – Extends base, `getResolverMap()` returns `{ datasource: "getDatasource", mapper: "getMapper" }`, exposes **`createService(ServiceImplClass, options)`**.
- **`PluginMapperTestHarness`** – Extends base, `getResolverMap()` returns mapper/service/datasource/registry, exposes **`createMapper(MapperImplClass, options)`**.
- **`PluginDatasourceTestHarness`** – Extends base, same resolver map as mapper, exposes **`createDatasource(DatasourceImplClass, options)`**.

You can build a harness with **`PluginServiceTestHarness.create(config)`** (and similarly for mapper/datasource).

For custom harnesses, extend `PluginComponentTestHarness`, override `getResolverMap()`, add your `create*(Class, options)` method that calls **`this.createComponentInstance(Class, options)`**, and use **`MyHarness.create(config)`** to build.

## Mocks (reusable in mapper/datasource specs)

- **`createMockLogger()`** – Logger-shaped mock (info, debug, warn, error, formatJSON, …).
- **`createMockPlugin(config)`** – Minimal `PluginModuleData` for the given config.
- **`createMockConfigService(config)`** – ConfigService mock with `consumerIds`, `defaultConsumerId`, `configuredFeatures`. For datasource tests, also returns `datasourceConfig` (or `{ baseUrl: "http://localhost" }`) for any `DATASOURCE_CONFIG_*` key.
- **`createMockRequestContext(config, overrides?)`** – RequestContext with `consumer` from config.

## Example: another plugin service

```ts
const harness = await PluginServiceTestHarness.create({
  pluginId: "my-other-plugin",
  featureId: "user",
  consumerIds: ["site-1", "site-2"],
  defaultConsumerId: "site-1",
});

const service = harness.createService(MyOtherUserServiceImpl, {
  componentId: "my-other-plugin.user.service",
  datasource: mockUserDatasource,
  mapper: mockUserMapper,
});
```

Same pattern; only config and mocks change.

## Quick start (plugin mapper)

```ts
import { PluginMapperTestHarness } from "@plugin/testing";

// In beforeEach:
const harness = await PluginMapperTestHarness.create({
  pluginId: "tutorial-pet-rest",
  featureId: "pet",
  consumerIds: ["site-1"],
});

const mapper = harness.createMapper(MyMapperImpl, {
  componentId: "my-plugin.my-feature.mapper",
  mapper: mockOtherMapper,   // optional: override getMapper()
  service: mockService,      // optional: override getService()
  datasource: mockDatasource, // optional: override getDatasource()
  registry: mockRegistry,    // optional: override getRegistry()
});

const requestContext = harness.requestContext();
```

## Quick start (plugin datasource)

```ts
import { PluginDatasourceTestHarness } from "@plugin/testing";

// In beforeEach:
const harness = await PluginDatasourceTestHarness.create({
  pluginId: "tutorial-pet-rest",
  featureId: "pet",
  consumerIds: ["site-1"],
  datasourceConfig: { baseUrl: "https://api.example.com" }, // optional; default has baseUrl
});

const datasource = harness.createDatasource(MyDatasourceImpl, {
  componentId: "my-plugin.my-feature.datasource",
  mapper: mockMapper,   // optional: override getMapper()
  service: mockService, // optional: override getService()
});

const requestContext = harness.requestContext();
```
