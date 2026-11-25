import { RequestContext } from "@context/request";
import { AdobeCommerceBaseDatasource } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCreateCustomerInput, AdobeCommerceCustomer, AdobeCommerceCustomerAddress, AdobeCommerceCustomerAddressInput, AdobeCommerceCustomerQueries } from "./schema/adobe-commerce.ec-user.schema";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";

export interface AdobeCommerceECUserServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    createCustomerV2: GraphqlDatasourceServiceDefinition;
    customer: GraphqlDatasourceServiceDefinition;
    createCustomerAddress: GraphqlDatasourceServiceDefinition;
    updateCustomerAddress: GraphqlDatasourceServiceDefinition;
    deleteCustomerAddress: GraphqlDatasourceServiceDefinition;
}

export class AdobeCommerceECUserDatasource extends AdobeCommerceBaseDatasource {
    protected serviceDefinitions: AdobeCommerceECUserServiceDefinitions = {
        createCustomerV2: {
            id: 'createCustomerV2',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceCustomerQueries.createCustomerV2,
        },
        customer: {
            id: 'customer',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceCustomerQueries.customer,
        },
        createCustomerAddress: {
            id: 'createCustomerAddress',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceCustomerQueries.createCustomerAddress,
        },
        updateCustomerAddress: {
            id: 'updateCustomerAddress',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceCustomerQueries.updateCustomerAddress,
        },
        deleteCustomerAddress: {
            id: 'deleteCustomerAddress',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceCustomerQueries.deleteCustomerAddress,
        },
    };

    async createCustomer(requestContext: RequestContext, account: AdobeCommerceCreateCustomerInput): Promise<AdobeCommerceCustomer> {
        const methodname = `${AdobeCommerceECUserDatasource.name}.createCustomer`;

        const variables = {
            input: account,
        };

        const gqlResult = await this.executeGQLService<{ createCustomerV2: { customer: AdobeCommerceCustomer } }>(
            requestContext,
            this.serviceDefinitions.createCustomerV2,
            variables,
            null,
            {},
            ['password'],
        );

        return gqlResult.createCustomerV2?.customer;
    }

    async getCustomer(requestContext: RequestContext): Promise<AdobeCommerceCustomer> {
        const methodname = `${AdobeCommerceECUserDatasource.name}.getCustomer`;

        const gqlResult = await this.executeGQLService<{ customer: AdobeCommerceCustomer }>(requestContext, this.serviceDefinitions.customer, {}, null, {}, []);

        return gqlResult.customer;
    }

    async createCustomerAddress(requestContext: RequestContext, addressInput: AdobeCommerceCustomerAddressInput): Promise<AdobeCommerceCustomerAddress> {
        const methodname = `${AdobeCommerceECUserDatasource.name}.createCustomerAddress`;

        const variables = {
            input: addressInput,
        };

        const gqlResult = await this.executeGQLService<{ createCustomerAddress: AdobeCommerceCustomerAddress }>(
            requestContext,
            this.serviceDefinitions.createCustomerAddress,
            variables,
            null,
            {},
            [],
        );

        return gqlResult.createCustomerAddress;
    }

    async updateCustomerAddress(requestContext: RequestContext, id: number, addressInput: AdobeCommerceCustomerAddressInput): Promise<AdobeCommerceCustomerAddress> {
        const methodname = `${AdobeCommerceECUserDatasource.name}.updateCustomerAddress`;

        const variables = {
            id,
            input: addressInput,
        };

        const gqlResult = await this.executeGQLService<{ updateCustomerAddress: AdobeCommerceCustomerAddress }>(
            requestContext,
            this.serviceDefinitions.updateCustomerAddress,
            variables,
            null,
            {},
            [],
        );

        return gqlResult.updateCustomerAddress;
    }

    async deleteCustomerAddress(requestContext: RequestContext, id: number): Promise<boolean> {
        const methodname = `${AdobeCommerceECUserDatasource.name}.deleteCustomerAddress`;

        const variables = {
            id,
        };

        const gqlResult = await this.executeGQLService<{ deleteCustomerAddress: boolean }>(requestContext, this.serviceDefinitions.deleteCustomerAddress, variables, null, {}, []);

        return gqlResult.deleteCustomerAddress;
    }
}
