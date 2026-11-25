import { RequestContext } from "@context/request";
import { CommercetoolsEntity, CommercetoolsGetTokenResponse, CommercetoolsResultSet } from "./schema/commercetools.common.type";
import { BaseRestDatasource, HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { StringUtility } from "@utilities";
import { CommercetoolsConsumerConfiguration } from "./commercetools.configuration.type";
import { CommercetoolsOAuthRegistry } from "./commercetools.common.oauth.registry";

export const CommercetoolsBaseDatasourcePathParams = {
    projectKey: '{projectKey}',
    storeKey: '{storeKey}',
    key: '{key}',
    id: '{id}',
    customerId: '{customerId}',
};

export interface CommercetoolsBaseServiceDefinitions extends RestDatasourceServiceDefinitions {
    getClientToken: CommercetoolsServiceDefinition;
    getAdminClientToken: CommercetoolsServiceDefinition;
}

const composeGetTokenServiceDefinition = (id: string): CommercetoolsServiceDefinition => {
    return {
        id: id,
        method: HttpMethods.post,
        path: `oauth/token`,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        isBasicAuth: true,
    }
};

export abstract class CommercetoolsBaseDatasource extends BaseRestDatasource {
    protected baseServiceDefinitions: CommercetoolsBaseServiceDefinitions = {
        getClientToken: composeGetTokenServiceDefinition('getClientToken'),
        getAdminClientToken: composeGetTokenServiceDefinition('getAdminClientToken'),
    };

    protected consumerPathMap: Record<string, Record<string, string>> = {};

    async getClientToken(requestContext: RequestContext, isAdmin: boolean): Promise<CommercetoolsGetTokenResponse> {
        const methodname = `${CommercetoolsBaseDatasource.name}.getClientToken`;

        let dsResult: CommercetoolsGetTokenResponse = null;

        const queryParams = {
            grant_type: 'client_credentials',
        };

        let serviceDefinition = isAdmin ? this.baseServiceDefinitions.getAdminClientToken : this.baseServiceDefinitions.getClientToken;

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, queryParams);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching client token (${serviceDefinition.id}): ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async executeCompleteResultSet(
        requestContext: RequestContext,
        serviceDefinition: RestDatasourceServiceDefinition,
        queryParams: any = {},
        headers: any = {},
        paramMap: any = {},
        body: any = {},
        maskLogParams: string[] = [],
        results: CommercetoolsEntity[] = [],
    ): Promise<CommercetoolsEntity[]> {
        const dsResult: CommercetoolsResultSet = await this.execute(requestContext, serviceDefinition, queryParams, headers, paramMap, body, maskLogParams);

        const { total, limit, offset } = dsResult;

        const totalPages = total < limit ? 1 : Math.ceil(total / limit);
        const pageNumber = Math.ceil(offset / limit) + 1;

        results.push(...dsResult.results);

        if (pageNumber < totalPages) {
            queryParams.offset = offset + limit;
            queryParams.limit = limit;

            const nextResults = await this.executeCompleteResultSet(requestContext, serviceDefinition, queryParams, headers, paramMap, body, maskLogParams);

            results.push(...nextResults);
        }

        return results;
    }

    protected composePath(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: RestDatasourceServiceDefinition, paramMap: Record<string, string> = {}) {
        const { storeId } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext).configuration;

        if (StringUtility.isStringNotEmpty(storeId)) {
            paramMap[CommercetoolsBaseDatasourcePathParams.projectKey] = datasourceConfig.projectKey;
            paramMap[CommercetoolsBaseDatasourcePathParams.storeKey] = storeId;
        }

        return super.composePath(requestContext, datasourceConfig, serviceDefinition, paramMap);
    }

    protected resolvePath(requestContext: RequestContext, serviceDefinition: CommercetoolsServiceDefinition) {
        const methodname = `${CommercetoolsBaseDatasource.name}.resolvePath`;

        const { consumer } = requestContext;
        const { id, path, storePath } = serviceDefinition;

        if (!this.consumerPathMap[consumer]?.[id]) {
            const { storeId } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext).configuration;

            if (!this.consumerPathMap[consumer]) {
                this.consumerPathMap[consumer] = {};
            }

            if (StringUtility.isStringNotEmpty(storeId) && StringUtility.isStringNotEmpty(storePath)) {
                this.consumerPathMap[consumer][id] = storePath;
            } else {
                this.consumerPathMap[consumer][id] = path;
            }
        }

        return this.consumerPathMap[consumer][id];
    }

    protected getHost(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: RestDatasourceServiceDefinition) {
        let host = datasourceConfig.host;

        if (this.baseServiceDefinitions.getClientToken.id == serviceDefinition.id || this.baseServiceDefinitions.getAdminClientToken.id == serviceDefinition.id) {
            host = datasourceConfig.authHost;
        }

        return host;
    }

    protected composeHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: RestDatasourceServiceDefinition) {
        const methodname = `${CommercetoolsBaseDatasource.name}.composeHeaders`;

        headers = super.composeHeaders(requestContext, datasourceConfig, headers, serviceDefinition);

        return headers;
    }

    protected addAuthTokenToHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: CommercetoolsServiceDefinition) {
        if (this.baseServiceDefinitions.getClientToken.id != serviceDefinition.id && this.baseServiceDefinitions.getAdminClientToken.id != serviceDefinition.id) {
            if (serviceDefinition.isAdminService) {
                headers.authorization = `Bearer ${this.getOAuthRegistry(requestContext).getAdminClientAccessToken()}`;
            } else {
                const token = this.getPluginToken(requestContext);

                if (!headers.authorization && StringUtility.isStringNotEmpty(token?.token)) {
                    headers.authorization = `Bearer ${token.token}`;
                } else {
                    headers.authorization = `Bearer ${this.getOAuthRegistry(requestContext).getClientAccessToken()}`;
                }
            }
        }

        return headers;
    }

    protected composeAuth(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: CommercetoolsServiceDefinition) {
        let basicAuth;

        if (serviceDefinition.isBasicAuth) {
            let clientConfig = datasourceConfig.anonymousCredentials;

            if (this.baseServiceDefinitions.getClientToken.id == serviceDefinition.id) {
                clientConfig = datasourceConfig.clientCredentials;
            } else if (this.baseServiceDefinitions.getAdminClientToken.id == serviceDefinition.id) {
                clientConfig = datasourceConfig.adminCredentials;
            }

            const { clientId, clientSecret } = clientConfig;

            if (clientId && clientSecret) {
                basicAuth = {
                    username: clientId,
                    password: clientSecret,
                };
            }
        }

        return basicAuth;
    }

    protected getOAuthRegistry(requestContext: RequestContext) {
        return this.getRegistry<CommercetoolsOAuthRegistry>(requestContext, CommercetoolsOAuthRegistry);
    }
}

export interface CommercetoolsServiceDefinition extends RestDatasourceServiceDefinition {
    storePath?: string;
    isAdminService?: boolean;
    isBasicAuth?: boolean;
}

export interface CommercetoolsServiceDefinitions extends RestDatasourceServiceDefinitions {
    [key: string]: CommercetoolsServiceDefinition;
}

export interface CommercetoolsQueryParams {
    where?: string[];
    sort?: string[];
    expand?: string[];
    limit?: number;
    offset?: number;
    withTotal?: boolean;
}

export interface CommercetoolsEntityQueryParams {
    expand?: string[];
    version?: number;
    dataErasure?: boolean;
}
