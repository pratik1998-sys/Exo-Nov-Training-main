import { RequestContext } from "@context/request";
import { Product, ProductFilterInput, ProductResultSet, ProductService } from "@feature-commerce/product";
import { PaginationInput, SortByInput } from "@feature/models";
import { BasePluginServiceImpl } from "@plugin/service";

import { CatalystStaticProductData, CatalystStaticProductRecord } from "./catalyst-static.product.data";

export class CatalystStaticProductServiceImpl extends BasePluginServiceImpl implements ProductService {
    protected toProduct(record: CatalystStaticProductRecord): Product {
        const currency = CatalystStaticProductData.currency;

        return {
            id: record.id,
            identifier: record.id,
            slug: record.slug,
            sku: record.sku,
            name: record.name,
            description: record.description,
            longDescription: record.description,
            type: "SIMPLE",
            isPurchasable: true,
            thumbnail: { url: `https://picsum.photos/seed/${record.slug}/480/360`, altText: record.name },
            price: {
                offer: { value: record.price, currency },
                list: { value: record.listPrice ?? record.price, currency },
            },
        } as Product;
    }

    async getProduct(id: string, identifier: string, slug: string, requestContext: RequestContext, context?: any): Promise<Product> {
        const record = CatalystStaticProductData.products.find(
            (p) => (id && p.id === id) || (identifier && (p.id === identifier || p.sku === identifier)) || (slug && p.slug === slug),
        );

        return record ? this.toProduct(record) : null;
    }

    async getProducts(
        filter: ProductFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
        disableMaxPagination?: boolean,
    ): Promise<ProductResultSet> {
        let records = CatalystStaticProductData.products;

        const term = filter?.term?.toLowerCase();
        if (term) {
            records = records.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
        }

        const slugs = filter?.product?.slugs;
        if (slugs?.length) {
            records = records.filter((p) => slugs.includes(p.slug));
        }

        const ids = filter?.product?.ids;
        if (ids?.length) {
            records = records.filter((p) => ids.includes(p.id));
        }

        const pageSize = pagination?.pageSize ?? (records.length || 10);
        const page = pagination?.page ?? 1;
        const offset = (page - 1) * pageSize;
        const pageCount = Math.max(1, Math.ceil(records.length / pageSize));

        return {
            pagination: { page, pageSize, pageCount, resultCount: records.length, hasMorePages: page < pageCount },
            results: records.slice(offset, offset + pageSize).map((r) => this.toProduct(r)),
        } as ProductResultSet;
    }
}
