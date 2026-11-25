import { AppConfiguration, MessengerConfiguration } from "@configuration/types";
import { LoggerKey } from "@logger";
import { LoggerUtility } from "@logger/utilities";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { MessengerLoader } from "@server/loader/datastore/messenger.loader";
import { ComponentModuleData } from "@server/loader/types/loader.types";
import { BaseModule } from "@module/module";

@Global()
@Module({})
export class MessengerModule extends BaseModule {
  protected static rootDirectory = "messenger";

  static async initializeModule(
    configuration: AppConfiguration,
    module: ComponentModuleData,
    moduleClass: any,
  ): Promise<DynamicModule> {
    const methodname = `${MessengerModule.name}.initializeModule`;

    const moduleShortPath = this.getModuleDirectoryShortPath(moduleClass);

    this.logger.log(
      `${methodname} - [${moduleClass.name}] - Initializing Messenger module - Path: ${moduleShortPath} `,
    );

    // moduleClass.featureId = 'message';

    moduleClass.providers = [];

    const enabledMessengers = MessengerLoader.getEnabledDatastores(
      configuration.appName,
      configuration,
      [],
    );

    enabledMessengers.forEach((messageConfig) => {
      moduleClass.providers.push(
        this.createMessengerClassProvider(configuration, messageConfig),
      );
    });

    return {
      module: moduleClass,
      imports: moduleClass.imports,
      exports: moduleClass.exports,
      providers: moduleClass.providers,
      controllers: moduleClass.controllers,
    };
  }

  protected static createMessengerClassProvider(
    configuration: AppConfiguration,
    messengerConfig: MessengerConfiguration,
  ) {
    const methodname = `${MessengerModule.name}.createMessengerClassProvider`;

    return {
      provide: this.composeMessengerServiceToken(messengerConfig.id),
      useFactory: async (
        configService: ConfigService,
        moduleRef: ModuleRef,
        loggerKey,
      ) => {
        const fileFormat = `**/${messengerConfig.type}.messenger.service.js`;

        const classPath = await this.resolveClass(
          configuration,
          "messenger",
          this.rootDirectory,
          fileFormat,
        );

        const { id, type } = messengerConfig;

        const cfg = configService.get(
          `MESSENGER_CONFIG_${type.toUpperCase()}_${id.toUpperCase()}`,
        );

        if (!cfg) {
          this.logger.error(
            `${methodname} - Missing environment configuration for datastore ${id}`,
          );
          throw new Error(`MESSENGER_MISSING_ENV_CONFIGURATION`);
        }

        const mConfig = {
          ...messengerConfig,
          ...JSON.parse(cfg),
        };

        const logMConfig = LoggerUtility.applyMasks(
          JSON.parse(JSON.stringify(mConfig)),
          null,
          configService,
        );

        this.logger.log(
          `${methodname} - Messenger ${type}:${id} Configuration: ${JSON.stringify(logMConfig)}`,
        );

        return new classPath.classObj(
          mConfig,
          configService,
          moduleRef,
          loggerKey,
        );
      },
      inject: [ConfigService, ModuleRef, LoggerKey],
    };
  }

  static composeMessengerServiceToken(messageId: string) {
    return `message_service:${messageId}`;
  }
}
