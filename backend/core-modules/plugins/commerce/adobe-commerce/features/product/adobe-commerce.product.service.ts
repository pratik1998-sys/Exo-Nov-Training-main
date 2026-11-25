import { RequestContext } from "@context/request";
import { Product, ProductErrors, ProductFilterInput, ProductResultSet, ProductService } from "@feature-commerce/product";
import { EntityFilterInput, FacetRangeInput } from "@feature-shared-models";
import { PaginationInput, SortByInput } from "@feature/models";
import { AdobeCommerceBaseServiceImpl, AdobeCommerceConsumerConfiguration } from "@plugin-adobe-commerce/common";
import { AdobeCommerceProductDatasource } from "./adobe-commerce.product.datasource";
import { AdobeCommerceProductMapper } from "./adobe-commerce.product.mapper";
import { AdobeCommerceProduct, AdobeCommerceProductAttributeFilterInput, AdobeCommerceProductAttributeSortInput, AdobeCommerceProductResult } from "./schema/adobe-commerce.product.schema";
import { StringUtility } from "@utilities";

export class AdobeCommerceProductServiceImpl extends AdobeCommerceBaseServiceImpl implements ProductService {
    async getProduct(id: string, sku: string, slug: string, requestContext: RequestContext, context?: any): Promise<Product> {
        const methodname = `${AdobeCommerceProductServiceImpl.name}.product`;

        let dsProduct: AdobeCommerceProduct;

        const filter: AdobeCommerceProductAttributeFilterInput = this.composeBaseProductFilter(requestContext);

        if (StringUtility.isStringNotEmpty(slug)) {
            filter.url_key = {
                eq: slug,
            };
        } else if (StringUtility.isStringNotEmpty(sku)) {
            filter.sku = {
                eq: sku,
            };
        } else {
            this.logger.info(`${methodname} - Missing one of [slug, identifier]`);
            throw ProductErrors.invalidGetProductRequest();
        }

        try {
            const dsResult: AdobeCommerceProductResult = await this.executeGetProducts(requestContext, {}, null, filter, null);

            dsProduct = dsResult?.items?.length > 0 ? dsResult.items[0] : null;
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching product with filter ${this.logger.formatJSON(filter)}: ${error}`);
            throw ProductErrors.getProductFailed();
        }

        return this.getMapper<AdobeCommerceProductMapper>(requestContext).mapProduct(requestContext, dsProduct);
    }

    async getProducts(
        filterInput: ProductFilterInput,
        pagination: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
        disableMaxPagination?: boolean,
    ): Promise<ProductResultSet> {
        const methodname = `${AdobeCommerceProductServiceImpl.name}.products`;

        let dsResult: AdobeCommerceProductResult;

        pagination = this.validatePagination(pagination, requestContext, disableMaxPagination);

        const sort: AdobeCommerceProductAttributeSortInput =
            sortByInput ?
                {
                    [sortByInput.identifier]: sortByInput.isAscending ? 'ASC' : 'DESC',
                }
                : {};

        const filter: AdobeCommerceProductAttributeFilterInput = this.composeBaseProductFilter(requestContext);

        if (filterInput) {
            const { category, product, facets } = filterInput;

            this.addEntityTypeToFilter(requestContext, category, filter, 'category_uid', null);
            this.addEntityTypeToFilter(requestContext, product, filter, 'sku', 'url_key');

            if (facets) {
                facets.forEach((facet) => {
                    if (facet.ranges) {
                        this.applyFilterRangeClauseToFilter(requestContext, filter, facet.id, facet.ranges);
                    } else {
                        this.applyFilterMatchClauseForListToFilter(requestContext, filter, facet.id, facet.values);
                    }
                });
            }
        }

        if (Object.keys(filter).length == 0 && StringUtility.isStringEmpty(filterInput.term)) {
            this.logger.info(`${methodname} - Invalid get products request, no filters or search term`);
            throw ProductErrors.getProductsFailed();
        }

        let error;

        try {
            dsResult = await this.executeGetProducts(requestContext, pagination, filterInput?.term, filter, sort);
        } catch (e) {
            this.logger.info(`${methodname} - Error fetching products with filter ${this.logger.formatJSON(filterInput)}: ${error}`);
            throw ProductErrors.getProductsFailed();
        }

        return this.getMapper<AdobeCommerceProductMapper>(requestContext).mapProductResultSet(requestContext, dsResult, filterInput);
    }

    protected composeBaseProductFilter(requestContext: RequestContext): AdobeCommerceProductAttributeFilterInput {
        const filter: AdobeCommerceProductAttributeFilterInput = {};

        return filter;
    }

    protected addEntityTypeToFilter(
        requestContext: RequestContext,
        entityFilterInput: EntityFilterInput,
        filter: AdobeCommerceProductAttributeFilterInput,
        filterKeyId: string,
        filterKeySlug: string,
    ) {
        if (entityFilterInput) {
            const ids: string[] = entityFilterInput.ids;
            const slugs: string[] = entityFilterInput.slugs;

            this.applyFilterMatchClauseForListToFilter(requestContext, filter, filterKeyId, ids);
            this.applyFilterMatchClauseForListToFilter(requestContext, filter, filterKeySlug, slugs);
        }
    }

    protected applyFilterMatchClauseForListToFilter(requestContext: RequestContext, filter: AdobeCommerceProductAttributeFilterInput, key: string, list: string[]) {
        if (key && list?.length > 0) {
            if (list.length == 1) {
                filter[key] = {
                    eq: list[0],
                };
            } else {
                filter[key] = {
                    in: list,
                };
            }
        }
    }

    protected applyFilterRangeClauseToFilter(requestContext: RequestContext, filter: AdobeCommerceProductAttributeFilterInput, key: string, ranges: FacetRangeInput[]) {
        const { configuration } = this.getPluginConsumerConfiguration<AdobeCommerceConsumerConfiguration>(requestContext);

        if (key && configuration.productRangeFacets && configuration.productRangeFacets.includes(key) && ranges.length > 0) {
            filter[key] = {
                from: ranges[0].from,
                to: ranges[0].to,
            };
        }
    }

    protected async executeGetProducts(
        requestContext: RequestContext,
        paginationInput: PaginationInput,
        search?: string,
        filter?: AdobeCommerceProductAttributeFilterInput,
        sort?: AdobeCommerceProductAttributeSortInput,
    ) {
        return await this.getDatasource<AdobeCommerceProductDatasource>(requestContext).getProducts(requestContext, search, filter, paginationInput.pageSize, paginationInput.page, sort);
    }
}
