import { Context } from '@nestjs/graphql';
import { User, UserApiConfiguration, UserCreate, UserCreateInput, UserFilterInput, UserInput, UserModule, UserRequestParameters, UserResultSet, UserService } from '@feature-user';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';

const feature = UserModule.feature;

@Resolver((of) => User, { feature })
export class UserResolver extends BaseFeatureResolver {
    @Query(() => UserResultSet, UserApiConfiguration.users().queryOptions, feature)
    async users(
        @Args({ parameter: UserRequestParameters.filter, type: () => UserFilterInput, required: false })
        filter: UserFilterInput,
        @Args({ parameter: UserRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<UserResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(context, UserService);

        return await service.getUsers(filter, pagination, requestContext, context);
    }

    @Query(() => User, UserApiConfiguration.user().queryOptions, feature)
    async user(
        @Args({ parameter: UserRequestParameters.id, required: false })
        id: string,
        @Context()
        context: any,
    ): Promise<User> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(context, UserService);

        return await service.getUser(id, requestContext, context);
    }

    @Mutation(() => UserCreate, UserApiConfiguration.userCreate().queryOptions, feature)
    async userCreate(
        @Args({ parameter: UserRequestParameters.user, type: () => UserCreateInput, required: true })
        user: UserCreateInput,
        @Context()
        context: any,
    ): Promise<UserCreate> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(context, UserService);

        return await service.createUser(user, requestContext, context);
    }

    @Mutation(() => User, UserApiConfiguration.userUpdate().queryOptions, feature)
    async userUpdate(
        @Args({ parameter: UserRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: UserRequestParameters.user, type: () => UserInput, required: true })
        contact: UserInput,
        @Context()
        context: any,
    ): Promise<User> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(context, UserService);

        return await service.updateUser(id, contact, requestContext, context);
    }

    @Mutation(() => User, UserApiConfiguration.userDelete().queryOptions, feature)
    async userDelete(
        @Args({ parameter: UserRequestParameters.id, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<User> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(context, UserService);

        return await service.deleteUser(id, requestContext, context);
    }
}
