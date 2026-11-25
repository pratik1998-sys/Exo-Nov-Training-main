import { ShopifyImage, ShopifySEO } from '@plugin-shopify/common/schema/2025-10/shopify.base.schema';
import {
    ShopifyColletionQuery as _ShopifyColletionQuery,
    ShopifyCollection as _ShopifyCollection,
    ShopifyCollectionResultSet as _ShopifyCollectionResultSet,
    ShopifyCollectionInput as _ShopifyCollectionInput,
    ShopifyCollectionResultSetInput as _ShopifyCollectionResultSetInput,
} from '../2025-07/shopify.2025-07.category.schema';

export class ShopifyCollection extends _ShopifyCollection {
    protected static readonly imageClass = ShopifyImage;
    protected static readonly seoClass = ShopifySEO;
}

export class ShopifyCollectionResultSet extends _ShopifyCollectionResultSet {
    edges?: { cursor?: string; node?: ShopifyCollection }[];

    protected static readonly collectionClass = ShopifyCollection;
}

export interface ShopifyCollectionInput extends _ShopifyCollectionInput { }
export interface ShopifyCollectionResultSetInput extends _ShopifyCollectionResultSetInput { }

export class ShopifyColletionQuery extends _ShopifyColletionQuery {
    protected static readonly collectionClass = ShopifyCollection;
    protected static readonly collectionResultSetClass = ShopifyCollectionResultSet;
}
