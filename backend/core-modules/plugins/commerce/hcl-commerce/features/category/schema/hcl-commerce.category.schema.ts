/**
 * Types aligned with HCL Commerce 9.x Search REST **CategoryView** resource.
 *
 * @see https://help.hcl-software.com/commerce/9.0.0/restapi/code/search.html — Swagger UI (CategoryView collection)
 * @see https://help.hcl-software.com/commerce/9.1.0/search/refs/rsdCategoryView.html — category by identifier
 * @see https://help.hcl-software.com/commerce/9.1.0/search/refs/rsdcategoryviewbyIDs.html — byIds
 */

/** Single category row in `catalogGroupView` (CategoryView response body). */
export interface HCLCommerceCategoryViewCatalogGroup {
    resourceId?: string;
    uniqueID?: string;
    parentCatalogGroupID?: string;
    thumbnail?: string;
    name?: string;
    identifier?: string;
    shortDescription?: string;
    storeID?: string;
    fullImage?: string;
    /** Child category unique IDs when returned by @top / expanded views. */
    childCatalogGroupID?: string[];
    /** HCL JSON field name (dotted key). */
    'path.reversed'?: string;
    /** HCL JSON field name (dotted key). */
    'category.parent'?: string;
}

/**
 * CategoryView GET response root (record set + `catalogGroupView`).
 * Pagination fields are strings or numbers depending on server serialization.
 */
export interface HCLCommerceCategoryViewResponse {
    catalogGroupView?: HCLCommerceCategoryViewCatalogGroup[];
    recordSetComplete?: string | boolean;
    recordSetCount?: string | number;
    recordSetStartNumber?: string | number;
    recordSetTotal?: string | number;
    resourceId?: string;
    resourceName?: string;
}

/** Optional query parameters for `categoryview/@top`. */
export interface HCLCommerceCategoryViewTopQueryInput {
    depthAndLimit?: string;
    pageNumber?: string | number;
    pageSize?: string | number;
    orderBy?: string;
    checkEntitlement?: string | boolean;
    responseFormat?: string;
    currency?: string;
}

/** Optional query parameters for `categoryview/{categoryIdentifier}` (beyond catalogId/langId from base datasource). */
export interface HCLCommerceCategoryViewByIdentifierQueryInput {
    depthAndLimit?: string;
    pageNumber?: string | number;
    pageSize?: string | number;
    orderBy?: string;
    checkEntitlement?: string | boolean;
    responseFormat?: string;
    currency?: string;
}

/**
 * Query parameters for `categoryview/byIds`.
 * `id` is sent as repeated query keys: `id=10001&id=10002`.
 */
export interface HCLCommerceCategoryViewByIdsQueryInput {
    id: string[];
    depthAndLimit?: string;
    pageNumber?: string | number;
    pageSize?: string | number;
    orderBy?: string;
    checkEntitlement?: string | boolean;
    responseFormat?: string;
    currency?: string;
}
