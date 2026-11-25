import { ShopifyECUserDatasource as _ShopifyECUserDatasource } from '../shopify.ec-user.datasource';
import { ShopifyCustomerQuery } from './shopify.2025-07.ec-user.schema';

export class ShopifyECUserDatasource extends _ShopifyECUserDatasource {
    protected getQueryClass() {
        return ShopifyCustomerQuery;
    }
}
