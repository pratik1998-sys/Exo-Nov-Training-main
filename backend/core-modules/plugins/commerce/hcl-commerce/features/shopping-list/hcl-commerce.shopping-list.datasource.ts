import { RequestContext } from "@context/request";
import { HCLCommerceBaseDatasourcePathParams, HCLCommerceBaseRestDatasource, HCLCommerceDatasourceConfiguration } from "@plugin-hcl-commerce/common";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import {
    HCLCommerceWishlistCreateBody,
    HCLCommerceWishlistDeleteResponse,
    HCLCommerceWishlistGiftList,
    HCLCommerceWishlistListContainer,
    HCLCommerceWishlistQueryInput,
    HCLCommerceWishlistUpdateBody,
    HCLCommerceWishlistUpdateQueryInput,
    HCLCommerceWishlistWishListResponse,
    HCLCommerceWishlistWishListUpdateResponse,
} from "./schema/hcl-commerce.shopping-list.schema";

const HCLCommerceShoppingListPathParams = {
    ...HCLCommerceBaseDatasourcePathParams,
    externalId: "{externalId}",
};

export interface HCLCommerceShoppingListRestDefinitions extends RestDatasourceServiceDefinitions {
    findWishlistsSelf: RestDatasourceServiceDefinition;
    findWishlistDefault: RestDatasourceServiceDefinition;
    findWishlistByExternalId: RestDatasourceServiceDefinition;
    createWishlist: RestDatasourceServiceDefinition;
    updateWishlist: RestDatasourceServiceDefinition;
    deleteWishlist: RestDatasourceServiceDefinition;

    createDefaultWishlist: RestDatasourceServiceDefinition;
    getWishlist: RestDatasourceServiceDefinition;
}

/**
 * Storefront wishlist REST (`/wcs/resources/store/.../wishlist/...`).
 * @see https://help.hcl-software.com/commerce/9.1.0/restapi/code91/order-capture_transaction.html (wishlist tag)
 */
export class HCLCommerceShoppingListDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceShoppingListRestDefinitions = {
        findWishlistsSelf: {
            id: "findWishlistsSelf",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist/@self`,
            timeout: 15000,
            retryConfig: {
                maxAttempts: 3,
                ignoreStatuses: [401],
            },
        },
        findWishlistDefault: {
            id: "findWishlistDefault",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist/@default`,
            timeout: 15000,
            retryConfig: {
                maxAttempts: 3,
                ignoreStatuses: [401],
            },
        },
        findWishlistByExternalId: {
            id: "findWishlistByExternalId",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist/${HCLCommerceShoppingListPathParams.externalId}`,
            timeout: 15000,
            retryConfig: {
                maxAttempts: 3,
                ignoreStatuses: [401],
            },
        },
        createWishlist: {
            id: "createWishlist",
            method: HttpMethods.post,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist`,
            timeout: 15000,
        },
        updateWishlist: {
            id: "updateWishlist",
            method: HttpMethods.put,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist/${HCLCommerceShoppingListPathParams.externalId}`,
            timeout: 15000,
        },
        deleteWishlist: {
            id: "deleteWishlist",
            method: HttpMethods.delete,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist/${HCLCommerceShoppingListPathParams.externalId}`,
            timeout: 15000,
            retryConfig: {
                maxAttempts: 3,
                ignoreStatuses: [401],
            },
        },
        getWishlist: {
            id: "getWishlist",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist/${HCLCommerceShoppingListPathParams.externalId}`,
            timeout: 15000,
        },
        createDefaultWishlist: {
            id: "createDefaultWishlist",
            method: HttpMethods.post,
            path: `/store/${HCLCommerceShoppingListPathParams.storeId}/wishlist/@default`,
            timeout: 15000,
        },
    };

    async findWishlistsSelf(requestContext: RequestContext, query?: HCLCommerceWishlistQueryInput): Promise<HCLCommerceWishlistListContainer> {
        return await this.execute(requestContext, this.serviceDefinitions.findWishlistsSelf, query ?? {}, {}, {});
    }

    async findWishlistDefault(requestContext: RequestContext, query?: HCLCommerceWishlistQueryInput): Promise<HCLCommerceWishlistGiftList | HCLCommerceWishlistListContainer> {
        return await this.execute(requestContext, this.serviceDefinitions.findWishlistDefault, query ?? {}, {}, {});
    }

    async findWishlistByExternalId(
        requestContext: RequestContext,
        externalId: string,
        query?: HCLCommerceWishlistQueryInput,
    ): Promise<HCLCommerceWishlistGiftList | HCLCommerceWishlistListContainer> {
        const paramMap: Record<string, string> = {
            [HCLCommerceShoppingListPathParams.externalId]: externalId,
        };
        return await this.execute(requestContext, this.serviceDefinitions.findWishlistByExternalId, query ?? {}, {}, paramMap);
    }

    async createWishlist(requestContext: RequestContext, body: HCLCommerceWishlistCreateBody, query?: HCLCommerceWishlistQueryInput): Promise<HCLCommerceWishlistGiftList> {
        return await this.execute(requestContext, this.serviceDefinitions.createWishlist, query ?? {}, {}, {}, body);
    }

    async updateWishlist(
        requestContext: RequestContext,
        externalId: string,
        body: HCLCommerceWishlistUpdateBody,
        query?: HCLCommerceWishlistUpdateQueryInput,
    ): Promise<HCLCommerceWishlistWishListUpdateResponse> {
        const paramMap: Record<string, string> = {
            [HCLCommerceShoppingListPathParams.externalId]: externalId,
        };
        return await this.execute(requestContext, this.serviceDefinitions.updateWishlist, query ?? {}, {}, paramMap, body);
    }

    async deleteWishlist(
        requestContext: RequestContext,
        externalId: string,
        query?: HCLCommerceWishlistQueryInput,
    ): Promise<HCLCommerceWishlistDeleteResponse> {
        const paramMap: Record<string, string> = {
            [HCLCommerceShoppingListPathParams.externalId]: externalId,
        };
        return await this.execute(requestContext, this.serviceDefinitions.deleteWishlist, query ?? {}, {}, paramMap);
    }

    async getWishlist(requestContext: RequestContext, externalId: string, query?: HCLCommerceWishlistQueryInput): Promise<HCLCommerceWishlistListContainer> {
        const paramMap: Record<string, string> = {
            [HCLCommerceShoppingListPathParams.externalId]: externalId,
        };

        return await this.execute(requestContext, this.serviceDefinitions.getWishlist, query ?? {}, {}, paramMap);
    }

    async createDefaultWishlist(requestContext: RequestContext, body: HCLCommerceWishlistCreateBody, query?: HCLCommerceWishlistQueryInput): Promise<HCLCommerceWishlistGiftList> {
        return await this.execute(requestContext, this.serviceDefinitions.createDefaultWishlist, query ?? {}, {}, {}, body);
    }
}
