import { ShopifyECUserDatasource as _ShopifyECUserDatasource } from '../2025-07/shopify.2025-07.ec-user.datasource';
import { ShopifyCustomerQuery } from './shopify.2025-10.ec-user.schema';

export class ShopifyECUserDatasource extends _ShopifyECUserDatasource {
    protected getQueryClass() {
        return ShopifyCustomerQuery;
    }
}
