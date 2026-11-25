import { Controller, Post } from '@api-decorators';
import { Authenticate, AuthenticateGuestInput, AuthenticateInput, LogoutResponse } from './authenticate.model';
import { AuthenticateApiConfiguration } from './authenticate.api.configuration';
import { AuthenticateModule } from './authenticate.module';
import { AuthenticateService } from './authenticate.service';
import { BaseFeatureController } from '@feature/controller';
import { Body, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { clearAuthTokenCookieOnReply } from '@api/shared/cookies';

const paths = {
    root: 'authenticate',
};

const feature = AuthenticateModule.feature;

@Controller({ tags: 'authenticate', path: paths.root, feature })
export class AuthenticateController extends BaseFeatureController {
    @Post(AuthenticateApiConfiguration.authenticate().restOptions, feature)
    async authenticate(@Body() authenticateInput: AuthenticateInput, @Req() request: FastifyRequest): Promise<Authenticate> {
        const { requestContext, service } = this.getRequestContextAndService<AuthenticateService>(request, AuthenticateService);

        const { username, password, doUser, additionalAttributes } = authenticateInput;

        return await service.authenticate(username, password, doUser, additionalAttributes, requestContext, request);
    }

    @Post(AuthenticateApiConfiguration.authenticateGuest().restOptions, feature)
    async authenticateGuest(@Body() authenticateInput: AuthenticateGuestInput, @Req() request: FastifyRequest): Promise<Authenticate> {
        const { requestContext, service } = this.getRequestContextAndService<AuthenticateService>(request, AuthenticateService);

        const { additionalAttributes } = authenticateInput;

        return await service.authenticateGuest(additionalAttributes, requestContext, request);
    }

    @Post(AuthenticateApiConfiguration.logout().restOptions, feature)
    async logout(@Res({ passthrough: true }) reply: FastifyReply): Promise<LogoutResponse> {
        clearAuthTokenCookieOnReply(reply);

        return { success: true };
    }
}
