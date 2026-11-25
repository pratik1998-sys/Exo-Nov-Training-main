import {
  AdminDatasourceService,
  AdminDatasourceServiceInputModel,
  AdminDatasourceServiceModel,
  AdminDatasourceServiceModelResultSet,
} from "@admin-features";
import { RequestContext } from "@context/request";
import {
  ApiDatasourceServiceLoggingRegistry,
  BaseGraphqlDatasource,
} from "@plugin/datasource/api";
import { BaseAdminPluginServiceImpl } from "@plugin/service";

export class AdminDatasourceServiceImpl
  extends BaseAdminPluginServiceImpl
  implements AdminDatasourceService {
  async getDatasourceServices(
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModelResultSet> {
    const methodname = `${AdminDatasourceServiceImpl.name}.getDatasourceServices`;

    const serviceLoggingRegistry: ApiDatasourceServiceLoggingRegistry =
      ApiDatasourceServiceLoggingRegistry.getInstance();

    const serviceRegistry = serviceLoggingRegistry.getServiceRegistry();

    this.logger.info(
      `${methodname} - Datasource Service Registry: ${this.logger.formatJSON(serviceRegistry)}`,
    );

    const serviceList: AdminDatasourceServiceModel[] = [];

    Object.keys(serviceRegistry).forEach((id) => {
      serviceList.push(this.composeService(id, serviceLoggingRegistry));
    });

    return {
      pagination: {
        page: 1,
        pageSize: serviceList.length,
        pageCount: 1,
        resultCount: serviceList.length,
        hasMorePages: false,
      },
      results: serviceList,
    };
  }

  async getDatasourceService(
    id: string,
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModel> {
    const methodname = `${AdminDatasourceServiceImpl.name}.getDatasourceService`;

    const serviceLoggingRegistry: ApiDatasourceServiceLoggingRegistry =
      ApiDatasourceServiceLoggingRegistry.getInstance();

    const service = this.composeService(id, serviceLoggingRegistry);

    this.logger.info(
      `${methodname} - Service Configuration (${id}): ${this.logger.formatJSON(service)}`,
    );

    return service;
  }

  async updateDatasourceService(
    id: string,
    datasourceService: AdminDatasourceServiceInputModel,
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModel> {
    const methodname = `${AdminDatasourceServiceImpl.name}.updateDatasourceService`;

    const { isLoggingEnabled } = datasourceService;

    this.logger.info(
      `${methodname} - Updating service [${id}]: ${this.logger.formatJSON(datasourceService)}`,
    );

    const serviceLoggingRegistry: ApiDatasourceServiceLoggingRegistry =
      ApiDatasourceServiceLoggingRegistry.getInstance();

    serviceLoggingRegistry.updateDataValue(id, isLoggingEnabled);

    return this.getDatasourceService(id, requestContext, context);
  }

  async updateDatasourceServices(
    services: AdminDatasourceServiceInputModel[],
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModelResultSet> {
    const methodname = `${AdminDatasourceServiceImpl.name}.updateDatasourceServices`;

    this.logger.info(
      `${methodname} - Updating services: ${this.logger.formatJSON(services)}`,
    );

    const serviceResults: AdminDatasourceServiceModel[] = [];

    for await (const service of services) {
      serviceResults.push(
        await this.updateDatasourceService(service.id, service, requestContext, context),
      );
    }

    return {
      pagination: {
        page: 1,
        pageSize: serviceResults.length,
        pageCount: 1,
        resultCount: serviceResults.length,
        hasMorePages: false,
      },
      results: serviceResults,
    };
  }

  protected composeService(
    id: string,
    serviceLoggingRegistry: ApiDatasourceServiceLoggingRegistry,
  ) {
    const splitId = id.split(".");

    const serviceRegistry = serviceLoggingRegistry.getServiceRegistry();

    const serviceDefinition = serviceRegistry[id];

    const service = {
      ...serviceRegistry[id],
      serviceId: serviceRegistry[id].id,
      id,
      isLoggingEnabled: serviceLoggingRegistry.isServiceLoggingEnabled(
        splitId[1],
        splitId[0],
        splitId[2],
      ),
    };

    if (serviceDefinition.query) {
      service.query = {
        queryId: serviceDefinition.query.queryId,
        id: serviceDefinition.query.queryId,
        query: BaseGraphqlDatasource.prettifyQuery(serviceDefinition.query),
      };
    }

    return service;
  }
}
