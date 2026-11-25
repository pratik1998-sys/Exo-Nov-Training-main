import { RequestParameters, RequestParametersType } from '@api-parameters';

export interface ArticleRequestParametersType extends RequestParametersType {}

export const ArticleRequestParameters: ArticleRequestParametersType = {
    ...RequestParameters,
};
