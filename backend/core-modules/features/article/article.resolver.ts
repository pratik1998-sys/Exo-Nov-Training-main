import { Context } from '@nestjs/graphql';
import { Args, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';
import { Article, ArticleFilter, ArticleResultSet } from './article.model';
import { ArticleApiConfiguration } from './article.api.configuration';
import { ArticleModule } from './article.module';
import { ArticleRequestParameters } from './article.parameters';
import { ArticleService } from './article.service';

const feature = ArticleModule.feature;

@Resolver((of) => Article, { feature })
export class ArticleResolver extends BaseFeatureResolver {
    @Query(() => ArticleResultSet, ArticleApiConfiguration.articles().queryOptions, feature)
    async articles(
        @Args({
            parameter: ArticleRequestParameters.filter,
            type: () => ArticleFilter,
            required: false,
        })
        filter: ArticleFilter,
        @Args({
            parameter: ArticleRequestParameters.pagination,
            type: () => PaginationInput,
            required: false,
        })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<ArticleResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ArticleService>(
            context,
            ArticleService,
        );

        return await service.getArticles(filter, pagination, requestContext, context);
    }

    @Query(() => Article, ArticleApiConfiguration.article().queryOptions, feature)
    async article(
        @Args({ parameter: ArticleRequestParameters.id, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<Article> {
        const { requestContext, service } = this.getRequestContextAndService<ArticleService>(
            context,
            ArticleService,
        );

        return await service.getArticle(id, requestContext, context);
    }
}
