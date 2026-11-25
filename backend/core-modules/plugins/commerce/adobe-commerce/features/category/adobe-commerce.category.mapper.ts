import { RequestContext } from "@context/request";
import { CategoryResultSet, Category } from "@feature-commerce/category";
import { AdobeCommerceBaseMapper } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCategory, AdobeCommerceCategoryResult } from "./schema/adobe-commerce.category.schema";
import { AdobeCommerceProductMapper } from "@plugin-adobe-commerce/features/product";

export class AdobeCommerceCategoryMapper extends AdobeCommerceBaseMapper {
    mapCategories(requestContext: RequestContext, dsResult: AdobeCommerceCategoryResult, childMap: Record<string, AdobeCommerceCategory[]>): CategoryResultSet {
        return {
            pagination: this.mapPagination(requestContext, dsResult?.page_info, dsResult.total_count),
            results: dsResult.items.map((dsCategory) => this.mapCategory(requestContext, dsCategory, childMap)),
        };
    }

    mapCategory(requestContext: RequestContext, dsCategory: AdobeCommerceCategory, childMap: Record<string, AdobeCommerceCategory[]>): Category {
        const category: Category =
            dsCategory ?
                {
                    id: dsCategory.uid,
                    slug: dsCategory.url_key,
                    name: dsCategory.name,
                    description: dsCategory.description,
                    thumbnail: {
                        url: dsCategory.image,
                    },
                    children:
                        childMap[dsCategory.uid] ?
                            childMap[dsCategory.uid].map((dsChildCategory) => {
                                return this.mapCategory(requestContext, dsChildCategory, childMap);
                            })
                            : [],
                    products:
                        dsCategory.products ?
                            this.getMapper<AdobeCommerceProductMapper>(requestContext, AdobeCommerceProductMapper).mapProductResultSet(requestContext, dsCategory.products, {})
                            : null,
                }
                : {};

        return category;
    }
}
