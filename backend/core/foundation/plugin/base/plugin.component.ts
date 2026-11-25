import { AppConfigurationKeys } from "@configuration/app";
import { PluginConfiguration } from "@configuration/types";
import { RequestContext } from "@context/request";
import {
  BaseFeatureService,
  BaseFeatureServiceParameter,
} from "@feature/service";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import {
  BaseDatasource,
  BaseDatasourceInterfaceParameter,
} from "@plugin/datasource";
import { DatasourceUtility } from "@plugin/datasource/utilities/datasource.utility";
import { BaseMapper, BaseMapperInterfaceParameter } from "@plugin/mapper";
import { MapperUtility } from "@plugin/mapper/utilities/mapper.utility";
import { ServiceUtility } from "@plugin/service/utilities/service.utility";
import { PluginUtility } from "@plugin/utilities/plugin.utility";
import { PluginModuleData } from "@server/loader/types/loader.types";
import { Token } from "@token";
import { BaseRegistry, BaseRegistryInterfaceParameter } from "@registry";
import { RegistryUtility } from "@registry/utilities/registry.utility";
import { Logger } from "@logger";

export abstract class BasePluginComponent {
  static id;

  protected appConsumerIds: string[];
  protected defaultConsumerId: string;

  /**
   * Configuration should be obtained via ConfigService for dynamic updating - don't use from PluginModuleData -
   * this is only for class initializing on app start up
   *
   * @param componentId
   * @param consumerIds
   * @param plugin
   * @param moduleRef
   * @param configService
   * @param logger
   */
  constructor(
    protected componentId: string,
    protected consumerIds: string[],
    protected plugin: PluginModuleData,
    protected moduleRef: ModuleRef,
    protected configService: ConfigService,
    protected logger: Logger,
  ) {
    if (this.configService) {
      this.appConsumerIds = this.configService.get(
        AppConfigurationKeys.consumerIds,
      );
      this.defaultConsumerId = this.configService.get(
        AppConfigurationKeys.defaultConsumerId,
      );
    }
  }

  protected getPluginTokenId(requestContext: RequestContext) {
    const pluginConfiguration =
      this.getPluginConfiguration<PluginConfiguration>(requestContext);

    return pluginConfiguration.tokenId ?? pluginConfiguration.id;
  }

  protected getPluginToken<T extends Token>(requestContext: RequestContext): T {
    const tokenId = this.getPluginTokenId(requestContext);

    const tokens = requestContext.tokens ?? {};

    return (tokens[tokenId] as T) ?? null;
  }

  protected getPluginConsumerConfiguration<T>(
    requestContext: RequestContext,
  ): T {
    return PluginUtility.getPluginConsumerConfiguration(
      requestContext,
      this.plugin,
      this.configService,
    );
  }

  protected getPluginConfiguration<T>(requestContext: RequestContext): T {
    return PluginUtility.getPluginConfiguration(
      this.plugin,
      this.configService,
    );
  }

  protected getFeatureConfiguration<T>(): T {
    return PluginUtility.getFeatureConfiguration(
      this.plugin,
      this.configService,
    );
  }

  protected getRegistry<T extends BaseRegistry>(
    requestContext: RequestContext,
    registryInterface: BaseRegistryInterfaceParameter,
  ): T {
    return RegistryUtility.getRegistry<T>(
      requestContext.consumer,
      registryInterface,
      this.moduleRef,
      this.logger,
    );
  }

  protected getMapper<T extends BaseMapper>(
    requestContext: RequestContext,
    mapperInterface: BaseMapperInterfaceParameter,
  ): T {
    return MapperUtility.getMapper<T>(
      requestContext.consumer,
      mapperInterface,
      this.moduleRef,
      this.logger,
    );
  }

  protected getService<T extends BaseFeatureService>(
    requestContext: RequestContext,
    serviceInterface: BaseFeatureServiceParameter,
  ): T {
    return ServiceUtility.getService<T>(
      requestContext.consumer,
      serviceInterface,
      this.moduleRef,
      this.logger,
    );
  }

  protected getDatasource<T extends BaseDatasource>(
    requestContext: RequestContext,
    datasourceInterface?: BaseDatasourceInterfaceParameter,
  ): T {
    return DatasourceUtility.getDatasource(
      requestContext.consumer,
      datasourceInterface,
      this.moduleRef,
      this.logger,
    );
  }
}
