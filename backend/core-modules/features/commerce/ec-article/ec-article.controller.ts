import { Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Controller, Get } from '@api-decorators';
import { ECArticle, ECArticleFilter, ECArticleResultSet } from './ec-article.model';
import { ECArticleApiConfiguration } from './ec-article.api.configuration';
import { ECArticleModule } from './ec-article.module';
import { ECArticleService } from './ec-article.service';
import { ArticleController, ArticleResultSetQuery } from '@feature-article';
import { ECArticleRequestParameters } from './ec-article.parameters';
import { ResultSetQueryType } from '@feature/controller/types';

const feature = ECArticleModule.feature;

@Controller({ tags: 'article', path: 'article', feature })
export class ECArticleController extends ArticleController {
    @Get(ECArticleApiConfiguration.articles().restOptions, feature)
    async articles(@Req() request: FastifyRequest, @Query() query: ArticleResultSetQuery): Promise<ECArticleResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ECArticleService>(request, ECArticleService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const filter: ECArticleFilter = {
            type: query.type,
        };

        const { pagination } = resultSetQuery;

        return await service.getArticles(filter, pagination, requestContext, request);
    }

    @Get(ECArticleApiConfiguration.article().restOptions, feature)
    async article(@Param(ECArticleRequestParameters.identifier.id) id: string, @Req() request: FastifyRequest): Promise<ECArticle> {
        const { requestContext, service } = this.getRequestContextAndService<ECArticleService>(request, ECArticleService);

        return await service.getArticle(id, requestContext, request);
    }
}
