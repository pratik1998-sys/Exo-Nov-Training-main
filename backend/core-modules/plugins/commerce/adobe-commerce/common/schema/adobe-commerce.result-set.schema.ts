import { AdobeCommerceSearchResultPageInfo } from './adobe-commerce.common.schema';

export class AdobeCommerceResultSet {
    page_info?: AdobeCommerceSearchResultPageInfo;
    total_count?: number;

    static baseGQL = `
            page_info {
                ${AdobeCommerceSearchResultPageInfo.baseGQL}
            }
            total_count
        `;
}
