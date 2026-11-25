import { ArticleErrors, ArticleErrorsType } from "@feature-article";

export interface ECArticleErrorsType extends ArticleErrorsType { }

export class ECArticleErrors extends ArticleErrors {
    protected static errors: ECArticleErrorsType = {
        ...ArticleErrors.errors,
    };
}
