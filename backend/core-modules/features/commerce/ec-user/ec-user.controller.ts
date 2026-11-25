import { Body, Param, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Get, Post, Controller, Put } from '@api-decorators';
import { ECUser, ECUserCreate, ECUserCreateBodyInput, ECUserInput } from './ec-user.model';
import { ECUserApiConfiguration } from './ec-user.api.configuration';
import { ECUserModule } from './ec-user.module';
import { ECUserRequestParameters } from './ec-user.parameters';
import { ECUserService } from './ec-user.service';
import { UserController } from '@feature-user';

const feature = ECUserModule.feature;

@Controller({ tags: 'user', path: 'user', feature })
export class ECUserController extends UserController {
    @Get(ECUserApiConfiguration.user().restOptions, feature)
    async user(@Param(ECUserRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<ECUser> {
        const { requestContext, service } = this.getRequestContextAndService<ECUserService>(request, ECUserService);

        return await service.getUser(identifier, requestContext, request);
    }

    @Post(ECUserApiConfiguration.userCreate().restOptions, feature)
    async userCreate(@Body() body: ECUserCreateBodyInput, @Req() request: FastifyRequest): Promise<ECUserCreate> {
        const { requestContext, service } = this.getRequestContextAndService<ECUserService>(request, ECUserService);

        const { cartId } = body;

        return await service.createUser(body, cartId, requestContext, request);
    }

    @Put(ECUserApiConfiguration.userUpdate().restOptions, feature)
    async userUpdate(@Param(ECUserRequestParameters.identifier.id) identifier: string, @Body() body: ECUserInput, @Req() request: FastifyRequest): Promise<ECUser> {
        const { requestContext, service } = this.getRequestContextAndService<ECUserService>(request, ECUserService);

        return await service.updateUser(identifier, body, requestContext, request);
    }
}
