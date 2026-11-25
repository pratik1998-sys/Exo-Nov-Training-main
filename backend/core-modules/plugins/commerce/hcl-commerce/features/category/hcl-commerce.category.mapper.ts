import { RequestContext } from "@context/request";
import { CategoryResultSet, Category } from "@feature-commerce/category";
import { HCLCommerceBaseMapper } from "@plugin-hcl-commerce/common";

export class HCLCommerceCategoryMapper extends HCLCommerceBaseMapper {
    mapCategories(requestContext: RequestContext, dsResultSet: any): CategoryResultSet {
        return {
            pagination: this.mapPagination(requestContext, dsResultSet),
            results: dsResultSet.catalogGroupView.map((dsCategory) => this.mapCategory(requestContext, dsCategory)),
        };
    }

    mapCategory(requestContext: RequestContext, dsCategory: any): Category {
        const category: Category =
            dsCategory ?
                {
                    id: dsCategory.uniqueID,
                    slug: dsCategory.identifier,
                    identifier: dsCategory.identifier,
                    name: dsCategory.name,
                    description: dsCategory.shortDescription,
                    thumbnail:
                        dsCategory.thumbnail ?
                            {
                                url: dsCategory.thumbnail,
                            }
                            : null,
                    images:
                        dsCategory.fullImage ?
                            [
                                {
                                    url: dsCategory.fullImage,
                                },
                            ]
                            : [],
                    children: dsCategory.children ? dsCategory.children.map((dsChildCategory) => this.mapCategory(requestContext, dsChildCategory)) : [],
                }
                : {};

        return category;
    }
}
