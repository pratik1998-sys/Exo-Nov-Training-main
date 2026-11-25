
import { ShopifyNavigationDatasource } from './shopify.navigation.datasource';
import { ShopifyNavigationMapper } from './shopify.navigation.mapper';
import { RequestContext } from '@context/request';
import { ShopifyNavigationConsumerConfiguration } from './shopify.navigation.configuration.type';
import { BaseRegistry } from '@registry';
import { FooterNavigation, HeaderNavigation } from '@feature-navigation';
import { PluginConfiguration } from '@configuration/types';
import { ShopifyConsumerConfiguration, ShopifyDatasourceConfiguration, ShopifyMenuConfiguration } from '@plugin-shopify/common';
import { StringUtility } from '@utilities';
import { ShopifyMenu } from '@plugin-shopify/common/schema/shopify.menu.schema';

export class ShopifyNavigationRegistry extends BaseRegistry {
    private data: Record<string, any> = {};

    protected consumerHeaders: Record<string, HeaderNavigation> = {};
    protected consumerFooters: Record<string, FooterNavigation> = {};

    protected async load() {
        const methodname = `${ShopifyNavigationRegistry.name}.load`;

        const results = await this.fetchData();

        results.forEach((result) => {
            this.consumerHeaders[result.consumerId] = result.headerNavigation;
            this.consumerFooters[result.consumerId] = result.footerNavigation;

            this.data[result.consumerId] = result;
        });

        this.logger.info(`${methodname} - Loaded registry with data: ${this.logger.formatJSON(this.data)}`);
    }

    protected async fetchData() {
        const consumerConfigurations: ShopifyNavigationConsumerConfiguration[] = Object.values(
            this.getPluginConfiguration<PluginConfiguration>().configuredConsumers as Record<string, ShopifyNavigationConsumerConfiguration>,
        );

        const async = [];

        consumerConfigurations.forEach((consumerConfiguration) => {
            if (consumerConfiguration.configuration.doNavigationRegistry) {
                async.push(this.fetchConsumerNavigation(consumerConfiguration));
            }
        });

        return await Promise.all(async);
    }

    protected async fetchConsumerNavigation(consumerConfiguration: ShopifyConsumerConfiguration) {
        const { configuration, id: consumerId } = consumerConfiguration;

        const headerNavigation: HeaderNavigation = {
            mainNavigationItems: [],
            quickNavigationItems: [],
        };

        const footerNavigation: FooterNavigation = {
            mainNavigationItems: [],
            quickNavigationItems: [],
        };

        const async = [
            this.fetchConsumerNavigationGroup(consumerConfiguration, configuration.menus?.header, configuration.menus?.headerQuick, headerNavigation),
            this.fetchConsumerNavigationGroup(consumerConfiguration, configuration.menus?.footer, configuration.menus?.footerQuick, footerNavigation),
        ];

        await Promise.all(async);

        return { consumerId, headerNavigation, footerNavigation };
    }

    protected async fetchConsumerNavigationGroup(
        consumerConfiguration: ShopifyConsumerConfiguration,
        mainNavigationConfiguration: ShopifyMenuConfiguration,
        quickNavigationConfiguration: ShopifyMenuConfiguration,
        navigationContainer: HeaderNavigation | FooterNavigation,
    ) {
        const async = [];

        const hasMain = StringUtility.isStringNotEmpty(mainNavigationConfiguration?.id);
        const hasQuick = StringUtility.isStringNotEmpty(quickNavigationConfiguration?.id);

        if (hasMain) {
            async.push(this.fetchMenu(consumerConfiguration, mainNavigationConfiguration));
        }

        if (hasQuick) {
            async.push(this.fetchMenu(consumerConfiguration, quickNavigationConfiguration));
        }

        if (async.length > 0) {
            const results = await Promise.all(async);

            let mainResult: ShopifyMenu;
            let quickResult: ShopifyMenu;

            if (hasMain) {
                mainResult = results[0];

                if (hasQuick) {
                    quickResult = results[1];
                }
            } else {
                quickResult = results[0];
            }

            const { id: consumerId } = consumerConfiguration;

            const mapper = this.getNavigationMapper(consumerId);

            const requestContext: RequestContext = { consumer: consumerId };

            const { host } = this.getNavigationDatasource(consumerId).getDatasourceConfig<ShopifyDatasourceConfiguration>(requestContext);

            if (mainResult) {
                navigationContainer.mainNavigationItems = mapper.mapNavigationItems(requestContext, mainResult.items, host);
            }

            if (quickResult) {
                navigationContainer.quickNavigationItems = mapper.mapNavigationItems(requestContext, quickResult.items, host);
            }
        }
    }

    protected addConsumerToMenuMap(menuConfiguration: ShopifyMenuConfiguration, menuMap: Record<string, ShopifyConsumerConfiguration[]>, consumerConfiguration: ShopifyConsumerConfiguration) {
        if (menuConfiguration) {
            const { id } = menuConfiguration;

            if (!menuMap[id]) {
                menuMap[id] = [];
            }

            menuMap[id].push(consumerConfiguration);
        }
    }

    protected async fetchMenu(consumerConfiguration: ShopifyConsumerConfiguration, menuConfiguration: ShopifyMenuConfiguration): Promise<ShopifyMenu> {
        const methodname = `${ShopifyNavigationRegistry.name}.fetchMenu`;

        const { id: consumerId } = consumerConfiguration;
        const { id: menuHandle, depth } = menuConfiguration;

        const ds = this.getNavigationDatasource(consumerId);

        let menu: ShopifyMenu;

        try {
            menu = await ds.getMenu({ consumer: consumerId }, menuHandle, depth, false);
        } catch (error) {
            //Fail silently
            this.logger.info(`${methodname} - Error fetching menu [${menuHandle}]: ${this.logger.formatJSON(error)}`);
        }

        return menu;
    }

    protected getNavigationDatasource(consumerId: string) {
        return this.getDatasource<ShopifyNavigationDatasource>(consumerId, ShopifyNavigationDatasource);
    }

    protected getNavigationMapper(consumerId: string) {
        return this.getMapper<ShopifyNavigationMapper>(consumerId, ShopifyNavigationMapper);
    }

    getConsumerHeader(consumerId: string) {
        return this.consumerHeaders[consumerId] ?? null;
    }

    getConsumerFooter(consumerId: string) {
        return this.consumerFooters[consumerId] ?? null;
    }

    getRegistryData() {
        return this.data;
    }
}
