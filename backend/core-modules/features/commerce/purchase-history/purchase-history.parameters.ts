import { CommerceRequestParameters, CommerceRequestParametersType } from "@feature-commerce/common";

export interface PurchaseHistoryRequestParametersType extends CommerceRequestParametersType { }

export const PurchaseHistoryRequestParameters: PurchaseHistoryRequestParametersType = {
    ...CommerceRequestParameters
}