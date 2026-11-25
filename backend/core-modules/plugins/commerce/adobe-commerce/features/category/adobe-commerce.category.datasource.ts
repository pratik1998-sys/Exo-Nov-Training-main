import { RequestContext } from "@context/request";
import { PaginationInput } from "@feature/models";
import { AdobeCommerceBaseDatasource } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCategoryFilterInput, AdobeCommerceCategoryQueries, AdobeCommerceCategoryResult } from "./schema/adobe-commerce.category.schema";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";

export interface AdobeCommerceCategoryServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    getCategories: GraphqlDatasourceServiceDefinition;
}


export class AdobeCommerceCategoryDatasource extends AdobeCommerceBaseDatasource {
    protected serviceDefinitions: AdobeCommerceCategoryServiceDefinitions = {
        getCategories: {
            id: 'getCategories',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceCategoryQueries.getCategories(),
        },
    };

    async getCategories(requestContext: RequestContext, filters: AdobeCommerceCategoryFilterInput, pageSize?: number, currentPage?: number, productPagination?: PaginationInput) {
        const methodname = `${AdobeCommerceCategoryDatasource.name}.getCategories`;

        let result: AdobeCommerceCategoryResult = null;

        const variables: any = {
            filters,
            pageSize,
            currentPage,
        };

        if (productPagination) {
            variables.productCurrentPage = productPagination.page;
            variables.productPageSize = productPagination.pageSize;
        }

        const query = productPagination ? AdobeCommerceCategoryQueries.getCategoriesWithProducts(this.getProductAttributes(requestContext)) : this.serviceDefinitions.getCategories.query;

        const gqlResult = await this.executeGQLService<{ categories: AdobeCommerceCategoryResult }>(requestContext, this.serviceDefinitions.getCategories, variables, query);

        return gqlResult?.categories;
    }
}
