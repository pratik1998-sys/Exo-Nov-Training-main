import { Logger } from "@nestjs/common";
import { basename } from "path";
import { ModuleRef, NestFactory, SerializedGraph } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import * as dotenv from "dotenv";
import { MicroserviceOptions } from "@nestjs/microservices";
import * as path from "path";
import { ApplicationModuleData } from "@server/loader/types/loader.types";
import { ClassPath } from "@utilities/class-resolver.utility";
import {
  AppConfiguration,
  PluginConsumerConfiguration,
} from "@configuration/types";
import { EnvironmentVariableKeys } from "@configuration/environment";
import { AdminApplicationModule, ApplicationModule } from "@application";
import { LoggerUtility } from "@logger/utilities";
import { SwaggerInitializer } from "@server/swagger";
import { ConfigurationLoader } from "@server/loader/configuration/configuration.loader";
import { PluginComponentVariant } from "@plugin/module";
import { BaseMessengerModule } from "@datastore";
import { ApiDatasourceServiceLoggingRegistry } from "@plugin/datasource/api";
import { BaseRegistry } from "@registry";
import { NestJSLoggerServiceAdapter } from "@logger/logger.nestjs.adapter";
import fastifyCookie from "@fastify/cookie";
import type { IncomingMessage } from "http";

type InitializedApp = {
  app: NestFastifyApplication;
  appModule: ApplicationModuleData;
};

type PluginComponentVariantMap = {
  [key: string]: {
    services: ClassPath[];
    datasources: ClassPath[];
    mappers: ClassPath[];
    registries: ClassPath[];
    consumers: PluginConsumerConfiguration[];
  };
};

export class NestServer {
  protected static readonly logger = new Logger(NestServer.name);

  //This needs to be overridden in the app child of NestServer
  protected static appDirectory;

  protected static appDirectoryName;

  protected static readonly logConstants = {
    divider: "---------------------------------------------------------------",
    accessEmoji: "🚀",
    memoryEmoji: "⚙️",
  };

  static async createServer() {
    const methodname = `${NestServer.name}.createServer`;

    this.appDirectoryName = basename(this.appDirectory);

    this.logger.log(
      `Initializing server from app ${this.appDirectoryName} at path ${this.appDirectory}`,
    );

    dotenv.config({
      path: [
        `${this.appDirectory}${path.sep}.env`,
        `${this.appDirectory}${path.sep}.env.${process.env.APP_ENV}`,
      ],
    });

    //AppConfiguration is a mashup of the app configuration.yaml and the process.env variables during app bootup - process.env will override
    const configuration = this.fetchConfiguration();

    const initializedApp = await this.createApp(configuration);
    const initializedAdminApp = await this.createAdminApp(
      configuration,
      initializedApp,
    );

    await this.logApplications(
      configuration,
      initializedApp,
      initializedAdminApp,
    );
  }

  protected static async createApp(
    configuration: AppConfiguration,
  ): Promise<InitializedApp> {
    const appModule = await this.createApplicationModule(configuration);

    const initializedApp = await this.initializeApp(
      configuration,
      appModule,
      process.env[EnvironmentVariableKeys.port] || 3000,
      process.env[EnvironmentVariableKeys.host],
    );

    return initializedApp;
  }

  protected static async createAdminApp(
    configuration: AppConfiguration,
    initializedApp: InitializedApp,
  ): Promise<InitializedApp> {
    let initializedAdminApp = null;

    if (configuration.isAdminAppEnabled) {
      const adminApplicationModule = await this.createAdminApplicationModule(
        configuration,
        initializedApp,
      );

      initializedAdminApp = await this.initializeApp(
        configuration,
        adminApplicationModule,
        process.env[EnvironmentVariableKeys.adminPort] || 4000,
        process.env[EnvironmentVariableKeys.host],
      );
    }

    return initializedAdminApp;
  }

  protected static async createApplicationModule(
    configuration: AppConfiguration,
  ): Promise<ApplicationModuleData> {
    return await ApplicationModule.forRootAsync(
      this.appDirectoryName,
      this.appDirectory,
      configuration,
    );
  }

