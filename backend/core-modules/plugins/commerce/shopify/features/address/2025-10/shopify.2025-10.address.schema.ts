import { ShopifyAddress as _ShopifyAddress, ShopifyAddressResultSet as _ShopifyAddressResultSet } from '../2025-07/shopify.2025-07.address.schema';

export class ShopifyAddress extends _ShopifyAddress {}

export class ShopifyAddressResultSet extends _ShopifyAddressResultSet {
    edges?: { cursor?: string; node?: ShopifyAddress }[];

    protected static readonly addressClass = ShopifyAddress;
}
