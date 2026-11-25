import { RequestContext } from '@context/request';
import { ShopifyBaseMapper } from '@plugin-shopify/common';
import { ShopifyNavigationConsumerConfiguration } from './shopify.navigation.configuration.type';
import { NavigationItem } from '@feature-navigation/navigation.model';
import { ShopifyMenuItem } from '@plugin-shopify/common/schema/shopify.menu.schema';

export class ShopifyNavigationMapper extends ShopifyBaseMapper {
    protected readonly urlTokens = {
        pages: '/pages',
        collections: '/collections',
    };

    protected readonly menuItemTypeTranslation = {
        FRONTPAGE: {
            id: 'FRONTPAGE',
            type: 'page',
        },
        COLLECTION: {
            id: 'COLLECTION',
            type: 'category',
        },
        CATALOG: {
            id: 'CATALOG',
            type: 'category',
        },
        PAGE: {
            id: 'PAGE',
            type: 'page',
        },
        BLOG: {
            id: 'BLOG',
            type: 'blog',
        },
        ARTICLE: {
            id: 'ARTICLE',
            type: 'article',
        },
    };

    mapNavigationItems(requestContext: RequestContext, dsMenuItems: ShopifyMenuItem[], host: string): NavigationItem[] {
        return dsMenuItems ? dsMenuItems.map((dsMenuItem) => this.mapNavigationItem(requestContext, dsMenuItem, host)) : [];
    }

    mapNavigationItem(requestContext: RequestContext, dsMenuItem: ShopifyMenuItem, host: string): NavigationItem {
        let navigationItem: NavigationItem = null;

        if (dsMenuItem) {
            navigationItem = {
                identifier: dsMenuItem.resource?.handle ?? dsMenuItem.id,
                label: dsMenuItem.title,
                isInternalNavigation: true,
                description: dsMenuItem.resource?.title ?? null,
                target: '_self',
                url: null,
                type: this.menuItemTypeTranslation[dsMenuItem.type] ?? this.menuItemTypeTranslation.PAGE,
                navigationItems: dsMenuItem.items?.map((dsChildMenuItem) => this.mapNavigationItem(requestContext, dsChildMenuItem, host)),
            };

            const { COLLECTION, CATALOG, PAGE, FRONTPAGE, BLOG, ARTICLE } = this.menuItemTypeTranslation;

            if (dsMenuItem.type == COLLECTION.id || dsMenuItem.type == CATALOG.id) {
                this.mapCategoryNavigationItem(requestContext, dsMenuItem, navigationItem);
            } else if (dsMenuItem.type == PAGE.id || dsMenuItem.type == FRONTPAGE.id || dsMenuItem.type == BLOG.id || dsMenuItem.type == ARTICLE.id) {
                this.mapPageNavigationItem(requestContext, dsMenuItem, navigationItem);
            }

            navigationItem.type = this.menuItemTypeTranslation[dsMenuItem.type]?.type ?? 'page';
        }

        return navigationItem;
    }

    protected mapCategoryNavigationItem(requestContext: RequestContext, dsMenuItem: ShopifyMenuItem, navigationItem: NavigationItem) {
        const { configuration } = this.getPluginConsumerConfiguration<ShopifyNavigationConsumerConfiguration>(requestContext);

        const { shopPath, categoryPath } = configuration;

        const { COLLECTION } = this.menuItemTypeTranslation;

        const { type, resource } = dsMenuItem;

        navigationItem.url = `/${shopPath}`;

        if (COLLECTION.id == type) {
            navigationItem.url = `${navigationItem.url}/${categoryPath}/${resource?.handle}`;
        }
    }

    protected mapPageNavigationItem(requestContext: RequestContext, dsMenuItem: ShopifyMenuItem, navigationItem: NavigationItem) {
        const { FRONTPAGE, BLOG, ARTICLE } = this.menuItemTypeTranslation;

        const { configuration } = this.getPluginConsumerConfiguration<ShopifyNavigationConsumerConfiguration>(requestContext);

        const { blogPath, articlePath } = configuration;

        const { type, resource } = dsMenuItem;

        navigationItem.url = '/';

        if (BLOG.id == type) {
            navigationItem.url = `/${blogPath}/`;
        } else if (ARTICLE.id == type) {
            navigationItem.url = `/${articlePath}/`;
        }

        if (FRONTPAGE.id != type) {
            navigationItem.url = `${navigationItem.url}${resource?.handle}`;
        }
    }
}
