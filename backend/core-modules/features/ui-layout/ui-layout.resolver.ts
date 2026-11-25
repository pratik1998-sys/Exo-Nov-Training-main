import { Args, Query, Resolver } from "@api-decorators";
import { UILayout, UILayoutApiConfiguration, UILayoutModule, UILayoutRequestParameters, UILayoutService } from "@feature-ui-layout";
import { BaseFeatureResolver } from "@feature/resolver";
import { Context } from "@nestjs/graphql";

const feature = UILayoutModule.feature;

@Resolver((of) => UILayout, { feature })
export class UILayoutResolver extends BaseFeatureResolver {
    @Query(() => UILayout, UILayoutApiConfiguration.uiLayout().queryOptions, feature)
    async uiLayout(
        @Args({ parameter: UILayoutRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: UILayoutRequestParameters.type, required: true })
        type: string,
        @Context()
        context,
    ): Promise<UILayout> {
        const { requestContext, service } = this.getRequestContextAndService<UILayoutService>(context, UILayoutService);

        return await service.getUILayout(id, type, requestContext, context);
    }
}
