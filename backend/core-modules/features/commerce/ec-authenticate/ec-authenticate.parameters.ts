import { CommerceRequestParameters, CommerceRequestParametersType } from "@feature-commerce/common";
import { AuthenticateRequestParameters, AuthenticateRequestParametersType } from "@feature-authenticate";

export interface ECAuthenticateRequestParametersType extends AuthenticateRequestParametersType, CommerceRequestParametersType { }

export const ECAuthenticateRequestParameters: ECAuthenticateRequestParametersType = {
    ...AuthenticateRequestParameters,
    ...CommerceRequestParameters,
};
