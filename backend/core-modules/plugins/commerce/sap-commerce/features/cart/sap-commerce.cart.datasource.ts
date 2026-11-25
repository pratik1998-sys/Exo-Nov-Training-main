import { RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions, HttpMethods } from "@plugin-datasource-rest";
import {
    components,
    CreateCartEn,
    CreateUser,
    GetCart,
    GetCartEntries,
    GetUser,
    RemoveCart,
    SAPCommerceCart,
    SAPCommerceDeliveryMode,
    SAPCommerceDeliveryModes,
    UpdateCartEn,
} from './schema/sap-commerce.cart.schema';
import { SAPCommerceBaseDatasource, SAPCommerceBaseDatasourcePathParams } from "@plugin-sap-commerce/common";
import { RequestContext } from "@context/request";

export const SAPCommerceCartDatasourcePathParams = {
    ...SAPCommerceBaseDatasourcePathParams,
    cartId: '{cartId}',
    entryNumber: '{entryNumber}',
    promotionId: '{promotionId}',
};

export interface SAPCommerceCartServiceDefinitions extends RestDatasourceServiceDefinitions {
    createCart: RestDatasourceServiceDefinition;
    getCart: RestDatasourceServiceDefinition;
    deleteCart: RestDatasourceServiceDefinition;
    addCartItem: RestDatasourceServiceDefinition;
    updateCartItem: RestDatasourceServiceDefinition;
    deleteCartItem: RestDatasourceServiceDefinition;
    updateCartEmail: RestDatasourceServiceDefinition;
    updateCartCostCenter: RestDatasourceServiceDefinition;
    updateCartPaymentType: RestDatasourceServiceDefinition;
    getDeliveryModes: RestDatasourceServiceDefinition;
    getDeliveryMode: RestDatasourceServiceDefinition;
    updateDeliveryMode: RestDatasourceServiceDefinition;
    deleteDeliveryMode: RestDatasourceServiceDefinition;
    updateDeliveryAddress: RestDatasourceServiceDefinition;
    createDeliveryAddress: RestDatasourceServiceDefinition;
    deleteDeliveryAddress: RestDatasourceServiceDefinition;
    addPromotion: RestDatasourceServiceDefinition;
    deletePromotion: RestDatasourceServiceDefinition;
    validateCart: RestDatasourceServiceDefinition;
};

export const cartBasePath = `/occ/v2/${SAPCommerceCartDatasourcePathParams.baseSiteId}/users/${SAPCommerceCartDatasourcePathParams.userId}/carts`;
export const cartByIdBasePath = `${cartBasePath}/${SAPCommerceCartDatasourcePathParams.cartId}`;
export const cartEntriesBasePath = `${cartByIdBasePath}/entries`;
export const cartEntryBasePath = `${cartEntriesBasePath}/${SAPCommerceCartDatasourcePathParams.entryNumber}`;
export const cartDeliveryModeBasePath = `${cartByIdBasePath}/deliverymode`;
export const cartDeliveryAddressBasePath = `${cartByIdBasePath}/addresses/delivery`;
export const cartPromotionPath = `${cartByIdBasePath}/promotions/${SAPCommerceCartDatasourcePathParams.promotionId}`;

