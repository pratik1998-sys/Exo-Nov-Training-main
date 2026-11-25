import { AdobeCommerceAttributeValue, AdobeCommerceComplexTextValue, AdobeCommerceFilterEqualTypeInput, AdobeCommerceFilterMatchTypeInput, AdobeCommerceFilterRangeTypeInput, AdobeCommerceGiftCardAmounts, AdobeCommerceMediaGallery, AdobeCommerceMoney, AdobeCommercePriceDetails, AdobeCommerceSearchResultPageInfo, AdobeCommerceSortEnum } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCategory } from "@plugin-adobe-commerce/features/category";
import { GraphqlDatasourceQuery } from "@plugin-datasource-graphql";

export class AdobeCommerceProductCustomAttributes {
    items?: AdobeCommerceAttributeValue[];

    static baseGQL = `
        items {
            ${AdobeCommerceAttributeValue.baseGQL}
        }
    `;
}

export class AdobeCommerceProductImage extends AdobeCommerceMediaGallery { }

export class AdobeCommerceProductMediaGalleryEntriesVideoContent {
    media_type?: string;
    video_description?: string;
    video_metadata?: string;
    video_provider?: string;
    video_title?: string;
    video_url?: string;
}

export class AdobeCommerceProductVideo extends AdobeCommerceMediaGallery {
    video_content: AdobeCommerceProductMediaGalleryEntriesVideoContent;
}

export class AdobeCommerceProductDiscount {
    amount_off?: number;
    percent_off?: number;

    static baseGQL = `
        amount_off
        percent_off
    `;
}

export class AdobeCommerceFixedProductTax {
    amount?: AdobeCommerceMoney;
    label?: string;

    static baseGQL = `
        amount {
            ${AdobeCommerceMoney.baseGQL}
        }
        label
    `;
}

export class AdobeCommerceProductPrice {
    discount?: AdobeCommerceProductDiscount;
    final_price?: AdobeCommerceMoney;
    fixed_product_taxes?: AdobeCommerceFixedProductTax[];
    regular_price?: AdobeCommerceMoney;

    static baseGQL = `
        discount {
            ${AdobeCommerceProductDiscount.baseGQL}
        }
        final_price {
            ${AdobeCommerceMoney.baseGQL}
        }
        fixed_product_taxes {
            ${AdobeCommerceFixedProductTax.baseGQL}
        }
        regular_price {
            ${AdobeCommerceMoney.baseGQL}
        }
    `;
}

export class AdobeCommercePriceRange {
    maximum_price?: AdobeCommerceProductPrice;
    minimum_price?: AdobeCommerceProductPrice;

    static baseGQL = `
        maximum_price {
            ${AdobeCommerceProductPrice.baseGQL}
        }
        minimum_price {
            ${AdobeCommerceProductPrice.baseGQL}
        }
    `;
}

export class AdobeCommerceTierPrice {
    discount?: AdobeCommerceProductDiscount;
    final_price?: AdobeCommerceMoney;
    quantity?: number;
}

export class AdobeCommerceProductReviewRating {
    name?: string;
    value?: string;
}

export class AdobeCommerceProductReview {
    average_rating?: number;
    created_at?: string;
    nickname?: string;
    product?: AdobeCommerceProduct;
    ratings_breakdown?: AdobeCommerceProductReviewRating[];
    summary?: string;
    text?: string;
}

export class AdobeCommerceProductReviews {
    page_info?: AdobeCommerceSearchResultPageInfo;
    items?: AdobeCommerceProductReview[];
}

export class AdobeCommerceProduct {
    categories?: AdobeCommerceCategory;
    crosssell_products?: AdobeCommerceProduct[];
    custom_attributesV2?: AdobeCommerceProductCustomAttributes;
    description?: AdobeCommerceComplexTextValue;
    gift_message_available?: string;
    image?: AdobeCommerceProductImage;
    is_returnable?: string;
    media_gallery?: AdobeCommerceMediaGallery[];
    meta_description?: string;
    meta_keyword?: string;
    meta_title?: string;
    name?: string;
    new_from_date?: string;
    new_to_date?: string;
    only_x_left_in_stock?: number;
    price_range?: AdobeCommercePriceRange;
    price_tiers?: AdobeCommerceTierPrice[];
    rating_summary?: number;
    related_products?: AdobeCommerceProduct[];
    review_count?: number;
    reviews?: AdobeCommerceProductReviews;
    short_description?: AdobeCommerceComplexTextValue;
    sku?: string;
    small_image?: AdobeCommerceProductImage;
    special_price?: number;
    special_to_date?: string;
    staged?: boolean;
    stock_status?: string;
    swatch_image?: string;
    thumbnail?: AdobeCommerceProductImage;
    type_id?: string;
    uid?: string;
    upsell_products?: AdobeCommerceProduct[];
    url_key?: string;
    url_suffix?: string;

