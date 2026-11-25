import { RequestContext } from '@context/request';
import { HttpException } from '@nestjs/common';
import { ShopifyNavigationDatasource } from './shopify.navigation.datasource';
import { ShopifyNavigationMapper } from './shopify.navigation.mapper';
import { ShopifyNavigationConsumerConfiguration, ShopifyNavigationConsumerConfigurationConfig } from './shopify.navigation.configuration.type';
import { ShopifyNavigationRegistry } from './shopify.navigation.registry';
import { ShopifyBaseServiceImpl, ShopifyDatasourceConfiguration, ShopifyMenuConfiguration } from '@plugin-shopify/common';
import { FooterNavigation, HeaderNavigation, NavigationErrors, NavigationItem, NavigationService } from '@feature-navigation';
import { StringUtility } from '@utilities';
import { ShopifyMenu } from '@plugin-shopify/common/schema/shopify.menu.schema';

export class ShopifyNavigationServiceImpl extends ShopifyBaseServiceImpl implements NavigationService {
    async getHeaderNavigation(requestContext: RequestContext, context?: any): Promise<HeaderNavigation> {
        const methodname = `${ShopifyNavigationServiceImpl.name}.getHeaderNavigation`;

        const { consumer: consumerId } = requestContext;

        const configuration = this.getConsumerConfiguration(requestContext);

        const { doNavigationRegistry } = configuration;

        let headerNavigation: HeaderNavigation;

        if (doNavigationRegistry) {
            headerNavigation = this.getNavigationRegistry(requestContext).getConsumerHeader(consumerId);
        }

        if (!headerNavigation) {
            if (doNavigationRegistry) {
                this.logger.info(`${methodname} - No consumer [${consumerId}] header found in registry - fetching`, requestContext);
            }

            headerNavigation = await this.getNavigation(configuration.menus?.header, configuration.menus?.headerQuick, 'header', 'header-quick', NavigationErrors.getHeaderFailed(), requestContext);
        }

        return headerNavigation;
    }

    async getFooterNavigation(requestContext: RequestContext, context?: any): Promise<FooterNavigation> {
        const methodname = `${ShopifyNavigationServiceImpl.name}.getFooterNavigation`;

        const { consumer: consumerId } = requestContext;

        const configuration = this.getConsumerConfiguration(requestContext);

        const { doNavigationRegistry } = configuration;

        let footerNavigation: FooterNavigation;

        if (doNavigationRegistry) {
            footerNavigation = this.getNavigationRegistry(requestContext).getConsumerFooter(consumerId);
        }

        if (!footerNavigation) {
            if (doNavigationRegistry) {
                this.logger.info(`${methodname} - No consumer [${consumerId}] footer found in registry - fetching`, requestContext);
            }

            footerNavigation = await this.getNavigation(configuration.menus?.footer, configuration.menus?.footerQuick, 'footer', 'footer-quick', NavigationErrors.getFooterFailed(), requestContext);
        }

        return footerNavigation;
    }

    protected async getNavigation(
        mainMenuConfiguration: ShopifyMenuConfiguration,
        quickMenuConfiguration: ShopifyMenuConfiguration,
        mainType: string,
        quickType: string,
        error: HttpException,
        requestContext: RequestContext,
    ) {
        const methodname = `${ShopifyNavigationServiceImpl.name}.getNavigation`;

        const async = [this.getNavigationType(mainMenuConfiguration, mainType, error, requestContext), this.getNavigationType(quickMenuConfiguration, quickType, error, requestContext)];

        const [mainNavigationItems, quickNavigationItems] = await Promise.all(async);

        return {
            mainNavigationItems,
            quickNavigationItems,
        };
    }

    protected async getNavigationType(menuConfiguration: ShopifyMenuConfiguration, type: string, error: HttpException, requestContext: RequestContext) {
        const methodname = `${ShopifyNavigationServiceImpl.name}.getNavigation`;

        const { id, depth } = menuConfiguration ?? {};

        let navigationItems: NavigationItem[] = [];

        if (StringUtility.isStringNotEmpty(id)) {
            const ds = this.getNavigationDatasource(requestContext);

            let dsMenu: ShopifyMenu;

            try {
                dsMenu = await ds.getMenu(requestContext, id, depth ?? 5, false);
            } catch (e) {
                throw error;
            }

            const dsConfig = this.getNavigationDatasource(requestContext).getDatasourceConfig<ShopifyDatasourceConfiguration>(requestContext);

            const { host } = dsConfig;

            const mapper = this.getNavigationMapper(requestContext);

            navigationItems = dsMenu?.items?.map((dsMenuItem) => mapper.mapNavigationItem(requestContext, dsMenuItem, host));
        } else {
            this.logger.info(`${methodname} - WARNING: No ${type} menu handle defined`, requestContext);
        }

        return navigationItems;
    }

    protected getNavigationMapper(requestContext: RequestContext) {
        return this.getMapper<ShopifyNavigationMapper>(requestContext, ShopifyNavigationMapper);
    }

    protected getNavigationDatasource(requestContext: RequestContext) {
        return this.getDatasource<ShopifyNavigationDatasource>(requestContext, ShopifyNavigationDatasource);
    }

    protected getNavigationRegistry(requestContext: RequestContext) {
        return this.getRegistry<ShopifyNavigationRegistry>(requestContext, ShopifyNavigationRegistry);
    }

    protected getConsumerConfiguration(requestContext: RequestContext): ShopifyNavigationConsumerConfigurationConfig {
        const { configuration } = this.getPluginConsumerConfiguration<ShopifyNavigationConsumerConfiguration>(requestContext);

        return configuration;
    }
}
