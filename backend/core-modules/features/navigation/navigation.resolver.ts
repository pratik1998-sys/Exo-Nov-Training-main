import { Context } from '@nestjs/graphql';
import { Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { HeaderNavigation, FooterNavigation, NavigationItem } from './navigation.model';
import { NavigationApiConfiguration } from './navigation.api.configuration';
import { NavigationModule } from './navigation.module';
import { NavigationService } from './navigation.service';

const feature = NavigationModule.feature;

@Resolver((of) => NavigationItem, { feature })
export class NavigationResolver extends BaseFeatureResolver {
    @Query(() => HeaderNavigation, NavigationApiConfiguration.navigationHeader().queryOptions, feature)
    async navigationHeader(
        @Context()
        context: any,
    ): Promise<HeaderNavigation> {
        const { requestContext, service } = this.getRequestContextAndService<NavigationService>(context, NavigationService);

        return await service.getHeaderNavigation(requestContext, context);
    }

    @Query(() => FooterNavigation, NavigationApiConfiguration.navigationFooter().queryOptions, feature)
    async navigationFooter(
        @Context()
        context: any,
    ): Promise<FooterNavigation> {
        const { requestContext, service } = this.getRequestContextAndService<NavigationService>(context, NavigationService);

        return await service.getFooterNavigation(requestContext, context);
    }
}