    static baseGQL(customAttributes: string[]) {
        return `
            categories {
                ${AdobeCommerceCategory.baseGQL(false)}
            }
            description {
                ${AdobeCommerceComplexTextValue.baseGQL}
            }
            image {
                ${AdobeCommerceProductImage.baseGQL}
            }
            name
            price_range {
                ${AdobeCommercePriceRange.baseGQL}
            }
            short_description {
                ${AdobeCommerceComplexTextValue.baseGQL}
            }
            sku
            small_image {
                ${AdobeCommerceProductImage.baseGQL}
            }
            thumbnail {
                ${AdobeCommerceProductImage.baseGQL}
            }
            type_id
            uid
            url_key
            ${customAttributes.join(' ')}
            ... on ConfigurableProduct {
                configurable_options {
                    id
                    uid
                    label
                    attribute_code
                    attribute_id
                    attribute_uid
                    use_default
                    values {
                        label
                        default_label
                        uid
                        use_default_value
                    }
                }
            }
        `;
    }

    static cartProductBaseGQL(customAttributes: string[]) {
        return `
            name
            price_range {
                ${AdobeCommercePriceRange.baseGQL}
            }
            sku
            thumbnail {
                ${AdobeCommerceProductImage.baseGQL}
            }
            type_id
            uid
            url_key
            ${customAttributes.join(' ')}
        `;
    }
}

export class AdobeCommerceBundleItemOption {
    can_change_quantity?: boolean;
    is_default?: boolean;
    label?: string;
    position?: number;
    price?: number;
    price_type?: string;
    product?: AdobeCommerceProduct;
    quantity?: number;
    uid?: string;
}

export class AdobeCommerceBundleItem {
    options?: AdobeCommerceBundleItemOption[];
    position?: number;
    price_range?: AdobeCommercePriceRange;
    required?: boolean;
    sku?: string;
    title?: string;
    type?: string;
    uid?: string;
}

export class AdobeCommerceVirtualProduct extends AdobeCommerceProduct {
    media_description?: string;
    //options?: AdobeCommerceCustomizableOption[];
}

export class AdobeCommerceSimpleProduct extends AdobeCommerceProduct {
    //options?: AdobeCommerceCustomizableOption[];
    weight?: number;
}

export class AdobeCommerceSwatchData {
    value: string;
}

export class AdobeCommerceImageSwatchData extends AdobeCommerceSwatchData {
    thumbnail: string;
}

export class AdobeCommerceTextSwatchData extends AdobeCommerceSwatchData { }

export class AdobeCommerceColorSwatchData extends AdobeCommerceSwatchData { }

export class AdobeCommerceConfigurableProductOptionValue {
    is_available?: boolean;
    is_use_default?: boolean;
    label?: string;
    swatch?: AdobeCommerceSwatchData;
    uid?: string;
}

export class AdobeCommerceConfigurableProductOption {
    attribute_code?: string;
    label?: string;
    uid?: string;
    values?: AdobeCommerceConfigurableProductOptionValue[];
}

export class AdobeCommerceConfigurableOptionAvailableForSelection {
    attribute_code?: string;
    option_value_uids?: string[];
}

export class AdobeCommerceConfigurableProductOptionsSelection {
    configurable_options?: AdobeCommerceConfigurableProductOption[];
    media_gallery?: AdobeCommerceMediaGallery[];
    options_available_for_selection?: AdobeCommerceConfigurableOptionAvailableForSelection[];
    variant?: AdobeCommerceSimpleProduct;
}

export class AdobeCommerceConfigurableProductOptionsValues {
    default_label?: string;
    label?: string;
    store_label?: string;
    swatch_data?: AdobeCommerceSwatchData;
    uid?: string;
    use_default_value?: boolean;
}

export class AdobeCommerceConfigurableProductOptions {
    attribute_code?: string;
    attribute_uid?: string;
    label?: string;
    position?: number;
    uid?: string;
    use_default?: boolean;
    values?: AdobeCommerceConfigurableProductOptionsValues[];
}

export class AdobeCommerceConfigurableProduct extends AdobeCommerceProduct {
    configurable_options?: AdobeCommerceConfigurableProductOptions[];
    configurable_product_options_selection?: AdobeCommerceConfigurableProductOptionsSelection;
    //options?: AdobeCommerceCustomizableOption;
    weight?: number;
}

export class AdobeCommerceDownloadableProductLinks {
    sample_url?: string;
    sort_order?: number;
    title?: string;
    uid?: string;
}

export class AdobeCommerceDownloadableProductSamples {
    sample_url?: string;
    sort_order?: number;
    title?: string;
}

