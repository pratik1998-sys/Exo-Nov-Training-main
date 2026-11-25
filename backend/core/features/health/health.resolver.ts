import { Query, Resolver } from "@api-decorators";
import { BaseAdminFeatureResolver } from "@feature/resolver";
import { HealthApiConfiguration, HealthModule, HealthResponse } from "@health";
import { Context } from "@nestjs/graphql";

const feature = HealthModule.feature;

@Resolver((of) => HealthResponse, { feature })
export class HealthResolver extends BaseAdminFeatureResolver {
  @Query(
    () => HealthResponse,
    HealthApiConfiguration.health().queryOptions,
    feature,
  )
  async health(
    @Context()
    context: any,
  ): Promise<HealthResponse> {
    return {
      status: "UP",
    };
  }
}
