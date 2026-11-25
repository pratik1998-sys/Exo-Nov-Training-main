import { RequestContext } from "@context/request";
import { Category, CategoryErrors, CategoryFilterInput, CategoryResultSet, CategoryService } from "@feature-commerce/category";
import { PaginationInput } from "@feature/models";
import { AdobeCommerceBaseServiceImpl, AdobeCommerceConsumerConfiguration } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCategoryDatasource } from "./adobe-commerce.category.datasource";
import { AdobeCommerceCategoryMapper } from "./adobe-commerce.category.mapper";
import { AdobeCommerceCategory, AdobeCommerceCategoryFilterInput, AdobeCommerceCategoryResult } from "./schema/adobe-commerce.category.schema";
import { StringUtility } from "@utilities";

export class AdobeCommerceCategoryServiceImpl extends AdobeCommerceBaseServiceImpl implements CategoryService {
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
        const methodname = `${AdobeCommerceCategoryServiceImpl.name}.category`;

        let dsCategory: AdobeCommerceCategory;

        if (StringUtility.isStringNotEmpty(slug)) {
            dsCategory = await this.executeGetCategoryBySlug(requestContext, slug, productPagination);
        } else if (StringUtility.isStringNotEmpty(id)) {
            dsCategory = await this.executeGetCategoryById(requestContext, id, productPagination);
        } else {
            dsCategory = await this.executeGetCategoryBySlug(requestContext, this.getRootCategorySlug(requestContext), productPagination);
        }

        const dsCategoryChildMap = await this.getCategoryChildCategories(requestContext, categoryPagination, dsCategory, depth);

