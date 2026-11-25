import { Provider } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerKey } from "@logger";
import * as path from "path";
import {
  AppConfiguration,
  PluginConsumerConfiguration,
} from "@configuration/types";
import { groupEntityClassesByDatabaseConnection } from "@plugin/database";
import { ClassPath, ClassResolver } from "@utilities/class-resolver.utility";
import { BaseModule, ComponentType } from "@module/module";
import { PluginModuleData } from "@server/loader/types/loader.types";
import { StringUtility } from "@utilities";

export interface PluginComponentVariant {
  variant: string;
  fileFormat: string;
  consumers: PluginConsumerConfiguration[];
  classPaths: ClassPath[];
}

export interface PluginComponentTypes {
  service: ComponentType;
  mapper: ComponentType;
  datasource: ComponentType;
  registry: ComponentType;
  entity: ComponentType;
}

export class BasePluginModule extends BaseModule {
  static readonly defaultPluginVariantId = "default";

  static readonly componentTypes: PluginComponentTypes = {
    service: {
      id: "service",
      classNameSuffix: "ServiceImpl",
      fileSuffix: "service.js",
      tsFileSuffix: "service.ts",
    },
    mapper: {
      id: "mapper",
      classNameSuffix: "Mapper",
      fileSuffix: "mapper.js",
      tsFileSuffix: "mapper.ts",
    },
    datasource: {
      id: "datasource",
      classNameSuffix: "Datasource",
      fileSuffix: "datasource.js",
      tsFileSuffix: "datasource.ts",
    },
    registry: {
      id: "registry",
      classNameSuffix: "Registry",
      fileSuffix: "registry.js",
      tsFileSuffix: "registry.ts",
    },
    entity: {
      id: "entity",
      classNameSuffix: "Entity",
      fileSuffix: "entity.js",
      tsFileSuffix: "entity.ts",
    },
  };

  static async initializeModule(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
    moduleClass: any,
  ): Promise<any> {
    const { id: pluginId, feature, configuration: pluginConfig } = plugin;

    const methodname = this.composeMethodName("initializeModule", plugin);

    const moduleShortPath = this.getModuleDirectoryShortPath(moduleClass);

    this.logger.log(
      `${methodname} - [${moduleClass.name}] - Initializing Plugin module - Plugin Id: ${pluginId}, Feature Id: ${feature.id}, Path: ${moduleShortPath} `,
    );

    moduleClass.providers = moduleClass.providers.concat(
      await this.createPluginProviders(configuration, plugin),
    );
    moduleClass.imports = moduleClass.imports.concat(
      await this.createPluginImports(configuration, plugin),
    );

    const registryProviders = await this.createPluginRegistryComponentProviders(
      configuration,
      plugin,
    );
    const datasourceProviders: Provider[] =
      await this.createPluginDatasourceComponentProviders(
        configuration,
        plugin,
      );

    moduleClass.providers = moduleClass.providers.concat(registryProviders);
    moduleClass.providers = moduleClass.providers.concat(datasourceProviders);

    const initializedModule = {
      module: moduleClass,
      imports: [ConfigModule, ...moduleClass.imports],
      providers: moduleClass.providers,
      exports: moduleClass.exports,
      adminProviders: registryProviders,
    };

    return initializedModule;
  }

  //For plugin type specific override
  protected static async createPluginImports(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
  ): Promise<any[]> {
    return this.createPluginDatabaseImports(configuration, plugin);
  }

