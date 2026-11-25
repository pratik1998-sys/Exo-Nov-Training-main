import { RequestContext } from '@context/request';
import {
    Article,
    ArticleErrors,
    ArticleFilter,
    ArticleResultSet,
    ArticleService,
} from '@feature-article';
import { PaginationInput } from '@feature/models';
import { ProductService } from '@feature-commerce/product';
import { AdobeAEMBaseServiceImpl } from '@plugin-adobe-aem/common';
import { AdobeAEMArticleDatasource } from './adobe-aem.article.datasource';
import { AdobeAEMArticleMapper } from './adobe-aem.article.mapper';

export class AdobeAEMArticleServiceImpl
    extends AdobeAEMBaseServiceImpl
    implements ArticleService {
    async getArticles(
        filter: ArticleFilter,
        pagination: PaginationInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ArticleResultSet> {
        const methodname = `${AdobeAEMArticleServiceImpl.name}.getArticles`;

        let result = null;
        try {
            result = await this.getDatasource<AdobeAEMArticleDatasource>(
                requestContext,
            ).getArticles(requestContext, filter?.type);
        } catch (error) {
            this.logger.info(
                `${methodname} - Error fetching articles: ${error}`,
                requestContext,
            );
            throw ArticleErrors.getArticlesFailed();
        }

        result = result?.data?.buyingGuideList?.items?.length > 0 ? result.data.buyingGuideList.items : [];

        return this.getMapper<AdobeAEMArticleMapper>(requestContext).mapArticles(
            requestContext,
            result,
        );
    }

    async getArticle(
        id: string,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Article> {
        const methodname = `${AdobeAEMArticleServiceImpl.name}.getArticle`;

        const result = await this.getArticleByPath(requestContext, id);

        return this.getMapper<AdobeAEMArticleMapper>(requestContext).mapArticle(
            requestContext,
            result,
        );
    }

    protected async getArticleByPath(requestContext: RequestContext, id: string): Promise<any> {
        const methodname = `${AdobeAEMArticleServiceImpl.name}.getArticleByPath`;

        let result = null;

        try {
            result = await this.getDatasource<AdobeAEMArticleDatasource>(requestContext).getArticleByPath(requestContext, id);
        } catch (error) {
            this.logger.info(
                `${methodname} - Error fetching article ${id}: ${error}`,
                requestContext,
            );
            throw ArticleErrors.getArticleFailed();
        }

        return result?.data?.buyingGuideByPath?.item;
    }
}
