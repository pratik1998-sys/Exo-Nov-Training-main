import { Controller, Get } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';
import { Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Article, ArticleFilter, ArticleResultSet, ArticleResultSetQuery } from './article.model';
import { ArticleApiConfiguration } from './article.api.configuration';
import { ArticleModule } from './article.module';
import { ArticleRequestParameters } from './article.parameters';
import { ArticleService } from './article.service';

const paths = {
    root: 'article',
};

const feature = ArticleModule.feature;

@Controller({ tags: 'article', path: paths.root, feature })
export class ArticleController extends BaseFeatureController {
    @Get(ArticleApiConfiguration.articles().restOptions, feature)
    async articles(@Req() request: FastifyRequest, @Query() query: ArticleResultSetQuery): Promise<ArticleResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ArticleService>(request, ArticleService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const filter: ArticleFilter = {
            type: query.type,
        };

        const { pagination } = resultSetQuery;

        return await service.getArticles(filter, pagination, requestContext, request);
    }

    @Get(ArticleApiConfiguration.article().restOptions, feature)
    async article(
        @Param(ArticleRequestParameters.id.id) id: string,
        @Req() request: FastifyRequest,
    ): Promise<Article> {
        const { requestContext, service } = this.getRequestContextAndService<ArticleService>(request, ArticleService);

        return await service.getArticle(id, requestContext, request);
    }
}
