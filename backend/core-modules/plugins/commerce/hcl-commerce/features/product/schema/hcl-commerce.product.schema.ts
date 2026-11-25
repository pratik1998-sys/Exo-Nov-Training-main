/**
 * Types aligned with HCL Commerce 9.x Search REST **ProductView** resource (Swagger `search.yaml` — models such as
 * `Price`, `ProductDetail`, `FacetView`, `CatalogEntryView`, record-set and suggestion shapes).
 *
 * @see https://help.hcl-software.com/commerce/9.0.0/restapi/code/search.html — ProductView collection
 * @see https://help.hcl-software.com/commerce/9.0.0/restapi/code/search.yaml — OpenAPI (when available)
 */

/** Swagger: **Price** — one row in `catalogEntryView[].price`. */
export interface HCLCommerceProductRestPrice {
    usage?: string;
    description?: string;
    currency?: string;
    value?: string;
}

/** Swagger: **FacetView** `entry` item (facet bucket). */
export interface HCLCommerceProductRestFacetEntry {
    count?: string | number;
    label?: string;
    value?: string;
    selected?: string | boolean;
    extendedData?: HCLCommerceProductRestExtendedData;
    range?: HCLCommerceProductRestFacetRange;
}

export interface HCLCommerceProductRestFacetRange {
    from?: string;
    to?: string;
    min?: string;
    max?: string;
}

export interface HCLCommerceProductRestExtendedData {
    uniqueId?: string;
}

/** Swagger: **FacetView**. */
export interface HCLCommerceProductRestFacet {
    value?: string;
    name?: string;
    entry?: HCLCommerceProductRestFacetEntry[];
}

/** Swagger: **BreadCrumbTrailEntryView** (e.g. category navigation on `byCategory`). */
export interface HCLCommerceProductRestBreadcrumb {
    label?: string;
    type_?: string;
    value?: string;
}

/** Swagger: **MetaData** / loose metadata on product views. */
export interface HCLCommerceProductRestMetaData {
    [key: string]: string | undefined;
}

/**
 * Swagger: **ProductDetail** (serialized as objects in `catalogEntryView[]`).
 * Search index may return additional dotted field names (e.g. `relationship.parent`).
 */
export interface HCLCommerceProductRestCatalogEntry {
    hasSingleSKU?: string | boolean;
    buyable?: string | boolean;
    resourceId?: string;
    uniqueID?: string;
    name?: string;
    shortDescription?: string;
    longDescription?: string;
    manufacturer?: string;
    catalogEntryTypeCode?: string;
    parentCatalogGroupID?: string;
    thumbnail?: string;
    fullImage?: string;
    partNumber?: string;
    storeID?: string;
    type?: string;
    id?: string;
    price?: HCLCommerceProductRestPrice | HCLCommerceProductRestPrice[];
    /** Dotted keys from the search index (optional examples). */
    "relationship.parent"?: string;
    "manufacturer.normalized"?: string;
}

/**
 * ProductView GET response root (e.g. `byId`, `byIds`, `byPartNumbers`, `bySearchTerm`, `byCategory`, `/{partNumber}`).
 * Pagination fields may be string or number depending on server serialization.
 */
export interface HCLCommerceProductRestResponse {
    catalogEntryView?: HCLCommerceProductRestCatalogEntry[];
    facetView?: HCLCommerceProductRestFacet[];
    breadCrumbTrailEntryView?: HCLCommerceProductRestBreadcrumb[];
    recordSetComplete?: string | boolean;
    recordSetCount?: string | number;
    recordSetStartNumber?: string | number;
    recordSetTotal?: string | number;
    recordSetTotalMatches?: string | number;
    resourceId?: string;
    resourceName?: string;
    metaData?: HCLCommerceProductRestMetaData;
}

/** Shared optional query parameters for ProductView (aligns with CategoryView / search profiles). */
export interface HCLCommerceProductRestCommonQueryInput {
    pageNumber?: string | number;
    pageSize?: string | number;
    orderBy?: string;
    checkEntitlement?: string | boolean;
    responseFormat?: string;
    currency?: string;
    profileName?: string;
}

/** Query for `GET .../productview/byId/{productId}` */
export type HCLCommerceProductRestByIdQueryInput = HCLCommerceProductRestCommonQueryInput;

/** Query for `GET .../productview/byIds` — repeat `id` per Swagger. */
export interface HCLCommerceProductRestByIdsQueryInput extends HCLCommerceProductRestCommonQueryInput {
    id: string[];
}

/** Query for `GET .../productview/byPartNumbers` — repeat `partNumber` per Swagger. */
export interface HCLCommerceProductRestByPartNumbersQueryInput extends HCLCommerceProductRestCommonQueryInput {
    partNumber: string[];
}

/** Query for `GET .../productview/byCategory/{categoryId}` */
export type HCLCommerceProductRestByCategoryQueryInput = HCLCommerceProductRestCommonQueryInput;

/** Query for `GET .../productview/bySearchTerm/{searchTerm}` */
export type HCLCommerceProductRestBySearchTermQueryInput = HCLCommerceProductRestCommonQueryInput;

/** Query for `GET .../productview/{partNumber}` */
export type HCLCommerceProductRestByPartNumberPathQueryInput = HCLCommerceProductRestCommonQueryInput;

/**
 * Query names for `GET .../price?q=...` (transaction REST, not Search ProductView).
 * @see https://help.hcl-software.com/commerce/9.1.0/api/com/ibm/commerce/rest/price/handler/PriceHandler.html
 * @see https://help.hcl-software.com/commerce/9.1.0/restapi/code91/price_transaction.html
 */
export const HCLCommercePriceRestQueryName = {
    byCatalogEntryIds: "byCatalogEntryIds",
    byPartNumbers: "byPartNumbers",
} as const;

