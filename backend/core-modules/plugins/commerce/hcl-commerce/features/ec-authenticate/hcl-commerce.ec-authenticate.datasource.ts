import { RequestContext } from "@context/request";
import { HCLCommerceBaseDatasourcePathParams, HCLCommerceBaseRestDatasource, HCLCommerceECToken } from "@plugin-hcl-commerce/common";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";

const HCLCommerceECAuthenticateDatasourcePathParams = {
    ...HCLCommerceBaseDatasourcePathParams,
};

export interface HCLCommerceECAuthenticateRestServiceDefinitions extends RestDatasourceServiceDefinitions {
    loginIdentity: RestDatasourceServiceDefinition;
    guestIdentity: RestDatasourceServiceDefinition;
}

/**
 * HCL Commerce REST identity resources: POST store/{storeId}/loginidentity, POST store/{storeId}/guestidentity.
 */
export class HCLCommerceECAuthenticateRestDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceECAuthenticateRestServiceDefinitions = {
        loginIdentity: {
            id: "loginIdentity",
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECAuthenticateDatasourcePathParams.storeId}/loginidentity`,
            timeout: 5000
        },
        guestIdentity: {
            id: "guestIdentity",
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECAuthenticateDatasourcePathParams.storeId}/guestidentity`,
            timeout: 5000
        },
    };

    protected addAuthTokenToHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, unknown>, serviceDefinition: RestDatasourceServiceDefinition) {
        if (serviceDefinition.id == this.serviceDefinitions.loginIdentity.id) {
            const token = this.getPluginToken<HCLCommerceECToken>(requestContext);

            if (token) {
                headers.WCToken = token.WCToken;
                headers.WCTrustedToken = token.WCTrustedToken;
            }
        }

        return headers;
    }

    async authenticate(requestContext: RequestContext, username: string, password: string): Promise<Record<string, unknown>> {
        const methodname = `${HCLCommerceECAuthenticateRestDatasource.name}.authenticate`;

        const body = {
            logonId: username,
            logonPassword: password,
        };

        try {
            return await this.execute(requestContext, this.serviceDefinitions.loginIdentity, {}, {}, {}, body, ["logonPassword"]);
        } catch (error) {
            this.logger.info(`${methodname} - Error executing login: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }
    }

    async authenticateGuest(requestContext: RequestContext): Promise<Record<string, unknown>> {
        const methodname = `${HCLCommerceECAuthenticateRestDatasource.name}.authenticateGuest`;

        try {
            return await this.execute(requestContext, this.serviceDefinitions.guestIdentity, {}, {}, {}, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error executing guest authentication: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }
    }
}
