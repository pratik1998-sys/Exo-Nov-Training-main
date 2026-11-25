import { AdobeCommerceFilterEqualTypeInput, AdobeCommerceFilterMatchTypeInput, AdobeCommerceSearchResultPageInfo } from "@plugin-adobe-commerce/common";
import { AdobeCommerceProduct } from "@plugin-adobe-commerce/features/product";
import { GraphqlDatasourceQuery } from "@plugin-datasource-graphql";

export class AdobeCommerceBreadcrumb {
    category_level?: number;
    category_name?: string;
    category_uid?: string;
    category_url_key?: string;
    category_url_path?: string;

    static baseGQL = `
        category_level
        category_name
        category_uid
        category_url_key
        category_url_path
    `;
}

export class AdobeCommerceCategoryProducts {
    items?: AdobeCommerceProduct[];
    page_info?: AdobeCommerceSearchResultPageInfo;
    total_count?: number;

    static baseGQL(customAttributes) {
        return `
            items {
                ${AdobeCommerceProduct.baseGQL(customAttributes)}
            }
            page_info {
                ${AdobeCommerceSearchResultPageInfo.baseGQL}
            }
            total_count
        `;
    }
}

export class AdobeCommerceCategory {
    automatic_sorting?: string;
    available_sort_by?: string[];
    breadcrumbs?: AdobeCommerceBreadcrumb[];
    children_count?: string;
    description?: string;
    display_mode?: string;
    image?: string;
    include_in_menu?: number;
    is_anchor?: number;
    level?: number;
    meta_description?: string;
    meta_keywords?: string;
    meta_title?: string;
    name?: string;
    path?: string;
    path_in_store?: string;
    position?: number;
    product_count?: number;
    products?: AdobeCommerceCategoryProducts;
    uid?: string;
    url_key?: string;
    url_path?: string;
    url_suffix?: string;

    static baseGQL(includeProducts: boolean, customAttributes?: string[]) {
        let query = `
            children_count
            description
            display_mode
            image
            is_anchor
            level
            meta_description
            meta_keywords
            meta_title
            name
            position
            uid
            url_key
            breadcrumbs {
                ${AdobeCommerceBreadcrumb.baseGQL}
            }
        `;

        if (includeProducts) {
            query = `
                ${query}
                products(pageSize:$productPageSize, currentPage: $productCurrentPage) {
                    ${AdobeCommerceCategoryProducts.baseGQL(customAttributes)}
                }
            `;
        }

        return query;
    }
}

export class AdobeCommerceCategoryResult {
    items?: AdobeCommerceCategory[];
    page_info?: AdobeCommerceSearchResultPageInfo;
    total_count?: number;

    static baseGQL(includeProducts: boolean, customAttributes?: string[]) {
        return `
            items {
                ${AdobeCommerceCategory.baseGQL(includeProducts, customAttributes)}
            }
            page_info {
                ${AdobeCommerceSearchResultPageInfo.baseGQL}
            }
            total_count
        `;
    }
}

export class AdobeCommerceCategoryFilterInput {
    category_uid?: AdobeCommerceFilterEqualTypeInput;
    name?: AdobeCommerceFilterMatchTypeInput;
    parent_category_uid?: AdobeCommerceFilterEqualTypeInput;
    url_key?: AdobeCommerceFilterEqualTypeInput;
}

export const AdobeCommerceCategoryQueries = {
    getCategories: (): GraphqlDatasourceQuery => {
        return {
            queryId: 'categories',
            query: `query GetCategories($filters:CategoryFilterInput, $pageSize:Int, $currentPage:Int){
                categories(filters:$filters, pageSize:$pageSize, currentPage:$currentPage){
                    ${AdobeCommerceCategoryResult.baseGQL(false)}
                }
            }`,
        };
    },

    getCategoriesWithProducts: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'categories',
            query: `query GetCategories($filters:CategoryFilterInput, $pageSize:Int, $currentPage:Int, $productPageSize:Int, $productCurrentPage:Int){
                categories(filters:$filters, pageSize:$pageSize, currentPage:$currentPage){
                    ${AdobeCommerceCategoryResult.baseGQL(true, customAttributes)}
                }
            }`,
        };
    },
};
