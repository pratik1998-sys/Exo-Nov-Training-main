import { GraphqlDatasourceQuery } from '@plugin-datasource-graphql';
import { ShopifyAddress, ShopifyAddressResultSet } from '../address/shopify.address.schema';

export class ShopifyCustomer {
    acceptsMarketing?: boolean;
    addresses?: ShopifyAddressResultSet;
    createdAt?: string;
    defaultAddress?: ShopifyAddress;
    displayName?: string;
    email?: string;
    firstName?: string;
    id?: string;
    lastName?: string;
    numberOfOrders?: number;

    /**@todo - add ShopifyOrder class when Orders feature complete */
    orders?: any[];

    phone?: string;
    updatedAt?: string;

    protected static readonly addressClass = ShopifyAddress;
    protected static readonly addressResultSetClass = ShopifyAddressResultSet;

    static composeGQL(doAddresses: boolean, doOrders: boolean) {
        let query = `
            acceptsMarketing
            createdAt
            displayName
            email
            firstName
            id
            lastName
            numberOfOrders
            phone
            updatedAt
        `;

        if (doAddresses) {
            query = `
                ${query}
                defaultAddress {
                    ${this.addressClass.composeGQL()}
                }
                addresses(first: $addressFirst, after: $addressAfter) {
                    ${this.addressResultSetClass.composeGQL()}
                }
            `;
        }

        if (doOrders) {
            /**@todo - add ShopifyOrder class composeGQL when Orders feature complete */
            query = `
                ${query}
            `;
        }

        return query;
    }
}

export class ShopifyCustomerUserError {
    code?: string;
    field?: string;
    message?: string;

    static composeGQL() {
        return `
            code
            field
            message
        `;
    }
}

export class ShopifyUserError {
    field?: string;
    message?: string;

    static composeGQL() {
        return `
            field
            message
        `;
    }
}

export class ShopifyCustomerCreateResult {
    customer: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAddressCreateResult {
    customerAddress: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAddressUpdateResult {
    customerAddress: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAddressDeleteResult {
    deletedCustomerAddressId: string;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerDefaultAddressUpdateResult {
    customer: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerCreateInput {
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    password: string;
    acceptsMarketing?: boolean;
}

export class ShopifyCustomerInput {
    customerAccessToken: string;
    addressFirst: number;
    addressAfter?: string;
}

export class ShopifyCustomerAddressCreateInput {
    customerAccessToken: string;
    address: ShopifyAddress;
}

export class ShopifyCustomerAddressUpdateInput {
    customerAccessToken: string;
    address: ShopifyAddress;
    id: string;
}

export class ShopifyCustomerAddressDeleteInput {
    customerAccessToken: string;
    id: string;
}

export class ShopifyCustomerDefaultAddressUpdateInput {
    customerAccessToken: string;
    addressId: string;
    addressFirst: number;
    addressAfter?: string;
}

export class ShopifyCustomerQuery {
    protected static readonly customerClass = ShopifyCustomer;
    protected static readonly customerUserErrorClass = ShopifyCustomerUserError;
    protected static readonly userErrorClass = ShopifyUserError;
    protected static readonly addressClass = ShopifyAddress;

    static customerCreate = (): GraphqlDatasourceQuery => {
        return {
            queryId: 'customerCreate',
            query: `mutation CustomerCreate($input: CustomerCreateInput!) {
                        customerCreate(input: $input) {
                            customer {
                                ${this.customerClass.composeGQL(false, false)}
                            }
                            customerUserErrors {
                                ${this.customerUserErrorClass.composeGQL()}
                            }
                            userErrors{
                                ${this.userErrorClass.composeGQL()}
                            }
                        }
                    }`,
        };
    };

    static customer = (): GraphqlDatasourceQuery => {
        return {
            queryId: 'customer',
            query: `query Customer($customerAccessToken: String!, $addressFirst:Int, $addressAfter:String) {
                        customer(customerAccessToken: $customerAccessToken) {
                            ${this.customerClass.composeGQL(true, false)}
                        }
                    }`,
        };
    };

    static customerAddressCreate = (): GraphqlDatasourceQuery => {
        return {
            queryId: 'customerAddressCreate',
            query: `mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
                        customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
                            customerAddress {
                                ${this.addressClass.composeGQL()}
                            }
                            customerUserErrors {
                                ${this.userErrorClass.composeGQL()}
                            }
                            userErrors{
                                ${this.userErrorClass.composeGQL()}
                            }
                        }
                    }`,
        };
    };

    static customerAddressUpdate = (): GraphqlDatasourceQuery => {
        return {
            queryId: 'customerAddressUpdate',
            query: `mutation CustomerAddressUpdate($customerAccessToken: String!, $id:ID!, $address: MailingAddressInput!) {
                        customerAddressUpdate(customerAccessToken: $customerAccessToken, id:$id, address: $address) {
                            customerAddress {
                                ${this.addressClass.composeGQL()}
                            }
                            customerUserErrors {
                                ${this.userErrorClass.composeGQL()}
                            }
                            userErrors{
                                ${this.userErrorClass.composeGQL()}
                            }
                        }
                    }`,
        };
    };

    static customerAddressDelete = (): GraphqlDatasourceQuery => {
        return {
            queryId: 'customerAddressDelete',
            query: `mutation CustomerAddressDelete($customerAccessToken: String!, $id:ID!) {
                        customerAddressDelete(customerAccessToken: $customerAccessToken, id:$id) {
                            deletedCustomerAddressId
                            customerUserErrors {
                                ${this.userErrorClass.composeGQL()}
                            }
                            userErrors{
                                ${this.userErrorClass.composeGQL()}
                            }
                        }
                    }`,
        };
    };

    static customerDefaultAddressUpdate = (): GraphqlDatasourceQuery => {
        return {
            queryId: 'customerAddressDelete',
            query: `mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId:ID!, $addressFirst:Int, $addressAfter:String) {
                        customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId:$addressId) {
                            customer {
                                ${this.customerClass.composeGQL(true, false)}
                            }
                            customerUserErrors {
                                ${this.userErrorClass.composeGQL()}
                            }
                            userErrors{
                                ${this.userErrorClass.composeGQL()}
                            }
                        }
                    }`,
        };
    };
}
