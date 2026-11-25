import { AdminRegistryApiConfiguration } from "../admin-registry.api.configuration";
import { AdminRegistryModule } from "../admin-registry.module";
import { AdminRegistryRequestParameters } from "../admin-registry.parameters";
import { AdminRegistryService } from "../admin-registry.service";
import { AdminRegistryModel } from "../admin-registry.model";
import { Args, Mutation, Query, Resolver } from "@api-decorators";
import { BaseAdminFeatureResolver } from "@feature/resolver";
import { Context } from "@nestjs/graphql";

const feature = AdminRegistryModule.feature;

@Resolver((of) => AdminRegistryModel, { feature })
export class AdminRegistryResolver extends BaseAdminFeatureResolver {
  @Query(
    () => AdminRegistryModel,
    AdminRegistryApiConfiguration.registry().queryOptions,
    feature,
  )
  async registry(
    @Args({
      parameter: AdminRegistryRequestParameters.id,
      type: () => String!,
      required: true,
    })
    id: string,
    @Context()
    context: any,
  ): Promise<AdminRegistryModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminRegistryService>(
        context,
        AdminRegistryService,
      );

    return {
      data: await service.getRegistryData(id, requestContext, context),
    };
  }

  @Mutation(
    () => AdminRegistryModel,
    AdminRegistryApiConfiguration.registryRefresh().mutationOptions,
    feature,
  )
  async registryRefresh(
    @Args({
      parameter: AdminRegistryRequestParameters.id,
      type: () => String!,
      required: true,
    })
    id: string,
    @Context()
    context: any,
  ): Promise<AdminRegistryModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminRegistryService>(
        context,
        AdminRegistryService,
      );

    return {
      data: await service.refreshRegistry(id, requestContext, context),
    };
  }
}
