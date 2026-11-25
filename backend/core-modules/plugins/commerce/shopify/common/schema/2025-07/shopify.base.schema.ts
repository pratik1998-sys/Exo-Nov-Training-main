import {
    ShopifyImage as _ShopifyImage,
    ShopifyPageInfo as _ShopifyPageInfo,
    ShopifyResultSet as _ShopifyResultSet,
    ShopifySEO as _ShopifySEO,
    ShopifyMediaImage as _ShopifyMediaImage,
} from '../../schema/shopify.base.schema';

export class ShopifyImage extends _ShopifyImage {}

export class ShopifyMediaImage extends _ShopifyMediaImage {
    protected static readonly imageClass = ShopifyImage;
}

export class ShopifySEO extends _ShopifySEO {}

export class ShopifyPageInfo extends _ShopifyPageInfo {}

export class ShopifyResultSet extends _ShopifyResultSet {}