  protected static async createAdminApplicationModule(
    configuration: AppConfiguration,
    initializedApp: InitializedApp,
  ): Promise<ApplicationModuleData> {
    return await AdminApplicationModule.forRootAsync(
      this.appDirectoryName,
      this.appDirectory,
      configuration,
      initializedApp.appModule,
    );
  }

  /**
   * Connect the messages to be consumers
   *
   * Note: Currently NestJS can only do one client per transport (ie, only one kafka client, one redis client, etc)
   *
   * There is an open issue to address this: https://github.com/nestjs/nest/issues/11298
   *
   * @param app
   * @param appModule
   */
  protected static async connectMessengers(
    configuration: AppConfiguration,
    app: NestFastifyApplication,
    appModule: any,
  ) {
    const methodname = `${NestServer.name}.connectMessengers`;

    const moduleRef = app.get(ModuleRef);
    //const configService = app.get(ConfigService);

    if (appModule.messengerIds) {
      this.logger.log(
        `${methodname} - Connecting Messengers to App: ${JSON.stringify(appModule.messengerIds)}`,
      );

      appModule.messengerIds.forEach((messengerId) => {
        const options: MicroserviceOptions = moduleRef.get(
          BaseMessengerModule.composeMessengerOptionsToken(messengerId),
          { strict: false },
        );

        const logOptions = JSON.parse(JSON.stringify(options));

        LoggerUtility.applyMasks(logOptions, configuration, null);

        this.logger.log(
          `${methodname} - Connecting Message ${messengerId} with options: ${JSON.stringify(LoggerUtility.applyMasks(logOptions, configuration, null))}`,
        );

        app.connectMicroservice<MicroserviceOptions>(options);
      });

      await app.startAllMicroservices();
    }
  }

