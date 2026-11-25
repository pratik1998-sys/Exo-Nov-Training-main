import { AdminDatasourceApiConfiguration } from "./admin-datasource.api.configuration";
import { AdminDatasourceModule } from "./admin-datasource.module";
import { AdminDatasourceRequestParameters } from "./admin-datasource.parameters";
import {
  AdminDatasourceServiceInputModel,
  AdminDatasourceServiceModel,
  AdminDatasourceServiceModelResultSet,
} from "./admin-datasource.model";
import { AdminDatasourceService } from "./admin-datasource.service";
import { BaseAdminFeatureResolver } from "@feature/resolver";
import { Args, Mutation, Query, Resolver } from "@api-decorators";
import { Context } from "@nestjs/graphql";

const feature = AdminDatasourceModule.feature;

@Resolver((of) => AdminDatasourceServiceModel, { feature })
export class AdminDatasourceResolver extends BaseAdminFeatureResolver {
  @Query(
    () => AdminDatasourceServiceModelResultSet,
    AdminDatasourceApiConfiguration.datasourceServices().queryOptions,
    feature,
  )
  async datasourceServices(
    @Context()
    context: any,
  ): Promise<AdminDatasourceServiceModelResultSet> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminDatasourceService>(
        context,
        AdminDatasourceService,
      );

    return await service.getDatasourceServices(requestContext, context);
  }

  @Query(
    () => AdminDatasourceServiceModel,
    AdminDatasourceApiConfiguration.datasourceService().queryOptions,
    feature,
  )
  async datasourceService(
    @Args({
      parameter: AdminDatasourceRequestParameters.id,
      type: () => String!,
      required: true,
    })
    id: string,
    @Context()
    context: any,
  ): Promise<AdminDatasourceServiceModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminDatasourceService>(
        context,
        AdminDatasourceService,
      );

    return await service.getDatasourceService(id, requestContext, context);
  }

  @Mutation(
    () => AdminDatasourceServiceModelResultSet,
    AdminDatasourceApiConfiguration.datasourceServicesUpdate().mutationOptions,
    feature,
  )
  async datasourceServicesUpdate(
    @Args({
      parameter: AdminDatasourceRequestParameters.datasourceServices,
      type: () => [AdminDatasourceServiceInputModel],
      required: true,
    })
    datasourceServices: AdminDatasourceServiceInputModel[],
    @Context()
    context: any,
  ): Promise<AdminDatasourceServiceModelResultSet> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminDatasourceService>(
        context,
        AdminDatasourceService,
      );

    return await service.updateDatasourceServices(
      datasourceServices,
      requestContext,
      context,
    );
  }
}
