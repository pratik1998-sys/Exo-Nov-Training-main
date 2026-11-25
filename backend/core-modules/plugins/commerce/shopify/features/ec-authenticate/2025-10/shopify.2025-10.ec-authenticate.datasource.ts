import { ShopifyECAuthenticateDatasource as _ShopifyECAuthenticateDatasource } from '../2025-07/shopify.2025-07.ec-authenticate.datasource';
import { ShopifyAuthenticateQuery } from './shopify.2025-10.ec-authenticate.schema';

export class ShopifyECAuthenticateDatasource extends _ShopifyECAuthenticateDatasource {
    protected getQueryClass() {
        return ShopifyAuthenticateQuery;
    }
}
