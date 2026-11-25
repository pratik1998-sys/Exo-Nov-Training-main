import { Parent, Context, ResolveProperty, Int, Resolver } from '@nestjs/graphql';
import { Args, Query } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { CategoryFilterInput, CategoryResultSet } from './category.model';
import { CategoryApiConfiguration } from './category.api.configuration';
import { CategoryRequestParameters } from './category.parameters';
import { CategoryService } from './category.service';
import { CategoryModule } from './category.module';
import { Category } from './category.model';
import { PaginationInput, SortByInput } from '@feature/models';
import { ProductFilterInput, ProductResultSet, ProductService } from '@feature-commerce/product';

const feature = CategoryModule.feature;

// @Resolver((of) => Category, { feature })
@Resolver((of) => Category)
export class CategoryResolver extends BaseFeatureResolver {
    @Query(() => Category, CategoryApiConfiguration.category().queryOptions, feature)
    async category(
        @Args({ parameter: CategoryRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CategoryRequestParameters.identifier, required: false })
        identifier: string,
        @Args({ parameter: CategoryRequestParameters.slug, required: false })
        slug: string,
        @Args({ parameter: CategoryRequestParameters.depth, type: () => Int, required: false })
        depth: number,
        @Args({ parameter: CategoryRequestParameters.categoryPagination, type: () => PaginationInput, required: false })
        categoryPagination: PaginationInput,
        @Args({ parameter: CategoryRequestParameters.productPagination, type: () => PaginationInput, required: false })
        productPagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<Category> {
        const { requestContext, service } = this.getRequestContextAndService<CategoryService>(context, CategoryService);

        return await service.getCategory(id, identifier, slug, depth, categoryPagination, productPagination, requestContext, context);
    }

    // @Query(() => [Category])
    // async categoriesTop(
    //     // @Args({ parameter:CategoryRequestParameters.depth, type: Int, required: false })
    //     // depth:number,
    //     @Context()
    //     context: any,
    // ): Promise<Category[]> {
    //     const { requestContext, service } = this.getRequestContextAndService<CategoryService>(context, CategoryService);

    //     return await service.getTopCategories(requestContext, context);
    // }

    @Query(() => CategoryResultSet, CategoryApiConfiguration.categories().queryOptions, feature)
    async categories(
        @Args({ parameter: CategoryRequestParameters.filter, type: () => CategoryFilterInput, required: false })
        filter: CategoryFilterInput,
        @Args({ parameter: CategoryRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CategoryRequestParameters.depth, type: () => Int, required: false })
        depth: number,
        @Context()
        context: any,
    ): Promise<CategoryResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<CategoryService>(context, CategoryService);

        return await service.getCategories(filter, pagination, depth, requestContext, context);
    }

    @ResolveProperty('products', (type) => ProductResultSet)
    async getProducts(
        @Parent() category,
        @Args({ parameter: CategoryRequestParameters.filter, type: () => ProductFilterInput, required: false })
        filter: ProductFilterInput,
        @Args({ parameter: CategoryRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CategoryRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context,
    ): Promise<ProductResultSet> {
        const methodname = `${CategoryResolver.name}.getProducts`;

        if (!category.products) {
            this.logger.info(`${methodname} - Category ${category.id} products requested, but not resolved in the plugin category service. Will fetch via ProductService`);

            const requestContext = this.getRequestContext(context);

            const service = this.resolveService<ProductService>(requestContext, ProductService);

            filter = filter ?? {};

            filter.category = {
                ids: [category.id],
            };

            return await service.getProducts(filter, pagination, sortBy, requestContext, context);
        } else {
            return category.products;
        }
    }
}
