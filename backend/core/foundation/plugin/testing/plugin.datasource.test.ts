import {
  PluginComponentTestHarness,
  type PluginComponentConstructor,
  type ResolverMap,
} from "./plugin.base.test";

/**
 * Harness for testing plugin datasources. Use PluginDatasourceTestHarness.create(config) to build.
 * ConfigService is configured to return datasource config for DATASOURCE_CONFIG_* keys so BaseDatasource constructor succeeds.
 */
export class PluginDatasourceTestHarness extends PluginComponentTestHarness {
  protected getResolverMap(): ResolverMap {
    return {
      mapper: "getMapper",
      service: "getService",
      datasource: "getDatasource",
      registry: "getRegistry",
    };
  }

  /**
   * Create a plugin datasource instance with getMapper/getService/getDatasource/getRegistry (or other resolvers) overridden.
   * Use this so the datasource uses your mocks instead of resolving from ModuleRef.
   */
  createDatasource<T extends object>(
    DatasourceImplClass: PluginComponentConstructor<T>,
    options: {
      componentId: string;
      mapper?: unknown;
      service?: unknown;
      datasource?: unknown;
      registry?: unknown;
      [key: string]: unknown;
    },
  ): T {
    return this.createComponentInstance(DatasourceImplClass, options);
  }
}
