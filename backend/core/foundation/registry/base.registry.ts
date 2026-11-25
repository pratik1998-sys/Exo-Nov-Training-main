import { ConfigService } from "@nestjs/config";
import { OnApplicationBootstrap } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { RegistryConfiguration } from "@registry/types";
import { PluginModuleData } from "@server/loader/types/loader.types";
import { Logger } from "@logger";
import { AppConfigurationKeys } from "@configuration/app";
import { PluginUtility } from "@plugin/utilities/plugin.utility";
import { RequestContext } from "@context/request";
import { PluginConfiguration } from "@configuration/types";
import { EnvironmentVariableKeys } from "@configuration/environment";
import {
  BaseDatasource,
  BaseDatasourceInterfaceParameter,
} from "@plugin/datasource";
import { DatasourceUtility } from "@plugin/datasource/utilities/datasource.utility";
import { MapperUtility } from "@plugin/mapper/utilities/mapper.utility";
import { ServiceUtility } from "@plugin/service/utilities/service.utility";
import { RegistryUtility } from "@registry/utilities/registry.utility";

export type BaseRegistryInterfaceParameter = {
  id: string;
};

export abstract class BaseRegistry implements OnApplicationBootstrap {
  //Initialized at module initiliazation
  static registryId: string;
  static id: string;

  private timer: any;
  protected registryConfiguration: RegistryConfiguration;
  private isRegistryEnabled: boolean;

  private isInitialized: boolean;

  protected static instance;

  protected appConsumerIds: string[];

  protected defaultConsumerId: string;

  protected abstract load(): any;
  protected abstract fetchData(): any;

  abstract getRegistryData();

  private static registeredRegistries: string[] = [];

  /**
   * Registries must be a singleton object. Those DI via Nest is a singleton approach, this application
   * supports a handful apps, the main being the core app (what most functionality is served from), and
   * another being the admin app. The admin app must be able to see what is in the registries, and refresh
   * the registeries. Thus, the registery instance must be shared across the Nest apps, something which doesn't
   * seem to be supported OOB with Nest. Having this extra singleton approach ensures the module loader in
   * both apps use the same instance of the registery.
   *
   * @param moduleRef
   * @param configService
   * @param logger
   */
  protected constructor(
    protected componentId: string,
    protected registryId: string,
    protected consumerIds: string[],
    protected plugin: PluginModuleData,
    protected moduleRef: ModuleRef,
    protected configService: ConfigService,
    protected logger: Logger,
  ) {
    const methodname = `${BaseRegistry.name}() [${this.registryId}]`;

    this.appConsumerIds = this.configService.get(
      AppConfigurationKeys.consumerIds,
    );

    this.defaultConsumerId = this.resolvePluginDefaultConsumerId();

    this.registryConfiguration = this.fetchRegistryConfiguration();

    this.logger.info(
      `${methodname} - Config: ${this.logger.formatJSON(this.registryConfiguration)}`,
    );

    this.isRegistryEnabled = !this.registryConfiguration.disabled;

    this.logger.info(`${methodname} - Is Enabled: ${this.isRegistryEnabled}`);
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
    //The original check was if(!this.instance), however on this was not working when there was an extension of a registry...it was only
    //resolving to the original parent registry
    if (!BaseRegistry.registeredRegistries.includes(this.registryId)) {
      BaseRegistry.registeredRegistries.push(this.registryId);

      this.instance = new registryClass(
        componentId,
        registryId,
        consumerIds,
        plugin,
        moduleRef,
        configService,
        logger,
      );
    }

    return this.instance;
  }

