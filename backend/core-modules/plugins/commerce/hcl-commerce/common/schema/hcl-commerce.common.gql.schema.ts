/*
export class HCLCommerceSearchResultPageInfo {
    current_page?: number;
    page_size?: number;
    total_pages?: number;

    static baseGQL = `
        current_page
        page_size
        total_pages
    `;
}

export class HCLCommerceFilterEqualTypeInput {
    eq?: string;
    in?: string[];
}

export enum HCLCommerceFilterMatchTypeEnum {
    FULL,
    PARTIAL,
}

export enum HCLCommerceSortEnum {
    ASC,
    DESC,
}

export class HCLCommerceFilterMatchTypeInput {
    match?: string;
    match_type?: HCLCommerceFilterMatchTypeEnum;
}

export class HCLCommerceFilterRangeTypeInput {
    from?: string;
    to?: string;
}
*/

export class HCLCommercePagination {
    static baseGQL = `
        recordSetComplete
        recordSetCount
        recordSetStartNumber
        recordSetTotal
    `;
}
