import { ShopifyMediaImage } from '@plugin-shopify/common/schema/2025-07/shopify.base.schema';
import {
    ShopifyMetaObject as _ShopifyMetaObject,
    ShopifyMetaObjectField as _ShopifyMetaObjectField,
    ShopifyMetaObjectQuery as _ShopifyMetaObjectQuery,
    ShopifyMetaObjectResultSet as _ShopifyMetaObjectResultSet,
} from '../shopify.metaobject.schema';
import { ShopifyCollection } from '@plugin-shopify/features/category/2025-07/shopify.2025-07.category.schema';

export class ShopifyMetaObject extends _ShopifyMetaObject {
    protected static getMetaObjectFieldClass() {
        return ShopifyMetaObjectField;
    }
}

export class ShopifyMetaObjectField extends _ShopifyMetaObjectField {
    protected static readonly mediaImageClass = ShopifyMediaImage;
    protected static readonly collectionClass = ShopifyCollection;
    protected static readonly metaObjectClass = ShopifyMetaObject;
}

export class ShopifyMetaObjectResultSet extends _ShopifyMetaObjectResultSet {
    edges?: { cursor?: string; node?: ShopifyMetaObject }[];

    protected static readonly metaObjectClass = ShopifyMetaObject;
}

export class ShopifyMetaObjectQuery extends _ShopifyMetaObjectQuery {
    protected static readonly metaObjectClass = ShopifyMetaObject;
    protected static readonly metaObjectResultSetClass = ShopifyMetaObjectResultSet;
}
