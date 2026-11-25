import { RequestContext } from "@context/request";
import { BaseGraphqlDatasource, GraphqlDatasourceQuery, GraphqlDatasourceServiceDefinition } from "@plugin-datasource-graphql";
import { HCLCommerceConsumerConfiguration } from "./types/hcl-commerce.configuration.type";
import { HCLCommerceDatasourceConfiguration } from "./types/hcl-commerce.datasource.configuration";
import { HCLCommerceECToken } from "./types/hcl-commerce.ec-token.type";

export abstract class HCLCommerceBaseGQLDatasource extends BaseGraphqlDatasource {
    protected getHost(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: GraphqlDatasourceServiceDefinition) {
        return datasourceConfig.graphqlHost;
    }

    protected async executeGQL<T>(
        requestContext: RequestContext,
        serviceDefinition: GraphqlDatasourceServiceDefinition,
        variables: Record<string, any> = {},
        query: GraphqlDatasourceQuery = null,
        headers: any = {},
        maskedLogParams: string[] = [],
        attempt: number = 1,
    ): Promise<T> {
        const methodname = `${HCLCommerceBaseGQLDatasource.name}.executeGQL`;

        const dsConfig = this.getDatasourceConfig<HCLCommerceDatasourceConfiguration>(requestContext);

        const { configuration } = this.getPluginConsumerConfiguration<HCLCommerceConsumerConfiguration>(requestContext);

        variables = {
            ...variables,
            storeId: dsConfig.storeId,
            catalogId: dsConfig.catalogId,
            langId: configuration.languageIds[requestContext.locale],
        };

        try {
            return await super.executeGQL(requestContext, serviceDefinition, variables, query, headers, maskedLogParams, attempt);
        } catch (error) {
            this.logger.error(`${methodname} - Error executing GraphQL query: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }
    }

    protected addAuthTokenToHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: GraphqlDatasourceServiceDefinition) {
        const methodname = `${HCLCommerceBaseGQLDatasource.name}.addAuthTokenToHeaders`;

        const token = this.getPluginToken<HCLCommerceECToken>(requestContext);

        // Add authentication token to headers if needed
        if (token) {
            headers.WCToken = token.wcToken;
            headers.WCTrustedToken = token.wcTrustedToken;
        }

        return headers;
    }
}
