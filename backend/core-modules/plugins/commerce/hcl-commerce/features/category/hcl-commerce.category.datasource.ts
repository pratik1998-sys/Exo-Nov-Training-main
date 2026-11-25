import { RequestContext } from "@context/request";
import { HCLCommerceBaseDatasourcePathParams, HCLCommerceBaseRestDatasource, HCLCommerceDatasourceConfiguration } from "@plugin-hcl-commerce/common";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import {
    HCLCommerceCategoryViewByIdentifierQueryInput,
    HCLCommerceCategoryViewByIdsQueryInput,
    HCLCommerceCategoryViewResponse,
    HCLCommerceCategoryViewTopQueryInput,
} from "./schema/hcl-commerce.category.schema";

const HCLCommerceCategoryDatasourcePathParams = {
    ...HCLCommerceBaseDatasourcePathParams,
    categoryIdentifier: "{categoryIdentifier}",
};

export interface HCLCommerceCategoryRestServiceDefinitions extends RestDatasourceServiceDefinitions {
    findTopCategories: RestDatasourceServiceDefinition;
    findCategoryByIdentifier: RestDatasourceServiceDefinition;
    findCategoriesByIds: RestDatasourceServiceDefinition;
}

/**
 * REST CategoryView handler: `/search/resources/store/{storeId}/categoryview/...`
 */
export class HCLCommerceCategoryDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceCategoryRestServiceDefinitions = {
        findTopCategories: {
            id: "findTopCategories",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceCategoryDatasourcePathParams.storeId}/categoryview/@top`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findCategoryByIdentifier: {
            id: "findCategoryByIdentifier",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceCategoryDatasourcePathParams.storeId}/categoryview/${HCLCommerceCategoryDatasourcePathParams.categoryIdentifier}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findCategoriesByIds: {
            id: "findCategoriesByIds",
            method: HttpMethods.get,
            path: `/store/${HCLCommerceCategoryDatasourcePathParams.storeId}/categoryview/byIds`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async findTopCategories(requestContext: RequestContext, query?: HCLCommerceCategoryViewTopQueryInput): Promise<HCLCommerceCategoryViewResponse> {
        const methodname = `${HCLCommerceCategoryDatasource.name}.findTopCategories`;

        try {
            return await this.execute(requestContext, this.serviceDefinitions.findTopCategories, query ?? {}, {}, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }
    }

    async findCategoryByIdentifier(
        requestContext: RequestContext,
        identifier: string,
        query?: HCLCommerceCategoryViewByIdentifierQueryInput,
    ): Promise<HCLCommerceCategoryViewResponse> {
        const methodname = `${HCLCommerceCategoryDatasource.name}.findCategoryByIdentifier`;

        const paramMap: Record<string, string> = {
            [HCLCommerceCategoryDatasourcePathParams.categoryIdentifier]: encodeURIComponent(identifier),
        };

        try {
            return await this.execute(requestContext, this.serviceDefinitions.findCategoryByIdentifier, query ?? {}, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error for identifier ${identifier}: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }
    }

    async findCategoriesByIds(requestContext: RequestContext, ids: string[], query?: Omit<HCLCommerceCategoryViewByIdsQueryInput, "id">): Promise<HCLCommerceCategoryViewResponse> {
        const methodname = `${HCLCommerceCategoryDatasource.name}.findCategoriesByIds`;

        const queryParams: HCLCommerceCategoryViewByIdsQueryInput = {
            ...query,
            id: ids,
        };

        try {
            return await this.execute(requestContext, this.serviceDefinitions.findCategoriesByIds, queryParams, {}, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error for ids ${this.logger.formatJSON(ids)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }
    }

    protected getHost(requestContext: RequestContext, datasourceConfig: HCLCommerceDatasourceConfiguration, serviceDefinition: RestDatasourceServiceDefinition) {
        return datasourceConfig.searchHost;
    }
}
