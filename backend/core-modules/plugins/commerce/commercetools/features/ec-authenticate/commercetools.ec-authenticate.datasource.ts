import { RequestContext } from "@context/request";
import { CommercetoolsBaseDatasource, CommercetoolsBaseDatasourcePathParams, CommercetoolsServiceDefinition, CommercetoolsServiceDefinitions } from "@plugin-commercetools/common";
import { CommercetoolsCustomerLoginRequest, CommercetoolsCustomerLoginResponse, CommercetoolsGetTokenResponse } from "./schema/commercetools.ec-authenticate.schema";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { StringUtility } from "@utilities";

export interface CommercetoolsECAuthenticateServiceDefinitions extends CommercetoolsServiceDefinitions {
    getCustomerToken_OAuth: CommercetoolsServiceDefinition;
    getAnonymousToken: CommercetoolsServiceDefinition;
    customerLogin: CommercetoolsServiceDefinition;
}

export class CommercetoolsECAuthenticateDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsECAuthenticateServiceDefinitions = {
        getCustomerToken_OAuth: {
            id: 'getCustomerToken_OAuth',
            method: HttpMethods.post,
            path: `oauth/${CommercetoolsBaseDatasourcePathParams.projectKey}/customers/token`,
            storePath: `oauth/${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/customers/token`,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            isBasicAuth: true,
        },
        getAnonymousToken: {
            id: 'getAnonymousToken',
            method: HttpMethods.post,
            path: `oauth/{projectKey}/anonymous/token`,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            isBasicAuth: true,
        },
        customerLogin: {
            id: 'customerLogin',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/login`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/login`,
            timeout: 5000,
        }
    };

    async getCustomerToken_OAuth(requestContext: RequestContext, username: string, password: string): Promise<CommercetoolsGetTokenResponse> {
        const methodname = `${CommercetoolsECAuthenticateDatasource.name}.getCustomerToken_OAuth`;

        let dsResult: CommercetoolsGetTokenResponse = null;

        const queryParams = {
            grant_type: 'password',
            username,
            password,
        };

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.getCustomerToken_OAuth, queryParams, {}, {}, {}, ['password']);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching token for ${username}: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async customerLogin(requestContext: RequestContext, username: string, password: string, cartId?: string): Promise<CommercetoolsCustomerLoginResponse> {
        const methodname = `${CommercetoolsECAuthenticateDatasource.name}.customerLogin`;

        let dsResult: CommercetoolsCustomerLoginResponse = null;

        const body: CommercetoolsCustomerLoginRequest = {
            email: username,
            password,
        };

        if (StringUtility.isStringNotEmpty(cartId)) {
            body.anonymousCart = {
                id: cartId,
                typeId: 'cart',
            };
        }

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.customerLogin, {}, {}, {}, body, ['password']);
        } catch (error) {
            this.logger.info(`${methodname} - Error logging on customer ${username}: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async getAnonymousToken(requestContext: RequestContext): Promise<CommercetoolsGetTokenResponse> {
        const methodname = `${CommercetoolsECAuthenticateDatasource.name}.getAnonymousToken`;

        let dsResult: CommercetoolsGetTokenResponse = null;

        const queryParams = {
            grant_type: 'client_credentials',
        };

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.getAnonymousToken, queryParams);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching anonymous token: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }



    protected getHost(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: RestDatasourceServiceDefinition) {
        return this.serviceDefinitions.customerLogin.id == serviceDefinition.id ? datasourceConfig.host : datasourceConfig.authHost;
    }

    // protected addAuthTokenToHeaders(requestContext: RequestContext, headers: Record<string, any>, serviceDefinition: CommercetoolsServiceDefinition) {
    //     if (serviceIds.getClientToken != serviceDefinition.id && serviceIds.getAdminClientToken != serviceDefinition.id) {
    //         headers = super.addAuthTokenToHeaders(requestContext, headers, serviceDefinition);
    //     }

    //     return headers;
    // }

    // protected composeAuth(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: CommercetoolsServiceDefinition) {
    //     let basicAuth;

    //     if (serviceIds.customerLogin != serviceDefinition.id) {
    //         let clientConfig = datasourceConfig.anonymousCredentials;

    //         if (serviceIds.getClientToken == serviceDefinition.id) {
    //             clientConfig = datasourceConfig.clientCredentials;
    //         } else if (serviceIds.getAdminClientToken == serviceDefinition.id) {
    //             clientConfig = datasourceConfig.adminCredentials;
    //         }

    //         const { clientId, clientSecret } = clientConfig;

    //         if (clientId && clientSecret) {
    //             basicAuth = {
    //                 username: clientId,
    //                 password: clientSecret,
    //             };
    //         }
    //     }

    //     return basicAuth;
    // }
}
