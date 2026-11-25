import { Logger } from "@logger";
import { ModuleRef } from "@nestjs/core";
import {
  BaseDatasource,
  BaseDatasourceInterfaceParameter,
} from "@plugin/datasource";
import { ComponentUtility } from "@utilities/component.utility";

export class DatasourceUtility extends ComponentUtility {
  private static readonly datasourceTokenIdentifier = "datasource";

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
   *  - When "getDatasourceByConsumerAndFeature" is called, the key will be simple [$consumerId][$featureId]
   *  - When "getDatasource" is called, it utilizes the datasource component id that is "complex" and the key will be [$consumerId][$featureId.$componentId]
   */
  protected static componentMap: Record<string, any> = {};

  static getDatasource<T extends BaseDatasource>(
    consumerId: string,
    datasourceInterface: BaseDatasourceInterfaceParameter,
    moduleRef: ModuleRef,
    logger: Logger,
  ): T {
    return this.getComponentFromCache(
      consumerId,
      datasourceInterface.id,
      null,
      moduleRef,
      this.componentMap,
      logger,
    );
  }

  static getDatasourceByConsumerAndFeature<T extends BaseDatasource>(
    consumerId: string,
    featureId: string,
    moduleRef: ModuleRef,
    logger: Logger,
  ): T {
    return this.getComponentFromCache(
      consumerId,
      featureId,
      this.datasourceTokenIdentifier,
      moduleRef,
      this.componentMap,
      logger,
    );
  }
}
