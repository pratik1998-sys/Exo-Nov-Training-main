import { GraphqlDatasourceQuery } from "@plugin-datasource-graphql";
import { ShopifyResultSet } from "@plugin-shopify/common/schema/shopify.base.schema";

export class ShopifyAddress {
    address1?: string;
    address2?: string;
    city?: string;
    company?: string;
    country?: string;
    countryCode?: string;
    countryCodeV2?: string;
    firstName?: string;
    formatted?: string[];
    formattedArea?: string;
    id?: string;
    lastName?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
    phone?: string;
    province?: string;
    provinceCode?: string;
    zip?: string;

    static composeGQL() {
        return `
            address1
            address2
            city
            company
            country
            countryCode
            countryCodeV2
            firstName
            formatted
            formattedArea
            id
            lastName
            latitude
            longitude
            name
            phone
            province
            provinceCode
            zip
        `;
    }
}

export class ShopifyAddressResultSet extends ShopifyResultSet {
    edges?: { cursor?: string; node?: ShopifyAddress }[];

    protected static readonly addressClass = ShopifyAddress;

    static composeGQL() {
        return super.composeResultSetSchema(this.addressClass.composeGQL(), false);
    }
}