export class SAPCommerceCartDatasource extends SAPCommerceBaseDatasource {
    protected serviceDefinitions: SAPCommerceCartServiceDefinitions = {
        createCart: {
            id: 'createCart',
            method: HttpMethods.post,
            path: cartBasePath,
            timeout: 5000,
        },
        getCart: {
            id: 'getCart',
            method: HttpMethods.get,
            path: cartByIdBasePath,
            timeout: 5000,
        },
        deleteCart: {
            id: 'deleteCart',
            method: HttpMethods.delete,
            path: cartByIdBasePath,
            timeout: 5000,
        },
        addCartItem: {
            id: 'addCartItem',
            method: HttpMethods.post,
            path: cartEntriesBasePath,
            timeout: 5000,
        },
        updateCartItem: {
            id: 'updateCartItem',
            method: HttpMethods.put,
            path: cartEntryBasePath,
            timeout: 5000,
        },
        deleteCartItem: {
            id: 'deleteCartItem',
            method: HttpMethods.delete,
            path: cartEntryBasePath,
            timeout: 5000,
        },
        updateCartEmail: {
            id: 'updateCartEmail',
            method: HttpMethods.put,
            path: `${cartByIdBasePath}/email`,
            timeout: 5000,
        },
        updateCartCostCenter: {
            id: 'updateCartCostCenter',
            method: HttpMethods.put,
            path: `${cartByIdBasePath}/costcenter`,
            timeout: 5000,
        },
        updateCartPaymentType: {
            id: 'updateCartPaymentType',
            method: HttpMethods.put,
            path: `${cartByIdBasePath}/paymenttype`,
            timeout: 5000,
        },
        getDeliveryModes: {
            id: 'getDeliveryModes',
            method: HttpMethods.get,
            path: `${cartByIdBasePath}/deliverymodes`,
            timeout: 5000,
        },
        getDeliveryMode: {
            id: 'getDeliveryMode',
            method: HttpMethods.get,
            path: `${cartDeliveryModeBasePath}`,
            timeout: 5000,
        },
        updateDeliveryMode: {
            id: 'updateDeliveryMode',
            method: HttpMethods.put,
            path: `${cartDeliveryModeBasePath}`,
            timeout: 5000,
        },
        deleteDeliveryMode: {
            id: 'deleteDeliveryMode',
            method: HttpMethods.delete,
            path: `${cartDeliveryModeBasePath}`,
            timeout: 5000,
        },
        createDeliveryAddress: {
            id: 'createDeliveryAddress',
            method: HttpMethods.post,
            path: cartDeliveryAddressBasePath,
            timeout: 5000,
        },
        updateDeliveryAddress: {
            id: 'updateDeliveryAddress',
            method: HttpMethods.put,
            path: cartDeliveryAddressBasePath,
            timeout: 5000,
        },
        deleteDeliveryAddress: {
            id: 'deleteDeliveryAddress',
            method: HttpMethods.delete,
            path: cartDeliveryAddressBasePath,
            timeout: 5000,
        },
        addPromotion: {
            id: 'addPromotion',
            method: HttpMethods.post,
            path: cartPromotionPath,
            timeout: 5000,
        },
        deletePromotion: {
            id: 'deletePromotion',
            method: HttpMethods.delete,
            path: cartPromotionPath,
            timeout: 5000,
        },
        validateCart: {
            id: 'validateCart',
            method: HttpMethods.post,
            path: `${cartByIdBasePath}/validate`,
            timeout: 5000,
        },
    };

