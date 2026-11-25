import { AdobeCommerceAttributeValue, AdobeCommerceAttributeValueInput } from "@plugin-adobe-commerce/common";
import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";

export class AdobeCommerceCreateCustomerInput {
    allow_remote_shopping_assistance?: boolean;
    custom_attributes?: AdobeCommerceAttributeValueInput[];
    date_of_birth?: string;
    email?: string;
    firstname?: string;
    gender?: number;
    is_subscribed?: boolean;
    lastname?: string;
    middlename?: string;
    password?: string;
    prefix?: string;
    suffix?: string;
    taxvat?: string;
}

export class AdobeCommerceCustomerAddressRegion {
    region_code?: string;
    region?: string;

    static baseGQL = `
        region_code
        region_id
        region
    `;
}

export class AdobeCommerceCustomerAddress {
    id?: string;
    firstname?: string;
    lastname?: string;
    street?: string[];
    city?: string;
    region?: AdobeCommerceCustomerAddressRegion;
    postcode?: string;
    country_code?: string;
    telephone?: string;
    default_billing?: boolean;
    default_shipping?: boolean;

    static baseGQL = `
        id
        firstname
        lastname
        street
        city
        region {
            ${AdobeCommerceCustomerAddressRegion.baseGQL}
        }
        postcode
        country_code
        telephone
        default_billing
        default_shipping
    `;
}

//TODO: The output is really the AC Customer interface...
export class AdobeCommerceCustomer {
    id?: string;
    date_of_birth?: string;
    email?: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    telephone?: string;
    custom_attributes?: AdobeCommerceAttributeValue[];
    addresses: AdobeCommerceCustomerAddress[];
    /*
    static baseGQL = `
        id
        date_of_birth
        email
        firstname
        middlename
        lastname
        custom_attributes {
            code
        }
    `;
    */

    static baseGQL = `
        id
        date_of_birth
        email
        firstname
        middlename
        lastname
        addresses {
            ${AdobeCommerceCustomerAddress.baseGQL}
        }
    `;
}

// export class AdobeCommerceCustomerAddressAttributeInput{

// }

export class AdobeCommerceCustomerAddressRegionInput {
    region?: string;
    region_code?: string;
    region_id?: string;
}

export class AdobeCommerceCustomerAddressInput {
    city?: string;
    company?: string;
    country_code?: string;
    country_id?: string;
    //custom_attributes?: AdobeCommerceCustomerAddressAttributeInput[];
    custom_attributesV2?: AdobeCommerceAttributeValueInput[];
    default_billing?: boolean;
    default_shipping?: boolean;
    fax?: string;
    firstname?: string;
    lastname?: string;
    middlename?: string;
    postcode?: string;
    prefix?: string;
    region?: AdobeCommerceCustomerAddressRegionInput;
    street?: string[];
    telephone?: string;
    vat_id?: string;
}

export const AdobeCommerceCustomerQueries: GraphqlDatasourceQueries = {
    createCustomerV2: {
        queryId: 'createCustomerV2',
        query: `mutation CreateCustomerV2($input:CustomerCreateInput!){
            createCustomerV2(input:$input){
                customer {
                    ${AdobeCommerceCustomer.baseGQL}
                }
            }
        }`,
    },
    customer: {
        queryId: 'customer',
        query: `query Customer{
            customer{
                ${AdobeCommerceCustomer.baseGQL}
            }
        }`,
    },

    createCustomerAddress: {
        queryId: 'createCustomerAddress',
        query: `mutation createCustomerAddress($input:CustomerAddressInput!){
            createCustomerAddress(input:$input){
                ${AdobeCommerceCustomerAddress.baseGQL}
            }
        }`,
    },

    updateCustomerAddress: {
        queryId: 'updateCustomerAddress',
        query: `mutation updateCustomerAddress($id:Int!, $input:CustomerAddressInput!){
            updateCustomerAddress(id:$id, input:$input){
                ${AdobeCommerceCustomerAddress.baseGQL}
            }
        }`,
    },

    deleteCustomerAddress: {
        queryId: 'deleteCustomerAddress',
        query: `mutation deleteCustomerAddress($id:Int!){
            deleteCustomerAddress(id:$id)
        }`,
    },
};
