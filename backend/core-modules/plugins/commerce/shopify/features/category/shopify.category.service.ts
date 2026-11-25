
import { RequestContext } from '@context/request';
import { ShopifyCategoryDatasource } from './shopify.category.datasource';
import { ShopifyCategoryRegistry } from './shopify.category.registry';
import { ShopifyBaseServiceImpl } from '@plugin-shopify/common';
import { Category, CategoryFilterInput, CategoryResultSet, CategoryService } from '@feature-commerce/category';
import { PaginationInput } from '@feature/models';
import { StringUtility } from '@utilities';


export class ShopifyCategoryServiceImpl extends ShopifyBaseServiceImpl implements CategoryService {
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
        const methodname = `${ShopifyCategoryServiceImpl.name}.getCategory`;

        let category: Category = null;

        const registry = this.getCategoryRegistry(requestContext);

        if (StringUtility.isStringNotEmpty(id)) {
            category = registry.getCategoryById(requestContext.consumer, id);
        } else {
            category = registry.getCategoryBySlug(requestContext.consumer, identifier || slug);
        }

        return category;
    }

    async getCategories(filter: CategoryFilterInput, pagination: PaginationInput, depth: number, requestContext: RequestContext, context?: any): Promise<CategoryResultSet> {
        const methodname = `${ShopifyCategoryServiceImpl.name}.getCategories`;

        const registry = this.getCategoryRegistry(requestContext);

        let categoryList: Category[] = [];

        if (filter?.ids?.length > 0 || filter?.identifiers?.length > 0 || filter?.slugs?.length > 0) {
            const categoryMap: Record<string, Category> = {};

            filter?.ids?.forEach((id) => {
                const category = registry.getCategoryById(requestContext.consumer, id);

                this.addCategoryToCategoryIdMap(category, categoryMap);
            });

            filter?.identifiers?.forEach((identifier) => {
                const category = registry.getCategoryBySlug(requestContext.consumer, identifier);

                this.addCategoryToCategoryIdMap(category, categoryMap);
            });

            filter?.slugs?.forEach((slug) => {
                const category = registry.getCategoryBySlug(requestContext.consumer, slug);

                this.addCategoryToCategoryIdMap(category, categoryMap);
            });

            categoryList = Object.values(categoryMap);
        } else {
            const registry = this.getRegistry<ShopifyCategoryRegistry>(requestContext, ShopifyCategoryRegistry);

            categoryList = registry.getTopCategories(requestContext.consumer);
        }

        const categoryResultSet: CategoryResultSet = {
            pagination: {
                pageSize: categoryList.length,
                pageCount: 1,
                resultCount: categoryList.length,
                hasMorePages: false,
                page: 1,
            },
            results: categoryList,
        };

        return categoryResultSet;
    }

    protected addCategoryToCategoryIdMap(category: Category, categoryMap: Record<string, Category>) {
        if (category) {
            categoryMap[category.id] = category;
        }
    }

    protected getCategoryRegistry(requestContext: RequestContext) {
        return this.getRegistry<ShopifyCategoryRegistry>(requestContext, ShopifyCategoryRegistry);
    }

    protected getCategoryDatasource(requestContext: RequestContext): ShopifyCategoryDatasource {
        return this.getDatasource<ShopifyCategoryDatasource>(requestContext, ShopifyCategoryDatasource);
    }
}
