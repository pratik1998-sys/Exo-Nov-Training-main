import { GraphqlDatasourceQuery } from '@plugin-datasource-graphql';
import { ShopifyAddress, ShopifyAddressResultSet } from '../../address/2025-07/shopify.2025-07.address.schema';
import {
    ShopifyCustomer as _ShopifyCustomer,
    ShopifyCustomerUserError as _ShopifyCustomerUserError,
    ShopifyUserError as _ShopifyUserError,
    ShopifyCustomerQuery as _ShopifyCustomerQuery,
    ShopifyCustomerCreateResult as _ShopifyCustomerCreateResult,
    ShopifyCustomerCreateInput as _ShopifyCustomerCreateInput,
    ShopifyCustomerAddressCreateResult as _ShopifyCustomerAddressCreateResult,
    ShopifyCustomerAddressUpdateResult as _ShopifyCustomerAddressUpdateResult,
    ShopifyCustomerAddressDeleteResult as _ShopifyCustomerAddressDeleteResult,
    ShopifyCustomerDefaultAddressUpdateResult as _ShopifyCustomerDefaultAddressUpdateResult,
    ShopifyCustomerInput as _ShopifyCustomerInput,
    ShopifyCustomerAddressCreateInput as _ShopifyCustomerAddressCreateInput,
    ShopifyCustomerAddressUpdateInput as _ShopifyCustomerAddressUpdateInput,
    ShopifyCustomerAddressDeleteInput as _ShopifyCustomerAddressDeleteInput,
    ShopifyCustomerDefaultAddressUpdateInput as _ShopifyCustomerDefaultAddressUpdateInput,
} from '../shopify.ec-user.schema';

export class ShopifyCustomer extends _ShopifyCustomer {
    protected static readonly addressClass = ShopifyAddress;
    protected static readonly addressResultSetClass = ShopifyAddressResultSet;
}

export class ShopifyCustomerUserError extends _ShopifyCustomerUserError { }

export class ShopifyUserError extends _ShopifyUserError { }

export class ShopifyCustomerCreateResult extends _ShopifyCustomerCreateResult {
    customer: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAddressCreateResult extends _ShopifyCustomerAddressCreateResult {
    customerAddress: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAddressUpdateResult extends _ShopifyCustomerAddressUpdateResult {
    customerAddress: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerAddressDeleteResult extends _ShopifyCustomerAddressDeleteResult {
    deletedCustomerAddressId: string;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerDefaultAddressUpdateResult extends _ShopifyCustomerDefaultAddressUpdateResult {
    customer: ShopifyCustomer;
    customerUserErrors: ShopifyCustomerUserError[];
    userErrors: ShopifyUserError[];
}

export class ShopifyCustomerCreateInput extends _ShopifyCustomerCreateInput { }

export class ShopifyCustomerInput extends _ShopifyCustomerInput { }

export class ShopifyCustomerAddressCreateInput extends _ShopifyCustomerAddressCreateInput {
    address: ShopifyAddress;
}

export class ShopifyCustomerAddressUpdateInput extends _ShopifyCustomerAddressUpdateInput {
    address: ShopifyAddress;
}

export class ShopifyCustomerAddressDeleteInput extends _ShopifyCustomerAddressDeleteInput { }

export class ShopifyCustomerDefaultAddressUpdateInput extends _ShopifyCustomerDefaultAddressUpdateInput { }

export class ShopifyCustomerQuery extends _ShopifyCustomerQuery {
    protected static readonly customerClass = ShopifyCustomer;
    protected static readonly customerUserErrorClass = ShopifyCustomerUserError;
    protected static readonly userErrorClass = ShopifyUserError;
    protected static readonly addressClass = ShopifyAddress;

    static customerCreate = (): GraphqlDatasourceQuery => {
        return super.customerCreate();
    };
}
