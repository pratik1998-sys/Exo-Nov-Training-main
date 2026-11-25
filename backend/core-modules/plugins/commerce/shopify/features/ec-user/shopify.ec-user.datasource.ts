
import {
    ShopifyCustomer,
    ShopifyCustomerAddressCreateInput,
    ShopifyCustomerAddressCreateResult,
    ShopifyCustomerAddressDeleteInput,
    ShopifyCustomerAddressDeleteResult,
    ShopifyCustomerAddressUpdateInput,
    ShopifyCustomerAddressUpdateResult,
    ShopifyCustomerCreateInput,
    ShopifyCustomerCreateResult,
    ShopifyCustomerDefaultAddressUpdateInput,
    ShopifyCustomerDefaultAddressUpdateResult,
    ShopifyCustomerInput,
    ShopifyCustomerQuery,
} from './shopify.ec-user.schema';
import { RequestContext } from '@context/request';
import { ShopifyAddress } from '../address/shopify.address.schema';
import { GraphqlDatasourceQuery, GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions } from '@plugin-datasource-graphql';
import { HttpMethods } from '@plugin-datasource-rest';
import { ShopifyBaseDatasource } from '@plugin-shopify/common';

export interface ShopifyECUserServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    createCustomer: GraphqlDatasourceServiceDefinition;
    getCustomer: GraphqlDatasourceServiceDefinition;
    createCustomerAddress: GraphqlDatasourceServiceDefinition;
    updateCustomerAddress: GraphqlDatasourceServiceDefinition;
    deleteCustomerAddress: GraphqlDatasourceServiceDefinition;
    updateCustomerDefaultAddress: GraphqlDatasourceServiceDefinition;
}

export class ShopifyECUserDatasource extends ShopifyBaseDatasource {
    protected serviceDefinitions: ShopifyECUserServiceDefinitions = {
        createCustomer: {
            id: 'createCustomer',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        getCustomer: {
            id: 'getCustomer',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        createCustomerAddress: {
            id: 'createCustomerAddress',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        updateCustomerAddress: {
            id: 'updateCustomerAddress',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        deleteCustomerAddress: {
            id: 'deleteCustomerAddress',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        },
        updateCustomerDefaultAddress: {
            id: 'updateCustomerDefaultAddress',
            method: HttpMethods.post,
            timeout: 5000,
            query: null,
        }
    };

    async createCustomer<T extends ShopifyCustomerCreateResult>(requestContext: RequestContext, customerInput: ShopifyCustomerCreateInput): Promise<ShopifyCustomerCreateResult> {
        const serviceDefinition = this.serviceDefinitions.createCustomer;

        const variables: { input: ShopifyCustomerCreateInput } = {
            input: customerInput,
        };

        const query: GraphqlDatasourceQuery = this.getQuery(serviceDefinition.id, this.getQueryClass().customerCreate);

        const result = await this.executeGQLService<{ customerCreate: ShopifyCustomerCreateResult }>(requestContext, serviceDefinition, variables, query, {}, ['password']);

        return result.customerCreate as T;
    }

    async getCustomer<T extends ShopifyCustomer>(requestContext: RequestContext, customerAccessToken: string, addressFirst: number, addressAfter?: string): Promise<ShopifyCustomer> {
        const serviceDefinition = this.serviceDefinitions.getCustomer;

        const query: GraphqlDatasourceQuery = this.getQuery(serviceDefinition.id, this.getQueryClass().customer);

        const variables: ShopifyCustomerInput = {
            customerAccessToken,
            addressFirst,
            addressAfter,
        };

        const result = await this.executeGQLService<{ customer: ShopifyCustomer }>(requestContext, serviceDefinition, variables, query);

        return result.customer as T;
    }

    async createCustomerAddress<T extends ShopifyCustomerAddressCreateResult>(
        requestContext: RequestContext,
        customerAccessToken: string,
        address: ShopifyAddress,
    ): Promise<ShopifyCustomerAddressCreateResult> {
        const serviceDefinition = this.serviceDefinitions.createCustomerAddress;

        const query: GraphqlDatasourceQuery = this.getQuery(serviceDefinition.id, this.getQueryClass().customerAddressCreate);

        const variables: ShopifyCustomerAddressCreateInput = {
            customerAccessToken,
            address,
        };

        const result = await this.executeGQLService<{ customerAddressCreate: ShopifyCustomerAddressCreateResult }>(requestContext, serviceDefinition, variables, query);

        return result.customerAddressCreate as T;
    }

    async updateCustomerAddress<T extends ShopifyCustomerAddressCreateResult>(
        requestContext: RequestContext,
        customerAccessToken: string,
        address: ShopifyAddress,
        id: string,
    ): Promise<ShopifyCustomerAddressUpdateResult> {
        const serviceDefinition = this.serviceDefinitions.updateCustomerAddress;

        const query: GraphqlDatasourceQuery = this.getQuery(serviceDefinition.id, this.getQueryClass().customerAddressUpdate);

        const variables: ShopifyCustomerAddressUpdateInput = {
            customerAccessToken,
            address,
            id,
        };

        const result = await this.executeGQLService<{ customerAddressUpdate: ShopifyCustomerAddressUpdateResult }>(requestContext, serviceDefinition, variables, query);

        return result.customerAddressUpdate as T;
    }

    async deleteCustomerAddress<T extends ShopifyCustomerAddressDeleteResult>(requestContext: RequestContext, customerAccessToken: string, id: string): Promise<ShopifyCustomerAddressDeleteResult> {
        const serviceDefinition = this.serviceDefinitions.deleteCustomerAddress;

        const query: GraphqlDatasourceQuery = this.getQuery(serviceDefinition.id, this.getQueryClass().customerAddressDelete);

        const variables: ShopifyCustomerAddressDeleteInput = {
            customerAccessToken,
            id,
        };

        const result = await this.executeGQLService<{ customerAddressDelete: ShopifyCustomerAddressDeleteResult }>(requestContext, serviceDefinition, variables, query);

        return result.customerAddressDelete as T;
    }

    async updateCustomerDefaultAddress<T extends ShopifyCustomerDefaultAddressUpdateResult>(
        requestContext: RequestContext,
        customerAccessToken: string,
        addressId: string,
        addressFirst: number,
        addressAfter?: string,
    ): Promise<ShopifyCustomerDefaultAddressUpdateResult> {
        const serviceDefinition = this.serviceDefinitions.updateCustomerDefaultAddress;

        const query: GraphqlDatasourceQuery = this.getQuery(serviceDefinition.id, this.getQueryClass().customerDefaultAddressUpdate);

        const variables: ShopifyCustomerDefaultAddressUpdateInput = {
            customerAccessToken,
            addressId,
            addressFirst,
            addressAfter,
        };

        const result = await this.executeGQLService<{ customerDefaultAddressUpdate: ShopifyCustomerDefaultAddressUpdateResult }>(requestContext, serviceDefinition, variables, query);

        return result.customerDefaultAddressUpdate as T;
    }

    protected getQueryClass(): typeof ShopifyCustomerQuery {
        return ShopifyCustomerQuery;
    }
}
