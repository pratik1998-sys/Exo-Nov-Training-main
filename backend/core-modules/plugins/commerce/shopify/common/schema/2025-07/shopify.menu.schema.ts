import { ShopifyMenu as _ShopifyMenu, ShopifyMenuInput as _ShopifyMenuInput, ShopifyMenuItem as _ShopifyMenuItem, ShopifyMenuQuery as _ShopifyMenuQuery } from '../shopify.menu.schema';
import { ShopifyPage } from './shopify.page.schema';
import { ShopifyBlog } from './shopify.blog.schema';
import { GraphqlDatasourceQuery } from '@plugin-datasource-graphql';
import { ShopifyCollection } from '@plugin-shopify/features/category/shopify.category.schema';

export class ShopifyMenuItem extends _ShopifyMenuItem {
    items?: ShopifyMenuItem[];

    protected static readonly collectionClass = ShopifyCollection;
    protected static readonly pageClass = ShopifyPage;
    protected static readonly blogClass = ShopifyBlog;
}

export class ShopifyMenu extends _ShopifyMenu {
    items?: ShopifyMenuItem[];

    protected static readonly menuItemClass = ShopifyMenuItem;
}

export interface ShopifyMenuInput extends _ShopifyMenuInput { }

export class ShopifyMenuQuery extends _ShopifyMenuQuery {
    protected static readonly menuClass = ShopifyMenu;

    static getMenu = (depth: number): GraphqlDatasourceQuery => {
        return super.getMenu(depth);
    };
}