  /**
   * Discovers this plugin/feature's TypeORM entities (if any) and, when the plugin has
   * `databases` configured, registers them via `TypeOrmModule.forFeature` so
   * `getRepository()`/`getDatabaseConnection()` resolve on the plugin service. A single
   * `*.entity.ts` file may export more than one entity class - all matching exports are
   * registered, not just the first. A plugin with no entity files simply yields no
   * imports here, and behaves as a non-database plugin module - no explicit opt-in
   * required.
   *
   * A plugin may declare more than one database connection under `databases`. Each
   * entity class is registered against the connection named on its
   * `@PluginDatabaseConnection` decorator, or the plugin's primary connection
   * (the `databases` entry flagged `primary: true`, or the first entry) when the
   * decorator is absent. One `TypeOrmModule.forFeature` import is emitted per distinct
   * connection referenced by the plugin's entities.
   */
  protected static async createPluginDatabaseImports(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
  ): Promise<any[]> {
    const methodname = this.composeMethodName(
      "createPluginDatabaseImports",
      plugin,
    );

    const { configuration: pluginConfig } = plugin;

    const resolvedEntityClassPaths: ClassPath[] =
      await this.resolveEntitiesClassPaths(configuration, plugin);

    if (resolvedEntityClassPaths.length === 0) {
      return [];
    }

    const entityClasses: any[] = resolvedEntityClassPaths.flatMap(
      (entityClassPath) =>
        entityClassPath.classObjs ?? [entityClassPath.classObj],
    );

    const entityClassesByConnectionId = groupEntityClassesByDatabaseConnection(
      pluginConfig,
      entityClasses,
    );

    const connectionIds = Object.keys(entityClassesByConnectionId);

    this.logger.log(
      `${methodname} - Registering entities across ${connectionIds.length} database connection(s): ${JSON.stringify(connectionIds)}`,
    );

    return connectionIds.map((connectionId) =>
      TypeOrmModule.forFeature(
        entityClassesByConnectionId[connectionId],
        connectionId,
      ),
    );
  }

  protected static async resolveEntitiesClassPaths(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
  ): Promise<ClassPath[]> {
    const methodname = this.composeMethodName(
      "resolveEntitiesClassPaths",
      plugin,
    );

    const { id: pluginId, feature, configuration: pluginConfig } = plugin;
    const { id: featureId } = feature;

    const consumers = Object.values(pluginConfig.configuredConsumers);

    const pluginComponentVariants: PluginComponentVariant[] = [
      {
        fileFormat: `${pluginId}${path.sep}features${path.sep}${featureId}${path.sep}**${path.sep}*${pluginId}.${featureId}*.${this.componentTypes.entity.fileSuffix}`,
        consumers,
        classPaths: [],
        variant: this.defaultPluginVariantId,
      },
      {
        fileFormat: `${pluginId}${path.sep}**${path.sep}*${pluginId}.common*.${this.componentTypes.entity.fileSuffix}`,
        consumers,
        classPaths: [],
        variant: this.defaultPluginVariantId,
      },
    ];

    const async = pluginComponentVariants.map((pluginComponentVariant) =>
      this.resolvePluginComponentClasses(
        configuration,
        plugin,
        this.componentTypes.entity,
        pluginComponentVariant,
      ),
    );

    await Promise.all(async);

    let resolvedClassPaths: ClassPath[] = [];

    for (const pluginComponentVariant of pluginComponentVariants) {
      const { classPaths } = pluginComponentVariant;

      resolvedClassPaths = resolvedClassPaths.concat(classPaths);
    }

    if (resolvedClassPaths.length > 0) {
      this.logger.log(
        `${methodname} - Plugin[${pluginId}] Feature[${featureId}] Resolved database entities: ${JSON.stringify(resolvedClassPaths)}`,
      );
    }

    return resolvedClassPaths;
  }

  protected static async createPluginProviders(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
  ): Promise<Provider[]> {
    let providers: Provider[] = [];

    providers = [
      ...(await this.createPluginComponentProviders(
        configuration,
        plugin,
        this.componentTypes.service,
      )),
      ...(await this.createPluginComponentProviders(
        configuration,
        plugin,
        this.componentTypes.mapper,
      )),
      // ...(await this.createPluginComponentProviders(configuration, plugin, this.componentTypes.datasource)),
    ];

    return providers;
  }

