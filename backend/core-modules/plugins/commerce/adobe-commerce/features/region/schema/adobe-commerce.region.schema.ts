import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";

export class AdobeCommerceCountryRegion {
    id?: string;
    code?: string;
    name?: string;

    static baseGQL = `
        id
        code
        name
    `;
}

export class AdobeCommerceCountry {
    id?: string;
    two_letter_abbreviation?: string;
    three_letter_abbreviation?: string;
    full_name_locale?: string;
    full_name_english?: string;
    available_regions?: AdobeCommerceCountryRegion[];

    static baseGQL = `
        full_name_english
        full_name_locale
        id
        three_letter_abbreviation
        two_letter_abbreviation
        available_regions {
            ${AdobeCommerceCountryRegion.baseGQL}
        }
    `;
}

export const AdobeCommerceRegionQueries: GraphqlDatasourceQueries = {
    countries: {
        queryId: 'countries',
        query: `query Countries {
            countries {
                ${AdobeCommerceCountry.baseGQL}
            }
        }`,
    },
    country: {
        queryId: 'country',
        query: `query Country($id:String!){
            country(id: $id) {
                ${AdobeCommerceCountry.baseGQL}
            }
        }`,
    },
};