export type HCLCommercePriceRestQueryNameValue = (typeof HCLCommercePriceRestQueryName)[keyof typeof HCLCommercePriceRestQueryName];

/**
 * Query for `GET .../price` — entitled / range prices (`findByQuery` / `q` parameter).
 * Repeat `catalogEntryId` or `partNumber` in the query string per server contract.
 */
export interface HCLCommercePriceRestQueryInput {
    q: HCLCommercePriceRestQueryNameValue | string;
    catalogEntryId?: string[];
    partNumber?: string[];
    contractId?: string;
    quantity?: string | number;
    uom?: string;
    date?: string;
    checkEntitlement?: string | boolean;
    dynamicKitAsItem?: string | boolean;
    profileName?: string;
    responseFormat?: string;
    currency?: string;
}

/**
 * `com.ibm.commerce.foundation.common.datatypes.MonetaryAmountType` as used under **price-price** (e.g. `UnitPrice[].price`, `RangePrice[].priceInRange`).
 */
export interface HCLCommercePriceRestMonetaryAmount {
    currency?: string;
    /** Schema type is string; JSON may serialize numbers. */
    value?: string | number;
}

/**
 * `com.ibm.commerce.foundation.common.datatypes.QuantityType` as used under **price-price** (e.g. `UnitPrice[].quantity`, range min/max quantities).
 */
export interface HCLCommercePriceRestQuantity {
    uom?: string;
    value?: string | number;
}

/** `price-price_item.UnitPrice` */
export interface HCLCommercePriceRestItemUnitPrice {
    price?: HCLCommercePriceRestMonetaryAmount;
    quantity?: HCLCommercePriceRestQuantity;
}

/** `price-price_item.RangePrice` (e.g. `profile=range` on POST or entitled+range payloads). */
export interface HCLCommercePriceRestItemRangePrice {
    currency?: string;
    minimumQuantity?: HCLCommercePriceRestQuantity;
    maximumQuantity?: HCLCommercePriceRestQuantity;
    priceInRange?: HCLCommercePriceRestMonetaryAmount;
}

/** `price-price_item.userDataField` */
export interface HCLCommercePriceRestUserDataField {
    key?: string;
    value?: string;
}

/**
 * `price-price_item` — one element of `EntitledPrice[]`.
 * Field names match REST JSON (PascalCase `UnitPrice` / `RangePrice`).
 */
export interface HCLCommercePriceRestEntitledPriceItem {
    userDataField?: HCLCommercePriceRestUserDataField[];
    UnitPrice?: HCLCommercePriceRestItemUnitPrice[];
    productId?: string;
    /** Marked required in `price-price_item` schema; optional here for tolerant parsing. */
    partNumber?: string;
    RangePrice?: HCLCommercePriceRestItemRangePrice[];
    contractId?: string;
}

/**
 * GET/POST `.../price` response data type **price-price** (Swagger transaction bundle).
 *
 * @see https://help.hcl-software.com/commerce/9.1.0/restapi/code91/price_transaction.html
 * @see https://help.hcl-software.com/commerce/7.0.0/com.ibm.commerce.starterstores.doc/code/rsm_price_fep8.htm — Data Type Details (`price-price`, `price-price_item`)
 */
export interface HCLCommercePriceRestResponse {
    recordSetTotal?: string;
    EntitledPrice?: HCLCommercePriceRestEntitledPriceItem[];
    recordSetComplete?: string;
    recordSetStartNumber?: string;
    recordSetCount?: string;
    resourceId?: string;
    resourceName?: string;
}

/**
 * Transaction REST **inventoryavailability** — query for `GET .../inventoryavailability/{productIds}`.
 * Multiple catalog entry IDs are comma-separated in the path (see InventoryHandler in HCL Commerce 9.1.0 REST API docs).
 *
 * @see https://help.hcl-software.com/commerce/9.1.0/restapi/code91/order-capture_transaction.html — Inventory Availability
 * @see https://help.hcl-software.com/commerce/9.1.0/api/com/ibm/commerce/rest/inventory/handler/InventoryHandler.html
 */
export interface HCLCommerceInventoryAvailabilityByProductIdQueryInput {
    responseFormat?: string;
    onlineStoreId?: string;
    /** Multiple physical stores may be comma-separated in the query string. */
    physicalStoreId?: string;
}

/**
 * Transaction REST **inventoryavailability** — query for `GET .../inventoryavailability/byPartNumber/{partNumbers}`.
 */
export interface HCLCommerceInventoryAvailabilityByPartNumberQueryInput {
    responseFormat?: string;
    /** Per InventoryHandler this is required by the service; omit only if your deployment treats it as optional. */
    onlineStoreName?: string;
    physicalStoreName?: string;
}

/** `inventoryavailability-inventoryavailability_item` (Swagger order-capture bundle). */
export interface HCLCommerceInventoryAvailabilityRestItem {
    physicalStoreName?: string;
    onlineStoreName?: string;
    availabilityDateTime?: string;
    onlineStoreId?: string;
    unitOfMeasure?: string;
    availableQuantity?: string;
    inventoryStatus?: string;
    userDataField?: { key?: string; value?: string }[];
    physicalStoreId?: string;
    x_customField1?: string | null;
    x_customField2?: string | null;
    x_customField3?: string | null;
    productId?: string;
}

/** GET `.../inventoryavailability/{productIds}` and `.../byPartNumber/{partNumbers}` response root. */
export interface HCLCommerceInventoryAvailabilityRestResponse {
    resourceId?: string;
    resourceName?: string;
    InventoryAvailability?: HCLCommerceInventoryAvailabilityRestItem[];
}
