import { RequestContext } from "@context/request";
import { CommercetoolsEntityActionRequest } from "./schema/commercetools.common.type";
import { BaseDatasourcePluginServiceImpl } from "@plugin/service";
import { CommercetoolsConsumerConfiguration } from "@plugin-commercetools/common/commercetools.configuration.type";

export class CommercetoolsBaseServiceImpl extends BaseDatasourcePluginServiceImpl {
    protected composeQueryListValues(requestContext: RequestContext, list: string[], doGroup?: boolean) {
        let l = list.map((val) => `"${val}"`).join(',');

        return doGroup ? `(${l})` : l;
    }

    protected composeEntityAction(version: number): CommercetoolsEntityActionRequest {
        return {
            version: version,
            actions: [],
        };
    }

    protected getLanguage(requestContext: RequestContext) {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        return configuration.isLocaleAware ? requestContext.locale : requestContext.language;
    }
}
