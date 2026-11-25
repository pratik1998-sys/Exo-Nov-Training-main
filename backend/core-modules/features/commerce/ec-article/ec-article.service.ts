import { RequestContext } from "@context/request";
import { BaseFeatureService } from "@feature/service";
import { ECArticle, ECArticleFilter, ECArticleResultSet } from "./ec-article.model";
import { PaginationInput } from "@feature/models";

export abstract class ECArticleService extends BaseFeatureService {
    abstract getArticle(id: string, requestContext: RequestContext, context?: any): Promise<ECArticle>;
    abstract getArticles(filter: ECArticleFilter, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<ECArticleResultSet>;
}
