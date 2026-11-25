import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "path";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { HttpModule } from "@nestjs/axios";
import { Enhancer, GraphQLModule } from "@nestjs/graphql";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageLocalDefaultOptions,
} from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPlugin } from "@apollo/server";
import { CacheModule } from "@nestjs/cache-manager";
import { MiddlewareLoader } from "@server/loader/middleware/middleware.loader";
import { HeaderUtility } from "@api-headers/utilities";
import { ConfigurationUtility } from "@configuration/utilities";
import { AppConfigurationKeys } from "@configuration/app";
import { ApplicationModuleLoader } from "@server/loader/application/application.loader";
import { AppConfiguration } from "@configuration/types";
import { ApplicationModuleData } from "@server/loader/types/loader.types";
import {
  ApolloRequestContextPlugin,
  AuthTokenCookiePlugin,
} from "@api-graphql";
import { Headers } from "@api-headers";
import { AuthTokenCookieInterceptor } from "@api/shared/cookies";

@Module({})
export abstract class ApplicationModule implements NestModule {
  static readonly logger = new Logger(ApplicationModule.name);

  protected static module;

  constructor(protected readonly configService: ConfigService) {}

  async configure(consumer: MiddlewareConsumer) {
    const methodname = `${ApplicationModule.name}.configure`;

    await MiddlewareLoader.load(consumer, this.configService, false);
  }

  /**
   * Note: Apollo Landing Configuration seems to be cached in browser, so any updates will
   * not reflect until browser cache is cleared, or, a new incognito window is opened
   *
   * @param config
   * @returns
   */
  protected static composeApolloLandingPageConfiguration(
    config: ConfigService,
  ): ApolloServerPluginLandingPageLocalDefaultOptions {
    const headers: Record<string, string> = {};

    Object.values(Headers).forEach((header) => {
      const { name, description } = header;

      headers[name] = HeaderUtility.getHeaderDefaultValueFromConfigService(
        header,
        config,
      );
    });

    const apolloLandingPageConfiguration: ApolloServerPluginLandingPageLocalDefaultOptions =
      {
        headers,
        // Add your example requests that will appear in the Studio upon first load
        document: `
# Welcome to the  Cerebrum GraphQL Studio!\n\n
# This playground can be used to build, run and test GraphQL calls, and will be pre-populated with a working example.\n\n
# If your app relies on environment variables, you will need to have set up your .env file setup for this to work.\n\n

query ServerHealth {
    health {
        status
    }
}
        `,
        variables: {
          // Add variables to be used with the document's requests
        },
        footer: false, // In the event that you disable the embed, this will remove the footer linking you to the docs about how to configure the embed.
        embed: {
          runTelemetry: false, // Do not track usage
          endpointIsEditable: false, // Do not allow the user to alter the Studio endpoint
        },
      };

    return apolloLandingPageConfiguration;
  }

  protected static getGraphqlPlugins(config: ConfigService) {
    const methodname = `${ApplicationModule.name}.getGraphqlPlugins`;

    const plugins: ApolloServerPlugin[] = [
      new ApolloRequestContextPlugin(),
      new AuthTokenCookiePlugin(),
    ];

    // plugins.push(fastifyApolloDrainPlugin(FastifyAdapter));

    if (
      !ConfigurationUtility.getBooleanValue(
        config,
        AppConfigurationKeys.disableGraphqlPlayground,
      )
    ) {
      this.logger.log(`${methodname} - GraphQL Playground Enabled`);
      plugins.push(
        ApolloServerPluginLandingPageLocalDefault(
          this.composeApolloLandingPageConfiguration(config),
        ),
      );
    } else {
      this.logger.log(`${methodname} - GraphQL Playground Disabled`);
    }

    return plugins;
  }

  protected static async initializeApplicationModule(
    appId: string,
    configuration: AppConfiguration,
  ): Promise<ApplicationModuleData> {
    const module = await ApplicationModuleLoader.initializeApplicationModule(
      appId,
      configuration,
    );

    module.module = this;

    return module;
  }

  protected static getAppId(configuration: any) {
    const { appName } = configuration;

    return appName;
  }

  static async forRootAsync(
    appDirectoryName: string,
    appDirectory: string,
    configuration: AppConfiguration,
    imports: [] = [],
    providers: Provider[] = [],
    exports: [] = [],
  ): Promise<ApplicationModuleData> {
    const appId = this.getAppId(configuration);

    const module = await this.initializeApplicationModule(appId, configuration);

    module.appId = appId;
    module.appDirectoryRoot = appDirectoryName;

    module.imports = [
      ...module.imports,
      ...imports,
      /**
       *  The config module helps you get your environment variables from .env files, as well as the configuration sent in that was obtained
       *  by parsing the configuration.yaml at the app root directory.
       *
       *  Note: order of envFilePath is important - higher priority is given to the .env paths in the lower indices (ie KEY1 in both files at envFilePath[0]
       *  and envFilePath[1] would resolve to KEY in envFilePath[0])
       *
       *  Example: PORT=3000 (.env.dev) and PORT=3001 (.env). If the .env.$APP_ENV file exists, PORT will resolve to 3000
       */
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [
          `${appDirectory}${path.sep}.env.${process.env.APP_ENV}`,
          `${appDirectory}${path.sep}.env`,
        ],
        load: [
          () => {
            return configuration;
          },
        ],
      }),
      EventEmitterModule.forRoot({ wildcard: true }),
      HttpModule,
      GraphQLModule.forRootAsync<ApolloDriverConfig>({
        driver: ApolloDriver,
        useFactory: (config: ConfigService) => {
          const graphqlPath = ConfigurationUtility.getConfigurationValue(
            config,
            AppConfigurationKeys.graphqlPath,
            "graphql",
          );

          return {
            path: graphqlPath,
            debug: config.get(AppConfigurationKeys.graphqlDebug) === "true",
            graphiql: false,
            autoSchemaFile: path.join(
              process.cwd(),
              `generated${path.sep}${appId}${path.sep}schema.gql`,
            ),
            sortSchema: true,
            fieldResolverEnhancers: ["interceptors"] as Enhancer[],
            autoTransformHttpErrors: true,
            context: (context) => context,
            plugins: this.getGraphqlPlugins(
              config,
            ) as unknown as ApolloDriverConfig["plugins"],
            subscriptions: {
              "graphql-ws": true,
            },
          };
        },
        inject: [ConfigService],
      }),
      CacheModule.register({
        isGlobal: true,
        ttl: 300000,
      }),
    ];

    module.providers = [
      ...module.providers,
      ...providers,
      {
        provide: APP_INTERCEPTOR,
        useClass: AuthTokenCookieInterceptor,
      },
    ];

    module.exports = [...module.exports, ...exports];

    this.module = module;

    return module;
  }

  protected getApplicationModule() {
    return ApplicationModule.module;
  }
}
