import { RequestContext } from "@context/request";
import { PurchaseHistoryFilterInput, PurchaseHistoryResultSet } from "./purchase-history.model";
import { PaginationInput, SortByInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";

export abstract class PurchaseHistoryService extends BaseFeatureService {
    abstract getPurchaseHistory(
        filter: PurchaseHistoryFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<PurchaseHistoryResultSet>;
}
