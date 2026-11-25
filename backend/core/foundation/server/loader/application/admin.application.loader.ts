/**
 *  This file should not be touched or altered unless you are a member of the app
 *  governance team. Any changes could have a crippling effect on the application.
 */

import { AppConfigurationKeys } from "@configuration/app";
import { AppConfiguration } from "@configuration/types";
import { ApplicationModuleLoader } from "@server/loader/application/application.loader";
import {
  ApplicationModuleData,
  ComponentModuleData,
  FeatureModuleData,
} from "@server/loader/types/loader.types";
import { ClassPath } from "@utilities/class-resolver.utility";

/**
 * Resolve dynamic modules for the  application(s)
 */
export class AdminApplicationModuleLoader extends ApplicationModuleLoader {
  protected static globalGuardFileSuffix = `.admin.global.guard.js`;
  protected static configurationKey_features =
    AppConfigurationKeys.adminFeatures;

  protected static getAppName(configuration: any) {
    return `${configuration.appName}-admin`;
  }

  protected static isResolvedGuardClassPathValid(
    classPath: ClassPath,
    invalidFileSuffix: string,
  ) {
    return true;
  }

  /**
   * Not supported yet
   *
   * @param loadedModules
   * @returns
   */
  protected static createAdminProviders(loadedModules: any[]) {
    return [];
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
      configuration.configuredAdminFeatures,
    );

    const loggerModule: ComponentModuleData = await this.resolveLoggerModule(
      appId,
      configuration,
    );

    const resolvedModules: ComponentModuleData[] = [loggerModule];

    return await this.loadApplicationModules(
      featureModules,
      resolvedModules,
      appId,
      configuration,
    );
  }

  protected static async resolveSetupModules(
    appId: string,
    configuration: AppConfiguration,
  ) {
    const setupModules: FeatureModuleData[] = [];

    return setupModules;
  }
}
