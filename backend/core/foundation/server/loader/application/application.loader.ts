import { AppConfigurationKeys } from "@configuration/app";
import {
  EnvironmentVariableKeys,
  EnvironmentVariableValues,
} from "@configuration/environment";
import {
  AppConfiguration,
  FeatureConfigurationMapValue,
} from "@configuration/types";
import { LoggerKey } from "@logger";
import { MessengerLoggingRegistry } from "@messenger";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD, ModuleRef, Reflector } from "@nestjs/core";
import { ApiDatasourceServiceLoggingRegistry } from "@plugin/datasource/api";
import { MapperLoggingRegistry } from "@plugin/mapper";
import { BaseRegistry } from "@registry";
import { DatabaseLoader } from "@server/loader/datastore/database.loader";
import { MessengerLoader } from "@server/loader/datastore/messenger.loader";
import {
  ApplicationModuleData,
  ComponentModuleData,
  FeatureModuleData,
  ModuleType,
  PluginModuleData,
} from "@server/loader/types/loader.types";
import { ClassPath, ClassResolver } from "@utilities/class-resolver.utility";
import * as path from "path";

/**
 * This file should not be touched or altered unless you are a member of the app
 * governance team. Any changes could have a crippling effect on the application.
 * Resolve dynamic modules for the  application(s)
 */
export class ApplicationModuleLoader {
  static readonly logger = new Logger(ApplicationModuleLoader.name);

  protected static globalGuardFileFormat = `.global.guard.js`;
  protected static adminFileSuffixPrefix = ".admin";
  protected static configurationKey_features = AppConfigurationKeys.features;

  protected static getAppName(configuration: AppConfiguration) {
    return configuration.appName;
  }

  static async initializeApplicationModule(
    appId: string,
    configuration: AppConfiguration,
  ): Promise<ApplicationModuleData> {
    const methodname = `${ApplicationModuleLoader.name}.initializeApplicationModule [${appId}]`;

    //this.logger.log(`${methodname} - App configuration: ${JSON.stringify(configuration, null, 2)}`);

    let featureModules: FeatureModuleData[] = await this.resolveFeatureModules(
      appId,
      configuration,
      configuration.configuredFeatures,
    );

    featureModules = featureModules.concat(
      await this.resolveSetupModules(appId, configuration),
    );

    const loggerModule: ComponentModuleData = await this.resolveLoggerModule(
      appId,
      configuration,
    );
    const messengerModule: ComponentModuleData =
      await this.resolveMessengerModule(appId, configuration);
    const globalGuardModules: ComponentModuleData[] =
      await this.resolveGlobalGuardModules(appId, configuration);

    const resolvedModules: ComponentModuleData[] = [
      loggerModule,
      messengerModule,
      ...globalGuardModules,
    ];

    return await this.loadApplicationModules(
      featureModules,
      resolvedModules,
      appId,
      configuration,
    );
  }

  private static async resolveFoundationModuleType(
    moduleTypeId: string,
    moduleType: ModuleType,
    configuration: AppConfiguration,
    appId: string,
  ): Promise<ComponentModuleData> {
    const rootDirectory = path.join("foundation", moduleTypeId);

    return await this.resolveModuleType(
      moduleType,
      configuration,
      appId,
      rootDirectory,
      `**${path.sep}${moduleTypeId}.module.js`,
    );
  }

  /**
   * Find a module type that resolves to a single module in the code base
   *
   * @param appName
   * @param moduleType
   * @param config
   * @returns
   */
  private static async resolveModuleType(
    moduleType: ModuleType,
    configuration: AppConfiguration,
    appId: string,
    rootDirectory: string,
    classFileFormat?: string,
  ): Promise<ComponentModuleData> {
    const moduleId = moduleType.toLowerCase();

    const module: ComponentModuleData = {
      id: moduleId,
      classFileFormat: classFileFormat ?? `**${path.sep}${moduleId}.module.js`,
      type: moduleType,
      classPath: null,
      importedModule: null,
    };

    const resolvedClassPaths: ClassPath[] =
      await this.resolveModuleTypeClassPaths(
        module.classFileFormat,
        rootDirectory,
        moduleType,
        configuration.appName,
        appId,
      );

    module.classPath =
      resolvedClassPaths.length > 0 ? resolvedClassPaths[0] : null;

    return module;
  }

  protected static async resolveLoggerModule(
    appId: string,
    configuration: AppConfiguration,
  ): Promise<ComponentModuleData> {
    const moduleTypeId = ModuleType.logger.toLowerCase();

    return await this.resolveFoundationModuleType(
      moduleTypeId,
      ModuleType.logger,
      configuration,
      appId,
    );
  }