    async createCart(requestContext: RequestContext, fromCartId?: string, toCartId?: string): Promise<SAPCommerceCart> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.createCart`;

        const queryParams = {
            oldCartId: fromCartId,
            toMergeCartGuid: toCartId,
        };

        return await this.executeCartService(requestContext, null, this.serviceDefinitions.createCart, queryParams);
    }

    async getCart(requestContext: RequestContext, cartId: string): Promise<GetCart.Response._200> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.getCart`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.getCart);
    }

    async deleteCart(requestContext: RequestContext, cartId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.deleteCart`;

        await this.executeCartService(requestContext, cartId, this.serviceDefinitions.deleteCart);
    }

    async addCartItem(requestContext: RequestContext, cartId: string, body: CreateCartEn.Body): Promise<CreateCartEn.Response._200> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.addCartItem`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.addCartItem, {}, {}, {}, body);
    }

    async updateCartItem(requestContext: RequestContext, cartId: string, cartItemId: string, body: UpdateCartEn.Body): Promise<UpdateCartEn.Response._200> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.updateCartItem`;

        const paramMap = {
            [SAPCommerceCartDatasourcePathParams.entryNumber]: cartItemId,
        };

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.updateCartItem, {}, {}, paramMap, body);
    }

    async deleteCartItem(requestContext: RequestContext, cartId: string, cartItemId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.deleteCartItem`;

        const paramMap = {
            [SAPCommerceCartDatasourcePathParams.entryNumber]: cartItemId,
        };

        await this.executeCartService(requestContext, cartId, this.serviceDefinitions.deleteCartItem, {}, {}, paramMap);
    }

    async updateCartEmail(requestContext: RequestContext, cartId: string, email: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.updateCartEmail`;

        const queryParams = {
            email,
        };

        await this.executeCartService(requestContext, cartId, this.serviceDefinitions.updateCartEmail, queryParams);
    }

    async updateCartCostCenter(requestContext: RequestContext, cartId: string, costCenterId: string): Promise<SAPCommerceCart> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.updateCartCostCenter`;

        const queryParams = {
            costCenterId,
        };

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.updateCartCostCenter, queryParams);
    }

    async updateCartPaymentType(requestContext: RequestContext, cartId: string, paymentType: string, purchaseOrderNumber?: string): Promise<SAPCommerceCart> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.updateCartPaymentType`;

        const queryParams = {
            paymentType,
            purchaseOrderNumber,
        };

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.updateCartPaymentType, queryParams);
    }

    async getDeliveryModes(requestContext: RequestContext, cartId: string): Promise<SAPCommerceDeliveryModes> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.getDeliveryModes`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.getDeliveryModes);
    }

    async getDeliveryMode(requestContext: RequestContext, cartId: string): Promise<SAPCommerceDeliveryMode> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.getDeliveryMode`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.getDeliveryMode);
    }

    async updateDeliveryMode(requestContext: RequestContext, cartId: string, deliveryModeId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.updateDeliveryMode`;

        const queryParams = {
            deliveryModeId,
        };

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.updateDeliveryMode, queryParams);
    }

    async deleteDeliveryMode(requestContext: RequestContext, cartId: string): Promise<SAPCommerceCart> {
        const methodname: string = `${SAPCommerceCartDatasource.name}.deleteDeliveryMode`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.deleteDeliveryMode);
    }

    async createDeliveryAddress(requestContext: RequestContext, cartId: string, body: any) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.createDeliveryAddress`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.createDeliveryAddress, {}, {}, {}, body);
    }

    async updateDeliveryAddress(requestContext: RequestContext, cartId: string, addressId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.updateDeliveryAddress`;

        const queryParams = {
            addressId,
        };

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.updateDeliveryAddress, queryParams);
    }

    async deleteDeliveryAddress(requestContext: RequestContext, cartId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.deleteDeliveryMode`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.deleteDeliveryAddress);
    }

    async addPromotion(requestContext: RequestContext, cartId: string, promotionId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.addPromotion`;

        const queryParams = {
            promotionId,
        };

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.addPromotion, queryParams);
    }

    async deletePromotion(requestContext: RequestContext, cartId: string, promotionId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.deletePromotion`;

        const pathParams = {
            [SAPCommerceCartDatasourcePathParams.promotionId]: promotionId,
        };

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.deletePromotion, {}, {}, pathParams);
    }

    async validateCart(requestContext: RequestContext, cartId: string) {
        const methodname: string = `${SAPCommerceCartDatasource.name}.validateCart`;

        return await this.executeCartService(requestContext, cartId, this.serviceDefinitions.validateCart);
    }

    protected async executeCartService(
        requestContext: RequestContext,
        cartId: string,
        serviceDefinition: RestDatasourceServiceDefinition,
        queryParams?: Record<string, any>,
        headers?: Record<string, string>,
        paramMap?: Record<string, string>,
        body?: Record<string, any>,
    ) {
        const methodname = `${SAPCommerceCartDatasource.name}.executeCartService`;

        paramMap = paramMap ?? {};

        paramMap[SAPCommerceCartDatasourcePathParams.cartId] = cartId;

        let result;

        try {
            result = await this.execute(requestContext, serviceDefinition, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(
                `${methodname} - Error Executing [${serviceDefinition.id}] for cart [${cartId}] - (${this.logger.formatJSON(paramMap)}) ${body ? `- Body (${this.logger.formatJSON(body)})` : ``}: ${error}`,
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
