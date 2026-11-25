import { ShopifyBaseDatasource } from "@plugin-shopify/common";

/**
 * As of now, the Shopify "menu" schema and queries are handled in the base datasource.
 *
 * This may change to have a standalone "menu" feature, meaning, no EXO feature but a
 * plugin feature is auto initialized for use in the code base at another time. If/When
 * this happens, this datasource will need to be adjusted to call those datasource methods,
 * or, the serviceImpl will need to be adjusted to use that "standalone" datasource.
 */
export class ShopifyNavigationDatasource extends ShopifyBaseDatasource { }
