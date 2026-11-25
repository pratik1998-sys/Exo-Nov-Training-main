import {
  AdminDatasourceServiceInputModel,
  AdminDatasourceServiceModel,
  AdminDatasourceServiceModelResultSet,
} from "./admin-datasource.model";
import { RequestContext } from "@context/request";
import { BaseFeatureService } from "@feature/service";

export abstract class AdminDatasourceService extends BaseFeatureService {
  abstract getDatasourceServices(
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModelResultSet>;
  abstract getDatasourceService(
    id: string,
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModel>;
  abstract updateDatasourceService(
    id: string,
    datasourceService: AdminDatasourceServiceInputModel,
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModel>;
  abstract updateDatasourceServices(
    datasourceServices: AdminDatasourceServiceInputModel[],
    requestContext: RequestContext,
    context?: any,
  ): Promise<AdminDatasourceServiceModelResultSet>;
}
