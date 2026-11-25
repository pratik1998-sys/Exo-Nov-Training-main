import { RequestContext } from "@context/request";
import { ECArticle, ECArticleFilter, ECArticleResultSet, ECArticleService } from "@feature-commerce/ec-article";
import { ProductService } from "@feature-commerce/product";
import { PaginationInput } from "@feature/models";
import { AdobeAEMArticleMapper, AdobeAEMArticleServiceImpl } from "@plugin-adobe-aem/features/article";

export class AdobeAEMECArticleServiceImpl extends AdobeAEMArticleServiceImpl implements ECArticleService {
    async getArticles(filter: ECArticleFilter, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<ECArticleResultSet> {
        return await super.getArticles(filter, pagination, requestContext, context);
    }

    async getArticle(id: string, requestContext: RequestContext, context?: any): Promise<ECArticle> {
        const result = await this.getArticleByPath(requestContext, id);

        const article: ECArticle = this.getMapper<AdobeAEMArticleMapper>(requestContext).mapArticle(
            requestContext,
            result,
        );

        if (result?.products?.length > 0) {
            const productResultSet = await this.getService<ProductService>(requestContext, ProductService).getProducts({ product: { slugs: result.products } }, null, null, requestContext, context);

            article.products = productResultSet.results;
        }

        return article;
    }
}