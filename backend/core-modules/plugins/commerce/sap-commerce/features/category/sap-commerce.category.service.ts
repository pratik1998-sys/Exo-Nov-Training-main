import { RequestContext } from "@context/request";
import { CategoryService, Category, CategoryFilterInput, CategoryResultSet, CategoryErrors } from "@feature-commerce/category";
import { PaginationInput } from "@feature/models";
import { GetCatalogVersion, SAPCommerceBaseServiceImpl, SAPCommerceConsumerConfiguration } from "@plugin-sap-commerce/common";
import { SAPCommerceCategoryDatasource } from "./sap-commerce.category.datasource";
import { SAPCommerceCategoryMapper } from "./sap-commerce.category.mapper";
import { StringUtility } from "@utilities";

export class SAPCommerceCategoryServiceImpl extends SAPCommerceBaseServiceImpl implements CategoryService {
    async getCategory(
        id: string,
        identifier: string,
        slug: string,
        depth: number,
        categoryPagination: PaginationInput,
        productPagination: PaginationInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Category> {
        const methodname: string = `${SAPCommerceCategoryServiceImpl.name}.getCategory`;

        id = StringUtility.isStringNotEmpty(id) ? id : slug;

        let dsResult;

        try {
            dsResult = await this.getDatasource<SAPCommerceCategoryDatasource>(requestContext, SAPCommerceCategoryDatasource).getCategory(requestContext, id);
        } catch (error) {
            this.logger.info(`${methodname} - Error executing get category - ${id}: ${error}`);
            throw CategoryErrors.categoryGetFailed();
        }

        return this.getMapper<SAPCommerceCategoryMapper>(requestContext).mapCategory(requestContext, dsResult);
    }

    // async getTopCategories(requestContext: RequestContext, context?: any): Promise<Category[]> {
    //     const methodname: string = `${SAPCommerceCategoryServiceImpl.name}.getTopCategories`;

    //     const category = await this.fetchCategories(requestContext, 1, context);

    //     return category.children;
    // }

    async getCategories(filter: CategoryFilterInput, pagination: PaginationInput, depth: number, requestContext: RequestContext, context?: any): Promise<CategoryResultSet> {
        const methodname: string = `${SAPCommerceCategoryServiceImpl.name}.getCategories`;

        const category = await this.fetchCategories(requestContext, depth, context);

        return {
            pagination: {
                pageSize: category?.children?.length ?? 0,
                pageCount: 1,
                resultCount: category?.children?.length ?? 0,
                hasMorePages: false,
                page: 1,
            },
            results: category.children,
        };
    }

    protected async fetchCategories(requestContext: RequestContext, depth: number, context: any) {
        const methodname: string = `${SAPCommerceCategoryServiceImpl.name}.fetchCategories`;

        const rootCategory = this.getRootCategory(requestContext);

        const category = await this.getCategory(rootCategory, null, null, depth, null, null, requestContext, context);

        return category;
    }

    protected async executeGetCatalogVersion(
        requestContext: RequestContext,
        baseSiteId: string,
        catalogId: string,
        catalogVersionId: string,
        queryParams?: GetCatalogVersion.Query,
        headers?: GetCatalogVersion.Header,
    ): Promise<GetCatalogVersion.Response._200 | GetCatalogVersion.Response._400 | GetCatalogVersion.Response._401 | GetCatalogVersion.Response._403 | GetCatalogVersion.Response._404> {
        const methodname: string = `${SAPCommerceCategoryServiceImpl.name}.executeGetCatalogVersion`;

        let dsResult: GetCatalogVersion.Response._200 | GetCatalogVersion.Response._400 | GetCatalogVersion.Response._401 | GetCatalogVersion.Response._403 | GetCatalogVersion.Response._404;

        try {
            dsResult = await this.getDatasource<SAPCommerceCategoryDatasource>(requestContext, SAPCommerceCategoryDatasource).getCatalogVersion(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error executing getCatalogVersion: ${error}`);

            throw error;
        }

        return dsResult;
    }

    protected getRootCategory(requestContext: RequestContext) {
        const { configuration } = this.getPluginConsumerConfiguration<SAPCommerceConsumerConfiguration>(requestContext);

        const { rootCategory } = configuration;

        return rootCategory;
    }
}
