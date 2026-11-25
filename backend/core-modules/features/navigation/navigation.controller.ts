import { Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Get, Controller } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { HeaderNavigation, FooterNavigation } from './navigation.model';
import { NavigationApiConfiguration } from './navigation.api.configuration';
import { NavigationModule } from './navigation.module';
import { NavigationService } from './navigation.service';

const feature = NavigationModule.feature;

@Controller({ tags: 'navigation', path: 'navigation', feature })
export class NavigationController extends BaseFeatureController {
    @Get(NavigationApiConfiguration.navigationHeader().restOptions, feature)
    async navigationHeader(@Req() request: FastifyRequest): Promise<HeaderNavigation> {
        const { requestContext, service } = this.getRequestContextAndService<NavigationService>(request, NavigationService);

        return await service.getHeaderNavigation(requestContext, request);
    }

    @Get(NavigationApiConfiguration.navigationFooter().restOptions, feature)
    async navigationFooter(@Req() request: FastifyRequest): Promise<FooterNavigation> {
        const { requestContext, service } = this.getRequestContextAndService<NavigationService>(request, NavigationService);

        return await service.getFooterNavigation(requestContext, request);
    }
}
