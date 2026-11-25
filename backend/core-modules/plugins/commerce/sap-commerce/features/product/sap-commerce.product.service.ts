import { RequestContext } from "@context/request";
import { ProductService, Product, ProductFilterInput, ProductResultSet, ProductErrors } from "@feature-commerce/product";
import { PaginationInput, SortByInput } from "@feature/models";
import { GetProduct, GetProducts, SAPCommerceBaseServiceImpl } from "@plugin-sap-commerce/common";
import { SAPCommerceProductDatasource } from "./sap-commerce.product.datasource";
import { SAPCommerceProductMapper } from "./sap-commerce.product.mapper";
import { StringUtility } from "@utilities";

export abstract class SAPCommerceProductServiceImpl extends SAPCommerceBaseServiceImpl implements ProductService {
    async getProduct(id: string, identifier: string, slug: string, requestContext: RequestContext, context?: any): Promise<Product> {
        const methodname = `${SAPCommerceProductServiceImpl.name}.getProduct`;

        let dsResult: GetProduct.Response._200 = null;

        slug = slug ?? identifier ?? id;

        try {
            dsResult = await this.getProductDatasource(requestContext).getProduct(requestContext, slug);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching product [${slug}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw ProductErrors.getProductFailed();
        }

        return this.getProductMapper(requestContext).mapProduct(requestContext, dsResult);
    }

    async getProducts(
        filter: ProductFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
        disableMaxPagination?: boolean,
    ): Promise<ProductResultSet> {
        const methodname = `${SAPCommerceProductServiceImpl.name}.getProducts`;

        this.validatePagination(pagination, requestContext, disableMaxPagination);

        let dsResult: GetProducts.Response._200 = null;

        const query = this.buildProductsQuery(requestContext, filter, pagination, sortBy);

        try {
            dsResult = await this.getProductDatasource(requestContext).getProducts(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching products: ${this.logger.formatJSON(error)}`, requestContext);
            throw ProductErrors.getProductsFailed();
        }

        return this.getProductMapper(requestContext).mapProductResultSet(requestContext, dsResult, filter?.facets);
    }

    protected buildProductsQuery(requestContext: RequestContext, filterInput: ProductFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput) {
        const methodname = `${SAPCommerceProductDatasource.name}.buildProductsQuery`;

        let queryString = '';

        if (filterInput) {
            const { category, product, facets, term } = filterInput;

            if (StringUtility.isStringNotEmpty(term)) {
                queryString = term;
            }

            queryString = `${queryString}:`;

            if (sortByInput) {
                queryString = `${sortByInput.identifier}-${sortByInput.isAscending ? 'asc' : 'desc'}`;
            }

            // queryString = `${queryString}:`;

            if (category) {
                const { ids, slugs, identifiers } = category;

                //TODO - Not tested - how to query for products from multiple categories?
                identifiers.forEach((identifier) => {
                    // if (StringUtility.isStringNotEmpty(queryString)) {
                    //     queryString = `${queryString}:`;
                    // }

                    queryString = `${queryString}:category:${identifier}`;
                });
            }

            if (product) {
                const { ids, slugs, identifiers } = product;

                //TODO - This doesn't work - how to query for multiple products base on product code?
                identifiers.forEach((identifier) => {
                    queryString = `${queryString}:code:${identifier}`;
                });
            }

            if (facets) {
                facets.forEach((facet) => {
                    if (facet.values?.length > 0) {
                        queryString = `${queryString}:${facet.id}:${facet.values.join(',')}`;
                    }
                });
            }
        }

        const queryParams = {
            query: queryString,
            currentPage: paginationInput.page ? paginationInput.page - 1 : 0,
            pageSize: paginationInput.pageSize ?? 20,
            fields: 'FULL',
            searchQueryContext: 'DEFAULT',
            // sort: 'relevance',
        };

        return queryParams;
    }

    protected getProductDatasource(requestContext: RequestContext) {
        return this.getDatasource<SAPCommerceProductDatasource>(requestContext, SAPCommerceProductDatasource);
    }

    protected getProductMapper(requestContext: RequestContext) {
        return this.getMapper<SAPCommerceProductMapper>(requestContext, SAPCommerceProductMapper);
    }
}
