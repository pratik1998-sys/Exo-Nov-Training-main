import { Context, Parent, ResolveField } from '@nestjs/graphql';
import { Args, Query, Resolver } from '@api-decorators';
import { Product, ProductAttribute, ProductFilterInput, ProductResultSet } from './product.model';
import { ProductApiConfiguration } from './product.api.configuration';
import { ProductModule } from './product.module';
import { ProductRequestParameters } from './product.parameters';
import { ProductService } from './product.service';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput, SortByInput } from '@feature/models';

const feature = ProductModule.feature;

@Resolver((of) => Product, { feature })
export class ProductResolver extends BaseFeatureResolver {
    @Query(() => Product, ProductApiConfiguration.product().queryOptions, feature)
    async product(
        @Args({ parameter: ProductRequestParameters.identifier, required: false })
        id: string,
        @Args({ parameter: ProductRequestParameters.identifier, required: false })
        identifier: string,
        @Args({ parameter: ProductRequestParameters.slug, required: false })
        slug: string,
        @Context()
        context,
    ): Promise<Product> {
        const { requestContext, service } = this.getRequestContextAndService<ProductService>(context, ProductService);

        return await service.getProduct(id, identifier, slug, requestContext, context);
    }

    @Query(() => ProductResultSet, ProductApiConfiguration.products().queryOptions, feature)
    async products(
        @Args({ parameter: ProductRequestParameters.filter, type: () => ProductFilterInput, required: false })
        filter: ProductFilterInput,
        @Args({ parameter: ProductRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: ProductRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context,
    ): Promise<ProductResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ProductService>(context, ProductService);

        return await service.getProducts(filter, pagination, sortBy, requestContext, context);
    }

    /**
     * Map-style access in clients via aliases, e.g. `metal: attribute(identifier: "metal") { name values { value } }`.
     * Resolves from the parent product only (same data as `attributes` / `attributeList`).
     */
    @ResolveField("attribute", () => ProductAttribute, {
        nullable: true,
        description:
            "Single attribute by key; use GraphQL aliases for map-style access. No extra load beyond parent `attributes` / `attributeList`.",
    })
    resolveAttribute(
        @Parent() product: Product,
        @Args({ parameter: ProductRequestParameters.attributeKey, required: true }) identifier: string,
    ): ProductAttribute | null {
        const fromMap = product.attributes?.[identifier];
        if (fromMap) {
            return fromMap;
        }
        const list = product.attributeList;
        if (!list?.length) {
            return null;
        }
        return list.find((a) => a.identifier === identifier || a.id === identifier) ?? null;
    }
}
