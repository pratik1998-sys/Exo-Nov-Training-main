import { ShopifyNavigationDatasource as _ShopifyNavigationDatasource } from '../shopify.navigation.datasource';
import { ShopifyMetaObjectQuery } from '@plugin-shopify/common/schema/2025-07/shopify.metaobject.schema';
import { ShopifyMenuQuery } from '@plugin-shopify/common/schema/2025-07/shopify.menu.schema';

export class ShopifyNavigationDatasource extends _ShopifyNavigationDatasource {
    protected getMetaObjectQueryClass(): typeof ShopifyMetaObjectQuery {
        return ShopifyMetaObjectQuery;
    }

    protected getMenuQueryClass(): typeof ShopifyMenuQuery {
        return ShopifyMenuQuery;
    }
}
