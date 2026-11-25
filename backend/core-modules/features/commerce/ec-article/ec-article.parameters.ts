import { CommerceRequestParameters, CommerceRequestParametersType } from "@feature-commerce/common";
import { ArticleRequestParameters, ArticleRequestParametersType } from "@feature-article";

export interface ECArticleRequestParametersType extends CommerceRequestParametersType, ArticleRequestParametersType { }

export const ECArticleRequestParameters: ECArticleRequestParametersType = {
    ...ArticleRequestParameters,
    ...CommerceRequestParameters,
};
