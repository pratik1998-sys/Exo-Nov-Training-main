import {
  PluginComponentTestHarness,
  type PluginComponentConstructor,
  type ResolverMap,
} from "./plugin.base.test";

/**
 * Harness for testing plugin mappers. Use PluginMapperTestHarness.create(config) to build.
 */
export class PluginMapperTestHarness extends PluginComponentTestHarness {
  protected getResolverMap(): ResolverMap {
    return {
      mapper: "getMapper",
      service: "getService",
      datasource: "getDatasource",
      registry: "getRegistry",
    };
  }

  /**
   * Create a plugin mapper instance with getMapper/getService/getDatasource/getRegistry (or other resolvers) overridden.
   * Use this so the mapper uses your mocks instead of resolving from ModuleRef.
   */
  createMapper<T extends object>(
    MapperImplClass: PluginComponentConstructor<T>,
    options: {
      componentId: string;
      mapper?: unknown;
      service?: unknown;
      datasource?: unknown;
      registry?: unknown;
      [key: string]: unknown;
    },
  ): T {
    return this.createComponentInstance(MapperImplClass, options);
  }
}