  protected static async resolveMessengerModule(
    appId: string,
    configuration: AppConfiguration,
  ): Promise<ComponentModuleData> {
    const moduleTypeId = ModuleType.messenger.toLowerCase();

    return await this.resolveFoundationModuleType(
      moduleTypeId,
      ModuleType.messenger,
      configuration,
      appId,
    );
  }

  protected static async resolveGlobalGuardModules(
    appId: string,
    configuration: AppConfiguration,
  ): Promise<ComponentModuleData[]> {
    const methodname = `${ApplicationModuleLoader.name}.resolveGlobalGuardModules [${appId}]`;

    const fileFormat = `**${path.sep}*${this.globalGuardFileFormat}`;

    const resolvedClassPaths: ClassPath[] =
      await this.resolveModuleTypeClassPaths(
        fileFormat,
        "guards",
        ModuleType.guard,
        configuration.appName,
        appId,
        "guards",
      );

    const resolvedModules: ComponentModuleData[] = [];

    const adminFileSuffix = `${this.adminFileSuffixPrefix}${this.globalGuardFileFormat}`;

    resolvedClassPaths.forEach((classPath) => {
      if (this.isResolvedGuardClassPathValid(classPath, adminFileSuffix)) {
        resolvedModules.push({
          id: classPath.fileName,
          classFileFormat: fileFormat,
          type: ModuleType.guard,
          classPath: classPath,
          importedModule: null,
        });
      }
    });

    this.logger.log(
      `${methodname} - Resolved Global Guard Modules: ${JSON.stringify(resolvedModules, null, 2)}`,
    );

    return resolvedModules;
  }

  protected static isResolvedGuardClassPathValid(
    classPath: ClassPath,
    invalidFileSuffix: string,
  ) {
    return !classPath.fileName.endsWith(invalidFileSuffix);
  }

  protected static async resolveSetupModules(
    appId: string,
    configuration: AppConfiguration,
  ) {
    let setupModules: FeatureModuleData[] = [];

    if (
      EnvironmentVariableValues.appNodeEnv.local ==
      configuration.env[EnvironmentVariableKeys.appNodeEnv]
    ) {
      setupModules = await this.resolveFeatureModules(
        appId,
        configuration,
        configuration.configuredSetupFeatures,
      );
    }

    return setupModules;
  }

  protected static async resolveFeatureModules(
    appId: string,
    configuration: AppConfiguration,
    configuredFeatures: Record<string, FeatureConfigurationMapValue>,
  ) {
    const methodname = `${ApplicationModuleLoader.name}.resolveFeatureModules [${appId}]`;

    const featureModules: FeatureModuleData[] = [];

    await this.processFeatureConfiguration(
      appId,
      configuration,
      featureModules,
      configuredFeatures,
    );

    return featureModules;
  }

