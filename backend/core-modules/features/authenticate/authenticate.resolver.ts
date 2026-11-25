import { Args, Mutation, Resolver } from '@api-decorators';
import { Authenticate } from './authenticate.model';
import { AuthenticateApiConfiguration } from './authenticate.api.configuration';
import { AuthenticateRequestParameters } from './authenticate.parameters';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateModule } from './authenticate.module';
import { BaseFeatureResolver } from '@feature/resolver';
import { Context } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

const feature = AuthenticateModule.feature;

@Resolver((of) => Authenticate, { feature })
export class AuthenticateResolver extends BaseFeatureResolver {
    @Mutation(() => Authenticate, AuthenticateApiConfiguration.authenticate().mutationOptions, feature)
    async authenticate(
        @Args({ parameter: AuthenticateRequestParameters.username, required: true })
        username: string,
        @Args({ parameter: AuthenticateRequestParameters.password, required: true })
        password: string,
        @Args({ type: () => Boolean, parameter: AuthenticateRequestParameters.doUser, required: false })
        doUser: boolean,
        @Args({ type: () => GraphQLJSONObject, parameter: AuthenticateRequestParameters.additionalAttributes, required: false })
        additionalAttributes: Record<string, any>,
        @Context()
        context,
    ): Promise<Authenticate> {
        const { requestContext, service } = this.getRequestContextAndService<AuthenticateService>(context, AuthenticateService);

        return await service.authenticate(username, password, doUser, additionalAttributes, requestContext, context);
    }

    @Mutation(() => Authenticate, AuthenticateApiConfiguration.authenticateGuest().mutationOptions, feature)
    async authenticateGuest(
        @Args({ type: () => GraphQLJSONObject, parameter: AuthenticateRequestParameters.additionalAttributes, required: false })
        additionalAttributes: Record<string, any>,
        @Context()
        context,
    ): Promise<Authenticate> {
        const { requestContext, service } = this.getRequestContextAndService<AuthenticateService>(context, AuthenticateService);

        return await service.authenticateGuest(requestContext, context);
    }

    @Mutation(() => Boolean, AuthenticateApiConfiguration.logout().mutationOptions, feature)
    logout(): boolean {
        return true;
    }
}
