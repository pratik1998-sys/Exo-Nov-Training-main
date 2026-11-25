import { RequestContext } from "@context/request";
import { CategoryFilterInput, CategoryResultSet, CategoryService } from "@feature-commerce/category";
import { Product, ProductFilterInput, ProductResultSet, ProductService } from "@feature-commerce/product";
import { EntityFilterInput } from "@feature-shared-models";
import { PaginationInput, SortByInput } from "@feature/models";
import { CommercetoolsBaseServiceImpl, CommercetoolsConsumerConfiguration } from "@plugin-commercetools/common";
import { CommercetoolsProduct, CommercetoolsProductResultSet, } from "./schema/commercetools.product.schema";
import { CommercetoolsProductTypeRegistry } from "./commercetools.product.type.registry";
import { StringUtility } from "@utilities";
import { CommercetoolsProductErrors } from "./commercetools.product.error";
import { CommercetoolsProductMapper } from "./commercetools.product.mapper";
import { CommercetoolsProductDatasource, CommercetoolsProductQueryKeys, CommercetoolsProductSearchQueryParams, } from "./commercetools.product.datasource";

export class CommercetoolsProductServiceImpl extends CommercetoolsBaseServiceImpl implements ProductService {
    async getProduct(id: string, identifier: string, slug: string, requestContext: RequestContext, context?: any): Promise<Product> {
        const methodname = `${CommercetoolsProductServiceImpl.name}.getProduct`;

        const filter: ProductFilterInput = {
            product: {},
        };

        if (StringUtility.isStringNotEmpty(slug)) {
            filter.product.slugs = [slug];
        } else if (StringUtility.isStringNotEmpty(identifier)) {
            filter.product.identifiers = [identifier];
        } else if (StringUtility.isStringNotEmpty(id)) {
            filter.product.ids = [id];
        } else {
            this.logger.info(`${methodname} - Missing one of [slug, identifier, id]`, requestContext);
            throw CommercetoolsProductErrors.invalidGetProductRequest();
        }

        const productResultSet = await this.getProducts(filter, null, null, requestContext, context);

        return productResultSet.results.length > 0 ? productResultSet.results[0] : null;
    }

    async getProducts(
        filter: ProductFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
        disableMaxPagination?: boolean,
    ): Promise<ProductResultSet> {
        const methodname = `${CommercetoolsProductServiceImpl.name}.getProducts`;

        const query = await this.composeQuery_productSearch(requestContext, filter, pagination, sortBy);

        let dsProductResultSet: CommercetoolsProductResultSet = null;

        try {
            dsProductResultSet = await this.getProductDatasource(requestContext).getProducts(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching products - ${this.logger.formatJSON(filter)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw CommercetoolsProductErrors.getProductsFailed();
        }

        this.formatDSProducts(requestContext, dsProductResultSet?.results);

        return this.getProductMapper(requestContext).mapProductResultSet(requestContext, dsProductResultSet, filter?.facets);
    }

    protected formatDSProducts(requestContext: RequestContext, dsProducts: CommercetoolsProduct[]) {
        dsProducts?.forEach((dsProduct) => {
            this.formatDSProduct(requestContext, dsProduct);
        });
    }

    protected formatDSProduct(requestContext: RequestContext, dsProduct: CommercetoolsProduct) {
        if (dsProduct) {
            dsProduct._categories = dsProduct.categories.map((dsCategoryReference) => dsCategoryReference.obj);
        }
    }

    protected async composeQuery_productSearch(
        requestContext: RequestContext,
        filter: ProductFilterInput,
        paginationInput: PaginationInput,
        sortBy: SortByInput,
    ): Promise<CommercetoolsProductSearchQueryParams> {
        const methodname = `${CommercetoolsProductServiceImpl.name}.composeQuery_productSearch`;

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, paginationInput);


        const query: CommercetoolsProductSearchQueryParams = {
            [CommercetoolsProductQueryKeys.filterQuery]: [],
            [CommercetoolsProductQueryKeys.filterFacets]: [],
            facet: [],
            expand: [],
            sort: [],
            limit,
            offset
        };

        this.composeQueryExpand(requestContext, query);
        this.composeQueryFacets(requestContext, query);

        this.composeQueryFilter_store(requestContext, query);

        if (filter.category) {
            await this.composeQueryFilter_category(requestContext, query, filter.category);
        }

        if (filter.product) {
            await this.composeQueryFilter_product(requestContext, query, filter.product);
        }

        if (filter.sku) {
            await this.composeQueryFilter_sku(requestContext, query, filter.sku);
        }

        if (filter.facets) {
            this.composeQueryFilter_facets(requestContext, query, filter);
        }

        if (filter.term) {
            this.composeQueryTerm(requestContext, query, filter.term);
        }

        if (sortBy) {
            this.composeQuerySortBy(requestContext, query, sortBy);
        }

        return query;
    }

    protected composeQueryFilter_store(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams) {
        const { storeId, productFilterByStoreAttributeId } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext).configuration;

        if (StringUtility.isStringNotEmpty(productFilterByStoreAttributeId) && StringUtility.isStringNotEmpty(storeId)) {
            // query[CommercetoolsProductQueryKeys.filterFacets].push(`variants.attributes.store:"${storeId}"`);
            query[CommercetoolsProductQueryKeys.filterQuery].push(`variants.attributes.${productFilterByStoreAttributeId}:"${storeId}"`);
        }
    }

    protected async composeQueryTerm(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams, term: string) {
        query.fuzzy = true;
        query.fuzzyLevel = 0;
        query[`text.${requestContext.locale}`] = term;
    }

