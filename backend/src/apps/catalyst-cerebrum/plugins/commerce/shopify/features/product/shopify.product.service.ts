
import { ShopifyBaseServiceImpl } from '@plugin-shopify/common';
import { ShopifyProductDatasource } from './shopify.product.datasource';
import { ShopifyProductMapper } from './shopify.product.mapper';
import { Product, ProductFilterInput, ProductResultSet, ProductService } from '@feature-commerce/product';
import { PaginationInput, SortByInput } from '@feature/models';
import { RequestContext } from '@context/request';

export class ShopifyProductServiceImpl extends ShopifyBaseServiceImpl implements ProductService {
    async getProducts(filter: ProductFilterInput, pagination: PaginationInput, sortBy: SortByInput, requestContext: RequestContext): Promise<ProductResultSet> {
        const ds = this.getDatasource<ShopifyProductDatasource>(requestContext, ShopifyProductDatasource);

        const pageSize = pagination?.pageSize ?? 30;
        const page = pagination?.page ?? 1;

        let after: string | null = null;

        if (page > 1) {
            const prev: any = await ds.getProducts(requestContext, pageSize * (page - 1), null);
            after = prev?.products?.pageInfo?.endCursor ?? null;
        }

        const response: any = await ds.getProducts(requestContext, pageSize, after);

        const mapper = this.getMapper<ShopifyProductMapper>(requestContext, ShopifyProductMapper);

        const results = response?.products?.nodes?.map((node: any) => mapper.mapProduct(requestContext, node)) ?? [];

        return {
            results,
            pagination: {
                page,
                pageSize,
                resultCount: results.length,
                pageCount: 0,
                hasMorePages: response?.products?.pageInfo?.hasNextPage ?? false,
            },
        };
    }

    async getProduct(id: string, identifier: string, slug: string, requestContext: RequestContext): Promise<Product> {
        const methodname = 'getProduct';
        this.logger.info(`${methodname} - Fetching product: ${id || slug}`);

        // 1. Get the Datasource
        const ds = this.getDatasource<ShopifyProductDatasource>(requestContext, ShopifyProductDatasource);

        // 2. Fetch from Shopify (Assuming your DS has a getProduct method)
        // You might fetch by ID or by Handle (slug) depending on what is provided
        const response: any = await ds.getProduct(requestContext, id, slug);
        const productNode = response?.product ?? response?.productByHandle;

        if (!productNode) {
            this.logger.warn(`No product node found in response for: ${id || slug}`);
            return null;
        }

        // 3. Get the Mapper
        const mapper = this.getMapper<ShopifyProductMapper>(requestContext, ShopifyProductMapper);

        // 4. Map and Return
        return mapper.mapProduct(requestContext, productNode);
    }
}
