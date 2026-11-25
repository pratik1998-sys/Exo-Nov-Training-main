import { RequestContext } from "@context/request";
import { RestDatasourceServiceDefinitions, HttpMethods, RestDatasourceServiceDefinition } from "@plugin-datasource-rest";
import { SAPCommerceBaseDatasource, SAPCommerceBaseDatasourcePathParams } from "@plugin-sap-commerce/common";

export const SAPCommerceOrderDatasourcePathParams = {
    ...SAPCommerceBaseDatasourcePathParams,
    cartId: '{cartId}',
    code: '{code}',
};

export const orderBasePath = `/occ/v2/${SAPCommerceOrderDatasourcePathParams.baseSiteId}/users/${SAPCommerceOrderDatasourcePathParams.userId}/orders`;
export const b2bOrderBasePath = `/occ/v2/${SAPCommerceOrderDatasourcePathParams.baseSiteId}/orgUsers/${SAPCommerceOrderDatasourcePathParams.userId}/orders`;

export interface SAPCommerceOrderServiceDefinitions extends RestDatasourceServiceDefinitions {
    createOrder: RestDatasourceServiceDefinition;
    createB2BOrder: RestDatasourceServiceDefinition;
    getOrders: RestDatasourceServiceDefinition;
    getOrder: RestDatasourceServiceDefinition;
    getB2BOrders: RestDatasourceServiceDefinition;
    getB2BOrder: RestDatasourceServiceDefinition;
}

export class SAPCommerceOrderDatasource extends SAPCommerceBaseDatasource {
    protected serviceDefinitions: SAPCommerceOrderServiceDefinitions = {
        createOrder: {
            id: 'createOrder',
            method: HttpMethods.post,
            path: orderBasePath,
            timeout: 5000,
        },
        createB2BOrder: {
            id: 'createB2BOrder',
            method: HttpMethods.post,
            path: b2bOrderBasePath,
            timeout: 5000,
        },
        getOrders: {
            id: 'getOrders',
            method: HttpMethods.get,
            path: orderBasePath,
            timeout: 5000,
        },
        getOrder: {
            id: 'getOrder',
            method: HttpMethods.get,
            path: `${orderBasePath}/${SAPCommerceOrderDatasourcePathParams.code}`,
            timeout: 5000,
        },
        getB2BOrders: {
            id: 'getB2BOrders',
            method: HttpMethods.get,
            path: b2bOrderBasePath,
            timeout: 5000,
        },
        getB2BOrder: {
            id: 'getB2BOrder',
            method: HttpMethods.get,
            path: `${b2bOrderBasePath}/${SAPCommerceOrderDatasourcePathParams.code}`,
            timeout: 5000,
        },
    };

    async createOrder(requestContext: RequestContext, cartId: string) {
        const methodname: string = `${SAPCommerceOrderDatasource.name}.createOrder`;

        const queryParams = {
            cartId,
        };

        return await this.executeOrderService(requestContext, null, this.serviceDefinitions.createOrder, queryParams);
    }

    async createB2BOrder(requestContext: RequestContext, cartId: string, termsChecked: boolean) {
        const methodname: string = `${SAPCommerceOrderDatasource.name}.createB2BOrder`;

        const queryParams = {
            cartId,
            termsChecked,
        };

        return await this.executeOrderService(requestContext, null, this.serviceDefinitions.createB2BOrder, queryParams);
    }

    async getOrders(requestContext: RequestContext, query: Record<string, any>) {
        const methodname: string = `${SAPCommerceOrderDatasource.name}.getOrders`;

        return await this.executeOrderService(requestContext, null, this.serviceDefinitions.getOrders);
    }

    async getB2BOrders(requestContext: RequestContext, query: Record<string, any>) {
        const methodname: string = `${SAPCommerceOrderDatasource.name}.getB2BOrders`;

        return await this.executeOrderService(requestContext, null, this.serviceDefinitions.getB2BOrders);
    }

    async getOrder(requestContext: RequestContext, id: string) {
        const methodname: string = `${SAPCommerceOrderDatasource.name}.getOrder`;

        const paramMap = {
            [SAPCommerceOrderDatasourcePathParams.code]: id,
        };

        return await this.executeOrderService(requestContext, null, this.serviceDefinitions.getOrder, {}, {}, paramMap);
    }

    async getB2BOrder(requestContext: RequestContext, id: string) {
        const methodname: string = `${SAPCommerceOrderDatasource.name}.getB2BOrder`;

        const paramMap = {
            [SAPCommerceOrderDatasourcePathParams.code]: id,
        };

        return await this.executeOrderService(requestContext, null, this.serviceDefinitions.getB2BOrder, {}, {}, paramMap);
    }

    protected async executeOrderService(
        requestContext: RequestContext,
        cartId: string,
        serviceDefinition: RestDatasourceServiceDefinition,
        queryParams?: Record<string, any>,
        headers?: Record<string, string>,
        paramMap?: Record<string, string>,
        body?: Record<string, any>,
    ) {
        const methodname = `${SAPCommerceOrderDatasource.name}.executeOrderService`;

        paramMap = paramMap ?? {};

        let result;

        try {
            result = await this.execute(requestContext, serviceDefinition, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(
                `${methodname} - Error Executing [${serviceDefinition.id}] - (${this.logger.formatJSON(paramMap)}) ${body ? `- Body (${this.logger.formatJSON(body)})` : ``}: ${error}`,
                requestContext,
            );
            throw error;
        }

        return result;
    }

    protected composeQueryParams(requestContext: RequestContext, dataSourceConfig: any, queryParams: any) {
        queryParams = super.composeQueryParams(requestContext, dataSourceConfig, queryParams);

        queryParams.fields = 'FULL';

        return queryParams;
    }
}
