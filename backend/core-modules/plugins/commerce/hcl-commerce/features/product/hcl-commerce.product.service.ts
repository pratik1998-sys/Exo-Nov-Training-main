import { RequestContext } from "@context/request";
import { ProductService, Product, ProductFilterInput, ProductResultSet, ProductErrors } from "@feature-commerce/product";
import { PaginationInput, SortByInput } from "@feature/models";
import { HCLCommerceBaseServiceImpl } from "@plugin-hcl-commerce/common";
import { HCLCommerceProductRestDatasource } from "./hcl-commerce.product.datasource";
import { HCLCommerceProductFilter } from "./schema/hcl-commerce.product.filter";
import { HCLCommerceProductMapper } from "./hcl-commerce.product.mapper";
import { StringUtility } from "@utilities";
import { HCLCommerceProductErrors } from "@plugin-hcl-commerce/features/product/hcl-commerce.product.error";

export class HCLCommerceProductServiceImpl extends HCLCommerceBaseServiceImpl implements ProductService {
    async getProduct(id: string, identifier: string, slug: string, requestContext: RequestContext, context?: any): Promise<Product> {
        const methodname = `${HCLCommerceProductServiceImpl.name}.getProduct`;

        this.logger.debug(`${methodname} - Processing product request for consumer: ${requestContext.consumer}`, requestContext);

        const isValidId = StringUtility.isStringNotEmpty(id);
        const isValidIdentifier = StringUtility.isStringNotEmpty(identifier);
        const isValidSlug = StringUtility.isStringNotEmpty(slug);

        let dsResult;

        const ds = this.getProductDatasource(requestContext);

        try {
            if (isValidId) {
                this.logger.debug(`${methodname} - Finding product by ID: ${id}`, requestContext);
                dsResult = await ds.findProductById(requestContext, id);
            } else if (isValidIdentifier || isValidSlug) {
                if (!isValidIdentifier && isValidSlug) {
                    identifier = slug;
                }
                this.logger.debug(`${methodname} - Finding product by partnumber: ${identifier}`, requestContext);
                dsResult = await ds.findProductByPartnumber(requestContext, identifier);
            }

            dsResult = dsResult.catalogEntryView?.length > 0 ? dsResult.catalogEntryView[0] : null;
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching product - id: ${id}, identifier: ${identifier} - ${this.logger.formatJSON(error)}`, requestContext);
            throw ProductErrors.getProductFailed();
        }

        return this.getMapper<HCLCommerceProductMapper>(requestContext).mapProduct(requestContext, dsResult);
    }

    async getProducts(
        filter: ProductFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
        disableMaxPagination?: boolean,
    ): Promise<ProductResultSet> {
        const methodname = `${HCLCommerceProductServiceImpl.name}.getProducts`;

        this.logger.debug(`${methodname} - Processing products request for consumer: ${requestContext.consumer}`, requestContext);

        const dsFilter: HCLCommerceProductFilter = {
            searchTerm: filter.term,
            ids: [],
            partnumbers: [],
        };

        if (pagination) {
            const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination, 20);

            dsFilter.limit = limit;
            dsFilter.offset = offset;
        }

        if (filter?.product) {
            const { ids, identifiers, slugs } = filter.product;

            dsFilter.ids = ids;
            dsFilter.partnumbers = identifiers ?? [];

            if (slugs) {
                dsFilter.partnumbers = [...dsFilter.partnumbers, ...slugs];
            }
        }

        dsFilter.categoryId = await this.resolveCategoryId(requestContext, filter);

        if (filter.facets?.length) {
            if (!dsFilter.searchTerm && !dsFilter.categoryId) {
                throw HCLCommerceProductErrors.facetsRequireCategoryOrSearchTerm();
            }

            dsFilter.facets = [];

            filter.facets.forEach((facet) => {
                facet.values.forEach((value) => {
                    dsFilter.facets.push(value);
                });
            });
        }

        let dsResult;

        const ds = this.getProductDatasource(requestContext);

        //TODO - Revisit this - split out due to HCL pagination concerns...
        try {
            dsResult = await ds.findProducts(requestContext, dsFilter);

            this.logger.debug(`${methodname} - Query returned ${dsResult?.total || dsResult?.recordSetTotal || 0} total results`, requestContext);
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching products - ${this.logger.formatJSON(dsFilter)} - ${error}`, requestContext);
            throw ProductErrors.getProductsFailed();
        }

        return this.getMapper<HCLCommerceProductMapper>(requestContext).mapProductResultSet(requestContext, dsResult);
    }

    protected async resolveCategoryId(requestContext: RequestContext, filter: ProductFilterInput): Promise<string> {
        return filter?.category?.ids?.length > 0 ? filter?.category?.ids[0] : null;
    }

    protected getProductDatasource(requestContext: RequestContext): HCLCommerceProductRestDatasource {
        return this.getDatasource<HCLCommerceProductRestDatasource>(requestContext, HCLCommerceProductRestDatasource);
    }
}
