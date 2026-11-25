import { AppConfiguration } from "@configuration/types";
import { BaseDatastoreModule } from "@datastore";
import { DatastoreConfiguration } from "@configuration/types";
import { DatastoreDynamicModule } from "@server/loader/datastore/base/datastore.loader";
import { ClientsModule } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { LoggerUtility } from "@logger/utilities";

export class BaseMessengerModule extends BaseDatastoreModule {
  static async forRootAsync(
    appId: string,
    configuration: AppConfiguration,
    messengerConfiguration: DatastoreConfiguration,
  ) {
    const methodname = `${BaseMessengerModule.name}.forRootAsync [${appId}]`;

    const { type, id } = messengerConfiguration;

    const module: DatastoreDynamicModule = ClientsModule.registerAsync([
      {
        name: this.composeToken(appId, configuration, messengerConfiguration),
        useFactory: async (
          configService: ConfigService,
          moduleRef: ModuleRef,
        ) => {
          const options = this.composeOptions(
            appId,
            configService,
            messengerConfiguration,
          );

          const logOptions = LoggerUtility.applyMasks(
            JSON.parse(JSON.stringify(options)),
            null,
            configService,
          );

          this.logger.log(
            `${methodname} - Initializing Message [${type}-${id}]: ${JSON.stringify(logOptions, null, 2)}`,
          );

          return options;
        },
        inject: [ConfigService, ModuleRef],
      },
    ]);

    module.datastoreId = id;
    module.type = type;

    module.providers = [
      ...module.providers,
      {
        provide: this.composeMessengerOptionsToken(id),
        useFactory: async (configService: ConfigService) => {
          return this.composeOptions(
            appId,
            configService,
            messengerConfiguration,
          );
        },
        inject: [ConfigService],
      },
    ];

    return module;
  }

  protected static composeOptions(
    appId: string,
    configService: ConfigService,
    messengerConfiguration: DatastoreConfiguration,
  ) {
    throw new Error(`MESSENGER_MODULE_COMPOSE_OPTIONS_NOT_IMPLEMENTED`);

    //Have to return null to satisfy the ClientsModule.registerAsync type
    return null;
  }

  static composeMessengerOptionsToken(messageId: string) {
    return `messenger_options:${messageId}`;
  }
}
