import { Context } from '@nestjs/graphql';
import { Args, Query, Resolver } from '@api-decorators';
import { ECArticle, ECArticleFilter, ECArticleResultSet } from './ec-article.model';
import { ECArticleApiConfiguration } from './ec-article.api.configuration';
import { ECArticleModule } from './ec-article.module';
import { ArticleFilter, ArticleRequestParameters, ArticleResolver } from '@feature-article';
import { ECArticleService } from './ec-article.service';
import { ECArticleRequestParameters } from './ec-article.parameters';
import { PaginationInput } from '@feature/models';

const feature = ECArticleModule.feature;

@Resolver((of) => ECArticle, { feature })
export class ECArticleResolver extends ArticleResolver {
    @Query(() => ECArticleResultSet, ECArticleApiConfiguration.articles().queryOptions, feature)
    async articles(
        @Args({
            parameter: ArticleRequestParameters.filter,
            type: () => ECArticleFilter,
            required: false,
        })
        filter: ECArticleFilter,
        @Args({
            parameter: ArticleRequestParameters.pagination,
            type: () => PaginationInput,
            required: false,
        })
        pagination: PaginationInput,
        @Context()
        context,
    ): Promise<ECArticleResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ECArticleService>(context, ECArticleService);

        return await service.getArticles(filter, pagination, requestContext, context);
    }

    @Query(() => ECArticle, ECArticleApiConfiguration.article().queryOptions, feature)
    async article(
        @Args({ parameter: ECArticleRequestParameters.id, required: true })
        id: string,
        @Context()
        context,
    ): Promise<ECArticle> {
        const { requestContext, service } = this.getRequestContextAndService<ECArticleService>(context, ECArticleService);

        return await service.getArticle(id, requestContext, context);
    }
}
