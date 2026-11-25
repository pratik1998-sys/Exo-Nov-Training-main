import { RequestContext } from "@context/request";
import { ArticleErrors } from "@feature-article";
import { CatalystArticleServiceImpl } from "../article/catalyst.article.service";
import { ECArticle, ECArticleFilter, ECArticleResultSet, ECArticleService } from "@feature-commerce/ec-article";
import { ProductService } from "@feature-commerce/product";
import { PaginationInput } from "@feature/models";

import { CatalystECArticleData, CatalystECArticleRecord } from "./catalyst.ec-article.data";

export class CatalystECArticleServiceImpl extends CatalystArticleServiceImpl implements ECArticleService {
    async getArticles(filter: ECArticleFilter, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<ECArticleResultSet> {
        const resultSet = await super.getArticles(filter, pagination, requestContext, context);

        return {
            ...resultSet,
            results: resultSet.results as ECArticle[],
        };
    }

    async getArticle(id: string, requestContext: RequestContext, context?: any): Promise<ECArticle> {
        const record = CatalystECArticleData.getById(id);

        if (!record) {
            throw ArticleErrors.getArticleFailed();
        }

        const article: ECArticle = record as ECArticle;

        if (record.productSlugs.length > 0) {
            const productResultSet = await this.getService<ProductService>(requestContext, ProductService).getProducts(
                { product: { slugs: record.productSlugs } },
                null,
                null,
                requestContext,
                context,
            );

            article.products = productResultSet.results;
        }

        return article;
    }

    protected fetchArticleData(): CatalystECArticleRecord[] {
        return CatalystECArticleData.articles;
    }
}
