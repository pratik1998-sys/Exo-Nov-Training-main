import { Context } from '@nestjs/graphql';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { ECUser, ECUserCreate, ECUserCreateInput, ECUserInput } from './ec-user.model';
import { ECUserService } from './ec-user.service';
import { ECUserApiConfiguration } from './ec-user.api.configuration';
import { ECUserModule } from './ec-user.module';
import { ECUserRequestParameters } from './ec-user.parameters';
import { BaseFeatureResolver } from '@feature/resolver';

const feature = ECUserModule.feature;

@Resolver((of) => ECUser, { feature })
export class ECUserResolver extends BaseFeatureResolver {
    @Query(() => ECUser, ECUserApiConfiguration.user().queryOptions, feature)
    async user(
        @Args({ parameter: ECUserRequestParameters.id, type: () => String, required: false })
        id: string,
        @Context()
        context,
    ): Promise<ECUser> {
        const { requestContext, service } = this.getRequestContextAndService<ECUserService>(context, ECUserService);

        return await service.getUser(id, requestContext, context);
    }

    @Mutation(() => ECUserCreate, ECUserApiConfiguration.userCreate().mutationOptions, feature)
    async userCreate(
        @Args({ parameter: ECUserRequestParameters.user, type: () => ECUserCreateInput, required: true })
        user: ECUserCreateInput,
        @Args({ parameter: ECUserRequestParameters.cartId, type: () => String, required: false })
        cartId: string,
        @Context()
        context,
    ): Promise<ECUserCreate> {
        const { requestContext, service } = this.getRequestContextAndService<ECUserService>(context, ECUserService);

        return await service.createUser(user, cartId, requestContext, context);
    }

    @Mutation(() => ECUser, ECUserApiConfiguration.userUpdate().mutationOptions, feature)
    async userUpdate(
        @Args({ parameter: ECUserRequestParameters.id, type: () => String, required: true })
        id: string,
        @Args({ parameter: ECUserRequestParameters.user, type: () => ECUserInput, required: true })
        user: ECUserInput,
        @Context()
        context,
    ): Promise<ECUser> {
        const { requestContext, service } = this.getRequestContextAndService<ECUserService>(context, ECUserService);

        return await service.updateUser(id, user, requestContext, context);
    }
}
