import { Logger } from "@logger";
import { ModuleRef } from "@nestjs/core";
import { BaseMapper, BaseMapperInterfaceParameter } from "@plugin/mapper";
import { ComponentUtility } from "@utilities/component.utility";

export class MapperUtility extends ComponentUtility {
  private static readonly mapperTokenIdentifier = "mapper";

  /**
   * The point of this field, and the methods that utilize it, are to avoid creating tokenized string tokens for ModuleRef.get with
   * each and every method invocation. Instead, put these tokens into a map to easily reference and avoid the string creation and processing
   * overhead each time.
   *
   * Depending on the method called to access, the keys will either be simple (ie the feature ID) or "complex"
   * (ie $featureId.$componentType).
   *
   * This is due to the component id being created on server start up as $featureId.$componentId (the "complex" key). It is not
   * created here, rather referenced.
   *
   * So:
   *  - When "getMapperByConsumerAndFeature" is called, the key will be simple [$consumerId][$featureId]
   *  - When "getMapper" is called, it utilizes the mapper component id that is "complex" and the key will be [$consumerId][$featureId.$componentId]
   */
  protected static componentMap: Record<string, any> = {};

  static getMapper<T extends BaseMapper>(
    consumerId: string,
    mapperInterface: BaseMapperInterfaceParameter,
    moduleRef: ModuleRef,
    logger: Logger,
  ): T {
    return this.getComponentFromCache(
      consumerId,
      mapperInterface.id,
      null,
      moduleRef,
      this.componentMap,
      logger,
    );
  }

  static getMapperByConsumerAndFeature<T extends BaseMapper>(
    consumerId: string,
    featureId: string,
    moduleRef: ModuleRef,
    logger: Logger,
  ): T {
    return this.getComponentFromCache(
      consumerId,
      featureId,
      this.mapperTokenIdentifier,
      moduleRef,
      this.componentMap,
      logger,
    );
  }

  static getAdminMapper<T extends BaseMapper>(
    mapperInterface: BaseMapperInterfaceParameter,
    moduleRef: ModuleRef,
  ): T {
    return moduleRef.get(mapperInterface.id, { strict: false });
  }
}
