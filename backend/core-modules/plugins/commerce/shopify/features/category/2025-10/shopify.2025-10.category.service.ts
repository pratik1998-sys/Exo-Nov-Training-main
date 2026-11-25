import { RequestContext } from '@context/request';
import { ShopifyCategoryServiceImpl as _ShopifyCategoryServiceImpl } from '../2025-07/shopify.2025-07.category.service';
import { ShopifyCategoryDatasource } from './shopify.2025-10.category.datasource';

/**
 * For variants, the serviceImpl does not need to be extended just to override the get*Datasource method of the
 * parent (non-variant base serviceImpl). The calling framework's this.getDatasource<>(...) in the base serviceImpl
 * will resolve to the variant specific datasource (and likewise mapper for this.getMapper<>(...)) without needing to
 * extend the serviceImpl for variants. This is extended here as an example.
 */
export class ShopifyCategoryServiceImpl extends _ShopifyCategoryServiceImpl {
    protected getCategoryDatasource(requestContext: RequestContext): ShopifyCategoryDatasource {
        return this.getDatasource<ShopifyCategoryDatasource>(requestContext, ShopifyCategoryDatasource);
    }
}
