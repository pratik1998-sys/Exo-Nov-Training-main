import { AppConfiguration, DatastoreConfiguration } from "@configuration/types";
import { LoggerUtility } from "@logger/utilities";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatastoreDynamicModule } from "@server/loader/datastore/base/datastore.loader";

export abstract class BaseDatastoreModule {
  protected static readonly logger = new Logger(BaseDatastoreModule.name);

  protected static readonly datastoreType: string;

  /**
   * Override in child classes to initialize the datastore module
   *
   * @param appId
   * @param configuration
   * @param datastoreConfig
   */
  static async forRootAsync(
    appId: string,
    configuration: AppConfiguration,
    datastoreConfig: DatastoreConfiguration,
  ): Promise<DatastoreDynamicModule> {
    throw new Error(`DATASTORE_MODULE_FOR_ROOT_ASYNC_NOT_IMPLEMENTED`);
  }

  protected static getDatastoreEnvironmentConfiguration(
    appId: string,
    configService: ConfigService,
    datastoreConfig: DatastoreConfiguration,
  ) {
    const methodname = `${BaseDatastoreModule.name}.getDatastoreEnvironmentConfiguration [${appId}] [${this.datastoreType}]`;

    const { id, type } = datastoreConfig;

    const datastoreType = this.datastoreType.toUpperCase();

    const datastoreAppConfigurationKey = `${datastoreType}_CONFIG_${type.toUpperCase()}_${id.toUpperCase()}`;

    const cfg = configService.get(datastoreAppConfigurationKey);

    if (!cfg) {
      this.logger.error(
        `${methodname} - Missing environment configuration for datastore ${id} - Expected: ${datastoreAppConfigurationKey}`,
      );
      throw new Error(
        `DATASTORE_MISSING_ENV_CONFIGURATION_${datastoreType}:${id}`,
      );
    }

    const envCfg = JSON.parse(cfg);

    const logEnvCfg = LoggerUtility.applyMasks(
      JSON.parse(JSON.stringify(envCfg)),
      null,
      configService,
    );

    this.logger.log(
      `${methodname} - Datastore ${id} Environment AppConfiguration: ${JSON.stringify(logEnvCfg)}`,
    );

    return envCfg;
  }

  protected static composeToken(
    appId: string,
    configuration: AppConfiguration,
    datasourceConfig: DatastoreConfiguration,
  ): string {
    return `${this.datastoreType}:${datasourceConfig.id}`;
  }
}
