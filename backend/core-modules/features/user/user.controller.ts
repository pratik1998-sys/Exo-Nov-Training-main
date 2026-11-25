import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { User, UserApiConfiguration, UserFilterInput, UserInput, UserModule, UserRequestParameters, UserResultSet, UserResultSetQuery, UserService } from '@feature-user';
import { Body, Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ResultSetQueryType } from '@feature/controller/types';

const paths = {
    root: 'user',
};

const feature = UserModule.feature;

@Controller({ tags: 'user', path: paths.root, feature })
export class UserController extends BaseFeatureController {
    @Get(UserApiConfiguration.users().restOptions, feature)
    async users(@Req() request: FastifyRequest, @Query() query: UserResultSetQuery): Promise<UserResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(request, UserService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const filter: UserFilterInput = {
            identifiers:
                query.identifiers ?
                    !Array.isArray(query.identifiers) ?
                        [query.identifiers]
                        : query.identifiers
                    : undefined,
        };

        return await service.getUsers(filter, resultSetQuery.pagination, requestContext, request);
    }

    @Get(UserApiConfiguration.user().restOptions, feature)
    async user(@Param(UserRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<User> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(request, UserService);

        if (identifier === '@current') {
            identifier = null;
        }

        return await service.getUser(identifier, requestContext, request);
    }

    @Post(UserApiConfiguration.userCreate().restOptions, feature)
    async userCreate(@Body() userInput: UserInput, @Req() request: FastifyRequest): Promise<User> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(request, UserService);

        return await service.createUser(userInput, requestContext, request);
    }

    @Put(UserApiConfiguration.userUpdate().restOptions, feature)
    async userUpdate(@Param(UserRequestParameters.identifier.id) identifier: string, @Body() userInput: UserInput, @Req() request: FastifyRequest): Promise<User> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(request, UserService);

        return await service.updateUser(identifier, userInput, requestContext, request);
    }

    @Delete(UserApiConfiguration.userDelete().restOptions, feature)
    async userDelete(@Param(UserRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<User> {
        const { requestContext, service } = this.getRequestContextAndService<UserService>(request, UserService);

        return await service.deleteUser(identifier, requestContext, request);
    }
}
