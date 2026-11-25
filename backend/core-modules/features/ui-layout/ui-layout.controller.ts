import { Controller, Get } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { UILayoutApiConfiguration, UILayoutModule, UILayoutRequestParameters, UILayoutRest, UILayoutService } from '@feature-ui-layout';
import { Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';


const paths = {
    root: 'ui-layout',
};

const feature = UILayoutModule.feature;

@Controller({ tags: 'ui-layout', path: paths.root, feature })
export class UILayoutController extends BaseFeatureController {
    @Get(UILayoutApiConfiguration.uiLayout().restOptions, feature)
    async uiLayout(
        @Param(UILayoutRequestParameters.type.id) type: string,
        @Query(UILayoutRequestParameters.id.id) id: string,
        @Req() request: FastifyRequest
    ): Promise<UILayoutRest> {
        const { requestContext, service } = this.getRequestContextAndService<UILayoutService>(request, UILayoutService);

        return await service.getUILayout(id, type, requestContext, request);
    }
}
