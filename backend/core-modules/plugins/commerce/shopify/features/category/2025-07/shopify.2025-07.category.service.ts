import { ShopifyCategoryServiceImpl as _ShopifyCategoryServiceImpl } from '../shopify.category.service';
import { ShopifyCategoryDatasource } from './shopify.2025-07.category.datasource';
import { RequestContext } from '@context/request';

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
