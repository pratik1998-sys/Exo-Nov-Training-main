import { RequestContext } from "@context/request";
import { Article, ArticleErrors, ArticleFilter, ArticleResultSet, ArticleService } from "@feature-article";
import { PaginationInput } from "@feature/models";
import { BasePluginServiceImpl } from "@plugin/service";

import { CatalystArticleData, CatalystArticleRecord } from "./catalyst.article.data";

export class CatalystArticleServiceImpl extends BasePluginServiceImpl implements ArticleService {

    protected getArticleRecords(filter?: ArticleFilter): CatalystArticleRecord[] {
        let records = this.fetchArticleData();

        if (filter?.type) {
            records = records.filter((record) => record.type === filter.type);
        }

        return records;
    }

    async getArticles(filter: ArticleFilter, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<ArticleResultSet> {
        const records = this.getArticleRecords(filter);
        const pageSize = pagination?.pageSize ?? (records.length || 10);
        const page = pagination?.page ?? 1;
        const offset = (page - 1) * pageSize;
        const pageRecords = records.slice(offset, offset + pageSize);
        const pageCount = Math.max(1, Math.ceil(records.length / pageSize));

        return {
            pagination: {
                page,
                pageSize,
                pageCount,
                resultCount: records.length,
                hasMorePages: page < pageCount,
            },
            results: pageRecords.map((record) => record as Article),
        };
    }

    async getArticle(id: string, requestContext: RequestContext, context?: any): Promise<Article> {
        const record = this.fetchArticleData().find(
            (article) => article.id === id || article.identifier === id,
        );

        if (!record) {
            throw ArticleErrors.getArticleFailed();
        }

        return record as Article;
    }

    protected getArticleRecord(id: string): CatalystArticleRecord | undefined {
        return this.fetchArticleData().find(
            (article) => article.id === id || article.identifier === id,
        );
    }

    protected fetchArticleData(): CatalystArticleRecord[] {
        return CatalystArticleData.articles;
    }
}
