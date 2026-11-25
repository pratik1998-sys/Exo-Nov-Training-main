import { CommerceErrors, CommerceErrorsType } from '@feature-commerce/common';

export interface PurchaseHistoryErrorsType extends CommerceErrorsType { }

export class PurchaseHistoryErrors extends CommerceErrors {
    protected static errors: PurchaseHistoryErrorsType = {
        ...CommerceErrors.errors
    };
}
