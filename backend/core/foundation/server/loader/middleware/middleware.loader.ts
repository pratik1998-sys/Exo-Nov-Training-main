import { Logger, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import path from "path";
import { merge } from "lodash";
import { ClassPath, ClassResolver } from "@utilities/class-resolver.utility";
import { ComponentType } from "@module/module";
import { StringUtility } from "@utilities";
import {
  FeatureConfiguration,
  FeatureConfigurationMapValue,
  MiddlewareConfiguration,
  MiddlewareConsumerType,
  PluginConfiguration,
} from "@configuration/types";
import { AppConfigurationKeys } from "@configuration/app";
import { healthPath } from "@health";

export type MiddlewareClassPath = ClassPath &
  MiddlewareConfiguration & {
    classDef: any;
  };

export type EnabledMiddlewareConfiguration = {
  middleware: Record<string, MiddlewareConfiguration>;
  featureMiddleware: Record<string, MiddlewareConfiguration>;
  pluginMiddleware: Record<string, MiddlewareConfiguration>;
};

export class MiddlewareLoader {
  protected static readonly logger = new Logger(MiddlewareLoader.name);

  protected static readonly middlewareComponentType: ComponentType = {
    id: "middleware",
    classNameSuffix: "Middleware",
    fileSuffix: "middleware.js",
    tsFileSuffix: "middleware.ts",
  };

  protected static readonly middleware: MiddlewareConfiguration[] = [
    {
      id: "request.context.middleware",
      enabled: true,
      sequence: 1,
      configuration: {},
      forRoutes: [],
      excludeRoutes: [],
    },
    {
      id: "access-logging.middleware",
      enabled: true,
      sequence: 2,
      configuration: {},
      forRoutes: [],
      excludeRoutes: [],
    },
  ];

  static async load(
    consumer: MiddlewareConsumer,
    configService: ConfigService,
    isAdminApp: boolean,
  ) {
    let appId = configService.get(AppConfigurationKeys.appName);

    appId = isAdminApp ? `${appId}-admin` : appId;

    const appDirectory = configService.get(AppConfigurationKeys.appName);

    const methodname = `${MiddlewareLoader.name}.load [${appId}]`;

    const resolvedMiddlewareClassPaths = await this.resolveMiddlewareClassPaths(
      appId,
      appDirectory,
      configService,
    );

    resolvedMiddlewareClassPaths.forEach((classPath) => {
      this.applyMiddleware(appId, consumer, configService, classPath);
    });
  }

  protected static async resolveMiddlewareClassPaths(
    appId: string,
    appDirectory: string,
    configService: ConfigService,
  ): Promise<MiddlewareClassPath[]> {
    const methodname = `${MiddlewareLoader.name}.resolveMiddlewareClassPaths [${appId}]`;

    const featuresConfiguration: Record<string, FeatureConfigurationMapValue> =
      configService.get(AppConfigurationKeys.configuredFeatures);
    const rootMiddlewareConfiguration: MiddlewareConfiguration[] =
      configService.get(AppConfigurationKeys.middleware);
    const consumerIds: string[] = configService.get(
      AppConfigurationKeys.consumerIds,
    );

    const enabledMiddlewareConfiguration: EnabledMiddlewareConfiguration = {
      middleware: {},
      featureMiddleware: {},
      pluginMiddleware: {},
    };

    this.middleware.forEach((middlewareConfiguration) => {
      enabledMiddlewareConfiguration.middleware[middlewareConfiguration.id] =
        middlewareConfiguration;
    });

    this.resolveNonFeaturePluginMiddlewareConfiguration(
      appId,
      appDirectory,
      configService,
      rootMiddlewareConfiguration,
      enabledMiddlewareConfiguration,
    );
    this.resolveFeaturePluginMiddlewareConfiguration(
      appId,
      appDirectory,
      featuresConfiguration,
      rootMiddlewareConfiguration,
      enabledMiddlewareConfiguration,
    );

    const async = [
      this.resolveAndInitializeMiddlewareTypeClassPaths(
        appId,
        appDirectory,
        consumerIds,
        "features",
        enabledMiddlewareConfiguration.featureMiddleware,
      ),
      this.resolveAndInitializeMiddlewareTypeClassPaths(
        appId,
        appDirectory,
        consumerIds,
        "plugins",
        enabledMiddlewareConfiguration.pluginMiddleware,
      ),
      this.resolveAndInitializeMiddlewareTypeClassPaths(
        appId,
        appDirectory,
        consumerIds,
        "middleware",
        enabledMiddlewareConfiguration.middleware,
      ),
    ];

    const results: MiddlewareClassPath[][] = await Promise.all(async);

    const resolvedMiddlewareClassPaths: MiddlewareClassPath[] = [];

    results.forEach((result) => {
      result.forEach((middlewareClassPath) => {
        if (middlewareClassPath.classDef != null) {
          this.logger.log(
            `${methodname} - Class found for middleware [${middlewareClassPath.id}] - ${middlewareClassPath.resolvedPathShort}`,
          );

          middlewareClassPath.sequence = middlewareClassPath.sequence ?? 1000;

          resolvedMiddlewareClassPaths.push(middlewareClassPath);
        } else {
          this.logger.log(
            `${methodname} - WARNING: No Class found for middleware [${middlewareClassPath.id}]`,
          );
        }
      });
    });

    resolvedMiddlewareClassPaths.sort((a, b) => a.sequence - b.sequence);

    return resolvedMiddlewareClassPaths;
  }

  protected static async resolveAndInitializeMiddlewareTypeClassPaths(
    appId: string,
    appDirectory: string,
    consumerIds: string[],
    directory: string,
    enabledMiddlewareConfiguration: Record<string, MiddlewareConfiguration>,
  ): Promise<MiddlewareClassPath[]> {
    const methodname = `${MiddlewareLoader.name}.resolveAndInitializeMiddlewareTypeClassPaths [${appId}] (Middleware Type: ${directory})`;

    const fileFormat = `**${path.sep}*.${this.middlewareComponentType.fileSuffix}`;

    const classPaths = await ClassResolver.resolveClassPaths(
      fileFormat,
      appDirectory,
      directory,
      this.logger,
    );

    const async = [];

    const classPathGroupMap: Record<
      string,
      { specificConsumerIds: string[]; classPaths: ClassPath[] }
    > = {};

    classPaths.forEach((classPath) => {
      const { fileName } = classPath;

      classPath.id = fileName.replace(".js", "");

      let middlewareId = classPath.id;

      const consumerId = consumerIds.find((consumerId) =>
        middlewareId.startsWith(`${consumerId}.`),
      );

      if (consumerId) {
        middlewareId = middlewareId.replace(`${consumerId}.`, "");

        classPath.consumerIds = [consumerId];
      }

      if (!classPathGroupMap[middlewareId]) {
        classPathGroupMap[middlewareId] = {
          specificConsumerIds: [],
          classPaths: [],
        };
      }

      if (consumerId) {
        classPathGroupMap[middlewareId].specificConsumerIds.push(consumerId);
      }

      classPathGroupMap[middlewareId].classPaths.push(classPath);
    });

    for await (const classPathGroupId of Object.keys(classPathGroupMap)) {
      const classPathGroup = classPathGroupMap[classPathGroupId];

      const baseClassPathConsumerIds: string[] = consumerIds.filter(
        (consumerId) =>
          !classPathGroup.specificConsumerIds.includes(consumerId),
      );

      for await (const classPath of classPathGroup.classPaths) {
        if (!classPath.consumerIds || classPath.consumerIds.length == 0) {
          classPath.consumerIds = baseClassPathConsumerIds;
        }

        let middlewareConfiguration =
          enabledMiddlewareConfiguration[classPath.id];

        if (!middlewareConfiguration) {
          this.logger.log(
            `${methodname} - Middleware ${classPath.id} is consumer specific - No specific configuration found, default to middleware [${classPathGroupId}] configuration`,
          );

          if (enabledMiddlewareConfiguration[classPathGroupId]) {
            middlewareConfiguration = JSON.parse(
              JSON.stringify(enabledMiddlewareConfiguration[classPathGroupId]),
            );
          }
        }

        if (middlewareConfiguration) {
          this.processMiddlewareConfiguration(
            appId,
            middlewareConfiguration,
            classPath,
          );

          async.push(
            this.initializeMiddlewareTypeClassPath(
              appId,
              directory,
              classPath,
              middlewareConfiguration,
            ),
          );
        } else {
          this.logger.log(
            `${methodname} - Middleware [${classPath.id}] is not enabled in the app configuration`,
          );
        }
      }
    }

    const results = await Promise.all<MiddlewareClassPath[]>(async);

    return results;
  }

  /**
   * Processes and normalizes middleware configuration for a given class path.
   *
   * Constructs a map of middleware consumers, ensures that every consumer ID
   * referenced by the provided classPath exists in the configuration, and
   * merges per-consumer configuration with the global middleware configuration.
   *
   * The method mutates the supplied middlewareConfiguration by:
   * - Normalizing/creating entries in middlewareConfiguration.consumers so every
   *   consumer referenced by classPath.consumerIds is present.
   * - Setting middlewareConfiguration.configuredConsumers to a lookup map keyed
   *   by consumer id.
   * - Merging the global middlewareConfiguration.configuration with each
   *   consumer's configuration. The merge is a deep merge where properties from
   *   the consumer-specific configuration override the global configuration.
   *
   * Notes:
   * - The method expects middlewareConfiguration and classPath (and
   *   classPath.consumerIds) to be provided and non-null. Omitting these will
   *   result in runtime errors.
   * - The appId parameter is accepted for contextual/scoping reasons (e.g. logging
   *   or future behavior) but is not used by the current implementation.
   *
   * @param appId - Identifier of the application / scope for which middleware is being processed.
   * @param middlewareConfiguration - The middleware configuration object to normalize and augment.
   *                                  This object will be mutated in-place: its `consumers` array
   *                                  will be replaced with the normalized list and a
   *                                  `configuredConsumers` map will be added/updated.
   * @param classPath - Class path metadata containing `consumerIds` (array of consumer ids)
   *                    that must exist in the resulting configuration.
   *
   * @throws {TypeError} If middlewareConfiguration or classPath (or classPath.consumerIds)
   *                     are not provided (null/undefined), since the method mutates these structures.
   *
   * @returns void
   */
  protected static processMiddlewareConfiguration(
    appId: string,
    middlewareConfiguration: MiddlewareConfiguration,
    classPath: ClassPath,
  ) {
    const middlewareConsumerMap: Record<string, MiddlewareConsumerType> = {};

    middlewareConfiguration.consumers?.forEach((middlewareConsumer) => {
      middlewareConsumerMap[middlewareConsumer.id] = middlewareConsumer;
    });

    classPath.consumerIds.forEach((consumerId) => {
      if (!middlewareConsumerMap[consumerId]) {
        middlewareConsumerMap[consumerId] = {
          id: consumerId,
          configuration: {},
        };
      }
    });

    Object.keys(middlewareConsumerMap).forEach((consumerId) => {
      middlewareConsumerMap[consumerId].configuration = merge(
        {},
        middlewareConfiguration?.configuration ?? {},
        middlewareConsumerMap[consumerId].configuration ?? {},
      );
    });

    middlewareConfiguration.consumers = Object.values(middlewareConsumerMap);
    middlewareConfiguration.configuredConsumers = middlewareConsumerMap;
  }

  /**
   * Initialize and prepare a middleware class path entry by dynamically importing the module
   * at the resolved path, resolving the exported class name, and attaching runtime
   * metadata to the class before returning the initialized descriptor.
   *
   * The method:
   * - Merges the supplied classPath and middlewareConfiguration into an initial
   *   MiddlewareClassPath object with classDef set to null.
   * - Dynamically imports the module at classPath.resolvedPath.
   * - Attempts to find an exported member whose name ends with
   *   this.middlewareComponentType.classNameSuffix. If found, that export is treated as
   *   the middleware class and is stored in the returned descriptor's classDef.
   * - Attaches the following properties to the resolved middleware class:
   *   - consumerIds (from classPath.consumerIds)
   *   - id (from classPath.id)
   *   - consumerConfiguration (from middlewareConfiguration.configuredConsumers)
   * - Logs progress and warnings (for example when the class name cannot be resolved).
   *
   * Notes:
   * - If no exported class name matches the required suffix, the method returns the
   *   merged descriptor with classDef === null (a warning is logged).
   * - Errors raised by the dynamic import (e.g. module not found or runtime errors
   *   during module evaluation) are propagated to the caller.
   *
   * @param appId - Identifier of the application for which middleware is being initialized; used only for logging/context.
   * @param type - Middleware type string (used for logging/context).
   * @param classPath - ClassPath describing the middleware file (should include id, fileName, resolvedPath, consumerIds).
   * @param middlewareConfiguration - MiddlewareConfiguration providing configuration to merge into the descriptor and to attach as consumerConfiguration on the class.
   * @returns A Promise that resolves to an MiddlewareClassPath containing the merged input data and, if a valid class export was found, classDef set to the middleware class with runtime metadata attached; otherwise classDef will be null.
   * @throws Any error thrown by the dynamic import of the module at classPath.resolvedPath (these errors are not swallowed).
   */
  protected static async initializeMiddlewareTypeClassPath(
    appId: string,
    type: string,
    classPath: ClassPath,
    middlewareConfiguration: MiddlewareConfiguration,
  ): Promise<MiddlewareClassPath> {
    const methodname = `${MiddlewareLoader.name}.initializeMiddlewareTypeClassPath [${appId}] (Middleware Type: ${type})`;

    let initializedMiddleware: MiddlewareClassPath = {
      ...classPath,
      ...middlewareConfiguration,
      classDef: null,
    };

    let { id, fileName, resolvedPath, consumerIds } = classPath;

    this.logger.log(
      `${methodname} - Importing middleware: ${fileName}, id: ${id}, path: ${resolvedPath}, consumers: ${consumerIds.join(", ")}`,
    );

    const classImport = await import(resolvedPath);

    const className = Object.keys(classImport).find((key) =>
      key.endsWith(this.middlewareComponentType.classNameSuffix),
    );

    if (StringUtility.isStringNotEmpty(className)) {
      this.logger.log(
        `${methodname} - Initializing middleware: ${fileName}, id: ${id}, path: ${resolvedPath}, consumers: ${consumerIds.join(", ")}, className: ${className}`,
      );

      const middlewareClass = classImport[className];

      middlewareClass.consumerIds = consumerIds;
      middlewareClass.id = id;
      middlewareClass.consumerConfiguration =
        middlewareConfiguration.configuredConsumers;

      // middlewareClass.isAdminMiddleware = this.isAdminMiddlewareClassPath(appId, classPath);

      initializedMiddleware.classDef = middlewareClass;
    } else {
      this.logger.log(
        `${methodname} - WARNING: Middleware [${id}] could not resolve class name. Class name must end with ${this.middlewareComponentType.classNameSuffix}`,
      );
    }

    return initializedMiddleware;
  }

  /**
   * This method iterates over the "middleware" field in the configuration and resolves the entries
   * that have ids not composed of the enabled features/plugins of the app.
   *
   * If by chance, a feature/plugin is in the codebase but not in the configuration file, it will resolve
   * these as well, however, this is OK as these middleware classpaths are searched for in the "middleware"
   * directory. Because of this, there will be no corresponding classpath object, and they will get ignored.
   *
   * @param appId
   * @param appDirectory
   * @param configService
   * @param rootMiddlewareConfiguration
   * @param enabledMiddlewareConfiguration
   */
  protected static resolveNonFeaturePluginMiddlewareConfiguration(
    appId: string,
    appDirectory: string,
    configService: ConfigService,
    rootMiddlewareConfiguration: MiddlewareConfiguration[],
    enabledMiddlewareConfiguration: EnabledMiddlewareConfiguration,
  ) {
    const plugins: PluginConfiguration[] = configService.get(
      AppConfigurationKeys.plugins,
    );
    const features: FeatureConfiguration[] = configService.get(
      AppConfigurationKeys.features,
    );

    const featurePluginIdPrefixes: string[] = plugins.map(
      (plugin) => `${plugin.id}.`,
    );

    this.resolveFeatureIdPrefixes(features, featurePluginIdPrefixes);

    const resolvedNonFeaturePluginMiddlewareConfigurations: MiddlewareConfiguration[] =
      [];

    rootMiddlewareConfiguration?.forEach((middlewareConfiguration, i) => {
      const { id } = middlewareConfiguration;

      let isNonFeaturePluginMiddleware = true;

      for (const featurePluginIdPrefix of featurePluginIdPrefixes) {
        if (id.startsWith(featurePluginIdPrefix)) {
          isNonFeaturePluginMiddleware = false;
          break;
        }
      }

      if (isNonFeaturePluginMiddleware) {
        this.resolveMiddlewareConfigurationSequence(middlewareConfiguration, i);

        resolvedNonFeaturePluginMiddlewareConfigurations.push(
          middlewareConfiguration,
        );
      }

      this.resolveEnabledMiddlewareConfigurations(
        appId,
        resolvedNonFeaturePluginMiddlewareConfigurations,
        enabledMiddlewareConfiguration.middleware,
      );
    });
  }

  protected static resolveFeatureIdPrefixes(
    features: FeatureConfiguration[],
    featureIds: string[],
  ) {
    features.forEach((feature) => {
      if (feature.features) {
        this.resolveFeatureIdPrefixes(feature.features, featureIds);
      } else {
        featureIds.push(`${feature.id}.`);
      }
    });
  }

  protected static resolveFeaturePluginMiddlewareConfiguration(
    appId: string,
    appDirectory: string,
    featuresConfiguration: Record<string, FeatureConfigurationMapValue>,
    rootMiddlewareConfiguration: MiddlewareConfiguration[],
    enabledMiddlewareConfiguration: EnabledMiddlewareConfiguration,
  ) {
    Object.values(featuresConfiguration).forEach((feature) => {
      if (feature.configuredFeatures) {
        //This is a super feature, aka feature group
        this.resolveFeaturePluginMiddlewareConfiguration(
          appId,
          appDirectory,
          feature.configuredFeatures,
          rootMiddlewareConfiguration,
          enabledMiddlewareConfiguration,
        );
      } else {
        const {
          id: featureId,
          configuredPlugins,
          middleware: featureMiddleware,
        } = feature;

        const featureMiddlewareConfiguration = [...(featureMiddleware ?? [])];

        this.resolveFeaturePluginMiddlewareConfigurationInRoot(
          appId,
          rootMiddlewareConfiguration,
          [`${featureId}.`],
          featureMiddlewareConfiguration,
        );

        this.resolveEnabledMiddlewareConfigurations(
          appId,
          featureMiddlewareConfiguration,
          enabledMiddlewareConfiguration.featureMiddleware,
        );

        if (configuredPlugins) {
          Object.values(configuredPlugins).forEach((plugin) => {
            const { id: pluginId, middleware: pluginMiddleware } = plugin;

            const pluginMiddlewareConfiguration = [...(pluginMiddleware ?? [])];

            this.resolveFeaturePluginMiddlewareConfigurationInRoot(
              appId,
              rootMiddlewareConfiguration,
              [`${pluginId}.${featureId}.`, `${pluginId}.common.`],
              pluginMiddlewareConfiguration,
            );

            this.resolveEnabledMiddlewareConfigurations(
              appId,
              pluginMiddlewareConfiguration,
              enabledMiddlewareConfiguration.pluginMiddleware,
            );
          });
        }
      }
    });
  }

  protected static resolveFeaturePluginMiddlewareConfigurationInRoot(
    appId: string,
    rootMiddlewareConfiguration: MiddlewareConfiguration[],
    idPrefixes: string[],
    resolvedMiddlewareConfigurations: MiddlewareConfiguration[],
  ) {
    rootMiddlewareConfiguration?.forEach((middlewareConfiguration, i) => {
      const idPrefixHit = idPrefixes.find((idPrefix) =>
        middlewareConfiguration.id.startsWith(idPrefix),
      );

      if (idPrefixHit) {
        this.resolveMiddlewareConfigurationSequence(middlewareConfiguration, i);

        resolvedMiddlewareConfigurations.push(middlewareConfiguration);
      }
    });
  }

  protected static resolveMiddlewareConfigurationSequence(
    middlewareConfiguration: MiddlewareConfiguration,
    sequence: number,
  ) {
    const sequenceStart = 100;

    middlewareConfiguration.sequence =
      middlewareConfiguration.sequence ?? sequence;

    if (middlewareConfiguration.sequence < sequenceStart) {
      middlewareConfiguration.sequence += sequenceStart;
    }
  }

  protected static resolveEnabledMiddlewareConfigurations(
    appId: string,
    middlewareConfigurations: MiddlewareConfiguration[],
    enabledMiddlewareConfigurations: Record<string, MiddlewareConfiguration>,
  ) {
    if (middlewareConfigurations?.length > 0) {
      middlewareConfigurations.forEach((middlewareConfiguration) => {
        if (this.isMiddlewareValid(appId, middlewareConfiguration)) {
          const { id } = middlewareConfiguration;

          enabledMiddlewareConfigurations[id] = middlewareConfiguration;
        }
      });
    }
  }

  protected static isMiddlewareValid(
    appId: string,
    middlewareConfiguration: MiddlewareConfiguration,
  ) {
    const methodname = `${MiddlewareLoader.name}.isMiddlewareValid [${appId}]`;

    let isValid = this.isMiddlewareEnabled(appId, middlewareConfiguration);

    if (isValid) {
      isValid = !middlewareConfiguration.id.endsWith(
        `.admin.${this.middlewareComponentType.id}`,
      );

      if (!isValid) {
        this.logger.log(
          `${methodname} - WARNING: Middleware [${middlewareConfiguration.id}] is not valid`,
        );
      }
    }

    return isValid;
  }

  protected static isMiddlewareEnabled(
    appId: string,
    middlewareConfiguration: MiddlewareConfiguration,
  ) {
    const methodname = `${MiddlewareLoader.name}.isMiddlewareEnabled [${appId}]`;

    let isEnabled =
      !middlewareConfiguration.hasOwnProperty("enabled") ||
      middlewareConfiguration.enabled;

    if (!isEnabled) {
      this.logger.log(
        `${methodname} - WARNING: Middleware [${middlewareConfiguration.id}] is not enabled`,
      );
    }

    return isEnabled;
  }

  protected static applyMiddleware(
    appId: string,
    consumer: MiddlewareConsumer,
    configService: ConfigService,
    middleware: MiddlewareClassPath,
  ) {
    const methodname = `${MiddlewareLoader.name}.applyMiddleware [${appId}]`;

    let { forRoutes, excludeRoutes } = middleware;

    forRoutes = forRoutes ?? [];

    if (!forRoutes || (Array.isArray(forRoutes) && forRoutes.length == 0)) {
      forRoutes = ["*"];
    }

    excludeRoutes = excludeRoutes ?? [];

    excludeRoutes.push(healthPath);

    consumer
      .apply(middleware.classDef)
      .exclude(...excludeRoutes)
      .forRoutes(...forRoutes);
  }
}
