import { CommerceRequestParameters, CommerceRequestParametersType } from "@feature-commerce/common"

export interface OrderRequestParametersType extends CommerceRequestParametersType { }

export const OrderRequestParameters: OrderRequestParametersType = {
    ...CommerceRequestParameters
}