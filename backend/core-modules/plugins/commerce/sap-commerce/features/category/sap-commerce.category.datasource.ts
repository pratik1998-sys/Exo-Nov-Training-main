import { RequestContext } from "@context/request";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { GetCatalogVersion, GetCategories, SAPCommerceBaseDatasource, SAPCommerceBaseDatasourcePathParams, SAPCommerceConsumerConfiguration } from "@plugin-sap-commerce/common";

const SAPCommerceCategoryDatasourcePathParams = {
    ...SAPCommerceBaseDatasourcePathParams,
    catalogId: '{catalogId}',
    catalogVersionId: '{catalogVersionId}',
    categoryId: '{categoryId}',
};

export interface SAPCommerceCategoryServiceDefinitions extends RestDatasourceServiceDefinitions {
    getCatalogVersion: RestDatasourceServiceDefinition;
    getCategory: RestDatasourceServiceDefinition;
}

export class SAPCommerceCategoryDatasource extends SAPCommerceBaseDatasource {
    protected serviceDefinitions: SAPCommerceCategoryServiceDefinitions = {
        getCatalogVersion: {
            id: 'getCatalogVersion',
            method: HttpMethods.get,
            path: `/occ/v2/${SAPCommerceCategoryDatasourcePathParams.baseSiteId}/catalogs/${SAPCommerceCategoryDatasourcePathParams.catalogId}/${SAPCommerceCategoryDatasourcePathParams.catalogVersionId}`,
            timeout: 10000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getCategory: {
            id: 'getCategory',
            method: HttpMethods.get,
            path: `/occ/v2/${SAPCommerceCategoryDatasourcePathParams.baseSiteId}/catalogs/${SAPCommerceCategoryDatasourcePathParams.catalogId}/${SAPCommerceCategoryDatasourcePathParams.catalogVersionId}/categories/${SAPCommerceCategoryDatasourcePathParams.categoryId}`,
            timeout: 10000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };


    async getCatalogVersion(
        requestContext: RequestContext,
    ): Promise<GetCatalogVersion.Response._200 | GetCatalogVersion.Response._400 | GetCatalogVersion.Response._401 | GetCatalogVersion.Response._403 | GetCatalogVersion.Response._404> {
        const methodname: string = `${SAPCommerceCategoryDatasource.name}.getCatalogVersion`;

        return await this.executeCategoryService(requestContext, this.serviceDefinitions.getCatalogVersion);
    }

    async getCategory(requestContext: RequestContext, categoryId: string): Promise<GetCategories.Response._200> {
        const methodname: string = `${SAPCommerceCategoryDatasource.name}.getCategory`;

        const paramMap = {
            [SAPCommerceCategoryDatasourcePathParams.categoryId]: categoryId,
        };

        return await this.executeCategoryService(requestContext, this.serviceDefinitions.getCategory, {}, {}, paramMap);
    }

    protected async executeCategoryService(
        requestContext: RequestContext,
        serviceDefinition: RestDatasourceServiceDefinition,
        queryParams?: Record<string, any>,
        headers?: Record<string, string>,
        paramMap?: Record<string, string>,
    ) {
        const methodname = `${SAPCommerceCategoryDatasource.name}.executeCategoryService`;

        let result;

        paramMap = this.composePathParamMap(requestContext, paramMap);

        try {
            result = await this.execute(requestContext, serviceDefinition, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [${serviceDefinition.id}] - (${this.logger.formatJSON(paramMap)}): ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    protected composePathParamMap(requestContext: RequestContext, paramMap: Record<string, string>): Record<string, string> {
        const { configuration } = this.getPluginConsumerConfiguration<SAPCommerceConsumerConfiguration>(requestContext);

        const { catalog, catalogVersion } = configuration;

        paramMap = paramMap ?? {};

        paramMap = {
            ...paramMap,
            [SAPCommerceCategoryDatasourcePathParams.catalogId]: catalog,
            [SAPCommerceCategoryDatasourcePathParams.catalogVersionId]: catalogVersion,
        };

        return paramMap;
    }

    protected composeQueryParams(requestContext: RequestContext, dataSourceConfig: any, queryParams: any) {
        queryParams = super.composeQueryParams(requestContext, dataSourceConfig, queryParams);

        queryParams.fields = 'FULL';

        return queryParams;
    }
}
