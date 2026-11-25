import { RequestContext } from "@context/request";
import { BaseRestDatasource, RestDatasourceServiceDefinition } from "@plugin-datasource-rest";
import { SAPCommerceConsumerConfiguration } from "./types/sap-commerce.configuration.type";
import { SAPCommerceDatasourceConfiguration } from "./types/sap-commerce.datasource.configuration";

import { StringUtility } from "@utilities";

export const SAPCommerceBaseDatasourcePathParams = {
    baseSiteId: '{baseSiteId}',
    baseStoreId: '{baseStoreId}',
    b2bUnitId: '{b2bUnitId}',
    userId: '{userId}',
};

export abstract class SAPCommerceBaseDatasource extends BaseRestDatasource {
    protected clientIdSecretHeaders: Record<string, string> = {};

    protected composeQueryParams(requestContext: RequestContext, dataSourceConfig: any, queryParams: any) {
        queryParams = super.composeQueryParams(requestContext, dataSourceConfig, queryParams);

        queryParams.lang = requestContext.language;

        return queryParams;
    }

    protected composePath(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: RestDatasourceServiceDefinition, paramMap: any) {
        paramMap = paramMap ?? {};

        const obj = this.getPluginConsumerConfiguration<SAPCommerceConsumerConfiguration>(requestContext);

        const { configuration } = obj;

        paramMap[SAPCommerceBaseDatasourcePathParams.baseSiteId] = configuration.siteId;

        const token = this.getPluginToken(requestContext);

        paramMap[SAPCommerceBaseDatasourcePathParams.userId] = token?.isRegistered ? 'current' : 'anonymous';

        //TODO: Are these really just form custom Nestle APIs? If so, should be moved
        paramMap[SAPCommerceBaseDatasourcePathParams.b2bUnitId] = requestContext.account;
        paramMap[SAPCommerceBaseDatasourcePathParams.baseStoreId] = configuration.storeId;

        return super.composePath(requestContext, datasourceConfig, serviceDefinition, paramMap);
    }

    protected addAuthTokenToHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>) {
        const token = this.getPluginToken(requestContext);

        headers.Authorization = StringUtility.isStringEmpty(token?.token) ? this.getClientIdSecretHeader(requestContext) : `Bearer ${token.token}`;

        return headers;
    }

    protected getClientIdSecretHeader(requestContext: RequestContext) {
        const { consumer } = requestContext;

        if (!this.clientIdSecretHeaders[consumer]) {
            const dsConfig = this.getDatasourceConfig<SAPCommerceDatasourceConfiguration>(requestContext);

            this.clientIdSecretHeaders[consumer] = `Basic ${Buffer.from(`${dsConfig.clientId}:${dsConfig.clientSecret}`).toString('base64')}`;
        }

        return this.clientIdSecretHeaders[consumer];
    }

    protected composeHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: RestDatasourceServiceDefinition): Record<string, any> {
        headers = super.composeHeaders(requestContext, datasourceConfig, headers, serviceDefinition);

        //SAP is failing without this
        headers = {
            ...headers,
            'user-agent': 'Mozilla/5.0',
            'accept-language': requestContext.language,
        };

        return headers;
    }

    /*
    protected composeAuth(requestContext: RequestContext) {
        const datasourceConfig = this.getDatasourceConfig(requestContext);

        const { clientId, secret } = datasourceConfig;

        let basicAuth;

        if (clientId && secret) {
            basicAuth = {
                username: clientId,
                password: secret,
            };
        }


        return basicAuth;
    }
    */
}
