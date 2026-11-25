import { HttpException } from '@nestjs/common';
import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';

export interface ArticleErrorsType extends FeatureErrorsType {
    getArticlesFailed: ErrorType;
    getArticleFailed: ErrorType;
}

export class ArticleErrors extends FeatureErrors {
    protected static errors: ArticleErrorsType = {
        ...FeatureErrors.errors,
        getArticlesFailed: {
            code: 'ARTICLES_GET_FAILED',
            message: 'Failed to get articles',
            statusCode: 400,
        },
        getArticleFailed: {
            code: 'ARTICLE_GET_FAILED',
            message: 'Failed to get article',
            statusCode: 400,
        },
    };

    static getArticlesFailed(): HttpException {
        return this.composeHTTPError(this.errors.getArticlesFailed);
    }

    static getArticleFailed(): HttpException {
        return this.composeHTTPError(this.errors.getArticleFailed);
    }
}
