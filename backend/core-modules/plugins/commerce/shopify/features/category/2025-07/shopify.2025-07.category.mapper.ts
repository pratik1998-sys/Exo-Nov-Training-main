import { ShopifyCollectionResultSet, ShopifyCollection } from './shopify.2025-07.category.schema';
import { ShopifyCategoryMapper as _ShopifyCategoryMapper } from '../shopify.category.mapper';
import { Category, CategoryResultSet } from '@feature-commerce/category';
import { RequestContext } from '@context/request';

export class ShopifyCategoryMapper extends _ShopifyCategoryMapper {
    mapCategories(requestContext: RequestContext, dsResult: ShopifyCollectionResultSet): CategoryResultSet {
        return super.mapCategories(requestContext, dsResult);
    }

    mapCategory(requestContext: RequestContext, dsCollection: ShopifyCollection): Category {
        return super.mapCategory(requestContext, dsCollection);
    }
}
