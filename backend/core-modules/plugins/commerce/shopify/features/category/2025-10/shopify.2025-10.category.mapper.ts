import { ShopifyCollectionResultSet, ShopifyCollection } from './shopify.2025-10.category.schema';
import { ShopifyCategoryMapper as _ShopifyCategoryMapper } from '../2025-07/shopify.2025-07.category.mapper';
import { CategoryResultSet } from '@feature-commerce/category';
import { RequestContext } from '@context/request';
import { Category } from '@feature-commerce/category';

export class ShopifyCategoryMapper extends _ShopifyCategoryMapper {
    mapCategories(requestContext: RequestContext, dsResult: ShopifyCollectionResultSet): CategoryResultSet {
        return super.mapCategories(requestContext, dsResult);
    }

    mapCategory(requestContext: RequestContext, dsCollection: ShopifyCollection): Category {
        return super.mapCategory(requestContext, dsCollection);
    }
}
