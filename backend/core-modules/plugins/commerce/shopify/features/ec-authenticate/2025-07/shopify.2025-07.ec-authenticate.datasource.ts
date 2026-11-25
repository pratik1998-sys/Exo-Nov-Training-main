import { ShopifyECAuthenticateDatasource as _ShopifyECAuthenticateDatasource } from '../shopify.ec-authenticate.datasource';
import { ShopifyAuthenticateQuery } from './shopify.2025-07.ec-authenticate.schema';

export class ShopifyECAuthenticateDatasource extends _ShopifyECAuthenticateDatasource {
    protected getQueryClass() {
        return ShopifyAuthenticateQuery;
    }
}
