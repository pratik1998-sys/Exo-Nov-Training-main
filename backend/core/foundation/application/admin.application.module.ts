import { AppConfiguration } from "@configuration/types";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AdminApplicationModuleLoader } from "@server/loader/application/admin.application.loader";
import { AdminMiddlewareLoader } from "@server/loader/middleware/admin.middleware.loader";
import { ApplicationModuleData } from "@server/loader/types/loader.types";
import { ApplicationModule } from "@application";

@Module({})
export class AdminApplicationModule extends ApplicationModule {
  protected static module;

  async configure(consumer: MiddlewareConsumer) {
    const methodname = `${AdminApplicationModule.name}.configure`;

    await AdminMiddlewareLoader.load(consumer, this.configService, true);
  }

  protected static async initializeApplicationModule(
    appId: string,
    configuration: any,
  ): Promise<ApplicationModuleData> {
    const module =
      await AdminApplicationModuleLoader.initializeApplicationModule(
        appId,
        configuration,
      );

    module.module = AdminApplicationModule;

    return module;
  }

  protected static getAppId(configuration: AppConfiguration) {
    const { appName } = configuration;

    return `${appName}-admin`;
  }

  static async forRootAsync(
    appDirectoryName: string,
    appDirectory: string,
    configuration: AppConfiguration,
    appModule: any,
  ): Promise<ApplicationModuleData> {
    const module = await super.forRootAsync(
      appDirectoryName,
      appDirectory,
      configuration,
    );

    module.module = AdminApplicationModule;

    module.providers = [...module.providers, ...appModule.adminProviders];
    return module;
  }

  protected getApplicationModule() {
    return AdminApplicationModule.module;
  }
}
