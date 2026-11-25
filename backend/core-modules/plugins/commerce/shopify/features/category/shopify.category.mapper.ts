
import { RequestContext } from '@context/request';
import { Category, CategoryResultSet } from '@feature-commerce/category';
import { Image } from '@feature-shared-models';
import { ShopifyBaseMapper } from '@plugin-shopify/common';
import { ShopifyCollection, ShopifyCollectionResultSet } from '@plugin-shopify/features/category/shopify.category.schema';

export class ShopifyCategoryMapper extends ShopifyBaseMapper {
    mapCategories(requestContext: RequestContext, dsResult: ShopifyCollectionResultSet): CategoryResultSet {
        return null;
    }

    mapCategory(requestContext: RequestContext, dsCollection: ShopifyCollection): Category {
        let category: Category = null;

        if (dsCollection) {
            const image: Image =
                dsCollection?.image ?
                    {
                        url: dsCollection.image.src,
                        altText: dsCollection.image.altText,
                    }
                    : null;

            category = {
                id: dsCollection.id,
                identifier: dsCollection.handle,
                slug: dsCollection.handle,
                description: dsCollection.description,
                name: dsCollection.title,
                thumbnail: image,
                images: image ? [image] : [],
                children: [],
            };
        }

        return category;
    }
}
