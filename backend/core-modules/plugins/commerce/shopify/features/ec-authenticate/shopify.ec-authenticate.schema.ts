import { GraphqlDatasourceQuery } from '@plugin-datasource-graphql';
import { ShopifyCustomerUserError, ShopifyUserError } from '../ec-user/shopify.ec-user.schema';

export class ShopifyCustomerAccessToken {
    accessToken?: string;
    expiresAt?: string;

    static composeGQL() {
        return `
            accessToken
            expiresAt
        `;
    }
}

export class ShopifyCustomerAccessTokenCreateResult {
    customerAccessToken: ShopifyCustomerAccessToken;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAccessTokenCreateInput {
    email: string;
    password: string;
}

export class ShopifyAuthenticateQuery {
    protected static readonly customerAccessTokenClass = ShopifyCustomerAccessToken;
    protected static readonly customerUserErrorClass = ShopifyCustomerUserError;
    protected static readonly userErrorClass = ShopifyUserError;

    static customerAccessTokenCreate = (): GraphqlDatasourceQuery => {
        return {
            queryId: 'customerAccessTokenCreate',
            query: `mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
                        customerAccessTokenCreate(input: $input) {
                            customerAccessToken {
                                ${this.customerAccessTokenClass.composeGQL()}
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
}