    protected composeQuerySortBy(requestContext, query: CommercetoolsProductSearchQueryParams, sortBy: SortByInput) {
        if (sortBy.identifier == 'name') {
            sortBy.identifier = `${sortBy.identifier}.${requestContext.locale}`;
        }

        const sortArr = [sortBy.identifier, sortBy.isAscending ? 'asc' : 'desc'];

        query.sort.push(sortArr.join(' '));
    }

    /**
     * Commercetools requires a request to send in what attributes should be returned in the facets list...strange
     *
     * @param requestContext
     * @param query
     */
    protected composeQueryFacets(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams) {
        const facetableAttributes = this.getRegistry<CommercetoolsProductTypeRegistry>(requestContext, CommercetoolsProductTypeRegistry).getFacetableAttributes();

        query.facet.push(`categories.id counting products`);

        Object.values(facetableAttributes).forEach((attribute) => {
            query.facet.push(`variants.attributes.${attribute.name} counting products`);
        });
    }

    /**
     * Forewarning - Commercetools does support "product level" attributes association to products, however, these are not supported in search.
     * Only variant level attributes are searchable ("variants.attributes.[*]")
     * @param requestContext
     * @param query
     * @param facets
     */
    protected composeQueryFilter_facets(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams, filter: ProductFilterInput) {
        const { productTags } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext).configuration;

        const productTagMap: Record<string, string> = {};

        productTags?.forEach((productTag) => {
            productTagMap[productTag.id] = `variants.attributes.${productTag.attribute}`;
        });

        filter.facets?.forEach((facet) => {
            const facetId = productTagMap[facet.id] ?? facet.id;

            let values = facet.values.map((value) => {
                if (value === 'true') {
                    return '1';
                } else if (value === 'false') {
                    return '0';
                } else {
                    return value;
                }
            });

            query[CommercetoolsProductQueryKeys.filterFacets].push(`${facetId}:${this.composeQueryListValues(requestContext, values, false)}`);
            query[CommercetoolsProductQueryKeys.filterQuery].push(`${facetId}:${this.composeQueryListValues(requestContext, values, false)}`);
        });
    }

    protected composeQueryExpand(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams) {
        query.expand.push('categories[*]');
    }

    protected async composeQueryFilter_category(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams, categoryFilter: EntityFilterInput) {
        let { ids, identifiers, slugs } = categoryFilter;

        if (identifiers?.length > 0 || slugs?.length > 0) {
            const categoryFilter: CategoryFilterInput = {
                identifiers,
                slugs,
            };

            const categoryResultSet: CategoryResultSet = await this.getService<CategoryService>(requestContext, CategoryService).getCategories(categoryFilter, null, 0, requestContext);

            const categories = categoryResultSet.results;

            ids = ids ?? [];

            categories.forEach((category) => {
                ids.push(category.id);
            });
        }

        if (ids.length > 0) {
            query[CommercetoolsProductQueryKeys.filterQuery].push(`categories.id: ${this.composeQueryListValues(requestContext, ids, false)}`);
        }
    }

    protected async composeQueryFilter_product(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams, productFilter: EntityFilterInput) {
        const queryOrParts: string[] = [];

        const { ids, identifiers, slugs } = productFilter;

        if (ids?.length > 0) {
            // queryOrParts.push(`id:${this.composeQueryListValues(requestContext, ids, false)}`);
            query[CommercetoolsProductQueryKeys.filterQuery].push(`id:${this.composeQueryListValues(requestContext, ids, false)}`)
        }

        if (identifiers?.length > 0) {
            // queryOrParts.push(`key:${this.composeQueryListValues(requestContext, identifiers, false)}`);
            query[CommercetoolsProductQueryKeys.filterQuery].push(`key:${this.composeQueryListValues(requestContext, identifiers, false)}`)

        }

        if (slugs?.length > 0) {
            // queryOrParts.push(`slug.${requestContext.locale}:${this.composeQueryListValues(requestContext, slugs, false)}`);
            // queryOrParts.push(`slug.${requestContext.language}:${this.composeQueryListValues(requestContext, slugs, false)}`);

            // query[CommercetoolsProductQueryKeys.filterQuery].push(`slug.${requestContext.locale}:${this.composeQueryListValues(requestContext, slugs, false)}`)
            query[CommercetoolsProductQueryKeys.filterQuery].push(`slug.${this.getLanguage(requestContext)}:${this.composeQueryListValues(requestContext, slugs, false)}`)

        }

        // if (queryOrParts.length > 0) {
        //     query[CommercetoolsProductQueryKeys.filterQuery].push(queryOrParts.join(' or '));
        // }
    }

    protected async composeQueryFilter_sku(requestContext: RequestContext, query: CommercetoolsProductSearchQueryParams, skuFilter: EntityFilterInput) {
        const { ids, identifiers, slugs } = skuFilter;

        if (ids?.length > 0) {
            throw CommercetoolsProductErrors.productFilterBySkuIdNotSupported();
        } else if (slugs?.length > 0) {
            throw CommercetoolsProductErrors.productFilterBySkuSlugNotSupported();
        }

        if (identifiers?.length > 0) {
            query.markMatchingVariants = true;
            query[CommercetoolsProductQueryKeys.filterQuery].push(`variants.sku:${this.composeQueryListValues(requestContext, identifiers, false)}`);
        }
    }

    protected getProductDatasource(requestContext: RequestContext) {
        return this.getDatasource<CommercetoolsProductDatasource>(requestContext, CommercetoolsProductDatasource);
    }

    protected getProductMapper(requestContext: RequestContext) {
        return this.getMapper<CommercetoolsProductMapper>(requestContext, CommercetoolsProductMapper);
    }
}
