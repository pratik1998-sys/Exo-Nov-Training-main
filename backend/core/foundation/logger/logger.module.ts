import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { AppConfiguration } from "@configuration/types";
import { ComponentModuleData } from "@server/loader/types/loader.types";
import { AppConfigurationValues } from "@configuration/app";
import { BaseModule } from "@module/module";
import { NestJSLoggerServiceAdapter } from "@logger/logger.nestjs.adapter";
import { Logger, LoggerKey } from "@logger";

@Global()
@Module({})
export class LoggerModule extends BaseModule {
  protected static rootDirectory = "logger";

  static async initializeModule(
    configuration: AppConfiguration,
    module: ComponentModuleData,
    moduleClass: any,
  ): Promise<DynamicModule> {
    const methodname = `${LoggerModule.name}.initializeModule`;

    const moduleShortPath = this.getModuleDirectoryShortPath(moduleClass);

    this.logger.log(
      `${methodname} - [${moduleClass.name}] - Initializing Logger module - Path: ${moduleShortPath} `,
    );

    // moduleClass.featureId = 'logger';

    const loggerType =
      configuration.logger ?? AppConfigurationValues.logger.winston;

    const fileFormat = `**/${loggerType}.*logger.service.js`;

    moduleClass.providers = [
      this.createClassProvider(LoggerKey, configuration, "logger", fileFormat),
      {
        provide: NestJSLoggerServiceAdapter,
        useFactory: (logger: Logger) => {
          return new NestJSLoggerServiceAdapter(logger);
        },
        inject: [LoggerKey],
      },
    ];

    moduleClass.exports = [
      ...moduleClass.exports,
      LoggerKey,
      NestJSLoggerServiceAdapter,
    ];

    return {
      module: moduleClass,
      imports: moduleClass.imports,
      exports: moduleClass.exports,
      providers: moduleClass.providers,
      controllers: moduleClass.controllers,
    };
  }

  protected static createClassProvider(
    token: any,
    configuration: AppConfiguration,
    classComponentIdPrefix: string,
    fileFormat: string,
  ) {
    return {
      provide: token,
      useFactory: async (
        configService: ConfigService,
        moduleRef: ModuleRef,
      ) => {
        const classPath = await this.resolveClass(
          configuration,
          classComponentIdPrefix,
          this.rootDirectory,
          fileFormat,
        );

        return new classPath.classObj(configService, moduleRef);
      },
      inject: [ConfigService, ModuleRef],
    };
  }
}
