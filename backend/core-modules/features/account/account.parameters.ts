import { RequestParameters, RequestParametersType } from '@api-parameters';

export interface AccountRequestParametersType extends RequestParametersType { }

export const AccountRequestParameters: AccountRequestParametersType = {
    ...RequestParameters,
};