export class AdobeCommerceDownloadableProduct extends AdobeCommerceProduct {
    downloadable_product_links?: AdobeCommerceDownloadableProductLinks[];
    downloadable_product_samples?: AdobeCommerceDownloadableProductSamples[];
    links_purchased_separately?: number;
    links_title?: string;
}

export class AdobeCommerceGiftCardProduct extends AdobeCommerceProduct {
    allow_message?: boolean;
    allow_open_amount?: boolean;
    giftcard_amounts?: AdobeCommerceGiftCardAmounts[];
    giftcard_type?: string;
    is_redeemable?: boolean;
    limetime?: number;
    message_max_length?: number;
    open_amount_max?: number;
    open_amount_min?: number;
    weight?: number;
}

export class AdobeCommerceGroupedProductItem {
    position?: number;
    product?: AdobeCommerceProduct;
    qty?: number;
}

export class AdobeCommerceGroupedProduct extends AdobeCommerceProduct {
    items?: AdobeCommerceGroupedProductItem[];
    weight?: number;
}

export class AdobeCommerceBundleProduct extends AdobeCommerceProduct {
    dynamic_price?: boolean;
    dynamic_sku?: boolean;
    dynamic_weight?: boolean;
    items?: AdobeCommerceBundleItem[];
    //options?: AdobeCommerceCustomizableOption[];
    price_details?: AdobeCommercePriceDetails;
    price_view?: string;
    ship_bundle_items?: string;
    weight?: number;
}

export class AdobeCommerceAggregationOption {
    count?: number;
    label?: string;
    value?: string;

    static baseGQL = `
        count
        label
        value
    `;
}

export class AdobeCommerceAggregation {
    attribute_code?: string;
    count?: number;
    label?: string;
    options?: AdobeCommerceAggregationOption[];
    position?: number;

    static baseGQL = `
        attribute_code
        count
        label
        options {
            ${AdobeCommerceAggregationOption.baseGQL}
        }
        position
    `;
}

export class AdobeCommerceSortField {
    label?: string;
    value?: string;

    static baseGQL = `
        label
        value
    `;
}

export class AdobeCommerceSortFields {
    default?: string;
    options: AdobeCommerceSortField[];

    static baseGQL = `
        default
        options {
            ${AdobeCommerceSortField.baseGQL}
        }
    `;
}

export class AdobeCommerceSearchSuggestion {
    search?: string;

    static baseGQL = `
        search
    `;
}

export class AdobeCommerceProductAttributeSortInput {
    name?: AdobeCommerceSortEnum;
    position?: AdobeCommerceSortEnum;
    price?: AdobeCommerceSortEnum;
    relevance?: AdobeCommerceSortEnum;
}

export class AdobeCommerceProductAttributeFilterInput {
    category_uid?: AdobeCommerceFilterEqualTypeInput;
    category_url_path?: AdobeCommerceFilterEqualTypeInput;
    description?: AdobeCommerceFilterMatchTypeInput;
    name?: AdobeCommerceFilterMatchTypeInput;
    price?: AdobeCommerceFilterRangeTypeInput;
    short_description?: AdobeCommerceFilterMatchTypeInput;
    sku?: AdobeCommerceFilterEqualTypeInput;
    url_key?: AdobeCommerceFilterEqualTypeInput;
}

export class AdobeCommerceProductResult {
    aggregations?: AdobeCommerceAggregation[];
    items?: AdobeCommerceProduct[];
    page_info?: AdobeCommerceSearchResultPageInfo;
    sort_fields?: AdobeCommerceSortFields[];
    suggestions?: AdobeCommerceSearchSuggestion[];
    total_count?: number;

    static baseGQL(customAttributes: string[]) {
        return `
            aggregations {
                ${AdobeCommerceAggregation.baseGQL}
            }
            items {
                ${AdobeCommerceProduct.baseGQL(customAttributes)}
            }
            page_info {
                ${AdobeCommerceSearchResultPageInfo.baseGQL}
            }
            sort_fields {
                ${AdobeCommerceSortFields.baseGQL}
            }
            suggestions {
                ${AdobeCommerceSearchSuggestion.baseGQL}
            }
            total_count
        `;
    }
}

export const AdobeCommerceProductQueries = {
    getProducts: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'products',
            query: `query GetProducts($search:String, $filter:ProductAttributeFilterInput, $pageSize:Int, $currentPage:Int, $sort:ProductAttributeSortInput){
                products(search:$search, filter:$filter, pageSize:$pageSize, currentPage:$currentPage, sort:$sort){
                    ${AdobeCommerceProductResult.baseGQL(customAttributes)}
                }
            }`,
        };
    },
};
