import { RequestContext } from "@context/request";
import { CommercetoolsBaseDatasource, CommercetoolsBaseDatasourcePathParams, CommercetoolsQueryParams, CommercetoolsServiceDefinition, CommercetoolsServiceDefinitions } from "@plugin-commercetools/common";
import { CommercetoolsProductResultSet, CommercetoolsProductType, CommercetoolsProductTypeResultSet } from "./schema/commercetools.product.schema";
import { HttpMethods } from "@plugin-datasource-rest";


export interface CommercetoolsProductServiceDefinitions extends CommercetoolsServiceDefinitions {
    productProjectionSearch: CommercetoolsServiceDefinition;
    getProductTypes: CommercetoolsServiceDefinition;
}
const CommercetoolsProductDatasourcePathParams = {
    ...CommercetoolsBaseDatasourcePathParams,
};

export class CommercetoolsProductDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsProductServiceDefinitions = {
        productProjectionSearch: {
            id: 'productProjectionSearch',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/product-projections/search`,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        getProductTypes: {
            id: 'getProductTypes',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/product-types`,
            isAdminService: true,
            timeout: 5000,
        },
    };


    async getProducts(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams): Promise<CommercetoolsProductResultSet> {
        const methodname = `${CommercetoolsProductDatasource.name}.getProducts`;

        let dsResult: any = null;

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.productProjectionSearch, {}, {}, {}, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching products: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async getProductTypes(requestContext: RequestContext, query?: CommercetoolsQueryParams): Promise<CommercetoolsProductTypeResultSet> {
        const methodname = `${CommercetoolsProductDatasource.name}.getProductTypes`;

        let dsProductTypeResultSet: CommercetoolsProductTypeResultSet = null;

        try {
            dsProductTypeResultSet = await this.execute(requestContext, this.serviceDefinitions.getProductTypes, {}, {}, {}, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching product types - ${this.logger.formatJSON(query)}: ${error.message}`, requestContext);
            throw error;
        }

        return dsProductTypeResultSet;
    }

    async getProductTypesCompleteResultSet(requestContext: RequestContext, query?: CommercetoolsQueryParams): Promise<CommercetoolsProductType[]> {
        const methodname = `${CommercetoolsProductDatasource.name}.getProductTypesCompleteResultSet`;

        let dsProductTypes: CommercetoolsProductType[] = null;

        try {
            dsProductTypes = (await this.executeCompleteResultSet(requestContext, this.serviceDefinitions.getProductTypes, {}, {}, {}, query)) as CommercetoolsProductType[];
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching product types - ${this.logger.formatJSON(query)}: ${error.message}`, requestContext);
            throw error;
        }

        return dsProductTypes;
    }
}

export const CommercetoolsProductQueryKeys = {
    filterQuery: 'filter.query',
    filterFacets: 'filter.facets',
};

export interface CommercetoolsProductSearchQueryParams {
    markMatchingVariants?: boolean;
    fuzzy?: boolean;
    fuzzyLevel?: number;
    [CommercetoolsProductQueryKeys.filterQuery]?: string[];
    filter?: string[];
    facet?: string[];
    [CommercetoolsProductQueryKeys.filterFacets]: string[];
    sort?: string[];
    expand?: string[];
    limit?: number;
    offset?: number;
    staged?: boolean;
    priceCurrency?: string;
    priceCountry?: string;
    priceCustomerGroup?: string;
    priceCustomerGroupAssignments?: string[];
    priceChannel?: string;
    priceRecurrencePolicy?: string;
    localeProjection?: string[];
    storeProjection?: string;
    [key: string]: any;
}
