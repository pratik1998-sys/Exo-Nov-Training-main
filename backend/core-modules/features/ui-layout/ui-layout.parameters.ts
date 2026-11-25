import { RequestParameters } from '@api-parameters';
import { RequestParametersType } from '@api-parameters';

export interface UILayoutRequestParametersType extends RequestParametersType { }

export const UILayoutRequestParameters: UILayoutRequestParametersType = {
    ...RequestParameters,
};
