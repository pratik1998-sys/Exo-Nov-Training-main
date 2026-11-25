import { AdminMessengerApiConfiguration } from "./admin-messenger.api.configuration";
import { AdminMessengerModule } from "./admin-messenger.module";
import { AdminMessengerRequestParameters } from "./admin-messenger.parameters";
import { AdminMessengerService } from "./admin-messenger.service";
import {
  AdminMessengerModel,
  AdminMessengerModelInput,
  AdminMessengerResultSet,
} from "./admin-messenger.model";
import { Query, Resolver, Mutation, Args } from "@api-decorators";
import { BaseAdminFeatureResolver } from "@feature/resolver";
import { Context } from "@nestjs/graphql";

const feature = AdminMessengerModule.feature;

@Resolver((of) => AdminMessengerModel, { feature })
export class AdminMessengerResolver extends BaseAdminFeatureResolver {
  @Query(
    () => AdminMessengerResultSet,
    AdminMessengerApiConfiguration.messengers().queryOptions,
    feature,
  )
  async messengers(
    @Context()
    context: any,
  ): Promise<AdminMessengerResultSet> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminMessengerService>(
        context,
        AdminMessengerService,
      );

    return await service.getMessengers(requestContext, context);
  }

  @Query(
    () => AdminMessengerModel,
    AdminMessengerApiConfiguration.messenger().queryOptions,
    feature,
  )
  async messenger(
    @Args({
      parameter: AdminMessengerRequestParameters.id,
      type: () => String!,
      required: true,
    })
    id: string,
    @Context()
    context: any,
  ): Promise<AdminMessengerModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminMessengerService>(
        context,
        AdminMessengerService,
      );

    return await service.getMessenger(id, requestContext, context);
  }

  @Mutation(
    () => AdminMessengerResultSet,
    AdminMessengerApiConfiguration.messengersUpdate().mutationOptions,
    feature,
  )
  async messageUpdate(
    @Args({
      parameter: AdminMessengerRequestParameters.messengers,
      type: () => [AdminMessengerModelInput],
      required: true,
    })
    messengers: AdminMessengerModelInput[],
    @Context()
    context: any,
  ): Promise<AdminMessengerResultSet> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminMessengerService>(
        context,
        AdminMessengerService,
      );
    return await service.updateMessengers(messengers, requestContext, context);
  }
}
