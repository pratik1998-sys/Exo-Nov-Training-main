import { AdobeCommerceMoney } from "@plugin-adobe-commerce/common";

export class AdobeCommerceAppliedCoupon {
    code?: string;

    static baseGQL = `
        code
    `;
}

export class AdobeCommerceQuoteAddressCountry {
    code?: string;
    label?: string;

    static baseGQL = `
        code
        label
    `;
}

export class AdobeCommerceQuoteAddressRegion {
    code?: string;
    label?: string;
    region_id?: number;

    static baseGQL = `
        code
        label
        region_id
    `;
}

export class AdobeCommerceQuoteAddress {
    city?: string;
    company?: string;
    country?: AdobeCommerceQuoteAddressCountry;
    customer_notes?: string;
    fax?: string;
    firstname?: string;
    lastname?: string;
    postcode?: string;
    region?: AdobeCommerceQuoteAddressRegion;
    street?: string[];
    telephone?: string;
    // uid?: string;
    // vat_id?: string;

    static baseGQL = `
        city
        company
        country {
            ${AdobeCommerceQuoteAddressCountry.baseGQL}
        }
        customer_notes
        firstname
        lastname
        postcode
        region {
            ${AdobeCommerceQuoteAddressRegion.baseGQL}
        }
        street
        telephone
    `;
}

export class AdobeCommerceDiscount {
    amount?: AdobeCommerceMoney;
    //applied_to?: string;
    //coupon?: AdobeCommerceAppliedCoupon;
    //is_discounting_locked?: boolean;
    label?: string;
    //type?: string;
    //value?: number;

    static baseGQL = `
        amount {
            ${AdobeCommerceMoney.baseGQL}
        }
        label
    `;
}

export class AdobeCommerceTaxItem {
    amount?: AdobeCommerceMoney;
    rate?: number;
    title?: string;

    static baseGQL = `
        amount {
            ${AdobeCommerceMoney.baseGQL}
        }
        rate
        title
    `;
}
