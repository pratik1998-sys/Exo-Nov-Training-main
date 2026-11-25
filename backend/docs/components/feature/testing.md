---
title: Feature component testing
layout: default
---

# Feature component testing

[← Back to Feature](feature.md) · [Testing overview](../../testing.md)

The framework provides a **feature component testing** harness so you can unit-test feature **resolvers** and **controllers** without spinning up a full Nest app or resolving real feature services. All harness code lives under `core/foundation/feature/testing/` and is exposed via **`@feature/testing`**.

## Components covered

| Component | Harness | Purpose |
|-----------|---------|---------|
| **Resolver** | `FeatureResolverTestHarness` | Test GraphQL resolvers; override `resolveService` with a mock so queries/mutations use your stub. |
| **Controller** | `FeatureControllerTestHarness` | Test REST controllers; override `resolveService` with a mock and pass a minimal request with `raw.requestContext`. |

There is no separate harness for feature **services**; service tests typically use the plugin service harness when the implementation is a plugin service, or a plain Nest `Test.createTestingModule` (or similar) for in-process feature services.

## Structure

- **Config** — `FeatureTestConfig`: `featureId`, `featureGroup?`, `consumerIds`, `defaultConsumerId?`, `featureConfiguration?`. Merged with `DEFAULT_FEATURE_TEST_CONFIG` when you pass partial overrides.
- **Base** — `FeatureComponentTestHarness` (abstract) holds shared state (config, feature, configService, logger, moduleRef, requestContext) and a protected `createComponentInstance(ComponentClass, options)` that instantiates a resolver or controller and applies overrides (e.g. `service` → `resolveService`).
- **Subclasses** — `FeatureResolverTestHarness` exposes `createResolver(ResolverClass, { service?, ... })`; `FeatureControllerTestHarness` exposes `createController(ControllerClass, { service?, ... })`. Both use `FeatureResolverTestHarness.create(partialConfig?)` / `FeatureControllerTestHarness.create(partialConfig?)` to build the harness.
- **Mocks** — `createMockLogger`, `createMockFeature`, `createMockConfigService`, `createMockRequestContext` are available from `@feature/testing` for ad-hoc use.

Resolvers and controllers extend `BaseFeatureComponent` and get request context and service via `getRequestContextAndService(request, PetService)`. By overriding `resolveService` with a mock, your tests control the returned “service” and can assert on resolver/controller behavior without a real feature service.

## Usage summary

1. **Resolvers:** `FeatureResolverTestHarness.create({ featureId, consumerIds })` → `harness.createResolver(MyResolver, { service: mockService })`. Build a GraphQL context with `{ raw: { requestContext: harness.requestContext() } }` and call resolver methods.
2. **Controllers:** `FeatureControllerTestHarness.create({ featureId })` → `harness.createController(MyController, { service: mockService })`. Build a minimal request with `raw.requestContext` and call controller methods.

See the source README at `core/foundation/feature/testing/README.md` and example specs under `core-modules/features/tutorial-pet/pet/*.spec.ts` (resolver and controller) for full examples.

## Related

- [Testing overview](../../testing.md) — How to run tests and how the test scripts work
- [Plugin component testing](../plugin/testing.md) — Testing plugin services, mappers, and datasources
