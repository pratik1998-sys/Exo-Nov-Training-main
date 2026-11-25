import { ModuleRef } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { PluginModuleData } from "@server/loader/types/loader.types";
import { AppConfigurationKeys } from "@configuration/app";
import { RestDatasourceServiceDefinition } from "@plugin-datasource-rest";
import { Logger } from "@logger";
import { ConfigurableLoggingRegistry } from "@registry/configurable-logging.registry";
import { GraphqlDatasourceServiceDefinition } from "@plugin-datasource-graphql";

export class ApiDatasourceServiceLoggingRegistry extends ConfigurableLoggingRegistry {
  private serviceRegistry: Record<
    string,
    GraphqlDatasourceServiceDefinition & RestDatasourceServiceDefinition
  > = {};

  async initialize() {
    const methodname = `${ApiDatasourceServiceLoggingRegistry.name}.initialize`;

    await super.initialize();
  }

  static initializeInstance(
    componentId: string,
    registryClass: any,
    registryId: string,
    consumerIds: string[],
    plugin: PluginModuleData,
    moduleRef: ModuleRef,
    configService: ConfigService,
    logger: Logger,
  ): any {
    const instance: ApiDatasourceServiceLoggingRegistry =
      super.initializeInstance(
        componentId,
        registryClass,
        registryId,
        consumerIds,
        plugin,
        moduleRef,
        configService,
        logger,
      );

    instance.load();

    return instance;
  }

  isServiceLoggingEnabled(
    featureId: string,
    pluginId: string,
    serviceId: string,
  ) {
    let val = this.doLogging;

    if (val) {
      val = this.getDataValue(this.data, pluginId, false);
      val = this.getDataValue(val, featureId, false);
      val = this.getDataValue(val, serviceId, true);
    }

    return val;
  }

  protected getLoggingConfigKey() {
    return AppConfigurationKeys.serviceLogging;
  }

  registerService(
    datasourceId: string,
    serviceDefinition: GraphqlDatasourceServiceDefinition &
      RestDatasourceServiceDefinition,
  ) {
    this.serviceRegistry[`${datasourceId}.${serviceDefinition.id}`] =
      serviceDefinition;
  }

  getRegisteredServiceIds() {
    return Object.keys(this.serviceRegistry);
  }

  getServiceRegistry() {
    return this.serviceRegistry;
  }

  getRegistryData() {
    return this.data;
  }
}
