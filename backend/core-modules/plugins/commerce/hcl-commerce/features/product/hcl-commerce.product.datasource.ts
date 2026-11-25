import { RequestContext } from "@context/request";
import { HCLCommerceBaseDatasourcePathParams, HCLCommerceBaseRestDatasource, HCLCommerceDatasourceConfiguration } from "@plugin-hcl-commerce/common";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { HCLCommerceProductFilter } from "./schema/hcl-commerce.product.filter";
import {
    HCLCommerceInventoryAvailabilityByPartNumberQueryInput,
    HCLCommerceInventoryAvailabilityByProductIdQueryInput,
    HCLCommerceInventoryAvailabilityRestResponse,
    HCLCommercePriceRestQueryInput,
    HCLCommercePriceRestResponse,
    HCLCommerceProductRestByCategoryQueryInput,
    HCLCommerceProductRestByIdQueryInput,
    HCLCommerceProductRestByIdsQueryInput,
    HCLCommerceProductRestByPartNumbersQueryInput,
    HCLCommerceProductRestByPartNumberPathQueryInput,
    HCLCommerceProductRestBySearchTermQueryInput,
    HCLCommerceProductRestCommonQueryInput,
    HCLCommerceProductRestResponse,
    HCLCommercePriceRestQueryName,
} from "./schema/hcl-commerce.product.schema";

/**
 * Path param placeholders for HCL ProductView REST (`/search/resources/store/.../productview/...`).
 * Resolved datasource id: `product.rest.datasource` (distinct from GraphQL `product.datasource`).
 */
const HCLCommerceProductRestPathParams = {
    ...HCLCommerceBaseDatasourcePathParams,
    productId: "{productId}",
    categoryId: "{categoryId}",
    searchTerm: "{searchTerm}",
    partNumber: "{partNumber}",
    /** Inventory: catalog entry id segment (`{productIds}`), comma-separated when multiple. */
    inventoryProductIds: "{productIds}",
    /** Inventory: part number segment under `byPartNumber/{partNumbers}` */
    inventoryPartNumbers: "{partNumbers}",
};

export interface HCLCommerceProductRestServiceDefinitions extends RestDatasourceServiceDefinitions {
    findProductById: RestDatasourceServiceDefinition;
    findProductsByIds: RestDatasourceServiceDefinition;
    findProductByPartnumberPath: RestDatasourceServiceDefinition;
    findProductsByPartNumbers: RestDatasourceServiceDefinition;
    findBySearchTerm: RestDatasourceServiceDefinition;
    findByCategory: RestDatasourceServiceDefinition;
    /** Transaction REST `GET store/{storeId}/price` (PriceHandler); uses `host`, not `searchHost`. */
    getPrice: RestDatasourceServiceDefinition;
    /** Transaction REST `GET store/{storeId}/inventoryavailability/{productIds}` (InventoryHandler). */
    getInventoryAvailabilityByProductIds: RestDatasourceServiceDefinition;
    /** Transaction REST `GET store/{storeId}/inventoryavailability/byPartNumber/{partNumbers}` (InventoryHandler). */
    getInventoryAvailabilityByPartNumbers: RestDatasourceServiceDefinition;
}

