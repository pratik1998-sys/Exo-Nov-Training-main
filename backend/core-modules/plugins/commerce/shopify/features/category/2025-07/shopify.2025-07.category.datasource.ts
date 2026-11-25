import { ShopifyCategoryDatasource as _ShopifyCategoryDatasource } from '../shopify.category.datasource';
import { ShopifyColletionQuery } from './shopify.2025-07.category.schema';
import { ShopifyMetaObjectQuery } from '@plugin-shopify/common/schema/2025-07/shopify.metaobject.schema';
import { ShopifyMenuQuery } from '@plugin-shopify/common/schema/2025-07/shopify.menu.schema';

export class ShopifyCategoryDatasource extends _ShopifyCategoryDatasource {
    protected getQueryClass() {
        return ShopifyColletionQuery;
    }

    protected getMetaObjectQueryClass(): typeof ShopifyMetaObjectQuery {
        return ShopifyMetaObjectQuery;
    }

    protected getMenuQueryClass(): typeof ShopifyMenuQuery {
        return ShopifyMenuQuery;
    }
}
