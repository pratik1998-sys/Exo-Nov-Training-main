import { RequestContext } from "@context/request";
import { CategoryService } from "@feature-commerce/category";
import { FooterNavigation, HeaderNavigation, NavigationService } from "@feature-navigation";
import { CommercetoolsBaseServiceImpl, CommercetoolsConsumerConfiguration } from "@plugin-commercetools/common";
import { CommercetoolsNavigationMapper } from "@plugin-commercetools/features/navigation/commercetools.navigation.mapper";

export class CommercetoolsNavigationServiceImpl extends CommercetoolsBaseServiceImpl implements NavigationService {
    async getHeaderNavigation(requestContext: RequestContext, context?: any): Promise<HeaderNavigation> {
        const methodname = `${CommercetoolsNavigationServiceImpl.name}.getHeaderNavigation`;

        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        const categoryResultSet = await this.getService<CategoryService>(requestContext, CategoryService).getCategories(null, null, configuration.navigationDepthCategories ?? 3, requestContext, context);

        const mapper = this.getNavigationMapper(requestContext);

        return {
            mainNavigationItems: mapper.mapCategoryNavigationItems(requestContext, categoryResultSet),
            quickNavigationItems: [],
        };
    }

    async getFooterNavigation(requestContext: RequestContext, context?: any): Promise<FooterNavigation> {
        const methodname = `${CommercetoolsNavigationServiceImpl.name}.getFooterNavigation`;

        return {
            mainNavigationItems: [],
            quickNavigationItems: [],
        }
    }

    protected getNavigationMapper(requestContext: RequestContext): CommercetoolsNavigationMapper {
        return this.getMapper<CommercetoolsNavigationMapper>(requestContext, CommercetoolsNavigationMapper);
    }
}
