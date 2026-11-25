
import { ShopifyColletionQuery } from './shopify.2025-10.category.schema';
import { ShopifyCategoryDatasource as _ShopifyCategoryDatasource } from '../2025-07/shopify.2025-07.category.datasource';
import { ShopifyMetaObjectQuery } from '@plugin-shopify/common/schema/2025-10/shopify.metaobject.schema';
import { ShopifyMenuQuery } from '@plugin-shopify/common/schema/2025-10/shopify.menu.schema';

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
