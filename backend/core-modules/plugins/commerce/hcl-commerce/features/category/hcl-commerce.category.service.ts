import { RequestContext } from "@context/request";
import { Category, CategoryFilterInput, CategoryResultSet, CategoryService } from "@feature-commerce/category";
import { PaginationInput } from "@feature/models";
import { HCLCommerceBaseServiceImpl } from "@plugin-hcl-commerce/common";
import { HCLCommerceCategoryErrors } from "./hcl-commerce.category.error";
import { HCLCommerceCategoryMapper } from "./hcl-commerce.category.mapper";
import { StringUtility } from "@utilities";
import { HCLCommerceCategoryDatasource } from "@plugin-hcl-commerce/features/category/hcl-commerce.category.datasource";

export class HCLCommerceCategoryServiceImpl extends HCLCommerceBaseServiceImpl implements CategoryService {
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
        const methodname = `${HCLCommerceCategoryServiceImpl.name}.category`;

        if (StringUtility.isStringEmpty(id)) {
            id = StringUtility.isStringNotEmpty(slug) ? slug : identifier;
        }

        let dsCategory;

        try {
            const dsResult = await this.getDatasource<HCLCommerceCategoryDatasource>(requestContext).findCategoryByIdentifier(requestContext, id);

            dsCategory = dsResult?.catalogGroupView?.length > 0 ? dsResult.catalogGroupView[0] : null;
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching category ${id}: ${this.logger.formatJSON(error)}`, requestContext);
            throw HCLCommerceCategoryErrors.categoryGetFailed();
        }

        if (dsCategory) {
            await this.getChildCategories(requestContext, [dsCategory], depth ?? 0, 0);
        }

        return this.getMapper<HCLCommerceCategoryMapper>(requestContext).mapCategory(requestContext, dsCategory);
    }

    // async getTopCategories(requestContext: RequestContext, context?: any): Promise<Category[]> {
    //     const methodname = `${HCLCommerceCategoryServiceImpl.name}.categoriesTop`;

    //     const dsResult = await this.executeGetTopCategories(requestContext);

    //     const categoryResultSet = this.getMapper<HCLCommerceCategoryMapper>(requestContext).mapCategories(requestContext, dsResult);

    //     return categoryResultSet.results;
    // }

    async getCategories(filter: CategoryFilterInput, pagination: PaginationInput, depth: number, requestContext: RequestContext, context?: any): Promise<CategoryResultSet> {
        const methodname = `${HCLCommerceCategoryServiceImpl.name}.getCategories`;
        this.logger.info(`${methodname} - Delegating to getTopCategories with depth: ${depth}`, requestContext);

        const dsResult = await this.executeGetTopCategories(requestContext);

        if (dsResult.catalogGroupView.length > 0) {
            await this.getChildCategories(requestContext, dsResult.catalogGroupView, depth ?? 0, 0);
        }

        const categoryResultSet = this.getMapper<HCLCommerceCategoryMapper>(requestContext).mapCategories(requestContext, dsResult);

        return categoryResultSet;
    }

    protected async executeGetTopCategories(requestContext: RequestContext) {
        const methodname = `${HCLCommerceCategoryServiceImpl.name}.executeGetTopCategories`;

        let dsResult;

        try {
            dsResult = await this.getDatasource<HCLCommerceCategoryDatasource>(requestContext).findTopCategories(requestContext);
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching top categories: ${error}`, requestContext);
            throw HCLCommerceCategoryErrors.categoryGetFailed();
        }

        return dsResult;
    }

    protected async getChildCategories(requestContext: RequestContext, dsCategories: any[], depth: number, currentDepth: number = 0) {
        const methodname = `${HCLCommerceCategoryServiceImpl.name}.getChildCategories`;

        if (currentDepth < depth) {
            const async = [];

            dsCategories.forEach((dsCategory) => {
                async.push(this.getCategoryChildCategories(requestContext, dsCategory));
            });

            await Promise.all(async);

            currentDepth += 1;

            if (currentDepth < depth) {
                let dsChildrenCategories = [];

                dsCategories.forEach((dsCategory) => {
                    if (dsCategory?.children) {
                        dsChildrenCategories = dsChildrenCategories.concat(dsCategory.children);
                    }
                });

                await this.getChildCategories(requestContext, dsChildrenCategories, depth, currentDepth);
            }
        }
    }

    protected async getCategoryChildCategories(requestContext: RequestContext, dsCategory: any) {
        const methodname = `${HCLCommerceCategoryServiceImpl.name}.getCategoryChildCategories`;

        if (dsCategory?.childCatalogGroupID && dsCategory.childCatalogGroupID.length > 0) {
            dsCategory.childCatalogGroupID = !Array.isArray(dsCategory.childCatalogGroupID) ? [dsCategory.childCatalogGroupID] : dsCategory.childCatalogGroupID;

            let dsResult;

            const catalogIdcategoryIdDelimiter = '_';

            const childCategoryIds = dsCategory.childCatalogGroupID.map((id: string) => {
                return id.includes(catalogIdcategoryIdDelimiter) ? id.substring(id.indexOf(catalogIdcategoryIdDelimiter) + 1) : id;
            });

            try {
                dsResult = await this.getDatasource<HCLCommerceCategoryDatasource>(requestContext).findCategoriesByIds(requestContext, childCategoryIds);
            } catch (error) {
                this.logger.error(`${methodname} - Error fetching child categories: ${this.logger.formatJSON(error)}`, requestContext);
                throw HCLCommerceCategoryErrors.categoryGetFailed();
            }

            dsCategory.children = dsResult.catalogGroupView ?? [];
        }
    }
}
