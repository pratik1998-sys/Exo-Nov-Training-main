import {
  PluginComponentTestHarness,
  type PluginComponentConstructor,
  type ResolverMap,
} from "./plugin.base.test";

/**
 * Harness for testing plugin services. Use PluginServiceTestHarness.create(config) to build.
 */
export class PluginServiceTestHarness extends PluginComponentTestHarness {
  protected getResolverMap(): ResolverMap {
    return {
      datasource: "getDatasource",
      mapper: "getMapper",
    };
  }

  /**
   * Create a plugin service instance with datasource/mapper (or other resolvers) overridden.
   * Use this so the service uses your mocks instead of resolving from ModuleRef.
   */
  createService<T extends object>(
    ServiceImplClass: PluginComponentConstructor<T>,
    options: {
      componentId: string;
      datasource?: unknown;
      mapper?: unknown;
      [key: string]: unknown;
    },
  ): T {
    return this.createComponentInstance(ServiceImplClass, options);
  }
}
