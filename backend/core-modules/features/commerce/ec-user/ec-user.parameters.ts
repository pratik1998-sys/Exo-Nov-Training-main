import { UserRequestParameters, UserRequestParametersType } from '@feature-user';
import { CommerceRequestParameters, CommerceRequestParametersType } from '@feature-commerce/common';

export interface ECUserRequestParametersType extends CommerceRequestParametersType, UserRequestParametersType { }

export const ECUserRequestParameters: ECUserRequestParametersType = {
    ...CommerceRequestParameters,
    ...UserRequestParameters,
};