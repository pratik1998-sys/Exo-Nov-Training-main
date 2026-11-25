import { RequestContext } from "@context/request";
import { CommercetoolsBaseDatasource, CommercetoolsBaseDatasourcePathParams, CommercetoolsBaseServiceDefinitions, CommercetoolsEntityActionRequest, CommercetoolsEntityQueryParams, CommercetoolsQueryParams, CommercetoolsServiceDefinition, CommercetoolsServiceDefinitions } from "@plugin-commercetools/common";
import { CommercetoolsCart, CommercetoolsCartCreateBody, CommercetoolsCreateOrderFromCartBody } from "./schema/commercetools.cart.schema";
import { CommercetoolsOrder } from "@plugin-commercetools/features/order";
import { CommercetoolsShippingMethodResultSet } from "@plugin-commercetools/features/quote";
import { HttpMethods } from "@plugin-datasource-rest";
import { StringUtility } from "@utilities";
import { CommercetoolsCartConsumerConfiguration } from "@plugin-commercetools/features/cart";

const CommercetoolsCartDatasourcePathParams = {
    ...CommercetoolsBaseDatasourcePathParams,
    cartId: '{cartId}',
};

export interface CommercetoolsCartServiceDefinitions extends CommercetoolsServiceDefinitions {
    getCartById: CommercetoolsServiceDefinition;
    getCartByKey: CommercetoolsServiceDefinition;
    getCartByCustomerId: CommercetoolsServiceDefinition;
    createCart: CommercetoolsServiceDefinition;
    deleteCartById: CommercetoolsServiceDefinition;
    deleteCartByKey: CommercetoolsServiceDefinition;
    updateCartById: CommercetoolsServiceDefinition;
    updateCartByKey: CommercetoolsServiceDefinition;
    getShippingMethods: CommercetoolsServiceDefinition;
    createOrder: CommercetoolsServiceDefinition;
}

export class CommercetoolsCartDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsCartServiceDefinitions = {
        getCartById: {
            id: 'getCartById',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 5000,
        },
        getCartByKey: {
            id: 'getCartByKey',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 5000,
        },
        getCartByCustomerId: {
            id: 'getCartByCustomerId',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts/customer-id=${CommercetoolsBaseDatasourcePathParams.customerId}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts/customer-id=${CommercetoolsBaseDatasourcePathParams.customerId}`,
            timeout: 5000,
        },
        createCart: {
            id: 'createCart',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts`,
            timeout: 5000,
        },
        deleteCartById: {
            id: 'deleteCartById',
            method: HttpMethods.delete,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 5000,
        },
        deleteCartByKey: {
            id: 'deleteCartByKey',
            method: HttpMethods.delete,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 5000,
        },
        updateCartById: {
            id: 'updateCartById',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 5000,
        },
        updateCartByKey: {
            id: 'updateCartByKey',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/carts/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/carts/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 5000,
        },
        getShippingMethods: {
            id: 'getShippingMethods',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shipping-methods/matching-cart?cartId=${CommercetoolsCartDatasourcePathParams.cartId}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key={storeKey}/shipping-methods/matching-cart?cartId=${CommercetoolsCartDatasourcePathParams.cartId}`,
            timeout: 5000,
        },
        queryShippingMethods: {
            id: 'queryShippingMethods',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shipping-methods`,
            timeout: 5000,
        },
        createOrder: {
            id: 'createOrder',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/orders`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/orders`,
            timeout: 5000,
        }
    };

    async getCart(requestContext: RequestContext, id: string, key: string, customerId: string, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsCart> {
        const methodname = `${CommercetoolsCartDatasource.name}.getCartById`;

        let dsResult: CommercetoolsCart = null;

        let serviceDefinition = this.serviceDefinitions.getCartByCustomerId;

        if (StringUtility.isStringNotEmpty(key)) {
            serviceDefinition = this.serviceDefinitions.getCartByKey;
        } else if (StringUtility.isStringNotEmpty(id)) {
            serviceDefinition = this.serviceDefinitions.getCartById;
        }

        const paramMap = {
            [CommercetoolsCartDatasourcePathParams.id]: id,
            [CommercetoolsCartDatasourcePathParams.key]: key,
            [CommercetoolsCartDatasourcePathParams.customerId]: customerId,
        };

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching cart [${id || key || customerId}] (${serviceDefinition.id}): ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async createCart(requestContext: RequestContext, body: CommercetoolsCartCreateBody, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsCart> {
        const methodname = `${CommercetoolsCartDatasource.name}.createCart`;

        let dsResult: CommercetoolsCart = null;

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.createCart, query, {}, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating cart - ${this.logger.formatJSON(body)}: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async deleteCart(requestContext: RequestContext, id: string, key: string, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsCart> {
        const methodname = `${CommercetoolsCartDatasource.name}.createCart`;

        let dsResult: CommercetoolsCart = null;

        let serviceDefinition = this.serviceDefinitions.deleteCartById;

        if (StringUtility.isStringNotEmpty(key)) {
            serviceDefinition = this.serviceDefinitions.deleteCartByKey;
        }

        const paramMap = {
            [CommercetoolsCartDatasourcePathParams.id]: id,
            [CommercetoolsCartDatasourcePathParams.key]: key,
        };

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting cart [${id || key}] (${serviceDefinition.id}): ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async updateCart(requestContext: RequestContext, id: string, key: string, body: CommercetoolsEntityActionRequest, query: CommercetoolsQueryParams): Promise<CommercetoolsCart> {
        const methodname = `${CommercetoolsCartDatasource.name}.updateCart`;

        let dsResult: CommercetoolsCart = null;

        let serviceDefinition = this.serviceDefinitions.updateCartById;

        if (StringUtility.isStringNotEmpty(key)) {
            serviceDefinition = this.serviceDefinitions.updateCartByKey;
        }

        const paramMap = {
            [CommercetoolsCartDatasourcePathParams.id]: id,
            [CommercetoolsCartDatasourcePathParams.key]: key,
        };

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, query, {}, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating cart [${id || key}] (${serviceDefinition.id}): ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async getShippingMethods(requestContext: RequestContext, id: string, query: CommercetoolsEntityQueryParams): Promise<CommercetoolsShippingMethodResultSet> {
        const methodname = `${CommercetoolsCartDatasource.name}.getShippingMethods`;

        let dsResult: CommercetoolsShippingMethodResultSet = null;

        const paramMap = {
            [CommercetoolsCartDatasourcePathParams.cartId]: id,
        };

        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsCartConsumerConfiguration>(requestContext);

        const { isShippingMethodsCartSpecific } = configuration;

        const serviceDefinition = isShippingMethodsCartSpecific ? this.serviceDefinitions.getShippingMethods : this.serviceDefinitions.queryShippingMethods;

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching shipping methods for cart ${id}: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async createOrderFromCart(requestContext: RequestContext, body: CommercetoolsCreateOrderFromCartBody, query?: CommercetoolsEntityQueryParams) {
        const methodname = `${CommercetoolsCartDatasource.name}.createOrderFromCart`;

        let dsOrder: CommercetoolsOrder;

        try {
            dsOrder = await this.execute(requestContext, this.serviceDefinitions.createOrder, query, {}, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating order from cart - ${this.logger.formatJSON(body)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return dsOrder;
    }
}
