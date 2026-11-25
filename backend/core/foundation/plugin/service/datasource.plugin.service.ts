import { RequestContext } from "@context/request";
import {
  BaseDatasource,
  BaseDatasourceInterfaceParameter,
} from "@plugin/datasource";
import { DatasourceUtility } from "@plugin/datasource/utilities/datasource.utility";
import { BasePluginServiceImpl } from "@plugin/service";

export abstract class BaseDatasourcePluginServiceImpl extends BasePluginServiceImpl {
  protected consumerDatasources: Record<string, any> = {};

  protected getDatasource<T extends BaseDatasource>(
    requestContext: RequestContext,
    datasourceInterface?: BaseDatasourceInterfaceParameter,
  ): T {
    const consumerId = this.getConsumerId(requestContext);

    if (datasourceInterface) {
      return DatasourceUtility.getDatasource(
        consumerId,
        datasourceInterface,
        this.moduleRef,
        this.logger,
      );
    } else {
      return this.consumerDatasources[consumerId];
    }
  }

  onModuleInit() {
    const methodname = `${BaseDatasourcePluginServiceImpl.name}.onModuleInit`;

    for (const consumerId of this.consumerIds) {
      try {
        this.consumerDatasources[consumerId] =
          DatasourceUtility.getDatasourceByConsumerAndFeature(
            consumerId,
            this.plugin.feature.id,
            this.moduleRef,
            this.logger,
          );
      } catch (error) {
        this.logger.info(
          `${methodname} - Error fetching datasource for consumerId ${consumerId}, featureId: ${this.plugin.feature.id}: ${error}`,
        );
      }
    }

    super.onModuleInit();
  }
}
