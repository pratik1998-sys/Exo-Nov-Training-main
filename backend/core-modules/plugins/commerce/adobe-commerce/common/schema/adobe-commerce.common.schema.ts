export class AdobeCommerceSearchResultPageInfo {
    current_page?: number;
    page_size?: number;
    total_pages?: number;

    static baseGQL = `
        current_page
        page_size
        total_pages
    `;
}

export class AdobeCommerceComplexTextValue {
    html?: string;

    static baseGQL = `
        html
    `;
}

export class AdobeCommerceMediaGallery {
    disabled?: boolean;
    label?: string;
    position?: number;
    url?: string;

    static baseGQL = `
        disabled
        label
        position
        url
    `;
}

export class AdobeCommerceMoney {
    currency?: string;
    value?: number;

    static baseGQL = `
        currency
        value
    `;
}

/*
export class AdobeCommerceCustomizableOption {
    required?: string;
    sort_order?: number;
    title?: string;
    uid?: string;
}
*/

export class AdobeCommercePriceDetails {
    discount_percentage?: number;
    main_final_price?: number;
    main_price?: number;
}

export class AdobeCommerceGiftCardAmounts {
    attribute_id?: number;
    uid?: string;
    value?: number;
    website_id?: number;
    website_value?: number;
}

export class AdobeCommerceFilterEqualTypeInput {
    eq?: string;
    in?: string[];
}

export enum AdobeCommerceFilterMatchTypeEnum {
    FULL,
    PARTIAL,
}

export enum AdobeCommerceSortEnum {
    ASC,
    DESC,
}

export class AdobeCommerceFilterMatchTypeInput {
    match?: string;
    match_type?: AdobeCommerceFilterMatchTypeEnum;
}

export class AdobeCommerceFilterRangeTypeInput {
    from?: string;
    to?: string;
}

export class AdobeCommerceQuoteItemsSortInput {
    field?: string;
    order?: AdobeCommerceSortEnum;
}
