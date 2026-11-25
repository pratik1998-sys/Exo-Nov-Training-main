import { RequestContext } from "@context/request";
import { OrderService } from "@feature-commerce/order";
import { PurchaseHistoryFilterInput, PurchaseHistoryItem, PurchaseHistoryResultSet, PurchaseHistoryService } from "@feature-commerce/purchase-history";
import { PaginationInput, SortByInput } from "@feature/models";
import { HCLCommerceBaseServiceImpl } from "@plugin-hcl-commerce/common";


export class HCLCommercePurchaseHistoryServiceImpl extends HCLCommerceBaseServiceImpl implements PurchaseHistoryService {
    async getPurchaseHistory(
        filter: PurchaseHistoryFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<PurchaseHistoryResultSet> {
        const methodname = `${HCLCommercePurchaseHistoryServiceImpl.name}.getPurchaseHistory`;

        const orderService = this.getService<OrderService>(requestContext, OrderService);

        const orderResultSet = await orderService.getOrders(true, null, { pageSize: 5 }, null, requestContext, context);

        const purchaseItemMap: Record<string, PurchaseHistoryItem> = {};

        orderResultSet.results.forEach((order) => {
            order.items.results.map((orderItem) => {
                const purchaseHistoryItem: PurchaseHistoryItem = orderItem as PurchaseHistoryItem;

                if (!purchaseItemMap[purchaseHistoryItem.product.identifier]) {
                    purchaseHistoryItem.purchasedOn = order.createdOn;

                    purchaseItemMap[purchaseHistoryItem.product.identifier] = purchaseHistoryItem;
                }
            });
        });

        const purchaseItems = Object.values(purchaseItemMap);

        const purchaseHistoryResultSet: PurchaseHistoryResultSet = {
            pagination: {
                page: 1,
                pageSize: purchaseItems.length,
                pageCount: 1,
                hasMorePages: false,
                resultCount: purchaseItems.length,
            },
            results: purchaseItems,
        };

        return purchaseHistoryResultSet;
    }
}