  protected static async createPluginComponentProviders(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
    componentType: ComponentType,
    consumers?: PluginConsumerConfiguration[],
    fileFormat?: string,
  ): Promise<Provider[]> {
    const methodname = this.composeMethodName(
      "createPluginComponentProviders",
      plugin,
    );

    const { id: pluginId, feature } = plugin;
    const { id: featureId } = feature;

    consumers =
      consumers ?? Object.values(plugin.configuration.configuredConsumers);

    const pluginVariantMap: Record<string, PluginComponentVariant> = {};

    if (fileFormat) {
      pluginVariantMap[BasePluginModule.defaultPluginVariantId] = {
        variant: BasePluginModule.defaultPluginVariantId,
        fileFormat,
        consumers,
        classPaths: [],
      };
    } else {
      const fileFormatPrefix = `**/${pluginId}${path.sep}features${path.sep}${featureId}${path.sep}**${path.sep}*`;
      const fileFormatSuffix = `.${featureId}*.${componentType.fileSuffix}`;

      pluginVariantMap[BasePluginModule.defaultPluginVariantId] = {
        variant: BasePluginModule.defaultPluginVariantId,
        fileFormat: `${fileFormatPrefix}${pluginId}${fileFormatSuffix}`,
        consumers,
        classPaths: [],
      };

      consumers.forEach((consumer) => {
        const { variantId, id } = consumer;

        if (StringUtility.isStringNotEmpty(variantId)) {
          this.logger.log(
            `${methodname} - Plugin variant: ${variantId} consumer: ${id}`,
          );

          if (!pluginVariantMap[variantId]) {
            pluginVariantMap[variantId] = {
              variant: variantId,
              fileFormat: `${fileFormatPrefix}${pluginId}.${variantId}${fileFormatSuffix}`,
              consumers: [],
              classPaths: [],
            };
          }

          pluginVariantMap[variantId].consumers.push(consumer);
        }
      });
    }

    const logPluginVariants = JSON.stringify(
      Object.values(pluginVariantMap).map((pluginVariant) => {
        return {
          variant: pluginVariant.variant,
          fileFormat: pluginVariant.fileFormat,
        };
      }),
    );

    this.logger.log(
      `${methodname} - Resolving classes for component type ${componentType.id} with file formats: ${logPluginVariants}`,
    );

    const async = Object.values(pluginVariantMap).map(
      (pluginComponentVariant) =>
        this.resolvePluginComponentClasses(
          configuration,
          plugin,
          componentType,
          pluginComponentVariant,
        ),
    );

    await Promise.all(async);

    let resolvedPluginVariantConsumerIds: string[] = [];
    let resolvedDefaultPluginVariantClassPath: ClassPath;

    const resolvedPluginComponentVariants: PluginComponentVariant[] = [];

    Object.keys(pluginVariantMap).forEach((pluginComponentVariantType) => {
      const pluginComponentVariant =
        pluginVariantMap[pluginComponentVariantType];

      const { classPaths } = pluginComponentVariant;

      const isDefaultVariant =
        this.defaultPluginVariantId == pluginComponentVariantType;

      if (classPaths.length > 0) {
        classPaths.forEach((classPath) => {
          if (isDefaultVariant) {
            resolvedDefaultPluginVariantClassPath = classPath;
          } else {
            resolvedPluginVariantConsumerIds =
              resolvedPluginVariantConsumerIds.concat(classPath.consumerIds);
          }
        });

        resolvedPluginComponentVariants.push(pluginComponentVariant);
      }
    });

    if (resolvedDefaultPluginVariantClassPath) {
      const defaultPluginVariantConsumerIds: string[] = [];

      resolvedDefaultPluginVariantClassPath.consumerIds.forEach(
        (consumerId) => {
          if (!resolvedPluginVariantConsumerIds.includes(consumerId)) {
            defaultPluginVariantConsumerIds.push(consumerId);
          } else {
            this.logger.log(
              `${methodname} - Consumer [${consumerId}] has a specific plugin variant`,
            );
          }
        },
      );

      resolvedDefaultPluginVariantClassPath.consumerIds =
        defaultPluginVariantConsumerIds;
    }

    this.logger.log(
      `${methodname} - Resolved classes for component type ${componentType.id} with file formats: ${logPluginVariants} - ${JSON.stringify(resolvedPluginComponentVariants)}`,
    );

    let resolvedProviders: Provider[] = this.buildPluginComponentProviders(
      configuration,
      plugin,
      componentType,
      resolvedPluginComponentVariants,
    );

    return resolvedProviders;
  }

  protected static async createPluginRegistryComponentProviders(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
  ): Promise<Provider[]> {
    const componentType = this.componentTypes.registry;

    let resolvedProviders: Provider[] =
      await this.createPluginComponentProviders(
        configuration,
        plugin,
        componentType,
      );

    const pluginCommonRegistryFileFormat = `**${path.sep}${plugin.id}${path.sep}**${path.sep}*${plugin.id}.common*.${componentType.fileSuffix}`;

    resolvedProviders = resolvedProviders.concat(
      await this.createPluginComponentProviders(
        configuration,
        plugin,
        componentType,
        undefined,
        pluginCommonRegistryFileFormat,
      ),
    );

    return resolvedProviders;
  }