  protected static async processFeatureConfiguration(
    appId: string,
    configuration: AppConfiguration,
    featureModules: FeatureModuleData[],
    configuredFeatures: Record<string, FeatureConfigurationMapValue>,
    featureGroup?: FeatureConfigurationMapValue,
  ) {
    const methodname = `${ApplicationModuleLoader.name}.processFeatureConfiguration [${appId}]`;

    const { appName } = configuration;

    for await (const feature of Object.values(configuredFeatures)) {
      const { id: featureId, isGroup, configuredFeatures: fMap } = feature;

      if (isGroup) {
        this.logger.log(
          `${methodname} - Processing feature group: ${feature.id}}`,
        );
        await this.processFeatureConfiguration(
          appId,
          configuration,
          featureModules,
          fMap,
          feature,
        );
      } else {
        const featureMethodName = `${methodname} Feature[${featureId}]`;

        this.logger.log(`${featureMethodName} - Enabled`);

        const featureModule: FeatureModuleData = {
          id: feature.id,
          group: featureGroup?.id,
          configuration: feature,
          isStandalone: feature.standalone ?? false,
          classFileFormat: `**${path.sep}${featureId}.module.js`,
          type: ModuleType.feature,
          classPath: null,
          importedModule: null,
          pluginModules: [],
        };

        const async = [
          this.resolveModuleTypeClassPaths(
            featureModule.classFileFormat,
            `**${path.sep}features`,
            ModuleType.feature,
            appName,
            appId,
          ),
        ];

        if (feature.standalone) {
          this.logger.log(`${featureMethodName} - Standalone: true`);
        } else if (feature.configuredPlugins) {
          Object.values(feature.configuredPlugins).forEach((plugin) => {
            this.logger.log(`${featureMethodName} - Plugin: ${plugin.id}`);

            const pluginModule: PluginModuleData = {
              id: plugin.id,
              type: ModuleType.plugin,
              feature: {
                id: featureModule.id,
                group: featureModule.group,
                // configuration: featureModule.configuration,
              },
              configuration: plugin,
              classFileFormat: `**${path.sep}${plugin.id}.${featureId}.module.js`,
              classPath: null,
              importedModule: null,
            };

            featureModule.pluginModules.push(pluginModule);

            async.push(
              this.resolveModuleTypeClassPaths(
                pluginModule.classFileFormat,
                `**${path.sep}plugins`,
                ModuleType.plugin,
                appName,
                appId,
              ),
            );
          });
        }

        const results = await Promise.all(async);

        if (results.length > 0) {
          results.forEach((resolvedClassPaths, i) => {
            //let moduleType = i == 0 ? ModuleType.feature : ModuleType.plugin;
            const isFeatureModule = i == 0;

            const pluginModule = featureModule.pluginModules[i - 1];

            if (resolvedClassPaths.length > 0) {
              if (isFeatureModule) {
                featureModule.classPath = resolvedClassPaths[0];
              } else {
                pluginModule.classPath = resolvedClassPaths[0];
              }
            } else {
              if (isFeatureModule) {
                this.logger.error(
                  `${featureMethodName} - Class File Format ${featureModule.classFileFormat} Not Found`,
                );
                throw new Error(`FEATURE_NOT_FOUND:${featureModule.id}`);
              } else {
                this.logger.error(
                  `${featureMethodName} - Plugin[${pluginModule.id}] Class File Format ${pluginModule.classFileFormat} Not Found`,
                );
                throw new Error(
                  `FEATURE_PLUGIN_NOT_FOUND:${featureModule.id}:${pluginModule.id}`,
                );
              }
            }
          });
        } else {
          this.logger.log(
            `${featureMethodName} - Invalid resolveClassPaths result`,
          );
        }

        this.logger.log(
          `${featureMethodName} - Resolved class paths: ${JSON.stringify(featureModule)}`,
        );

        featureModules.push(featureModule);
      }
    }
  }

  private static async resolveModuleTypeClassPaths(
    classFileFormat: string,
    directoryName: string,
    moduleType: string,
    appName: string,
    appId: string,
    normalizedToken?: string,
  ) {
    const methodname = `${ApplicationModuleLoader.name}.resolveModuleTypeClassPaths [${appId}]`;

    const resolvedClassPaths = await ClassResolver.resolveClassPaths(
      classFileFormat,
      appName,
      directoryName,
      this.logger,
      false,
      normalizedToken,
    );

    this.logger.log(
      `${methodname} - (${moduleType}) Resolved class paths: ${JSON.stringify(resolvedClassPaths)}`,
    );

    return resolvedClassPaths;
  }

  private static async importModules(
    appId: string,
    resolvedModules: ComponentModuleData[],
  ) {
    const methodname = `${ApplicationModuleLoader.name}.importModules [${appId}]`;

    const async = resolvedModules.map((resolvedModule: ComponentModuleData) => {
      this.logger.log(
        `${methodname} - Resolved Module: ${JSON.stringify(resolvedModule)}`,
      );
      this.logger.log(
        `${methodname} - Module [${resolvedModule.type}] ${resolvedModule.id} loading from ${resolvedModule.classPath.resolvedPathShort.replace(".js", "")}`,
      );

      return this.importModule(resolvedModule);
    });

    await Promise.all(async);
  }

  private static async importModule(resolvedModule: ComponentModuleData) {
    resolvedModule.importedModule = await import(
      resolvedModule.classPath.resolvedPath
    );
  }

