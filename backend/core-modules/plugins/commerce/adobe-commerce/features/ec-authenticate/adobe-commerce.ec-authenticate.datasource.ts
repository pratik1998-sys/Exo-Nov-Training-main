import { RequestContext } from "@context/request";
import { AdobeCommerceBaseDatasource } from "@plugin-adobe-commerce/common";
import { AdobeCommerceECAuthenticateQueries } from "./schema/adobe-commerce.ec-authenticate.schema";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";


export interface AdobeCommerceECAuthenticateServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    generateCustomerToken: GraphqlDatasourceServiceDefinition;
}

export class AdobeCommerceECAuthenticateDatasource extends AdobeCommerceBaseDatasource {
    protected serviceDefinitions: AdobeCommerceECAuthenticateServiceDefinitions = {
        generateCustomerToken: {
            id: 'generateCustomerToken',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceECAuthenticateQueries.generateCustomerToken,
        },
    };

    async generateCustomerToken(requestContext: RequestContext, username: string, password: string): Promise<string> {
        const methodname = `${AdobeCommerceECAuthenticateDatasource.name}.generateCustomerToken`;

        let result: string = null;

        const variables = {
            email: username,
            password,
        };

        const gqlResult = await this.executeGQLService<{ generateCustomerToken: { token: string } }>(requestContext, this.serviceDefinitions.generateCustomerToken, variables, null, {}, [
            'password',
        ]);

        return gqlResult.generateCustomerToken?.token;
    }
}
