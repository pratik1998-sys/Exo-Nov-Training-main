import { RequestContext } from "@context/request";
import { CategoryResultSet, Category } from "@feature-commerce/category";
import { GetCategories, SAPCommerceBaseMapper } from "@plugin-sap-commerce/common";

export class SAPCommerceCategoryMapper extends SAPCommerceBaseMapper {
    mapCategoryResultSet(requestContext: RequestContext, dsCategories: GetCategories.Response._200[]): CategoryResultSet {
        return {
            pagination: this.mapPagination(requestContext, dsCategories),
            results: dsCategories.map((dsCategory) => this.mapCategory(requestContext, dsCategory)),
        };
    }

    mapCategory(requestContext: RequestContext, dsCategory: GetCategories.Response._200): Category {
        const category: Category =
            dsCategory ?
                {
                    id: dsCategory.id,
                    slug: dsCategory.id,
                    name: dsCategory.name,
                    children: dsCategory.subcategories.map((dsCategory) => this.mapCategory(requestContext, dsCategory)),
                    //products: dsCategory.products ? this.getMapper<AdobeCommerceProductMapper>(requestContext, AdobeCommerceProductMapper).mapProductResultSet(requestContext, dsCategory.products, {}) : null,
                }
                : {};

        return category;
    }
}
