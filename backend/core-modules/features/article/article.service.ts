import { BaseFeatureService } from '@feature/service';
import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';
import { Article, ArticleFilter, ArticleResultSet } from './article.model';

export abstract class ArticleService extends BaseFeatureService {
    abstract getArticles(
        filter: ArticleFilter,
        pagination: PaginationInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ArticleResultSet>;

    abstract getArticle(
        id: string,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Article>;
}