  protected static async initializeApp(
    configuration: AppConfiguration,
    appModule: any,
    port: string | number,
    host: string,
  ): Promise<InitializedApp> {
    const methodname = `${NestServer.name}.initializeApp`;

    const app = await this.createNestApp(configuration, appModule);

    await this.connectMessengers(configuration, app, appModule);

    this.initializeAppLogger(configuration, app);
    this.initializeAppCors(configuration, app);
    this.initializeAppSwagger(configuration, appModule, app);
    this.initializeAppSerializedGraph(configuration, app);

    this.logger.log(`${methodname} - Initializing app on ${host}:${port}`);

    try {
      await app.listen(port, host);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error starting server: ${message}`);
      throw error;
    }

    return {
      app: app,
      appModule: appModule,
    };
  }

  protected static resolveFastifyBodyLimit(
    configuration: AppConfiguration,
  ): number | undefined {
    const { fastifyBodyLimit } = configuration;

    return fastifyBodyLimit && fastifyBodyLimit > 0
      ? fastifyBodyLimit
      : undefined;
  }

  protected static async createNestApp(
    configuration: AppConfiguration,
    appModule: any,
  ): Promise<NestFastifyApplication> {
    const bodyLimit = this.resolveFastifyBodyLimit(configuration);
    const adapter =
      bodyLimit !== undefined
        ? new FastifyAdapter({ bodyLimit })
        : new FastifyAdapter();
    const app = await NestFactory.create<NestFastifyApplication>(
      appModule,
      adapter,
      {
        bufferLogs: false,
        snapshot: !!configuration.appBootDebug?.logSerializedGraph,
      },
    );

    await this.registerFastifyCookie(app);
    this.registerFastifyMediaBodyParsers(app, bodyLimit);

    return app;
  }

  protected static registerFastifyMediaBodyParsers(
    app: NestFastifyApplication,
    bodyLimit?: number,
  ): void {
    const fastify = app.getHttpAdapter().getInstance();
    const mediaTypes = [
      "application/octet-stream",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ];

    for (const mediaType of mediaTypes) {
      fastify.addContentTypeParser(
        mediaType,
        {
          parseAs: "buffer",
          ...(bodyLimit !== undefined ? { bodyLimit } : {}),
        },
        (_request, body, done) => {
          done(null, body);
        },
      );
    }
  }

  /**
   * Nest middleware receives the raw IncomingMessage; @fastify/cookie parses onto FastifyRequest.
   * Copy parsed cookies onto raw so RequestContextMiddleware can read them reliably.
   */
  protected static async registerFastifyCookie(
    app: NestFastifyApplication,
  ): Promise<void> {
    const fastify = app.getHttpAdapter().getInstance();

    await fastify.register(fastifyCookie);

    fastify.addHook("onRequest", (request, _reply, done) => {
      const raw = request.raw as IncomingMessage & {
        cookies?: Record<string, string | undefined>;
      };

      raw.cookies = request.cookies;
      done();
    });
  }

  protected static initializeAppLogger(
    configuration: AppConfiguration,
    app: NestFastifyApplication,
  ) {
    app.useLogger(app.get(NestJSLoggerServiceAdapter));
  }

  protected static initializeAppCors(
    configuration: AppConfiguration,
    app: NestFastifyApplication,
  ) {
    const cors = configuration.cors ?? { credentials: true, origin: "*" };
    app.enableCors(cors);
  }

  protected static initializeAppSwagger(
    configuration: AppConfiguration,
    appModule: any,
    app: NestFastifyApplication,
  ) {
    SwaggerInitializer.initializeSwagger(
      this.logger,
      configuration,
      appModule,
      app,
    );
  }

  protected static initializeAppSerializedGraph(
    configuration: AppConfiguration,
    app: NestFastifyApplication,
  ) {
    if (configuration.appBootDebug?.logSerializedGraph) {
      const graph = app.get(SerializedGraph);
      const logStr = `*****************\nSerializedGraph: ${configuration.appName}\n${JSON.stringify(graph.toJSON(), null, 2)}\n*****************`;
      this.logger.log(logStr);
    }
  }

  protected static fetchConfiguration() {
    const methodname = `${NestServer.name}.fetchConfiguration`;

    return ConfigurationLoader.loadConfiguration(
      this.appDirectoryName,
      this.appDirectory,
    );
  }

  /** Override in child classes in the apps to add a custom ASCII banner */
  protected static logASCIIBanner() {}

  protected static async logApplications(
    configuration: AppConfiguration,
    initializedApp: InitializedApp,
    initializedAdminApp: InitializedApp,
  ) {
    if (configuration.appBootDebug?.logEntities) {
      this.logApplication(configuration, initializedApp);

      if (initializedAdminApp != null) {
        this.logApplication(configuration, initializedAdminApp, true);
      }
    }

    if (configuration.appBootDebug?.logMemory) {
      const memoryUsage = process.memoryUsage();

      const divider = `${this.logConstants.memoryEmoji}  ${this.logConstants.divider}`;

      this.logger.log(divider);

      this.logger.log(
        `${this.logConstants.memoryEmoji}  RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      );
      this.logger.log(
        `${this.logConstants.memoryEmoji}  Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      );
      this.logger.log(
        `${this.logConstants.memoryEmoji}  Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      );
      this.logger.log(
        `${this.logConstants.memoryEmoji}  External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
      );

      if (memoryUsage.arrayBuffers) {
        this.logger.log(
          `${this.logConstants.memoryEmoji}  Array Buffers: ${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`,
        );
      }

      this.logger.log(divider);
    }

    this.logApplicationsAccessInfo(
      configuration,
      initializedApp,
      initializedAdminApp,
    );

    this.logASCIIBanner();
  }

  protected static async logApplicationsAccessInfo(
    configuration: any,
    initializedApp: InitializedApp,
    initializedAdminApp: InitializedApp,
  ) {
    await this.logApplicationAccessInfo(configuration, initializedApp);

    if (initializedAdminApp != null) {
      await this.logApplicationAccessInfo(
        configuration,
        initializedAdminApp,
        true,
      );
    }
  }

  protected static async logApplicationAccessInfo(
    configuration: any,
    initializedApp: InitializedApp,
    isAdminApp: boolean = false,
  ) {
    let {
      isGraphqlPlaygroundDisabled,
      isSwaggerDisabled,
      swaggerPath,
      graphqlPath,
    } = configuration;

    const { appModule, app } = initializedApp;
    const { appId } = appModule;

    const url = await app.getUrl();

    swaggerPath = swaggerPath ?? "swagger";
    graphqlPath = graphqlPath ?? "graphql";

    const divider = `${this.logConstants.accessEmoji} ${this.logConstants.divider}`;

    if (!isAdminApp) {
      this.logger.log(divider);
    }

    this.logger.log(
      `${this.logConstants.accessEmoji} [${appId}] App URL: ${url}`,
    );
    this.logger.log(
      `${this.logConstants.accessEmoji} [${appId}] GraphQL Playground: ${isGraphqlPlaygroundDisabled ? "DISABLED" : `${url}/${graphqlPath}`}`,
    );
    this.logger.log(
      `${this.logConstants.accessEmoji} [${appId}] OpenAPI SwaggerUI: ${isSwaggerDisabled ? "DISABLED" : `${url}/${swaggerPath}`}`,
    );
    this.logger.log(divider);
  }

  protected static logApplication(
    configuration: any,
    initializedApp: InitializedApp,
    isAdminApp: boolean = false,
  ) {
    if (!isAdminApp) {
      this.logApplicationConfiguration(
        configuration,
        initializedApp,
        isAdminApp,
      );
      this.logApplicationRegistries(configuration, initializedApp, isAdminApp);
    }

    this.logApplicationFeatures(configuration, initializedApp, isAdminApp);
  }

  protected static logApplicationConfiguration(
    configuration: any,
    initializedApp: InitializedApp,
    isAdminApp: boolean = false,
  ) {
    //Mask the env field as this will have sensitive details
    const config = JSON.parse(JSON.stringify(configuration));
    config.env = "*****";

    this.logger.log(
      `[${initializedApp.appModule.appId}] AppConfiguration: ${JSON.stringify(config, null, 2)}`,
    );
  }

  protected static logApplicationRegistries(
    configuration: any,
    initializedApp: InitializedApp,
    isAdminApp: boolean = false,
  ) {
    const { appId } = initializedApp.appModule;

    const serviceLoggingRegistry: ApiDatasourceServiceLoggingRegistry =
      ApiDatasourceServiceLoggingRegistry.getInstance();

    this.logger.log(
      `[${appId}] - REST Datasource Service Registry: ${JSON.stringify(serviceLoggingRegistry.getServiceRegistry(), null, 2)}`,
    );
    this.logger.log(
      `[${appId}] - REST Datasource Service Logging AppConfiguration: ${JSON.stringify(serviceLoggingRegistry.getRegistryData(), null, 2)}`,
    );
    this.logger.log(
      `[${appId}] - Initialized Registeries: ${JSON.stringify(BaseRegistry.getRegisteredRegistries(), null, 2)}`,
    );
  }

  protected static logApplicationFeatures(
    configuration: any,
    initializedApp: InitializedApp,
    isAdminApp: boolean = false,
  ) {
    const { appModule } = initializedApp;
    const { appId } = appModule;

    let featureLogStr = `[${appId}] - Initialized Features\n`;
    featureLogStr = `${featureLogStr}\n`;
    featureLogStr = `${featureLogStr}******************************************************************************************************************************\n\n`;

    const entities = {
      resolvers: {
        label: "Resolvers",
        key: "resolvers",
      },
      controllers: {
        label: "Controllers",
        key: "controllers",
      },
      services: {
        label: "Services",
        key: "services",
      },
      datasources: {
        label: "Datasources",
        key: "datasources",
      },
      mappers: {
        label: "Mappers",
        key: "mappers",
      },
      registries: {
        label: "Registries",
        key: "registries",
      },
    };

    appModule.featureModules.forEach((featureModule) => {
      const {
        isStandalone,
        id,
        pluginModules,
        classPath,
        resolverClassPaths,
        controllerClassPaths,
      } = featureModule;

      featureLogStr = `${featureLogStr}\tFeature:\n`;
      featureLogStr = `${featureLogStr}\t\t- ${id}\n\n`;
      featureLogStr = `${featureLogStr}\tLocation:\n\t\t- ${classPath.resolvedPathShort}\n\n`;

      featureLogStr = this.logComponent(
        featureLogStr,
        entities.resolvers.label,
        resolverClassPaths,
        "",
        "\t",
      );
      featureLogStr = this.logComponent(
        featureLogStr,
        entities.controllers.label,
        controllerClassPaths,
        "",
        "\t",
      );

      if (!isStandalone) {
        featureLogStr = `${featureLogStr}\tConsumers:\n`;
        pluginModules.forEach((pluginModule, x) => {
          const { id, consumerPluginComponents } = pluginModule;

          if (consumerPluginComponents) {
            const consumerIds = Object.keys(consumerPluginComponents);

            consumerIds.forEach((consumerId, i) => {
              const consumerEntities = consumerPluginComponents[consumerId];

              const variant =
                pluginModule.configuration.configuredConsumers[consumerId]
                  .variantId ?? "default";

              featureLogStr = `${featureLogStr}\t\t- ${consumerId}\n\n`;

              featureLogStr = `${featureLogStr}\t\t\tPlugin:\n\t\t\t\t- ${pluginModule.id} (${variant})\n\n`;

              featureLogStr = this.logComponent(
                featureLogStr,
                entities.services.label,
                consumerEntities.services,
                "",
                "\t\t\t",
              );
              featureLogStr = this.logComponent(
                featureLogStr,
                entities.datasources.label,
                consumerEntities.datasources,
                "",
                "\t\t\t",
              );
              featureLogStr = this.logComponent(
                featureLogStr,
                entities.mappers.label,
                consumerEntities.mappers,
                "",
                "\t\t\t",
              );
              featureLogStr = this.logComponent(
                featureLogStr,
                entities.registries.label,
                consumerEntities.registries,
                "",
                "\t\t\t",
              );

              if (i != consumerIds.length - 1) {
                featureLogStr = `${featureLogStr}\t\t------------------------------------------------------------------------------------------------\n\n`;
              }
            });
          }

          if (x != pluginModules.length - 1) {
            featureLogStr = `${featureLogStr}\t\t------------------------------------------------------------------------------------------------\n\n`;
          }
        });
      }

      featureLogStr = `${featureLogStr}\n******************************************************************************************************************************\n\n`;
    });

    featureLogStr = featureLogStr
      .replaceAll("dist/", "")
      .replaceAll(".js", ".ts");

    this.logger.log(`${featureLogStr}`);
  }

  protected static logComponent(
    logStr: string,
    label: string,
    classPaths: ClassPath[],
    labelBaseSpace: string,
    baseSpace: string,
  ) {
    if (classPaths?.length > 0) {
      logStr = `${logStr}${baseSpace}${labelBaseSpace}${label}:\n`;
      classPaths.forEach((classPath, i) => {
        logStr = `${logStr}${baseSpace}\t- ${classPath.fileName}\n${baseSpace}\t  ${classPath.resolvedPathShort}\n`;

        if (i != classPaths.length - 1) {
          logStr = `${logStr}\n`;
        }
      });

      logStr = `${logStr}\n`;
    }

    return logStr;
  }

  protected static addPluginComponentVariantToMap(
    map: PluginComponentVariantMap,
    key: string,
    componentVariants: PluginComponentVariant[],
  ) {
    componentVariants.forEach((componentVariant) => {
      if (!map[componentVariant.variant]) {
        map[componentVariant.variant] = {
          services: [],
          datasources: [],
          mappers: [],
          registries: [],
          consumers: componentVariant.consumers,
        };
      }

      map[componentVariant.variant][key] = map[componentVariant.variant][
        key
      ].concat(componentVariant.classPaths);
    });
  }
}
