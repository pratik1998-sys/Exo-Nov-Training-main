import { RequestContext } from "@context/request";
import { Category, CategoryResultSet } from "@feature-commerce/category";
import { NavigationItem } from "@feature-navigation";
import { CommercetoolsBaseMapper, CommercetoolsEntity } from "@plugin-commercetools/common";

export class CommercetoolsNavigationMapper extends CommercetoolsBaseMapper {
    mapResultSetEntity(requestContext: RequestContext, dsEntity: CommercetoolsEntity) {
        throw new Error("Method not implemented.");
    }

    mapCategoryNavigationItems(requestContext: RequestContext, categoryResultSet: CategoryResultSet): NavigationItem[] {
        return categoryResultSet.results.map((category) => this.mapCategoryNavigationItem(requestContext, category));
    }

    mapCategoryNavigationItem(requestContext: RequestContext, category: Category): NavigationItem {
        const navigationItem: NavigationItem = {
            label: category.name,
            url: category.slug,
            description: category.description ?? '',
            type: 'category',
            navigationItems: [],
        };

        if (category.children?.length > 0) {
            navigationItem.navigationItems = category.children.map((childCategory) => this.mapCategoryNavigationItem(requestContext, childCategory));
        }

        return navigationItem;
    }
}