  protected static async createPluginDatasourceComponentProviders(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
  ): Promise<Provider[]> {
    const componentType = this.componentTypes.datasource;

    let resolvedProviders: Provider[] =
      await this.createPluginComponentProviders(
        configuration,
        plugin,
        componentType,
      );

    const pluginBaseDatasourceFileFormat = `**${path.sep}${plugin.id}${path.sep}**${path.sep}*${plugin.id}.base.${componentType.fileSuffix}`;

    resolvedProviders = resolvedProviders.concat(
      await this.createPluginComponentProviders(
        configuration,
        plugin,
        componentType,
        undefined,
        pluginBaseDatasourceFileFormat,
      ),
    );

    return resolvedProviders;
  }

  protected static addVariantsToPluginData(
    plugin: PluginModuleData,
    componentType: ComponentType,
    resolvedPluginComponentVariants: PluginComponentVariant[],
  ) {
    //This is mainly for logging on app start
    resolvedPluginComponentVariants.forEach((variant) => {
      variant.consumers.forEach((consumer) => {
        if (!plugin.consumerPluginComponents) {
          plugin.consumerPluginComponents = {};
        }

        if (!plugin.consumerPluginComponents[consumer.id]) {
          plugin.consumerPluginComponents[consumer.id] = {
            variant: variant.variant,
            services: [],
            datasources: [],
            mappers: [],
            registries: [],
          };
        }

        const consumerClassPaths = variant.classPaths.find((classPath) =>
          classPath.consumerIds.includes(consumer.id),
        );

        if (consumerClassPaths) {
          if (this.componentTypes.service.id == componentType.id) {
            plugin.consumerPluginComponents[consumer.id].services =
              plugin.consumerPluginComponents[consumer.id].services.concat(
                consumerClassPaths,
              );
          } else if (this.componentTypes.datasource.id == componentType.id) {
            plugin.consumerPluginComponents[consumer.id].datasources =
              plugin.consumerPluginComponents[consumer.id].datasources.concat(
                consumerClassPaths,
              );
          } else if (this.componentTypes.mapper.id == componentType.id) {
            plugin.consumerPluginComponents[consumer.id].mappers =
              plugin.consumerPluginComponents[consumer.id].mappers.concat(
                consumerClassPaths,
              );
          } else if (this.componentTypes.registry.id == componentType.id) {
            plugin.consumerPluginComponents[consumer.id].registries =
              plugin.consumerPluginComponents[consumer.id].registries.concat(
                consumerClassPaths,
              );
          }
        }
      });
    });
  }

  protected static buildPluginComponentProviders(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
    componentType: ComponentType,
    resolvedPluginComponentVariants: PluginComponentVariant[],
  ): Provider[] {
    const methodname = this.composeMethodName(
      "buildPluginComponentProviders",
      plugin,
    );

    const resolvedProviders: Provider[] = [];

    this.addVariantsToPluginData(
      plugin,
      componentType,
      resolvedPluginComponentVariants,
    );

    for (const pluginComponentVariant of resolvedPluginComponentVariants) {
      const { classPaths } = pluginComponentVariant;

      for (const classPath of classPaths) {
        const { consumerIds, isDefault, id, classObj } = classPath;

        if (consumerIds.length > 0) {
          let defaultToken: string = null;

          if (isDefault) {
            if (pluginComponentVariant.variant == "default") {
              defaultToken = id;

              resolvedProviders.push(
                this.buildConsumerPluginComponentProvider(
                  configuration,
                  plugin,
                  componentType,
                  defaultToken,
                  null,
                  classPath,
                ),
              );
            }

            // defaultToken = id;

            // resolvedProviders.push(this.buildConsumerPluginComponentProvider(configuration, plugin, componentType, defaultToken, null, classPath));
          }

          for (const consumerId of consumerIds) {
            //If defaultToken is set, then it is the default class path being processed, and consumer specific providers are just alias providers to the default provider
            resolvedProviders.push(
              this.buildConsumerPluginComponentProvider(
                configuration,
                plugin,
                componentType,
                `${consumerId}.${id}`,
                defaultToken,
                classPath,
              ),
            );
          }
        } else {
          this.logger.log(
            `${methodname} - No consumer ids associated to class path: ${JSON.stringify(classPath)}`,
          );
        }
      }
    }

    return resolvedProviders;
  }

