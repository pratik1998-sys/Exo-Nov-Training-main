import { AppConfiguration, DatastoreConfiguration } from "@configuration/types";
import { DynamicModule, Logger } from "@nestjs/common";
import { ClassPath, ClassResolver } from "@utilities/class-resolver.utility";
import { BaseDatastoreModule } from "@datastore";
import path from "path";

export interface DatastoreDynamicModule extends DynamicModule {
  datastoreId?: string;
  type?: string;
}

export abstract class DatastoreLoader {
  protected static readonly logger = new Logger(DatastoreLoader.name);

  protected static readonly datastoreType: string;
  protected static readonly datastoreClientTypes: string[] = [];

  //Override in child classes
  protected static getDatastoresConfiguration(
    configuration: AppConfiguration,
  ): DatastoreConfiguration[] {
    throw new Error(
      `DATASTORE_LOADER_GET_DATASTORES_CONFIGURATION_NOT_IMPLEMENTED`,
    );
  }

  static async load(appId: string, configuration: AppConfiguration) {
    const methodname = `${DatastoreLoader.name}.loadModules [${appId}] [${this.datastoreType}]`;

    const enabledDatastores: DatastoreConfiguration[] =
      this.getEnabledDatastores(appId, configuration);

    const modules: DatastoreDynamicModule[] = [];

    for await (const datasourceConfig of enabledDatastores) {
      const { type, enabled, id } = datasourceConfig;

      const module = await this.loadDatastoreClientModule(
        appId,
        configuration,
        datasourceConfig,
      );

      if (module) {
        modules.push(module);
      } else {
        this.logger.log(
          `${methodname} - Invalid datastore type for datastore ${JSON.stringify(datasourceConfig)}`,
        );
        throw new Error(
          `DATASTORE_TYPE_INVALID_${this.datastoreType.toUpperCase()}`,
        );
      }
    }

    return modules;
  }

  protected static async loadDatastoreClientModule(
    appId: string,
    configuration: AppConfiguration,
    datastoreConfig: DatastoreConfiguration,
  ): Promise<DatastoreDynamicModule> {
    return null;
  }

  protected static async initializeDatastoreModule(
    appId: string,
    configuration: AppConfiguration,
    directory: string,
    datastoreConfig: DatastoreConfiguration,
  ) {
    const methodname = `${DatastoreLoader.name}.initializeDatastoreModule`;

    let module: DatastoreDynamicModule = null;

    const { type, id } = datastoreConfig;

    const fileFormat = `**${path.sep}${type}.${this.datastoreType}.module.js`;

    const classPaths: ClassPath[] = await ClassResolver.resolveClassPaths(
      fileFormat,
      appId,
      directory,
      this.logger,
    );

    const classPath = classPaths.length > 0 ? classPaths[0] : null;

    if (classPath) {
      const classDef = await import(classPath.resolvedPath);

      const moduleClassName = Object.keys(classDef).find((key) =>
        key.endsWith("Module"),
      );

      if (moduleClassName) {
        const moduleClass: typeof BaseDatastoreModule =
          classDef[moduleClassName];

        module = await moduleClass.forRootAsync(
          appId,
          configuration,
          datastoreConfig,
        );
      } else {
        this.logger.error(
          `${methodname} - No database module found for type ${type}`,
        );
        throw new Error(
          `DATASTORE_${this.datastoreType.toUpperCase()}_MODULE_CLASS_NOT_FOUND_${type}`,
        );
      }
    } else {
      this.logger.error(
        `${methodname} - No database module found for type ${type}`,
      );
      throw new Error(
        `DATASTORE_${this.datastoreType.toUpperCase()}_MODULE_NOT_FOUND_${type}`,
      );
    }

    return module;
  }

  static getEnabledDatastores(
    appId: string,
    configuration: AppConfiguration,
  ): DatastoreConfiguration[] {
    const methodname = `${DatastoreLoader.name}.getEnabledDatastores`;

    // const datastores = configuration[this.appAppConfigurationKey];

    const datastores = this.getDatastoresConfiguration(configuration);

    const enabledDatastores: DatastoreConfiguration[] = [];

    if (datastores) {
      datastores.forEach((datastoreConfig: DatastoreConfiguration) => {
        const { id } = datastoreConfig;

        if (this.isDatastoreEnabled(datastoreConfig)) {
          enabledDatastores.push(datastoreConfig);
        } else {
          this.logger.log(`${methodname} - Datastore ${id} is disabled`);
        }
      });
    }

    return enabledDatastores;
  }

  static isDatastoreEnabled(datastoreConfig: DatastoreConfiguration) {
    return (
      !datastoreConfig.hasOwnProperty("enabled") || datastoreConfig.enabled
    );
  }

  // static getDatastoreEnvironmentConfiguration(appId: string, configService: ConfigService, datastoreConfig: DatastoreConfiguration) {
  //     const methodname = `${DatastoreLoader.name}.getDatastoreEnvironmentConfiguration [${appId}] [${this.datastoreType}]`;

  //     const { id, type } = datastoreConfig;

  //     const datastoreType = this.datastoreType.toUpperCase();

  //     const datastoreAppConfigurationKey = `${datastoreType}_CONFIG_${type.toUpperCase()}_${id.toUpperCase()}`;

  //     const cfg = configService.get(datastoreAppConfigurationKey);

  //     if (!cfg) {
  //         this.logger.error(`${methodname} - Missing environment configuration for datastore ${id} - Expected: ${datastoreAppConfigurationKey}`);
  //         throw new Error(`DATASTORE_MISSING_ENV_CONFIGURATION_${datastoreType}`);
  //     }

  //     const envCfg = JSON.parse(cfg);

  //     const logEnvCfg = LoggerUtility.applyMasks(JSON.parse(JSON.stringify(envCfg)), null, configService);

  //     this.logger.log(`${methodname} - Datastore ${id} Environment AppConfiguration: ${JSON.stringify(logEnvCfg)}`);

  //     return envCfg;
  // }

  // protected static composeToken(appId: string, configuration: AppConfiguration, datasourceConfig: DatastoreConfiguration): string {
  //     return `${this.datastoreType}:${datasourceConfig.id}`;
  // }
}