  async initialize() {
    const methodname = `${BaseRegistry.name}.initialize [${this.registryId}]`;

    this.logger.info(`${methodname} - Initializing Registry`);

    if (this.isEnabled()) {
      this.initiateTimer();

      await this.load();
    } else {
      this.logger.info(`${methodname} - WARNING: Registry Disabled`);
    }
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

  protected getPluginConfiguration<T>(): T {
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

  protected resolvePluginDefaultConsumerId() {
    const methodname = `${BaseRegistry.name}.resolvePluginDefaultConsumerId [${this.registryId}]`;

    const configuration = this.getPluginConfiguration<PluginConfiguration>();

    let defaultConsumerId = this.configService.get(
      AppConfigurationKeys.defaultConsumerId,
    );

    if (configuration?.configuredConsumers) {
      Object.values(configuration.configuredConsumers).forEach((consumer) => {
        if (consumer.pluginDefaultConsumer) {
          defaultConsumerId = consumer.id;
        }
      });
    }

    this.logger.info(
      `${methodname} - Resolved default consumer [${defaultConsumerId}]`,
    );

    return defaultConsumerId;
  }

  protected fetchRegistryConfiguration() {
    const methodname = `${BaseRegistry.name}.fetchRegistryConfiguration [${this.registryId}]`;

    let registriesConfig = this.configService.get(
      EnvironmentVariableKeys.registryConfig,
    );

    registriesConfig = registriesConfig ? JSON.parse(registriesConfig) : {};

    let registryConfigKey = this.registryId;

    registryConfigKey = registryConfigKey.replace(".registry", "");

    if (!registriesConfig[registryConfigKey]) {
      registryConfigKey = registryConfigKey.substring(
        registryConfigKey.indexOf(this.plugin.id),
      );
    }

    this.logger.info(
      `${methodname} - Registry ${this.registryId} Configuration Key: ${registryConfigKey}`,
    );

    return registriesConfig[registryConfigKey]
      ? registriesConfig[registryConfigKey]
      : {};
  }

  initiateTimer() {
    const methodname = `${BaseRegistry.name}.initiateTimer [${this.registryId}]`;

    const { refreshInterval } = this.registryConfiguration;

    if (refreshInterval) {
      this.logger.info(`${methodname} Refresh Interval: ${refreshInterval}ms`);

      if (this.timer && this.timer != null) {
        clearInterval(this.timer);
      }

      this.timer = setInterval(() => {
        this.refresh();
      }, refreshInterval);
    }
  }

  static getInstance(): any {
    return this.instance;
  }

  isEnabled(): boolean {
    return this.isRegistryEnabled;
  }

  protected getTimer(): any {
    return this.timer;
  }

  protected getRegistryConfiguration(): any {
    return this.registryConfiguration;
  }

  async refresh(): Promise<any> {
    const methodname = `${BaseRegistry.name}.refresh [${this.registryId}]`;

    this.logger.info(`${methodname} - Refreshing Registry`);

    return await this.load();
  }

  /**
   * A registry is more or less a dataset, and thus consumer specific logic segregation does not exist.
   * However,  datasources are indeed consumer specific, and thus, if a registry wants consumer specific
   * datasource, it needs to send that consumerId in. If no consumerId is sent, which is probably the majority,
   * the datasource that will be used is the one associated to the default consumer id in the app configuraiton.
   *
   * Note, for registries, there is no class property for a datasource, as a registry may be shared by
   * multiple consumers, but datasources are specific to a consumer in moduleRef. Thus, the datasource is fetched
   * from moduleRef each time it is required.
   *
   * @param consumerId
   * @returns
   */
  protected getDatasource<T extends BaseDatasource>(
    consumerId?: string,
    datasourceInterface?: BaseDatasourceInterfaceParameter,
  ): T {
    consumerId = consumerId ?? this.defaultConsumerId;

    if (datasourceInterface) {
      return DatasourceUtility.getDatasource(
        consumerId,
        datasourceInterface,
        this.moduleRef,
        this.logger,
      );
    } else {
      return DatasourceUtility.getDatasourceByConsumerAndFeature(
        consumerId,
        this.plugin.feature.id,
        this.moduleRef,
        this.logger,
      );
    }
  }

  /**
   * mapperInterface as any here is to avoid cyclical dependency with BaseRegistry
   */
  protected getMapper<T>(consumerId?: string, mapperInterface?: any): T {
    consumerId = consumerId ?? this.defaultConsumerId;

    if (mapperInterface) {
      return MapperUtility.getMapper(
        consumerId,
        mapperInterface,
        this.moduleRef,
        this.logger,
      ) as T;
    } else {
      return MapperUtility.getMapperByConsumerAndFeature(
        consumerId,
        this.plugin.feature.id,
        this.moduleRef,
        this.logger,
      ) as T;
    }
  }

  /**
   * mapperInterface as any here is to avoid cyclical dependency with BaseRegistry
   */
  protected getService<T>(consumerId: string, serviceInterface: any): T {
    consumerId = consumerId ?? this.defaultConsumerId;

    return ServiceUtility.getService(
      consumerId,
      serviceInterface,
      this.moduleRef,
      this.logger,
    ) as T;
  }

  protected getRegistry<T extends BaseRegistry>(
    registryInterface: BaseRegistryInterfaceParameter,
    consumerId?: string,
  ): T {
    consumerId = consumerId ?? this.defaultConsumerId;

    return RegistryUtility.getRegistry<T>(
      consumerId,
      registryInterface,
      this.moduleRef,
      this.logger,
    );
  }

  /**
   * If a registry is using an  datasource, the datasource method will need an RequestContext to be able to execute, primarily,
   * it needs a consumerId, and in some cases, a locale. If these aren't passed into this method, use the application defaults.
   *
   * @param consumerId
   * @param locale
   */
  protected getRequestContext(
    consumerId?: string,
    locale?: string,
  ): RequestContext {
    return {
      consumer:
        (consumerId ?? this.consumerIds.length == 1)
          ? this.consumerIds[0]
          : this.defaultConsumerId,
      locale:
        locale ?? this.configService.get(AppConfigurationKeys.defaultLocale),
    };
  }

  async onApplicationBootstrap() {
    const methodname = `${BaseRegistry.name}.onApplicationBootstrap [${this.registryId}]`;

    if (!this.isInitialized) {
      this.logger.info(
        `${methodname} - Initializing Registry: ${this.registryId}`,
      );

      this.isInitialized = true;

      await this.initialize();
    }
  }

  static getRegisteredRegistries() {
    return this.registeredRegistries;
  }
}