  protected static buildConsumerPluginComponentProvider(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
    componentType: ComponentType,
    token: string,
    existingToken: string,
    resolvedClassPath: ClassPath,
  ): Provider {
    const methodname = this.composeMethodName(
      "buildConsumerPluginComponentProvider",
      plugin,
    );

    const { fileName, id, classObj, consumerIds } = resolvedClassPath;

    const isRegistry = this.componentTypes.registry.id == componentType.id;

    if (isRegistry) {
      classObj.registryId = fileName.replace(".js", "");
    }

    if (existingToken) {
      this.logger.log(
        `${methodname} - Plugin Component Provider - Creating Alias Provider - token: ${token} useExisting: ${existingToken}`,
      );

      return {
        provide: token,
        useExisting: existingToken,
      };
    } else {
      this.logger.log(
        `${methodname} - Plugin Component Provider - Creating New Provider - token: ${token}`,
      );

      //TODO REFACTORING - REVISIT CONSTRUCTOR AND INTIALIZE INSTANCE PARAMS HERE.....
      if (isRegistry) {
        return {
          provide: token,
          useFactory: async (
            configService: ConfigService,
            loggerKey,
            moduleRef: ModuleRef,
          ) => {
            this.logger.log(
              `${methodname} - Loading Registry Module ${this.name} Provider [${componentType.id}] - Id: ${id}, Token: ${token}, Class: ${fileName}`,
            );

            // return classObj.initializeInstance(id, classObj, classObj.registryId, consumerIds, pluginConfig, feature.id, moduleRef, configService, loggerKey);
            return classObj.initializeInstance(
              id,
              classObj,
              classObj.registryId,
              consumerIds,
              plugin,
              moduleRef,
              configService,
              loggerKey,
            );
          },
          inject: [ConfigService, LoggerKey, ModuleRef],
        };
      } else {
        return {
          provide: token,
          useFactory: async (
            configService: ConfigService,
            loggerKey,
            moduleRef: ModuleRef,
          ) => {
            this.logger.log(
              `${methodname} - Loading Module ${this.name} Provider [${componentType.id}] - Id: ${id}, Token: ${token}, Class: ${fileName}`,
            );

            // return new classObj(id, consumerIds, pluginConfig, feature.id, moduleRef, configService, loggerKey);
            return new classObj(
              id,
              consumerIds,
              plugin,
              moduleRef,
              configService,
              loggerKey,
            );
          },
          inject: [ConfigService, LoggerKey, ModuleRef],
        };
      }
    }
  }

  /**
   * The parameter componentIdentifier, for plugin-module, is the pluginId.
   *
   * @param componentIdentifier
   * @param consumerIds
   * @param appName
   * @param rootDirectory
   * @param fileFormat
   * @returns
   */
  protected static async resolvePluginComponentClasses(
    configuration: AppConfiguration,
    plugin: PluginModuleData,
    componentType: ComponentType,
    pluginComponentVariant: PluginComponentVariant,
  ) {
    const methodname = this.composeMethodName(
      "resolvePluginComponentClasses",
      plugin,
    );

    const { id: pluginId, feature } = plugin;
    const { id: featureId } = feature;
    const { fileFormat } = pluginComponentVariant;

    const classIdPrefix =
      this.componentTypes.registry.id == componentType.id
        ? pluginId
        : featureId;

    //FIX_2025-05_001 - Removed normalizedPath as it was not resolving correctly when there was a non-consumer specific extension, and a consumer specific extension in a consumer directory
    //ie $pluginId/features/$featureId/consumer-x/$filename

    //The fileFormat here includes the pluginId directory and not just file name, which is important on the chance plugin "abc" exists as does plugin "xyz-abc". Without having the directory,
    //the fileFormat wild card would resolve unpredictably between the two plugins.
    const classPaths: ClassPath[] = await ClassResolver.resolveClassPaths(
      fileFormat,
      configuration.appName,
      `**${path.sep}plugins`,
      this.logger,
      false,
      `${pluginId}/features/${featureId}`,
    );
    //const classPaths: ClassPath[] = await ClassResolver.resolveClassPaths(fileFormat, config[AppConfigurationKeys.appName], 'plugins', this.logger, false);

    pluginComponentVariant.classPaths = classPaths;

    if (classPaths.length > 0) {
      await this.resolvePluginComponentClassPaths(
        configuration,
        componentType,
        plugin,
        pluginComponentVariant,
        classIdPrefix,
      );
    } else {
      this.logger.log(
        `${methodname} - No Class Paths found for file format: ${fileFormat}`,
      );
    }
  }

