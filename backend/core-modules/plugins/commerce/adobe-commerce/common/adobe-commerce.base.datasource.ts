import { RequestContext } from "@context/request";
import { AdobeCommerceConsumerConfiguration } from "./adobe-commerce.configuration.type";
import { BaseGraphqlDatasource, GraphqlDatasourceServiceDefinition } from "@plugin-datasource-graphql";

export abstract class AdobeCommerceBaseDatasource extends BaseGraphqlDatasource {
    protected composeHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: GraphqlDatasourceServiceDefinition) {
        const methodname = `${AdobeCommerceBaseDatasource.name}.composeHeaders`;

        headers = super.composeHeaders(requestContext, datasourceConfig, headers, serviceDefinition);

        const { configuration } = this.getPluginConsumerConfiguration<AdobeCommerceConsumerConfiguration>(requestContext);

        const { consumer, locale } = requestContext;

        if (configuration?.locales[requestContext.locale]) {
            headers.store = configuration.locales[requestContext.locale].storeId;
        } else {
            this.logger.info(`${methodname} - WARNING: No Adobe Commerce site configured for  site ${consumer}, Locale: ${locale}`);
        }

        return headers;
    }

    protected addAuthTokenToHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: GraphqlDatasourceServiceDefinition) {
        const token = this.getPluginToken(requestContext);

        if (!headers.authorization && token?.isRegistered) {
            headers.authorization = `Bearer ${token.token}`;
        }

        return headers;
    }

    protected getProductAttributes(requestContext) {
        const { configuration } = this.getPluginConsumerConfiguration<AdobeCommerceConsumerConfiguration>(requestContext);

        return configuration.productAttributes ?? [];
    }
}
