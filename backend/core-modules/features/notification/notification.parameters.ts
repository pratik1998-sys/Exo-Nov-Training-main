import { RequestParameters, RequestParametersType } from "@api-parameters";


export interface NotificationRequestParametersType extends RequestParametersType { }

export const NotificationRequestParameters: NotificationRequestParametersType = {
    ...RequestParameters,
};