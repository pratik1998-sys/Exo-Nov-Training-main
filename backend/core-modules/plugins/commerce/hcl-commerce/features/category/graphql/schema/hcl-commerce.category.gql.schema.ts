import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";
import { HCLCommercePagination } from "@plugin-hcl-commerce/common";

/*
export class HCLCommerceBreadcrumb {
    category_level?: number;
    category_name?: string;
    category_uid?: string;
    category_url_key?: string;
    category_url_path?: string;

    static baseGQL = `
            `;
}
*/

export class HCLCommerceCategory {
    /*
    id?: string;
    catalogGroupID?: string; // Derived from identifier in HCL Commerce
    name?: string;
    description?: string;
    thumbnail?: string;
    identifier?: string;
    shortDescription?: string;
    fullImage?: string;
    parentCatalogGroupID?: string;
    parentCatalogGroup?: HCLCommerceCategory;
    children?: HCLCommerceCategory[];
    sequence?: number;
    storeID?: string;
    breadcrumbs?: HCLCommerceBreadcrumb[];
    url?: string; // Derived from identifier in HCL Commerce
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
    */

    // This is not used directly in the GraphQL query anymore
    // We're using explicit field names in the query
    static baseGQL = `
        name
        thumbnail
        identifier
        shortDescription
        fullImage
        parentCatalogGroupID
        childCatalogGroupID
        sequence
        storeID
        uniqueID
    `;
}

/*
export class HCLCommerceCategoryResult {
    items?: HCLCommerceCategory[];
    page_info?: HCLCommerceSearchResultPageInfo;
    total_count?: number;

    static baseGQL = `
        items {
            ${HCLCommerceCategory.baseGQL}
        }
        page_info {
            ${HCLCommerceSearchResultPageInfo.baseGQL}
        }
        total_count
    `;
}

export class HCLCommerceCategoryFilterInput {
    category_uid?: HCLCommerceFilterEqualTypeInput;
    name?: HCLCommerceFilterMatchTypeInput;
    parent_category_uid?: HCLCommerceFilterEqualTypeInput;
    url_key?: HCLCommerceFilterEqualTypeInput;
}
*/

export class HCLCommerceCategoryResult {
    static baseGQL = `
        ${HCLCommercePagination.baseGQL}
        catalogGroupView {
            ${HCLCommerceCategory.baseGQL}
        }
    `;
}

export const HCLCommerceCategoryQueries: GraphqlDatasourceQueries = {
    findTopCategories: {
        queryId: 'findTopCategories',
        query: `query findTopCategories($storeId: String!, $catalogId: String) {
            findTopCategories(storeId: $storeId, catalogId: $catalogId) {
                ${HCLCommerceCategoryResult.baseGQL}
            }
        }`,
    },
    findCategoryByIdentifier: {
        queryId: 'findCategoryByIdentifier',
        query: `query findCategoryByIdentifier($storeId: String!, $catalogId: String, $langId: String, $identifier: String!) {
            findCategoryByIdentifier(storeId: $storeId, catalogId: $catalogId, langId: $langId, categoryIdentifier: $identifier) {
                ${HCLCommerceCategoryResult.baseGQL}
            }
        }`,
    },
    findCategoriesByIdentifiers: {
        queryId: 'findCategoryByIdentifiers',
        query: `query findCategoryByIdentifiers($storeId: String!, $catalogId: String, $langId: String, $identifiers: String!) {
            findCategoryByIdentifiers(storeId: $storeId, catalogId: $catalogId, langId: $langId, identifier: $identifiers) {
                ${HCLCommerceCategoryResult.baseGQL}
            }
        }`,
    },
    findCategoryById: {
        queryId: 'findCategoryByUniqueId',
        query: `query findCategoryByUniqueId($storeId: String!, $catalogId: String, $langId: String, $id: String!) {
            findCategoryByUniqueId(storeId: $storeId, catalogId: $catalogId, langId: $langId, id: $id) {
                ${HCLCommerceCategoryResult.baseGQL}
            }
        }`,
    },
    findCategoriesByIds: {
        queryId: 'findCategoriesByUniqueIds',
        query: `query findCategoriesByUniqueIds($storeId: String!, $catalogId: String, $langId: String, $ids: [String]!) {
            findCategoriesByUniqueIds(storeId: $storeId, catalogId: $catalogId, langId: $langId, id: $ids) {
                ${HCLCommerceCategoryResult.baseGQL}
            }
        }`,
    },
};
