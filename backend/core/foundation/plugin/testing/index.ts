/**
 * Plugin component testing framework. Single point of truth for testing any plugin
 * service, mapper, or datasource without duplicating mock/harness setup.
 *
 * Usage in a plugin service spec:
 *
 *   import { PluginServiceTestHarness } from "@plugin/testing";
 *
 *   const harness = await PluginServiceTestHarness.create({
 *     pluginId: "tutorial-pet-rest",
 *     featureId: "pet",
 *     consumerIds: ["site-1"],
 *   });
 *   const service = harness.createService(MyServiceImpl, {
 *     componentId: "tutorial-pet-rest.pet.service",
 *     datasource: mockDatasource,
 *     mapper: mockMapper,
 *   });
 *   const requestContext = harness.requestContext();
 */

export type { PluginTestConfig } from "./types";
export { DEFAULT_PLUGIN_TEST_CONFIG, mergePluginTestConfig } from "./types";
export {
  createMockLogger,
  createMockPlugin,
  createMockConfigService,
  createMockRequestContext,
} from "./mocks";
export type {
  PluginComponentTestHarnessBase,
  PluginComponentConstructor,
  ResolverMap,
} from "./plugin.base.test";
export { PluginComponentTestHarness } from "./plugin.base.test";
export { PluginServiceTestHarness } from "./plugin.service.test";
export { PluginMapperTestHarness } from "./plugin.mapper.test";
export { PluginDatasourceTestHarness } from "./plugin.datasource.test";