  protected static async loadApplicationModules(
    featureModules: FeatureModuleData[],
    resolvedModules: ComponentModuleData[],
    appId: string,
    configuration: AppConfiguration,
  ): Promise<any> {
    const methodname = `${ApplicationModuleLoader.name}.loadApplicationModules [${appId}]`;

    featureModules.forEach((featureModule) => {
      resolvedModules.push(featureModule);
      featureModule.pluginModules.forEach((pluginModule) =>
        resolvedModules.push(pluginModule),
      );
    });

    this.logger.log(
      `${methodname} - Resolved modules: ${JSON.stringify(resolvedModules, null, 2)}`,
    );

    await this.importModules(appId, resolvedModules);

    let loadedModules: any[] = [];
    const moduleNames: string[] = [];

    const globalAppGuards: any[] = [];

    for await (const module of resolvedModules) {
      const { importedModule } = module;

      if (module.type == ModuleType.guard) {
        globalAppGuards.push(module);
      } else {
        const moduleField = Object.keys(importedModule).find(
          (key) => key.indexOf("Module") >= 0,
        );

        if (moduleField) {
          moduleNames.push(moduleField);

          importedModule[moduleField].fileName = module.classPath.resolvedPath;

          let loadedModule;

          if (importedModule[moduleField].forRootAsync) {
            loadedModule = await importedModule[moduleField].forRootAsync(
              configuration,
              module,
              importedModule[moduleField],
            );
          } else {
            loadedModule = importedModule[moduleField];
          }

          loadedModules.push(loadedModule);
        }
      }
    }

    const module: ApplicationModuleData = {
      module: null,
      appId,
      appDirectoryRoot: null,
      exports: [],
      imports: loadedModules,
      providers: [
        ...globalAppGuards.map((globalAppGuard) => {
          return {
            provide: APP_GUARD,
            useFactory: (
              reflector: Reflector,
              config: ConfigService,
              loggerKey,
              moduleRef: ModuleRef,
            ) => {
              return new globalAppGuard.importedModule[
                Object.keys(globalAppGuard.importedModule)[0]
              ](reflector, config, loggerKey, moduleRef);
            },
            inject: [Reflector, ConfigService, LoggerKey, ModuleRef],
          };
        }),
        ...this.createApplicationLevelRegistries(),
      ],
      featureModules: featureModules,
      moduleNames: moduleNames,
      adminProviders: this.createAdminProviders(loadedModules),
      messageIds: [],
    };

    await this.doDatastoreImports(appId, configuration, module);

    return module;
  }

  /**
   * Dynamically import datastore loaders as they are unique for the different datastore types (messenger, database, etc) and
   * their libraries (kafka, redis, postgres, etc). These should be dropped into a non-core directory (core-modules, src/*) and
   * the server startup will dynamically import them as needed.
   *
   * @param appId
   * @param configuration
   * @param module
   */
  private static async doDatastoreImports(
    appId: string,
    configuration: AppConfiguration,
    module: ApplicationModuleData,
  ) {
    const methodname = `${ApplicationModuleLoader.name}.doDatastoreImports [${appId}]`;

    const messageModules = await MessengerLoader.load(appId, configuration);

    const messageIds = messageModules.map(
      (messageModule) => messageModule.datastoreId,
    );

    const databaseModules = await DatabaseLoader.load(appId, configuration);

    module.imports = [...module.imports, ...messageModules, ...databaseModules];

    module.messageIds = messageIds;
  }

  /**
   * Not supported yet
   *
   * @param loadedModules
   * @returns
   */
  protected static createAdminProviders(loadedModules: any[]) {
    let adminProviders = [];

    loadedModules.forEach((loadedModule) => {
      if (loadedModule.adminProviders) {
        adminProviders = adminProviders.concat(loadedModule.adminProviders);
      }
    });

    return adminProviders;
  }

  protected static createApplicationLevelRegistries() {
    return [
      this.createLoggingRegistryProvider(
        ApiDatasourceServiceLoggingRegistry,
        "api.datasource.logging.registry",
      ),
      this.createLoggingRegistryProvider(
        MapperLoggingRegistry,
        "mapper.logging.registry",
      ),
      this.createLoggingRegistryProvider(
        MessengerLoggingRegistry,
        "messenger.logging.registry",
      ),
    ];
  }

  protected static createLoggingRegistryProvider(
    registryClass: typeof BaseRegistry,
    id: string,
  ) {
    registryClass.registryId = id;

    return {
      provide: registryClass.registryId,
      useFactory: (
        moduleRef: ModuleRef,
        configService: ConfigService,
        loggerKey,
      ) => {
        return this.initializeRegistryInstance(
          registryClass,
          id,
          configService,
          moduleRef,
          loggerKey,
        );
      },
      inject: [ModuleRef, ConfigService, LoggerKey],
    };
  }

  protected static initializeRegistryInstance(
    registryClass: any,
    pluginId: string,
    configService: ConfigService,
    moduleRef: ModuleRef,
    loggerKey,
  ) {
    return registryClass.initializeInstance(
      registryClass.registryId,
      registryClass,
      registryClass.registryId,
      [configService.get(AppConfigurationKeys.defaultConsumerId)],
      this.buildSimplePluginModule(pluginId),
      moduleRef,
      configService,
      loggerKey,
    );
  }

  protected static buildSimplePluginModule(id: string) {
    return {
      feature: {
        id,
        group: null,
        configuration: {},
      },
      configuration: {
        id,
        variants: null,
        consumers: {},
      },
      id,
      classFileFormat: null,
      classPath: null,
      importedModule: null,
    };
  }
}
