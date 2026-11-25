import { ShopifyCustomerUserError, ShopifyUserError } from '../../ec-user/2025-07/shopify.2025-07.ec-user.schema';
import {
    ShopifyCustomerAccessToken as _ShopifyCustomerAccessToken,
    ShopifyCustomerAccessTokenCreateInput as _ShopifyCustomerAccessTokenCreateInput,
    ShopifyAuthenticateQuery as _ShopifyAuthenticateQuery,
    ShopifyCustomerAccessTokenCreateResult as _ShopifyCustomerAccessTokenCreateResult,
} from '../shopify.ec-authenticate.schema';

export class ShopifyCustomerAccessToken extends _ShopifyCustomerAccessToken {}

export class ShopifyCustomerAccessTokenCreateResult extends _ShopifyCustomerAccessTokenCreateResult {
    customerAccessToken: ShopifyCustomerAccessToken;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAccessTokenCreateInput extends _ShopifyCustomerAccessTokenCreateInput {}

export class ShopifyAuthenticateQuery extends _ShopifyAuthenticateQuery {
    protected static readonly customerAccessTokenClass = ShopifyCustomerAccessToken;
}
