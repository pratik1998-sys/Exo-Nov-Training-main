import { Body, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Post, Controller } from '@api-decorators';
import { ECAuthenticate, ECAuthenticateGuestInput, ECAuthenticateInput } from './ec-authenticate.model';
import { ECAuthenticateApiConfiguration } from './ec-authenticate.api.configuration';
import { ECAuthenticateModule } from './ec-authenticate.module';
import { ECAuthenticateService } from './ec-authenticate.service';
import { AuthenticateController } from '@feature-authenticate';

const feature = ECAuthenticateModule.feature;

@Controller({ tags: 'authenticate', path: 'authenticate', feature })
export class ECAuthenticateController extends AuthenticateController {
    @Post(ECAuthenticateApiConfiguration.authenticate().restOptions, feature)
    async authenticate(@Body() authenticationInput: ECAuthenticateInput, @Req() request: FastifyRequest): Promise<ECAuthenticate> {
        const { requestContext, service } = this.getRequestContextAndService<ECAuthenticateService>(request, ECAuthenticateService);

        const { username, password, cartId, doCart, doUser } = authenticationInput;

        return await service.authenticate(username, password, doUser, doCart, cartId, requestContext, request);
    }

    @Post(ECAuthenticateApiConfiguration.authenticateGuest().restOptions, feature)
    async authenticateGuest(@Body() authenticateInput: ECAuthenticateGuestInput, @Req() request: FastifyRequest): Promise<ECAuthenticate> {
        const { requestContext, service } = this.getRequestContextAndService<ECAuthenticateService>(request, ECAuthenticateService);

        return await service.authenticateGuest(requestContext, request);
    }
}
