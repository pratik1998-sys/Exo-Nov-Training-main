
import { RequestContext } from '@context/request';
import { ShopifyAuthenticateQuery, ShopifyCustomerAccessTokenCreateInput, ShopifyCustomerAccessTokenCreateResult } from './shopify.ec-authenticate.schema';
import { GraphqlDatasourceQuery, GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions } from '@plugin-datasource-graphql';
import { HttpMethods } from '@plugin-datasource-rest';
import { ShopifyBaseDatasource } from '@plugin-shopify/common';

export interface ShopifyECAuthenticateServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    createCustomerAccessToken: GraphqlDatasourceServiceDefinition;
}

export class ShopifyECAuthenticateDatasource extends ShopifyBaseDatasource {
    protected serviceDefinitions: ShopifyECAuthenticateServiceDefinitions = {
        createCustomerAccessToken: {
            id: 'createCustomerAccessToken',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
    };

    async createCustomerAccessToken<T extends ShopifyCustomerAccessTokenCreateResult>(requestContext: RequestContext, email: string, password: string): Promise<T> {
        const serviceDefinition = this.serviceDefinitions.createCustomerAccessToken;

        const query: GraphqlDatasourceQuery = this.getQuery(serviceDefinition.id, this.getQueryClass().customerAccessTokenCreate);

        const variables: { input: ShopifyCustomerAccessTokenCreateInput } = {
            input: {
                email,
                password,
            },
        };

        const result = await this.executeGQLService<{ customerAccessTokenCreate: ShopifyCustomerAccessTokenCreateResult }>(requestContext, serviceDefinition, variables, query, {}, [
            'input',
        ]);

        return result.customerAccessTokenCreate as T;
    }

    protected getQueryClass(): typeof ShopifyAuthenticateQuery {
        return ShopifyAuthenticateQuery;
    }
}