  protected static async resolvePluginComponentClassPaths(
    configuration: AppConfiguration,
    componentType: ComponentType,
    plugin: PluginModuleData,
    pluginComponentVariant: PluginComponentVariant,
    classIdPrefix: string,
    doForceDefaultClassImport: boolean = true,
  ) {
    const methodname = this.composeMethodName(
      "resolvePluginComponentClassPaths",
      plugin,
    );

    const { classNameSuffix } = componentType;

    await this.resolveConsumersPluginComponentClassPaths(
      configuration,
      classNameSuffix,
      plugin,
      pluginComponentVariant,
      classIdPrefix,
    );

    let defaultClassPath: ClassPath = pluginComponentVariant.classPaths.find(
      (classPath) => classPath.isDefault,
    );

    //If no consumerIds resolved to the default class implementation (ie there is a consumer specific implementation for all consumers),
    //then the default implementation needs to have a forced import, to assign an ID to it, for use in the application to
    //obtain the token for the component class type to resolve to an implementation.
    //OR
    //If there exists an extension of the base (default) class, the default class still needs an ID assigned for the core code,
    //or to use the default class for the token to obtaint the class instance.
    if (doForceDefaultClassImport && defaultClassPath != null) {
      await this.importFullClassPathHierarchy(
        componentType,
        defaultClassPath,
        classIdPrefix,
      );
    }
  }

  protected static async resolveConsumersPluginComponentClassPaths(
    configuration: AppConfiguration,
    classNameSuffix: string,
    plugin: PluginModuleData,
    pluginComponentVariant: PluginComponentVariant,
    classIdPrefix: string,
  ) {
    const methodname = this.composeMethodName(
      "resolveConsumersPluginComponentClassPaths",
      plugin,
    );

    const { id: pluginId, feature } = plugin;
    const { id: featureId } = feature;

    const { classPaths, consumers, fileFormat } = pluginComponentVariant;

    if (classPaths.length > 0) {
      const classPathMapByKey: Record<string, ClassPath> = {};

      const defaultClassPathConsumerIds = consumers.map(
        (consumer) => consumer.id,
      );

      for await (const classPath of classPaths) {
        const { resolvedPathShort, fileName } = classPath;

        let token = `features${path.sep}${featureId}${path.sep}`;

        if (!resolvedPathShort.includes(token)) {
          token = `common${path.sep}`;
        }

        const key = resolvedPathShort.substring(
          resolvedPathShort.indexOf(token) + token.length,
        );

        classPath.isDefault = fileName.startsWith(`${pluginId}.`);

        classPathMapByKey[key] = classPath;
      }

      const classPathKeys = Object.keys(classPathMapByKey);

      for (const classPathKey of classPathKeys) {
        const classPath = classPathMapByKey[classPathKey];

        const { fileName } = classPath;

        for (const consumer of consumers) {
          if (fileName.startsWith(`${consumer.id}.`)) {
            classPathMapByKey[classPathKey].consumerIds.push(consumer.id);

            defaultClassPathConsumerIds.splice(
              defaultClassPathConsumerIds.indexOf(consumer.id),
              1,
            );
          }
        }
      }

      for await (const classPath of Object.values(classPathMapByKey)) {
        //Assign consumerIds that do not have specific class path to the default class path
        if (classPath.isDefault && defaultClassPathConsumerIds.length > 0) {
          classPath.consumerIds = defaultClassPathConsumerIds;
        }

        if (classPath.consumerIds.length > 0) {
          await this.importResolvedClass(
            classIdPrefix,
            classNameSuffix,
            classPath,
          );

          if (!classPath.classObj) {
            this.logger.warn(
              `${methodname} - WARNING - Class ${classPath.fileName} found, but misconfigured`,
            );
          }
        } else {
          this.logger.log(
            `${methodname} - Class Path has no consumer ids associated, will not load: ${JSON.stringify(classPath)}`,
          );
        }
      }
    } else {
      this.logger.log(
        `${methodname} - No Class Paths found for file format: ${fileFormat}`,
      );
    }
  }

  protected static composeMethodName(
    methodname: string,
    plugin: PluginModuleData,
  ) {
    return `${this.name}.${methodname} [${plugin.id}.${plugin.feature.id}]`;
  }
}
