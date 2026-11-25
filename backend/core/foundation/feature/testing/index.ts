/**
 * Feature component testing framework. Single point of truth for testing feature
 * resolvers and controllers without duplicating mock/harness setup.
 *
 * Usage in a resolver spec:
 *
 *   import { FeatureResolverTestHarness } from "@feature/testing";
 *
 *   const harness = await FeatureResolverTestHarness.create({
 *     featureId: "pet",
 *     consumerIds: ["site-1"],
 *   });
 *   const resolver = harness.createResolver(PetResolver, { service: mockPetService });
 *   const requestContext = harness.requestContext();
 *
 * Usage in a controller spec:
 *
 *   import { FeatureControllerTestHarness } from "@feature/testing";
 *
 *   const harness = await FeatureControllerTestHarness.create({ featureId: "pet" });
 *   const controller = harness.createController(PetController, { service: mockPetService });
 */

export type { FeatureTestConfig } from "./types";
export { DEFAULT_FEATURE_TEST_CONFIG, mergeFeatureTestConfig } from "./types";
export {
  createMockLogger,
  createMockFeature,
  createMockConfigService,
  createMockRequestContext,
} from "./mocks";
export type {
  FeatureComponentTestHarnessBase,
  FeatureComponentConstructor,
} from "./feature.base.test";
export { FeatureComponentTestHarness } from "./feature.base.test";
export { FeatureResolverTestHarness } from "./feature.resolver.test";
export { FeatureControllerTestHarness } from "./feature.controller.test";
