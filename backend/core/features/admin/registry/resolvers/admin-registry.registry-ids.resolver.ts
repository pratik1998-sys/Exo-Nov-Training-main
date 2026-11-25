import { Context } from "@nestjs/graphql";
import { AdminRegistryApiConfiguration } from "../admin-registry.api.configuration";
import { AdminRegistryModule } from "../admin-registry.module";
import { AdminRegistryService } from "../admin-registry.service";
import { Query, Resolver } from "@api-decorators";
import { BaseAdminFeatureResolver } from "@feature/resolver";

const feature = AdminRegistryModule.feature;

@Resolver((of) => [String], { feature })
export class AdminRegistriesResolver extends BaseAdminFeatureResolver {
  @Query(
    () => [String],
    AdminRegistryApiConfiguration.registries().queryOptions,
    feature,
  )
  async registries(
    @Context()
    context: any,
  ): Promise<string[]> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminRegistryService>(
        context,
        AdminRegistryService,
      );

    return service.getRegistries(requestContext, context);
  }
}
