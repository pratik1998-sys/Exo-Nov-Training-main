import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { PurchaseHistoryResultSet } from "./purchase-history.model";

export interface PurchaseHistoryApiOperations {
    purchaseHistory: ApiOperationDefinition;
}

export class PurchaseHistoryApiConfiguration extends ApiConfiguration {
    static operations: PurchaseHistoryApiOperations = {
        purchaseHistory: {
            id: 'purchaseHistory',
            description: 'Get purchase history',
            summary: 'Get purchase history',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: PurchaseHistoryResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
    };

    static purchaseHistory(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.purchaseHistory);
    }
}