export class HCLCommerceProductRestDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceProductRestServiceDefinitions = {
        findProductById: {
            id: "findProductById",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/productview/byId/${HCLCommerceProductRestPathParams.productId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findProductsByIds: {
            id: "findProductsByIds",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/productview/byIds`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findProductByPartnumberPath: {
            id: "findProductByPartnumberPath",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/productview/${HCLCommerceProductRestPathParams.partNumber}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findProductsByPartNumbers: {
            id: "findProductsByPartNumbers",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/productview/byPartNumbers`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findBySearchTerm: {
            id: "findBySearchTerm",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/productview/bySearchTerm/${HCLCommerceProductRestPathParams.searchTerm}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findByCategory: {
            id: "findByCategory",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/productview/byCategory/${HCLCommerceProductRestPathParams.categoryId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getPrice: {
            id: "getPrice",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/price`,
            timeout: 15000,
            retryConfig: {
                maxAttempts: 3,
                ignoreStatuses: [401],
            },
        },
        getInventoryAvailabilityByProductIds: {
            id: "getInventoryAvailabilityByProductIds",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/inventoryavailability/${HCLCommerceProductRestPathParams.inventoryProductIds}`,
            timeout: 15000,
            retryConfig: {
                maxAttempts: 3,
                ignoreStatuses: [401],
            },
        },
        getInventoryAvailabilityByPartNumbers: {
            id: "getInventoryAvailabilityByPartNumbers",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceProductRestPathParams.storeId}/inventoryavailability/byPartNumber/${HCLCommerceProductRestPathParams.inventoryPartNumbers}`,
            timeout: 15000,
            retryConfig: {
                maxAttempts: 3,
                ignoreStatuses: [401],
            },
        },
    };

    async findProductById(
        requestContext: RequestContext,
        productId: string,
        limit?: number,
        offset?: number,
        query?: HCLCommerceProductRestByIdQueryInput,
    ): Promise<HCLCommerceProductRestResponse> {
        const paramMap: Record<string, string> = {
            [HCLCommerceProductRestPathParams.productId]: encodeURIComponent(productId),
        };
        const queryParams: HCLCommerceProductRestByIdQueryInput = {
            ...this.toPageQuery(limit, offset),
            ...query,
        };
        return await this.execute(requestContext, this.serviceDefinitions.findProductById, queryParams, {}, paramMap);
    }

    async findProductsByIds(
        requestContext: RequestContext,
        ids: string[],
        limit?: number,
        offset?: number,
        query?: Omit<HCLCommerceProductRestByIdsQueryInput, "id">,
    ): Promise<HCLCommerceProductRestResponse> {
        const queryParams: HCLCommerceProductRestByIdsQueryInput = {
            ...this.toPageQuery(limit, offset),
            ...query,
            id: ids,
        };
        return await this.execute(requestContext, this.serviceDefinitions.findProductsByIds, queryParams, {}, {});
    }

    async findProductByPartnumber(
        requestContext: RequestContext,
        partNumber: string,
        limit?: number,
        offset?: number,
        query?: HCLCommerceProductRestByPartNumberPathQueryInput,
    ): Promise<HCLCommerceProductRestResponse> {
        const paramMap: Record<string, string> = {
            [HCLCommerceProductRestPathParams.partNumber]: encodeURIComponent(partNumber),
        };
        const queryParams: HCLCommerceProductRestByPartNumberPathQueryInput = {
            ...this.toPageQuery(limit, offset),
            ...query,
        };
        return await this.execute(requestContext, this.serviceDefinitions.findProductByPartnumberPath, queryParams, {}, paramMap);
    }

    async findProductsByPartnumbers(
        requestContext: RequestContext,
        partNumbers: string[],
        limit?: number,
        offset?: number,
        query?: Omit<HCLCommerceProductRestByPartNumbersQueryInput, "partNumber">,
    ): Promise<HCLCommerceProductRestResponse> {
        const queryParams: HCLCommerceProductRestByPartNumbersQueryInput = {
            ...this.toPageQuery(limit, offset),
            ...query,
            partNumber: partNumbers,
        };
        return await this.execute(requestContext, this.serviceDefinitions.findProductsByPartNumbers, queryParams, {}, {});
    }

    async findBySearchTerm(
        requestContext: RequestContext,
        searchTerm: string,
        query?: HCLCommerceProductRestBySearchTermQueryInput,
    ): Promise<HCLCommerceProductRestResponse> {
        const paramMap: Record<string, string> = {
            [HCLCommerceProductRestPathParams.searchTerm]: encodeURIComponent(searchTerm),
        };
        return await this.execute(requestContext, this.serviceDefinitions.findBySearchTerm, query ?? {}, {}, paramMap);
    }

    async findByCategory(
        requestContext: RequestContext,
        categoryId: string,
        query?: HCLCommerceProductRestByCategoryQueryInput,
    ): Promise<HCLCommerceProductRestResponse> {
        const paramMap: Record<string, string> = {
            [HCLCommerceProductRestPathParams.categoryId]: encodeURIComponent(categoryId),
        };
        return await this.execute(requestContext, this.serviceDefinitions.findByCategory, query ?? {}, {}, paramMap);
    }

    /**
     * `GET .../wcs/resources/store/{storeId}/price` — entitled and range prices via `q` (e.g. `byCatalogEntryIds`, `byPartNumbers`).
     * @see https://help.hcl-software.com/commerce/9.1.0/restapi/code91/price_transaction.html
     */
    async getPrice(requestContext: RequestContext, query: HCLCommercePriceRestQueryInput): Promise<HCLCommercePriceRestResponse> {
        return await this.execute(requestContext, this.serviceDefinitions.getPrice, query, {}, {}) as HCLCommercePriceRestResponse;
    }

    async getPriceByCatentryIds(
        requestContext: RequestContext,
        catentryIds: string[],
        query?: Omit<HCLCommercePriceRestQueryInput, "q" | "catalogEntryId">,
    ): Promise<HCLCommercePriceRestResponse> {

        const priceQuery: HCLCommercePriceRestQueryInput = {
            q: HCLCommercePriceRestQueryName.byCatalogEntryIds,
            catalogEntryId: catentryIds,
            ...query

        };

        return await this.getPrice(requestContext, priceQuery);
    }

    /** Shorthand for `getPrice` with `q=byPartNumbers` and repeated `partNumber` query params. */
    async getPriceByPartnumbers(
        requestContext: RequestContext,
        partNumbers: string[],
        query?: Omit<HCLCommercePriceRestQueryInput, "q" | "partNumber">,
    ): Promise<HCLCommercePriceRestResponse> {

        const priceQuery: HCLCommercePriceRestQueryInput = {
            q: HCLCommercePriceRestQueryName.byPartNumbers,
            partNumber: partNumbers,
            ...query,

        };

        return await this.getPrice(requestContext, priceQuery);
    }

    /**
     * `GET .../wcs/resources/store/{storeId}/inventoryavailability/{productIds}` — availability by catalog entry id(s).
     * Multiple IDs are comma-separated in the path segment per InventoryHandler.
     *
     * @see https://help.hcl-software.com/commerce/9.1.0/api/com/ibm/commerce/rest/inventory/handler/InventoryHandler.html#getInventoryAvailabilityByProductId-java.lang.String-java.lang.String-java.lang.String-java.lang.String-java.lang.String-
     * @see https://help.hcl-software.com/commerce/9.1.0/restapi/code91/order-capture_transaction.html
     */
    async getInventoryAvailabilityByProductIds(
        requestContext: RequestContext,
        productIds: string[],
        query?: HCLCommerceInventoryAvailabilityByProductIdQueryInput,
    ): Promise<HCLCommerceInventoryAvailabilityRestResponse> {
        const segment = productIds.map((id) => encodeURIComponent(id)).join(",");
        const paramMap: Record<string, string> = {
            [HCLCommerceProductRestPathParams.inventoryProductIds]: segment,
        };
        return (await this.execute(
            requestContext,
            this.serviceDefinitions.getInventoryAvailabilityByProductIds,
            query ?? {},
            {},
            paramMap,
        )) as HCLCommerceInventoryAvailabilityRestResponse;
    }

    /**
     * `GET .../inventoryavailability/byPartNumber/{partNumbers}` — availability by part number(s), comma-separated in path.
     *
     * @see https://help.hcl-software.com/commerce/9.1.0/api/com/ibm/commerce/rest/inventory/handler/InventoryHandler.html#getInventoryAvailabilityByPartNumber-java.lang.String-java.lang.String-java.lang.String-java.lang.String-java.lang.String-
     */
    async getInventoryAvailabilityByPartNumbers(
        requestContext: RequestContext,
        partNumbers: string[],
        query?: HCLCommerceInventoryAvailabilityByPartNumberQueryInput,
    ): Promise<HCLCommerceInventoryAvailabilityRestResponse> {
        const segment = partNumbers.map((pn) => encodeURIComponent(pn)).join(",");
        const paramMap: Record<string, string> = {
            [HCLCommerceProductRestPathParams.inventoryPartNumbers]: segment,
        };
        return (await this.execute(
            requestContext,
            this.serviceDefinitions.getInventoryAvailabilityByPartNumbers,
            query ?? {},
            {},
            paramMap,
        )) as HCLCommerceInventoryAvailabilityRestResponse;
    }

    /**
     * Routes to ProductView endpoints by filter. Combined filters use REST-friendly precedence:
     * `searchTerm` → `byCategory` → `byIds` → `byPartNumbers`. (GraphQL unified query can express more overlap.)
     */
    async findProducts(requestContext: RequestContext, filter: HCLCommerceProductFilter): Promise<HCLCommerceProductRestResponse> {
        const { categoryId, searchTerm, ids = [], partnumbers = [], limit, offset, facets } = filter ?? {};
        const pageQuery = this.toPageQuery(limit, offset);

        let result: HCLCommerceProductRestResponse = {
            catalogEntryView: [],
            recordSetTotal: 0,
            recordSetCount: 0,
        };

        if (searchTerm) {
            result = await this.findBySearchTerm(requestContext, searchTerm, {
                ...pageQuery,
                facet: facets,
            } as HCLCommerceProductRestBySearchTermQueryInput);
        } else if (categoryId) {
            result = await this.findByCategory(requestContext, categoryId, {
                ...pageQuery,
                facet: facets,
            } as HCLCommerceProductRestByCategoryQueryInput);
        } else if (ids.length > 0) {
            result = await this.findProductsByIds(requestContext, ids, limit, offset);
        } else if (partnumbers.length > 0) {
            result = await this.findProductsByPartnumbers(requestContext, partnumbers, limit, offset);
        }

        return result;
    }

    protected getHost(requestContext: RequestContext, datasourceConfig: HCLCommerceDatasourceConfiguration, serviceDefinition: RestDatasourceServiceDefinition) {
        if (
            serviceDefinition.id === "getPrice" ||
            serviceDefinition.id === "getInventoryAvailabilityByProductIds" ||
            serviceDefinition.id === "getInventoryAvailabilityByPartNumbers"
        ) {
            return datasourceConfig.host;
        }
        return datasourceConfig.searchHost;
    }

    protected toPageQuery(limit?: number, offset?: number): HCLCommerceProductRestCommonQueryInput {
        if (limit == null && offset == null) {
            return {};
        }
        const pageSize = limit ?? 20;
        const pageNumber = offset != null && pageSize > 0 ? Math.floor(Number(offset) / Number(pageSize)) + 1 : 1;
        return { pageSize, pageNumber };
    }
}
