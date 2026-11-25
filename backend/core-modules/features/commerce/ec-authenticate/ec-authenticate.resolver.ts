import { Context } from '@nestjs/graphql';
import { Args, Mutation, Resolver } from '@api-decorators';
import { ECAuthenticate, ECAuthenticateAdditonalAttributes, ECAuthenticateGuest } from './ec-authenticate.model';
import { ECAuthenticateApiConfiguration } from './ec-authenticate.api.configuration';
import { ECAuthenticateModule } from './ec-authenticate.module';
import { ECAuthenticateRequestParameters } from './ec-authenticate.parameters';
import { ECAuthenticateService } from './ec-authenticate.service';
import { AuthenticateResolver } from '@feature-authenticate';

const feature = ECAuthenticateModule.feature;

@Resolver((of) => ECAuthenticate, { feature })
export class ECAuthenticateResolver extends AuthenticateResolver {
    @Mutation(() => ECAuthenticate, ECAuthenticateApiConfiguration.authenticate().mutationOptions, feature)
    async authenticate(
        @Args({ parameter: ECAuthenticateRequestParameters.username, required: true })
        username: string,
        @Args({ parameter: ECAuthenticateRequestParameters.password, required: true })
        password: string,
        @Args({ type: () => Boolean, parameter: ECAuthenticateRequestParameters.doUser, required: false })
        doUser: boolean,
        @Args({ type: () => ECAuthenticateAdditonalAttributes, parameter: ECAuthenticateRequestParameters.additionalAttributes, required: false })
        additionalAttributes: ECAuthenticateAdditonalAttributes,
        @Context()
        context,
    ): Promise<ECAuthenticate> {
        const { requestContext, service } = this.getRequestContextAndService<ECAuthenticateService>(context, ECAuthenticateService);

        const { doCart, cartId } = additionalAttributes || {};

        return await service.authenticate(username, password, doUser, doCart, cartId, requestContext, context);
    }

    @Mutation(() => ECAuthenticateGuest, ECAuthenticateApiConfiguration.authenticateGuest().mutationOptions, feature)
    async authenticateGuest(
        @Args({ type: () => ECAuthenticateAdditonalAttributes, parameter: ECAuthenticateRequestParameters.additionalAttributes, required: false })
        additionalAttributes: ECAuthenticateAdditonalAttributes,
        @Context()
        context,
    ): Promise<ECAuthenticateGuest> {
        const { requestContext, service } = this.getRequestContextAndService<ECAuthenticateService>(context, ECAuthenticateService);

        return await service.authenticateGuest(requestContext, context);
    }
}
