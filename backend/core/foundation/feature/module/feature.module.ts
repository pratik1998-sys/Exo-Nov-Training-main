import {
  AppConfiguration,
  SubscriptionConfiguration,
} from "@configuration/types";
import { LoggerKey } from "@logger";
import { BaseModule, ComponentType } from "@module/module";
import { DynamicModule, Logger, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { MessengerLoader } from "@server/loader/datastore/messenger.loader";
import { FeatureModuleData } from "@server/loader/types/loader.types";
import { ClassPath, ClassResolver } from "@utilities/class-resolver.utility";
import * as path from "path";

export interface FeatureComponentTypes {
  resolver: ComponentType;
  controller: ComponentType;
  service: ComponentType;
  subscriptionPubSub: ComponentType;
}

export class BaseFeatureModule extends BaseModule {
  static feature: FeatureModuleData;

  protected static rootDirectory = "features";

  static readonly logger = new Logger(BaseFeatureModule.name);

  static readonly componentTypes: FeatureComponentTypes = {
    resolver: {
      id: "resolver",
      fileSuffix: "resolver.js",
      tsFileSuffix: "resolver.ts",
      classNameSuffix: "Resolver",
    },
    controller: {
      id: "controller",
      fileSuffix: "controller.js",
      tsFileSuffix: "controller.ts",
      classNameSuffix: "Controller",
    },
    service: {
      id: "service",
      fileSuffix: "service.js",
      tsFileSuffix: "service.ts",
      classNameSuffix: "Service",
    },
    subscriptionPubSub: {
      id: "subscription-pubsub",
      fileSuffix: "subscription.pubsub.js",
      tsFileSuffix: "subscription.pubsub.ts",
      classNameSuffix: "SubscriptionPubSub",
    },
  };

  static async initializeModule(
    configuration: AppConfiguration,
    feature: FeatureModuleData,
    moduleClass: any,
  ): Promise<DynamicModule> {
    const methodname = this.composeMethodName("initializeModule", feature);

    const moduleShortPath = this.getModuleDirectoryShortPath(moduleClass);

    this.logger.log(
      `${methodname} - [${moduleClass.name}] - Initializing Feature module - Feature Id: ${feature.id}, Path: ${moduleShortPath} `,
    );

    // moduleClass.featureId = feature.id;
    moduleClass.feature = feature;

    moduleClass.providers = [
      { provide: FeatureModuleData, useValue: feature },
      ...moduleClass.providers,
      ...moduleClass.resolvers,
      ...(await this.createFeatureResolvers(configuration, feature)),
      ...(await this.createFeatureSubscriptionPubSubs(configuration, feature)),
    ];

    moduleClass.imports = [...moduleClass.imports];

    moduleClass.controllers = moduleClass.controllers.concat(
      await this.resolveFeatureControllers(configuration, feature),
    );

    await this.addServiceInterfaceIds(configuration, feature);

    return {
      module: moduleClass,
      imports: moduleClass.imports,
      exports: moduleClass.exports,
      providers: moduleClass.providers,
      controllers: moduleClass.controllers,
    };
  }

  protected static async createFeatureResolvers(
    configuration: AppConfiguration,
    feature: FeatureModuleData,
  ): Promise<Provider[]> {
    let resolvers: Provider[] = [];

    resolvers = await this.createFeatureComponentProviders(
      configuration,
      feature,
      this.componentTypes.resolver,
    );

    return resolvers;
  }

  /**
   * NestJS doesn't (yet) support including controllers as Providers like every other component. Hence, resolve the Class Types, and set
   * the static featureId property.
   *
   * @param config
   * @param feature
   *
   * @returns
   */
  protected static async resolveFeatureControllers(
    configuration: AppConfiguration,
    feature: FeatureModuleData,
  ): Promise<Provider[]> {
    const methodname = this.composeMethodName(
      "resolveFeatureControllers",
      feature,
    );

    const { id: featureId } = feature;

    const resolvedClassPaths: ClassPath[] =
      await this.resolveFeatureComponentClasses(
        configuration,
        feature,
        this.componentTypes.controller,
      );

    const resolvedControllers: any[] = [];

    feature.controllerClassPaths = resolvedClassPaths;

    resolvedClassPaths.forEach((resolvedClassPath) => {
      const { fileName, classObj, id, resolvedPathShort } = resolvedClassPath;

      this.logger.log(
        `${methodname} - Loading Controller ${this.name} - Id: ${id}, Class: ${fileName}, Path: ${resolvedPathShort}`,
      );

      //Set the static properties for when access is needed in static flows (ie @Subscription decorator)
      classObj.featureId = featureId;

      resolvedControllers.push(classObj);
    });

    return resolvedControllers;
  }

  protected static async createFeatureComponentProviders(
    configuration: AppConfiguration,
    feature: FeatureModuleData,
    componentType: ComponentType,
  ): Promise<Provider[]> {
    const methodname = this.composeMethodName(
      "createFeatureComponentProviders",
      feature,
    );

    const resolvedClassPaths: ClassPath[] =
      await this.resolveFeatureComponentClasses(
        configuration,
        feature,
        componentType,
      );

    if (this.componentTypes.resolver.id == componentType.id) {
      feature.resolverClassPaths = resolvedClassPaths;
    }
    const resolvedProviders: Provider[] = [];

    resolvedClassPaths.forEach((resolvedClassPath) => {
      let { fileName, classObj, id, resolvedPathShort } = resolvedClassPath;

      if (classObj) {
        resolvedProviders.push({
          provide: id,
          useFactory: async (
            configService: ConfigService,
            loggerKey,
            moduleRef: ModuleRef,
          ) => {
            this.logger.log(
              `Loading Module ${this.name} Provider [${componentType.id}] - Id: ${id}, Token: ${id}, Class: ${fileName}, Path: ${resolvedPathShort}`,
            );

            return new classObj(feature, configService, moduleRef, loggerKey);
          },
          inject: [ConfigService, LoggerKey, ModuleRef],
        });
      }
    });

    return resolvedProviders;
  }

  protected static async createFeatureSubscriptionPubSubs(
    configuration: AppConfiguration,
    feature: FeatureModuleData,
  ) {
    const methodname = this.composeMethodName(
      "createFeatureSubscriptionPubSubs",
      feature,
    );

    let providers: Provider[] = [];

    const { appName } = configuration;
    const { id: featureId, configuration: featureConfig } = feature;

    const componentType = this.componentTypes.subscriptionPubSub;

    if (featureConfig?.configuredSubscriptions) {
      const subscriptionPubSubTypeMap: Record<
        string,
        {
          resolvedClassPath: ClassPath;
          subscriptionConfigurations: SubscriptionConfiguration[];
        }
      > = {};

      Object.values(featureConfig.configuredSubscriptions).forEach(
        (subscriptionConfig) => {
          if (
            MessengerLoader.isDatastoreEnabled(subscriptionConfig.messenger)
          ) {
            if (!subscriptionPubSubTypeMap[subscriptionConfig.messenger.type]) {
              subscriptionPubSubTypeMap[subscriptionConfig.messenger.type] = {
                resolvedClassPath: null,
                subscriptionConfigurations: [],
              };
            }

            subscriptionPubSubTypeMap[
              subscriptionConfig.messenger.type
            ].subscriptionConfigurations.push(subscriptionConfig);
          } else {
            this.logger.log(
              `${methodname} - Subscription messenger ${subscriptionConfig.messenger.id} is disabled - Disabled subscription`,
            );
          }
        },
      );

      for await (const messengerType of Object.keys(
        subscriptionPubSubTypeMap,
      )) {
        const fileNamePrefix = messengerType;

        const classPaths = await ClassResolver.resolveClassPaths(
          `**${path.sep}${fileNamePrefix}.${componentType.fileSuffix}`,
          appName,
          "subscription-pubsubs",
          this.logger,
        );

        const classPath = classPaths.length > 0 ? classPaths[0] : null;

        if (classPath) {
          await this.importResolvedClass(
            fileNamePrefix,
            componentType.classNameSuffix,
            classPath,
          );

          subscriptionPubSubTypeMap[messengerType].resolvedClassPath =
            classPath;
        }
      }

      const tokenPrefix =
        this.composeFeatureSubscriptionBaseTokenPrefix(featureId);

      Object.values(subscriptionPubSubTypeMap).forEach((entry) => {
        entry.subscriptionConfigurations.forEach(
          (subscriptionConfiguration) => {
            const baseSubscriptionPubSubToken = `${tokenPrefix}:${subscriptionConfiguration.messenger.id}:${subscriptionConfiguration.topic.topic}`;

            providers = [
              ...providers,
              {
                provide: baseSubscriptionPubSubToken,
                useFactory: async (
                  configService: ConfigService,
                  loggerKey,
                  moduleRef: ModuleRef,
                ) => {
                  this.logger.log(
                    `Loading Feature ${featureId} Subscription Message - Token: ${baseSubscriptionPubSubToken}, AppConfiguration: ${this.logger.log(JSON.stringify(subscriptionConfiguration))}`,
                  );

                  return new entry.resolvedClassPath.classObj(
                    subscriptionConfiguration,
                    configService,
                    moduleRef,
                    loggerKey,
                  );
                },
                inject: [ConfigService, LoggerKey, ModuleRef],
              },
              ...subscriptionConfiguration.queries.map((query) => {
                const aliasToken = `${tokenPrefix}:${query}`;
                this.logger.log(
                  `Aliasing Query ${query} - Feature ${featureId} Subscription Message - Base Token: ${baseSubscriptionPubSubToken}, Alias Token: ${aliasToken}`,
                );

                return {
                  provide: aliasToken,
                  useExisting: baseSubscriptionPubSubToken,
                };
              }),
            ];
          },
        );
      });
    }

    return providers;
  }

  protected static async resolveFeatureComponentClasses(
    configuration: AppConfiguration,
    feature: FeatureModuleData,
    componentType: ComponentType,
  ): Promise<ClassPath[]> {
    const methodname = this.composeMethodName(
      "resolveFeatureComponentClasses",
      feature,
    );

    const { id: featureId } = feature;

    const fileFormat = `**${path.sep}${featureId}*.${componentType.fileSuffix}`;

    const classPaths: ClassPath[] = await ClassResolver.resolveClassPaths(
      fileFormat,
      configuration.appName,
      this.rootDirectory,
      this.logger,
      false,
      `${this.rootDirectory}${path.sep}${featureId}`,
    );

    for await (const classPath of classPaths) {
      await this.importResolvedClass(
        featureId,
        componentType.classNameSuffix,
        classPath,
      );
    }

    return classPaths;
  }

  protected static async addServiceInterfaceIds(
    configuration: AppConfiguration,
    feature: FeatureModuleData,
  ) {
    const methodname = this.composeMethodName(
      "addServiceInterfaceIds",
      feature,
    );

    const { id: featureId } = feature;

    const componentType = this.componentTypes.service;

    const fileFormat = `**${path.sep}${featureId}*.${componentType.fileSuffix}`;

    const classPaths: ClassPath[] = await ClassResolver.resolveClassPaths(
      fileFormat,
      configuration.appName,
      this.rootDirectory,
      this.logger,
      false,
      `${this.rootDirectory}${path.sep}${featureId}`,
    );

    for await (const classPath of classPaths) {
      await this.importFullClassPathHierarchy(
        componentType,
        classPath,
        featureId,
      );
    }
  }

  protected static composeFeatureSubscriptionBaseTokenPrefix(
    featureId: string,
  ) {
    return `${featureId}:subscription:pubsub`;
  }

  static composeFeatureSubscriptionQueryToken(
    query: string,
    featureId?: string,
  ) {
    return `${this.composeFeatureSubscriptionBaseTokenPrefix(featureId)}:${query}`;
  }

  protected static composeMethodName(
    methodname: string,
    feature: FeatureModuleData,
  ) {
    return `${this.name}.${methodname} [${feature.id}]`;
  }
}
