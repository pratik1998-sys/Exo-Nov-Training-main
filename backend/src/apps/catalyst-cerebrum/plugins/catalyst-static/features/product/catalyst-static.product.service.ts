import { RequestContext } from "@context/request";
import { Product, ProductFilterInput, ProductResultSet, ProductService } from "@feature-commerce/product";
import { PaginationInput, SortByInput } from "@feature/models";
import { BasePluginServiceImpl } from "@plugin/service";
import { FindOptionsWhere, ILike, In, Repository } from "typeorm";

import { CatalystStaticProductData } from "./catalyst-static.product.data";
import { CatalystStaticProductEntity } from "./entities/catalyst-static.product.entity";

export class CatalystStaticProductServiceImpl extends BasePluginServiceImpl implements ProductService {
    protected getProductRepository(): Repository<CatalystStaticProductEntity> {
        return this.getRepository<Repository<CatalystStaticProductEntity>>(CatalystStaticProductEntity);
    }

    protected toProduct(record: CatalystStaticProductEntity): Product {
        const currency = CatalystStaticProductData.currency;

        return {
            id: record.identifier,
            identifier: record.identifier,
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
        const where: FindOptionsWhere<CatalystStaticProductEntity>[] = [];

        if (id) where.push({ identifier: id });
        if (identifier) where.push({ identifier }, { sku: identifier });
        if (slug) where.push({ slug });

        if (!where.length) return null;

        const record = await this.getProductRepository().findOne({ where });

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
        const base: FindOptionsWhere<CatalystStaticProductEntity> = {};

        const slugs = filter?.product?.slugs;
        if (slugs?.length) base.slug = In(slugs);

        const ids = filter?.product?.ids;
        if (ids?.length) base.identifier = In(ids);

        // The search term matches name OR description, so it becomes two where branches (TypeORM ORs array entries).
        const term = filter?.term?.trim();
        const where: FindOptionsWhere<CatalystStaticProductEntity>[] = term
            ? [
                  { ...base, name: ILike(`%${term}%`) },
                  { ...base, description: ILike(`%${term}%`) },
              ]
            : [base];

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        const [records, count] = await this.getProductRepository().findAndCount({
            where,
            order: { id: "ASC" },
            skip: offset,
            take: limit,
        });

        const page = pagination?.page ?? 1;
        const pageCount = Math.max(1, Math.ceil(count / limit));

        return {
            pagination: { page, pageSize: limit, pageCount, resultCount: count, hasMorePages: page < pageCount },
            results: records.map((r) => this.toProduct(r)),
        } as ProductResultSet;
    }
}