        return this.getMapper<AdobeCommerceCategoryMapper>(requestContext).mapCategory(requestContext, dsCategory, dsCategoryChildMap);
    }

    async getTopCategories(requestContext: RequestContext, context?: any): Promise<Category[]> {
        const methodname = `${AdobeCommerceCategoryServiceImpl.name}.categoriesTop`;

        const dsCategory = await this.executeGetCategoryBySlug(requestContext, this.getRootCategorySlug(requestContext));

        const pagination: PaginationInput = {
            pageSize: dsCategory?.children_count ? parseInt(dsCategory?.children_count) : 10,
            page: 1,
        };

        const dsCategoryChildMap = await this.getCategoryChildCategories(requestContext, pagination, dsCategory, 0);

        const category = this.getMapper<AdobeCommerceCategoryMapper>(requestContext).mapCategory(requestContext, dsCategory, dsCategoryChildMap);

        return category.children;
    }

    /**
     * @todo - Handle proper filtering (ie slugs, identifiers, ids, etc) along with pagination
     *
     * As of now, due to no filtering, this is acting as Top Categories only
     *
     * @param filter
     * @param pagination
     * @param depth
     * @param requestContext
     * @param context
     * @returns
     */
    async getCategories(filter: CategoryFilterInput, pagination: PaginationInput, depth: number, requestContext: RequestContext, context?: any): Promise<CategoryResultSet> {
        const methodname = `${AdobeCommerceCategoryServiceImpl.name}.getCategories`;

        const dsCategory = await this.executeGetCategoryBySlug(requestContext, this.getRootCategorySlug(requestContext));

        const childPagination: PaginationInput = {
            pageSize: dsCategory?.children_count ? parseInt(dsCategory?.children_count) : 10,
            page: 1,
        };

        const dsCategoryChildMap = await this.getCategoryChildCategories(requestContext, childPagination, dsCategory, 0);

        const category = this.getMapper<AdobeCommerceCategoryMapper>(requestContext).mapCategory(requestContext, dsCategory, dsCategoryChildMap);

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

    protected async getCategoryChildCategories(requestContext: RequestContext, pagination: PaginationInput, dsCategory: any, depth: number) {
        const methodname = `${AdobeCommerceCategoryServiceImpl.name}.getCategoryChildCategories`;

        const dsCategoryChildMap = {};

        if (dsCategory) {
            depth = depth ?? 0;

            dsCategoryChildMap[dsCategory.uid] = [];

            await this.getChildCategories(requestContext, [dsCategory], dsCategoryChildMap, pagination, depth, 0);
        }

        return dsCategoryChildMap;
    }

    protected async getChildCategories(
        requestContext: RequestContext,
        dsCategories: AdobeCommerceCategory[],
        categoryChildMap: Record<string, AdobeCommerceCategory[]>,
        paginationInput: PaginationInput,
        depth: number,
        currentDepth: number = 0,
    ) {
        const methodname = `${AdobeCommerceCategoryServiceImpl.name}.getChildCategories`;

        if (dsCategories?.length > 0) {
            let dsResult: AdobeCommerceCategoryResult;

            const filter: AdobeCommerceCategoryFilterInput = {
                parent_category_uid: {
                    in: dsCategories.map((dsCategory) => dsCategory.uid),
                },
            };

            try {
                dsResult = await this.executeGetCategories(requestContext, filter, paginationInput?.pageSize, paginationInput?.page);
            } catch (error) {
                this.logger.info(`${methodname} - Error fetching child categories with filter ${this.logger.formatJSON(filter)}: ${error}`);
                throw CategoryErrors.categoryGetFailed();
            }

            const { items: dsChildrenCategories } = dsResult;

            dsChildrenCategories.forEach((dsCategory) => {
                const { uid, breadcrumbs } = dsCategory;

                if (!categoryChildMap[uid]) {
                    categoryChildMap[uid] = [];
                }

                if (breadcrumbs) {
                    breadcrumbs.forEach((dsBreadcrumb) => {
                        const { category_uid: parentId } = dsBreadcrumb;

                        if (!categoryChildMap[parentId]) {
                            //This should never happen as the logic goes from parent down the tree.
                            categoryChildMap[parentId] = [];
                        }

                        categoryChildMap[parentId].push(dsCategory);
                    });
                } else if (dsCategories.length == 1) {
                    //Seems root category child categories do not have breadcrumb populated.
                    categoryChildMap[dsCategories[0].uid].push(dsCategory);
                }
            });

            currentDepth += 1;

            if (currentDepth < depth && dsChildrenCategories.length > 0) {
                await this.getChildCategories(requestContext, dsChildrenCategories, categoryChildMap, paginationInput, depth, currentDepth);
            }
        }
    }

    protected async executeGetCategoryById(requestContext: RequestContext, id: string, productPagination: PaginationInput): Promise<AdobeCommerceCategory> {
        const filter: AdobeCommerceCategoryFilterInput = {
            category_uid: {
                eq: id,
            },
        };

        return await this.executeGetCategory(requestContext, filter);
    }

    protected async executeGetCategoryBySlug(requestContext: RequestContext, slug: string, productPagination?: PaginationInput): Promise<AdobeCommerceCategory> {
        const filter: AdobeCommerceCategoryFilterInput = {
            url_key: {
                eq: slug,
            },
        };

        return await this.executeGetCategory(requestContext, filter, productPagination);
    }

    protected async executeGetCategory(requestContext: RequestContext, filter: AdobeCommerceCategoryFilterInput, productPagination?: PaginationInput): Promise<AdobeCommerceCategory> {
        const methodname = `${AdobeCommerceCategoryServiceImpl.name}.executeGetCategory`;

        let dsCategory: AdobeCommerceCategory;

        try {
            const dsResult = await this.executeGetCategories(requestContext, filter, 100, 1, productPagination);

            dsCategory = dsResult?.items.length > 0 ? dsResult.items[0] : null;
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching child category with filter ${this.logger.formatJSON(filter)}: ${error}`);
            throw CategoryErrors.categoryGetFailed();
        }

        return dsCategory;
    }

    protected async executeGetCategories(requestContext: RequestContext, filter: AdobeCommerceCategoryFilterInput, pageSize?: number, currentPage?: number, productPagination?: PaginationInput) {
        return await this.getDatasource<AdobeCommerceCategoryDatasource>(requestContext).getCategories(requestContext, filter, pageSize, currentPage, productPagination);
    }

    protected getRootCategorySlug(requestContext: RequestContext) {
        const { configuration } = this.getPluginConsumerConfiguration<AdobeCommerceConsumerConfiguration>(requestContext);

        return configuration.locales[requestContext.locale].rootCategory;
    }
}
