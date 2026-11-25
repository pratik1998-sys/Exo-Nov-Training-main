import { Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Get, Controller } from '@api-decorators';
import { Category, CategoryQuery, CategoryResultSet, CategoryResultSetQuery, CategoryResultSetQueryType } from './category.model';
import { CategoryRequestParameters } from './category.parameters';
import { BaseFeatureController } from '@feature/controller';
import { PaginationInput } from '@feature/models';
import { CategoryApiConfiguration } from './category.api.configuration';
import { CategoryService } from './category.service';
import { CategoryModule } from './category.module';

const feature = CategoryModule.feature;

@Controller({ tags: 'category', path: 'category', feature })
export class CategoryController extends BaseFeatureController {
    @Get(CategoryApiConfiguration.categories().restOptions, feature)
    async categories(@Query() query: CategoryResultSetQuery, @Req() request: FastifyRequest): Promise<CategoryResultSet> {
        const q = this.processResultSetQuery(query) as CategoryResultSetQueryType;

        const { requestContext, service } = this.getRequestContextAndService<CategoryService>(request, CategoryService);

        return await service.getCategories(q.filter, q.pagination, q.depth, requestContext, request);
    }

    // @Get({ resultType: [Category], path: '/top' })
    // async getTopCategories(@Req() request: FastifyRequest): Promise<Category[]> {
    //     const { requestContext, service } = this.getRequestContextAndService<CategoryService>(request, CategoryService);

    //     return await service.getTopCategories(requestContext, request);
    // }

    @Get(CategoryApiConfiguration.category().restOptions, feature)
    async category(
        @Param(CategoryRequestParameters.identifier.id)
        identifierInput: string,
        @Query() query: CategoryQuery,
        @Req() request: FastifyRequest,
    ): Promise<Category> {
        const { requestContext, service } = this.getRequestContextAndService<CategoryService>(request, CategoryService);

        const { idType, depth, categoryPage, categoryPageSize, productPage, productPageSize } = query;

        let slug = null;
        let identifier = null;
        let id = null;

        if (!idType || idType == 'id') {
            id = identifierInput;
        } else if (idType == 'slug') {
            slug = identifierInput;
        } else if (idType == 'identifier') {
            identifier = identifierInput;
        }

        const categoryPagination: PaginationInput = categoryPage || categoryPageSize ? { page: categoryPage, pageSize: categoryPageSize } : undefined;
        const productPagination: PaginationInput = productPage || productPageSize ? { page: productPage, pageSize: productPageSize } : undefined;

        return await service.getCategory(id, identifier, slug, depth, categoryPagination, productPagination, requestContext, request);
    }

    protected processResultSetQuery(query: CategoryResultSetQuery): CategoryResultSetQueryType {
        const q = super.processResultSetQuery(query) as CategoryResultSetQueryType;

        q.filter = {
            ids: query.ids,
            identifiers: query.identifiers,
            slugs: query.slugs
        };

        q.depth = query.depth;

        return q;
    }
}
