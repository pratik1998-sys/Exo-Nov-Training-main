import { RequestContext } from "@context/request";
import { CommercetoolsBaseDatasource, CommercetoolsBaseDatasourcePathParams, CommercetoolsQueryParams, CommercetoolsServiceDefinition, CommercetoolsServiceDefinitions } from "@plugin-commercetools/common";
import { CommercetoolsCategory, CommercetoolsCategoryResultSet } from "./schema/commercetools.category.schema";
import { HttpMethods } from "@plugin-datasource-rest";


export interface CommercetoolsCategoryServiceDefinitions extends CommercetoolsServiceDefinitions {
    getCategories: CommercetoolsServiceDefinition;
    getCategoriesForRegistry: CommercetoolsServiceDefinition;
    getCategoryByKey: CommercetoolsServiceDefinition;
    getCategoryById: CommercetoolsServiceDefinition;
}

const CommercetoolsCategoryDatasourcePathParams = {
    ...CommercetoolsBaseDatasourcePathParams,
};

export class CommercetoolsCategoryDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsCategoryServiceDefinitions = {
        getCategories: {
            id: 'getCategories',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/categories`,
            timeout: 5000,
        },
        getCategoriesForRegistry: {
            id: 'getCategoriesForRegistry',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/categories`,
            isAdminService: true,
            timeout: 5000,
        },
        getCategoryByKey: {
            id: 'getCategoryByKey',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/categories/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 5000,
        },
        getCategoryById: {
            id: 'getCategoryById',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/categories/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 5000,
        },
    };

    async getCategories(requestContext: RequestContext, query: CommercetoolsQueryParams): Promise<CommercetoolsCategoryResultSet> {
        const methodname = `${CommercetoolsCategoryDatasource.name}.getCategories`;

        let dsResult: CommercetoolsCategoryResultSet = null;

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.getCategories, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching categories: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async getCategoryCompleteResultSet(requestContext: RequestContext, query?: CommercetoolsQueryParams): Promise<CommercetoolsCategory[]> {
        const methodname = `${CommercetoolsCategoryDatasource.name}.getCategoryCompleteResultSet`;

        let dsCategories: CommercetoolsCategory[] = [];

        try {
            dsCategories = (await this.executeCompleteResultSet(requestContext, this.serviceDefinitions.getCategoriesForRegistry, query)) as CommercetoolsCategory[];
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching categories: ${error.message}`, requestContext);
            throw error;
        }

        return dsCategories;
    }

    async getCategoryById(requestContext: RequestContext, id: string, query: CommercetoolsQueryParams): Promise<CommercetoolsCategory> {
        const paramMap = {
            [CommercetoolsCategoryDatasourcePathParams.id]: id,
        };

        return await this.executeGetCategory(requestContext, this.serviceDefinitions.getCategoryById, paramMap, query);
    }

    async getCategoryByKey(requestContext: RequestContext, key: string, query: CommercetoolsQueryParams): Promise<CommercetoolsCategory> {
        const paramMap = {
            [CommercetoolsCategoryDatasourcePathParams.key]: key,
        };

        return await this.executeGetCategory(requestContext, this.serviceDefinitions.getCategoryByKey, paramMap, query);
    }

    protected async executeGetCategory(requestContext: RequestContext, serviceDefinition: CommercetoolsServiceDefinition, paramMap: Record<string, string>, query: CommercetoolsQueryParams) {
        const methodname = `${CommercetoolsCategoryDatasource.name}.executeGetCategory`;

        let dsResult: CommercetoolsCategory = null;

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching category - ${this.logger.formatJSON(paramMap)}: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }
}
