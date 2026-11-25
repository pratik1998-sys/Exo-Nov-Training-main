# Feature component testing framework

Single point of truth for testing feature **resolvers** and **controllers** without duplicating mock/harness setup. Mirrors the structure of `@plugin/testing`.

## Quick start (resolver)

```ts
import { FeatureResolverTestHarness } from "@feature/testing";

const harness = await FeatureResolverTestHarness.create({
  featureId: "pet",
  consumerIds: ["site-1"],
});
const resolver = harness.createResolver(PetResolver, { service: mockPetService });
const requestContext = harness.requestContext();
// call resolver methods, e.g. resolver.getPet(args, context)
```

## Quick start (controller)

```ts
import { FeatureControllerTestHarness } from "@feature/testing";

const harness = await FeatureControllerTestHarness.create({ featureId: "pet" });
const controller = harness.createController(PetController, { service: mockPetService });
const requestContext = harness.requestContext();
// call controller methods with mocked request (request.raw.requestContext = requestContext)
```

## Config

`FeatureTestConfig`: `featureId`, `featureGroup?`, `consumerIds`, `defaultConsumerId?`, `featureConfiguration?`. Pass partial overrides; defaults are merged via `DEFAULT_FEATURE_TEST_CONFIG`.

## Harness API

- **`FeatureResolverTestHarness.create(partialConfig?)`** – Returns harness with `createResolver(ResolverClass, { service?, ...overrides })`.
- **`FeatureControllerTestHarness.create(partialConfig?)`** – Returns harness with `createController(ControllerClass, { service?, ...overrides })`.
- **`createResolver` / `createController`** – Instantiate the component with harness feature/config/logger/moduleRef and override `resolveService` to return your mock service (and any other instance overrides).

## Mocks

- **`createMockLogger()`** – Logger-shaped mock.
- **`createMockFeature(config)`** – Minimal `FeatureModuleData` (id, group, configuration).
- **`createMockConfigService(config)`** – ConfigService with `consumerIds`, `configuredFeatures` (for `getFeatureConfiguration()`).
- **`createMockRequestContext(config, overrides?)`** – RequestContext with `consumer` from config.
