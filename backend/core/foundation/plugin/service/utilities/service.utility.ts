import {
  BaseFeatureService,
  BaseFeatureServiceParameter,
} from "@feature/service";
import { Logger } from "@logger";
import { ModuleRef } from "@nestjs/core";
import { ComponentUtility } from "@utilities/component.utility";

export class ServiceUtility extends ComponentUtility {
  /**
   * The point of this field, and the methods that utilize it, are to avoid creating tokenized string tokens for ModuleRef.get with
   * each and every method invocation. Instead, put these tokens into a map to easily reference and avoid the string creation and processing
   * overhead each time.
   */
  protected static componentMap: Record<string, any> = {};

  static getService<T extends BaseFeatureService>(
    consumerId: string,
    serviceInterface: BaseFeatureServiceParameter,
    moduleRef: ModuleRef,
    logger: Logger,
  ): T {
    return this.getComponentFromCache(
      consumerId,
      serviceInterface.id,
      null,
      moduleRef,
      this.componentMap,
      logger,
    );
  }

  static getAdminService<T extends BaseFeatureService>(
    serviceInterface: BaseFeatureServiceParameter,
    moduleRef: ModuleRef,
  ): T {
    return moduleRef.get(serviceInterface.id, { strict: false });
  }
}
