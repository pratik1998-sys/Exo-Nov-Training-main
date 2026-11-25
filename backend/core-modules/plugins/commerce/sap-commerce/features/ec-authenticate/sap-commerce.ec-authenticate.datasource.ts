import { RequestContext } from "@context/request";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { SAPCommerceBaseDatasourcePathParams, SAPCommerceBaseDatasource } from "@plugin-sap-commerce/common";

const SAPCommerceAuthenticationDatasourcePathParams = {
    ...SAPCommerceBaseDatasourcePathParams,
};

export interface SAPCommerceECAuthenticateServiceDefinitions extends RestDatasourceServiceDefinitions {
    authenticate: RestDatasourceServiceDefinition;
}

export class SAPCommerceECAuthenticateDatasource extends SAPCommerceBaseDatasource {
    protected serviceDefinitions: SAPCommerceECAuthenticateServiceDefinitions = {
        authenticate: {
            id: 'authenticate',
            method: HttpMethods.post,
            path: `/authorizationserver/oauth/token`,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    };

    async authenticate(requestContext: RequestContext, username: string, password: string): Promise<any> {
        const methodname: string = `${SAPCommerceECAuthenticateDatasource.name}.getUserToken`;

        const queryParams = {
            username,
            password,
            grant_type: 'password',
        };

        //SAP is failing without this
        const headers = {
            'user-agent': 'Mozilla/5.0',
        };

        let result;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.authenticate, queryParams, headers);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [${this.serviceDefinitions.authenticate.id}]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }
}
